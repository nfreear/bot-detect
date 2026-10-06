/**
 * A custom element to run bot-detection using Cloudflare Turnstile.
 *
 * @see https://github.com/nfreear/bot-detect
 * @license MIT
 */
import BotDetectElement from './BotDetectElement.js';
import FormWithBotDetectElement from './FormWithBotDetectElement.js';

const { customElements } = window;

function defineElements (tagName = 'my-form-with-bot-detect', tagName2 = 'bot-detect') {
  customElements.define(tagName, FormWithBotDetectElement);
  customElements.define(tagName2, BotDetectElement);
  return { BotDetectElement, FormWithBotDetectElement };
}

export { BotDetectElement, FormWithBotDetectElement, defineElements };

export default defineElements;
