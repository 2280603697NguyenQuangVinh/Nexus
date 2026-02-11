import { auth } from './firebaseClient';

export async function authorizedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Not logged in');
  }

  const token = await user.getIdToken();

  return fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}


