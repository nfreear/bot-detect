import { FormWithBotDetectElement, BotDetectElement } from './index.js';

export default function demoApp (tagName = 'my-form-with-bot-detect') {
  const formWithElem = document.querySelector(tagName);
  const url = new URL(window.location);

  if (url.search.includes('disable')) {
    formWithElem.setAttribute('button-disable', '');
  }

  if (url.search.includes('form-assoc')) {
    customElements.define('bot-detect', BotDetectElement);
  }

  customElements.define(tagName, FormWithBotDetectElement);
}

if (import.meta.url.includes('run')) {
  demoApp();
}
