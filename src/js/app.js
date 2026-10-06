import defineElements from './index.js';

export default function demoApp (tagName = 'my-form-with-bot-detect') {
  const formWithElem = document.querySelector(tagName);
  const botDetectElem = document.querySelector('bot-detect');
  const url = new URL(window.location);
  const params = new URLSearchParams(url.search);

  if (url.search.includes('disable')) {
    formWithElem.setAttribute('button-disable', '');
  }

  if (url.search.includes('validate')) {
    botDetectElem.removeAttribute('novalidate');
  }

  formWithElem.setAttribute('appearance', params.get('appearance') || 'always');
  formWithElem.dataset.lang = params.get('lang') || 'auto';

  defineElements(tagName);
}

if (import.meta.url.includes('run')) {
  demoApp();
}
