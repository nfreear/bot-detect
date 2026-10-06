
# `<my-form-with-bot-detect>`

Custom elements to run bot-detection using [Cloudflare Turnstile][ts-dev] or similar for a HTML `<form>`.

## HTML

```html
<my-form-with-bot-detect sitekey="…">
  <form>
    <label>Name <input autocomplete="name" required></label>

    <bot-detect></bot-detect>

    <button type="submit">Submit</button>
  </form>
</my-form-with-bot-detect>
```

## JavaScript

* CDN: [esm.sh/gh/nfreear/bot-detect][cdn]

```js
import defineElements from 'https://esm.sh/gh/nfreear/bot-detect';

defineElements();
```

## License

* License: [MIT][]

[ts-prod]: https://www.cloudflare.com/products/turnstile/
  "Verify Visitors Without CAPTCHA?"
[ts-dev]: https://developers.cloudflare.com/turnstile/
[ts-privacy]: https://www.cloudflare.com/turnstile-privacy-policy/
[cdn]: https://esm.sh/gh/nfreear/bot-detect
[mit]: https://nfreear.mit-license.org/2026
