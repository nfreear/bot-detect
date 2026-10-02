const { fetch, HTMLElement } = window;

/**
 *
 * @customElement form-with-bot-detect
 *
 * @see https://developers.cloudflare.com/turnstile/get-started/
 * @see https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/
 * @see https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/
 * @see https://developers.cloudflare.com/api/resources/turnstile/
 * @see https://www.cloudflare.com/turnstile-privacy-policy/
 */
export default class FormWithBotDetectElement extends HTMLElement {
  #src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  #verifyUrl = '/api/siteverify';
  // #widgetTagName = 'bot-detect';
  #widgetId;
  #widgetElement;
  #error;
  #status;
  #token;
  #valid;

  get #sitekey () { return this.getAttribute('sitekey'); }
  get #theme () { return this.getAttribute('theme') || 'auto'; }
  get #appearance () { return this.getAttribute('appearance') || 'always'; }
  get #retryIntervalMS () { return parseInt(this.getAttribute('retry-interval') || 8000); } // Milliseconds.
  get #widgetTagName () { return this.getAttribute('selector') || 'bot-detect'; }

  get #form () { return this.querySelector('form'); }
  get #elements () { return this.#form.elements; }
  get #output () { return this.#form.querySelector('output, [aria-live], [role = alert]')}
  get #submitButton () { return this.#form.querySelector('[type = submit]'); }
  get #responseElement () { return this.#form.querySelector('[ name = cf-turnstile-response ]'); }
  get #turnstile () { return window.turnstile; }
  get #response () { return this.#turnstile.getResponse(this.#widgetId); }

  #expectations () {
    console.assert(this.#form, 'Missing <form> element');
    console.assert(this.#output, 'Missing output/live-region element');
    console.assert(this.#submitButton, 'Missing submit button');
    console.assert(this.#elements && this.#elements.length, 'Missing form fields.');
    console.assert(this.#sitekey, 'Missing CF turnstile key');
  }

  constructor () {
    super();
    this.#expectations();
    this.#initializeBotDetection();
    this.#submitButton.addEventListener('click', (ev) => this.#onBeforeSubmit(ev));
    this.#form.addEventListener('submit', (ev) => this.#onSubmit(ev));
  }

  #initializeBotDetection () {
    const elem = this.#form.querySelector(this.#widgetTagName);
    if (elem) {
      this.#widgetElement = elem;
    } else {
      this.#widgetElement = document.createElement(this.#widgetTagName);
      this.#form.appendChild(this.#widgetElement);
    }
    const SCR = document.createElement('script');
    SCR.src = this.#src;
    SCR.setAttribute('defer', '');
    SCR.addEventListener('load', (ev) => this.#onLoad(ev));
    document.body.appendChild(SCR);
  }

  #onLoad (event) {
    console.assert(this.#turnstile, 'Missing CF Turnstile');

    const widgetId = this.#turnstile.render(this.#widgetElement, {
      language: this.dataset.lang || 'auto',
	    sitekey: this.#sitekey,
      size: 'flexible',
      theme: this.#theme,
      'retry-interval': this.#retryIntervalMS,
	    callback: (token) => this.#onSuccess(token),
      'error-callback': (err) => this.#onError(err),
      'expired-callback': (ev) => this.#onExpired(ev),
      'timeout-callback': (ev) => this.#onTimeout(ev),
    });

    console.debug('form-with-bot-detect:', [this], event);
  }

  #onError (errCode) {
    this.#setStatus('error', 'Sorry, there’s a problem with bot detection.');
    this.dataset.turnstileError = errCode;
    this.#error = errCode;
    this.#submitButton.disabled = true;
    console.error('CF Turnstile Error:', errCode);
  }

  #onExpired (event) {
    this.#setStatus('expired', 'Sorry, bot detection has expired.');
    this.removeAttribute('data-error');
    this.#submitButton.disabled = true;
    console.warn('CF Turnstile expired:', event);
  }

  #onTimeout (event) {
    this.#setStatus('timeout', 'Challenge timed out');
    this.removeAttribute('data-error');
    console.warn('CF Turnstile timeout:', event);
  }

  #onSuccess (token) {
    this.#setStatus ('success', 'Success');
    this.removeAttribute('data-error');
    this.#token = token;
    this.#error = undefined;
    this.#submitButton.disabled = false;
    console.debug('CF Turnstile token:', token);
  }

  #onBeforeSubmit (event) {
    this.#valid = this.#form.reportValidity();
    // this.#status = 'valid';
    console.debug('Before submit. Valid?', this.#valid);
  }

  async #onSubmit (event) {
    event.preventDefault();

    try {
      const resp = await fetch(this.#verifyUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: this.#response })
      });
      console.assert(resp.ok, `Fetch Error: ${resp.status}`);
      const data = await resp.json();

      console.debug('Verified?', data.success, data, event);
    } catch (error) {
      console.error('Caught:', error);
    }
  }

  #setStatus (status, message = '') {
    this.#status = status;
    this.dataset.turnstileStatus = status;
    this.#output.textContent = message;
  }
}
