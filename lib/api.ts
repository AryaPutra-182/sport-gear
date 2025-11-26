// src/lib/api.ts

// ⚠️ Pastikan PORT backend sesuai (4000 sesuai konfigurasi terakhir kita)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// -------------------------------------------------------
// 🔥 HELPER: Request Universal (Untuk JSON)
// -------------------------------------------------------
async function request(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});

  // 1. Auto-set Content-Type ke JSON jika body adalah string (JSON)
  if (options.body && typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // 2. Ambil Token dari LocalStorage & Masukkan ke Header
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // Tetap kirim cookie sebagai cadangan
  });

  // Handle jika response bukan JSON
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    return data;
  }
  
  return { error: response.statusText, status: response.status };
}


// -------------------------------------------------------
// 🔥 AUTH
// -------------------------------------------------------

export async function loginRequest(email: string, password: string) {
  // Login pakai fetch biasa karena belum punya token
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", 
  });

  return res.json();
}

export function registerRequest(name: string, email: string, password: string) {
  return request(`/auth/register`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function getMe() {
  return request(`/auth/me`);
}

export function logoutRequest() {
  return request(`/auth/logout`, { method: "POST" });
}

export function resetPassword(email: string, newPassword: string) {
  return request(`/auth/reset-password`, {
    method: "POST",
    body: JSON.stringify({ email, newPassword }),
  });
}


// -------------------------------------------------------
// 🔥 CATEGORIES
// -------------------------------------------------------

export function getCategories() {
  return request(`/categories`);
}

export function fetchCategoryById(id: string) {
  return request(`/categories/${id}`);
}

// KHUSUS FORM DATA (Upload Gambar Kategori)
export function createCategory(formData: FormData) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  return fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` }, 
    body: formData,
  }).then(res => res.json());
}

// KHUSUS FORM DATA (Update Gambar Kategori)
export function updateCategory(id: number, formData: FormData) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  return fetch(`${BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData,
  }).then(res => res.json());
}

export function deleteCategory(id: number) {
  return request(`/categories/${id}`, { method: "DELETE" });
}


// -------------------------------------------------------
// 🔥 PRODUCTS
// -------------------------------------------------------

export function getProducts(search?: string) {
  const q = search ? `?q=${encodeURIComponent(search)}` : "";
  return request(`/products${q}`);
}

export function getProductDetail(id: number | string) {
  return request(`/products/${id}`);
}

export function getProductsByCategory(category: string) {
  return request(`/products?category=${category}`);
}

// KHUSUS FORM DATA (Create Product dengan Gambar)
export function createProduct(formData: FormData) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  return fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  }).then(res => res.json());
}

// KHUSUS FORM DATA (Update Product dengan Gambar)
export function updateProduct(id: number, formData: FormData) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  return fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  }).then(res => res.json());
}

export function deleteProduct(id: number) {
  return request(`/products/${id}`, {
    method: "DELETE",
  });
}


// -------------------------------------------------------
// 🔥 ADDRESS
// -------------------------------------------------------

export function getLatestAddress() {
  return request(`/addresses/latest`);
}

// ✅ TAMBAHAN PENTING: Ambil semua alamat (Untuk Fix Checkout)
export function getMyAddresses() {
  return request(`/addresses`);
}

export function addAddress(data: any) {
  return request(`/addresses`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}


// -------------------------------------------------------
// 🔥 ORDERS
// -------------------------------------------------------

export function createOrder(data: any) {
  return request(`/orders`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function fetchOrders() {
  return request(`/orders/mine`);
}

export function getOrderDetail(id: number | string) {
  return request(`/orders/${id}`);
}


// -------------------------------------------------------
// 🔥 REVIEWS
// -------------------------------------------------------

export function submitReview(productId: number, rating: number, comment: string) {
  return request(`/reviews`, {
    method: "POST",
    body: JSON.stringify({ productId, rating, comment }),
  });
}


// -------------------------------------------------------
// 🔥 PAYMENTS
// -------------------------------------------------------

export function createPayment(orderId: number, proof: string) {
  return request(`/payments`, {
    method: "POST",
    body: JSON.stringify({ orderId, proof }),
  });
}