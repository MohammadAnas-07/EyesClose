/**
 * Health check. Later this file sits next to the waitlist and feedback handlers.
 * Rule: no handler in this package may accept form answers or case data.
 */
export interface HealthResponse {
  status: 'ok';
  service: 'eyesclose-server';
}

export function health(): HealthResponse {
  return { status: 'ok', service: 'eyesclose-server' };
}
