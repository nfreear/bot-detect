import errorResponse from './response.js';

const siteverifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Server-side validation of a Cloudflare Turnstile response token.
 *
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 * @see https://developers.cloudflare.com/api/resources/turnstile/
 */
export default async function validateTurnstile (token, secret, remoteip = null) {
	try {
		const response = await fetch(siteverifyUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					secret, // Was: : SECRET_KEY,
					response: token,
					remoteip: remoteip,
				}),
			},
		);

		return new Response(response.body, {
      status: response.status,
      headers: { 'ContentType': 'application/json' }
    });
	} catch (error) {
    return errorResponse(error, 'turnstile-error');
	}
}
