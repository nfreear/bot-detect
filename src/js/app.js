import defineElements from './index.js';
import FormValidator from 'my-form-validator';

export default function demoApp (tagName = 'my-form-with-bot-detect') {
  const validator = new FormValidator();

  const formWithElem = document.querySelector(tagName);
  const botDetectElem = document.querySelector('bot-detect');
  const url = new URL(window.location);
  const params = new URLSearchParams(url.search);

  if (url.search.includes('disable')) {
    formWithElem.setAttribute('button-disable', '');
  }

  if (url.search.includes('valid')) {
    botDetectElem.removeAttribute('novalidate');
  }

  formWithElem.setAttribute('appearance', params.get('appearance') || 'always');
  formWithElem.dataset.lang = params.get('lang') || 'auto';

  defineElements(tagName);

  validator.defineElement();
  validator.addPreSubmitEventHandler();
  validator.addBlurEventHandler();

  validator.form.addEventListener('submit', (ev) => onSubmit(ev, formWithElem));

  console.assert(validator.form && validator.form.action, 'Missing form action');
}

export async function onSubmit (event, helper) {
  event.preventDefault();
  const { action, elements } = event.target; // <form>
  const result = elements.result;

  try {
    const resp = await fetch(helper._verifyRequest());
    console.assert(resp.ok, `Fetch Error: ${action} ${resp.status}`);
    const data = await resp.json();
    result.value = `Verification ${data.success ? 'OK' : 'Error'}`;
    console.debug('Verified?', data.success, data, event);
    event.target.dataset.verified = data.success;
  } catch (error) {
    event.target.dataset.verified = false;
    console.error('Caught:', error);
    result.value = 'Verification error caught';
  }
}

if (import.meta.url.includes('run')) {
  demoApp();
}
