export class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export async function fetchJson(url, { timeoutMs = 10_000, ...options } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) throw new HttpError(`HTTP ${res.status}`, res.status);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}
