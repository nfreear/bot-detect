import errorResponse from './response.js';

const { fetch, Request, Response } = globalThis;

const siteverifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Server-side validation of a Cloudflare Turnstile response token.
 *
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export default async function validateTurnstile (token, secret, remoteip = null) {
	try {
		const request = new Request(siteverifyUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				secret, // Was: : SECRET_KEY,
				response: token,
				remoteip: remoteip,
			}),
		});
		const response = await fetch(request);

		return new Response(response.body, {
      status: response.status,
      headers: { 'ContentType': 'application/json' }
    });
	} catch (error) {
    return errorResponse(error, 'turnstile-error');
	}
}
