import validateTurnstile from './validateTurnstile.js';
import errorResponse from './response.js';

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
    if (!('TS_SECRET_KEY' in env)) {
      return errorResponse('Missing TS_SECRET_KEY in environment variables');
    }
    const secretKey = env.TS_SECRET_KEY;
    const url = new URL(request.url);
    const contentType = request.headers.get('content-type');
    const isJsonRequest = contentType.includes('application/json');
    const isApiRequest = url.pathname.startsWith('/api/siteverify');
    const isPostMethod = request.method === 'POST';

		if (isApiRequest && isJsonRequest && isPostMethod) {
      try {
        const data = await request.json();
        if (!data.response) {
          return errorResponse('Missing response?');
        }
        return await validateTurnstile(data.response, secretKey);
      } catch (error) {
        return errorResponse(error, 'request-error');
      }
		}

		return env.ASSETS.fetch(request);
	},
};
