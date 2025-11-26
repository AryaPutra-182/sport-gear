"use server";

const BASE_URL = "http://localhost:4000/api";

export async function deleteProduct(productId: number, token: string) {
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function updateOrderStatus(orderId: number, newStatus: string, token: string) {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  });

  return res.json();
}
