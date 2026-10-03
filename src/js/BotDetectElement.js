const { HTMLElement } = window;

/**
 * Experimental!
 * Make the container for the Turnstile widget participate in form validation.
 *
 * @customElement bot-detect
 * @see https://web.dev/articles/more-capable-form-controls
 */
export default class BotDetectElement extends HTMLElement {
  static formAssociated = true;
  #internals;

  get #delayMS () { return parseInt(this.getAttribute('delay') || 1000); }
  get #message () { return this.getAttribute('message') || 'Please verify the form'; }
  get #input () { return this.querySelector('input'); }
  get #_name () { return this.#input.name; }

  get value () { return this.#input.value; }
  get validity () { return this.#internals.validity; } // { ...{}, ...this.#internals.validity, ...{ tooShort: this.#tooShort, valueMissing: this.#valueMissing } };
  get validationMessage () { return this.#internals.validationMessage; }
  get willValidate () { return this.#internals.willValidate; }
  get form () { return this.#internals.form; }
  get minLength () { return 750; } /* Length: 817 */
  get required () { return true; }

  get #tooShort () { return !!this.value && (this.value.length < this.minLength); }
  get #valueMissing () { return !this.value || !this.value.length; }

  connectedCallback () {
    // super();
    this.setAttribute('tabindex', -1);
    this.#internals = this.attachInternals();
    setTimeout(() => this.#initialize(), this.#delayMS);
  }

  #initialize () {
    console.assert(this.#input, 'Missing hidden <input> element');
    this.checkValidity();
    console.debug('bot-detect:', [this]);
  }

  checkValidity () {
    const isValid = !this.#valueMissing && !this.#tooShort;
    this.#internals.setValidity({
        valueMissing: this.#valueMissing,
        tooShort: this.#tooShort
      },
      isValid ? '' : this.#message,
      this
    );
    return isValid;
  }

  reportValidity () {
    this.checkValidity();
  }
}
