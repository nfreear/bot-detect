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
  #intID;
  #count = 0;

  get #novalidate () { return this.hasAttribute('novalidate'); }
  // Was: get #delayMS () { return parseInt(this.getAttribute('delay') || 1000); }
  get #message () { return this.getAttribute('message') || 'Please verify that you’re human'; }
  get #input () { return this.querySelector('input'); }
  get #_name () { return this.#input.name; }

  get value () { return this.#input.value; }
  get validity () { return this.#internals && this.#internals.validity; } // Was: { ...{}, ...this.#internals.validity, ...{ tooShort: this.#tooShort, valueMissing: this.#valueMissing } };
  get validationMessage () { return this.#internals ? this.#internals.validationMessage : ''; }
  get willValidate () { return this.#internals ? this.#internals.willValidate : false; }
  get form () { return this.#internals && this.#internals.form; }
  get minLength () { return 750; } /* Length: 817 */
  get required () { return true; }

  get #tooShort () { return !!this.value && (this.value.length < this.minLength); }
  get #valueMissing () { return !this.value || !this.value.length; }

  connectedCallback () {
    // super();
    this.setAttribute('tabindex', -1);
    if (this.#novalidate) {
      console.debug('bot-detect (novalidate):', [this]);
    } else {
      this.#internals = this.attachInternals();
      this.#intID = setInterval(() => this.#onInterval(), 100);
      setTimeout(() => this.#onTimeout(), 20 * 1000);
    }
  }

  /* Check if 3rd-party bot-detection is ready yet.
   */
  #onInterval () {
    this.#count++;
    if (this.#input) {
      clearInterval(this.#intID);
      this.#intID = null;
      this.checkValidity();
      console.debug('bot-detect (validate):', this.#count * 200, [this]);
    }
  }

  #onTimeout () {
    if (this.#intID) {
      clearInterval(this.#intID);
    }
    console.assert(this.#input, 'Missing hidden <input> element');
  }

  checkValidity () {
    if (!this.#novalidate) {
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
  }

  reportValidity () {
    this.checkValidity();
  }
}
