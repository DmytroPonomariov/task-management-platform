import {
  Enrollment,
  Instructor,
  InstructorDashboard,
  TrainingSession,
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE ?? '/api').replace(/\/$/, '');

const resolveUrl = (path: string) =>
  `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(resolveUrl(path), options);

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = undefined;
  }

  if (!response.ok) {
    const message =
      typeof body === 'object' && body !== null && 'message' in body
        ? (body as { message?: string }).message
        : undefined;
    throw new Error(message ?? 'Unable to fetch data from API.');
  }

  return body as T;
}

export const apiClient = {
  getSessions: () => fetchJson('/sessions'),
};

export { API_BASE_URL };
