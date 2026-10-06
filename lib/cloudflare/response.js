const { Response } = globalThis;

/**
 * Error response.
 */
export default function errorResponse (error, errorCode = 'internal-error', status = 500) {
  console.error(errorCode, error);
  return new Response(JSON.stringify({
    success: false,
    'error-codes': [errorCode]
  }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
