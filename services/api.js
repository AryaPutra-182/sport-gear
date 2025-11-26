const BASE_URL = "http://localhost:4000/api";

export async function api(path, method = "GET", data = null, auth = false) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  });

  return res.json();
}
