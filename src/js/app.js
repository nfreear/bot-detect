import { FormWithBotDetectElement, BotDetectElement } from './index.js';

export default function demoApp (tagName = 'my-form-with-bot-detect') {
  const formWithElem = document.querySelector(tagName);
  const botDetectElem = document.querySelector('bot-detect');
  const url = new URL(window.location);

  if (url.search.includes('disable')) {
    formWithElem.setAttribute('button-disable', '');
  }

  if (url.search.includes('form-assoc')) {
    botDetectElem.removeAttribute('novalidate');
  }

  customElements.define(tagName, FormWithBotDetectElement);
  customElements.define('bot-detect', BotDetectElement);
}

if (import.meta.url.includes('run')) {
  demoApp();
}
