// The API runs on a free tier that spins down when idle and takes around a
// minute to wake. Poking /health as soon as someone opens the landing page
// means the server wakes while they are reading it, rather than starting from
// cold when they click "Try the demo".
//
// Deliberately fire-and-forget: if the API is unreachable there is nothing
// useful to do about it here, and the request must never affect the page.
export const prewarmApi = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (!baseUrl) return;

  fetch(`${baseUrl}/health`, { cache: "no-store" }).catch(() => {});
};
