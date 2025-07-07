"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deleteProduct(productId: number, imageUrl: string) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();

  const fileName = imageUrl.split('/').pop();
  if (fileName) {
    const { error: storageError } = await supabase.storage
      .from('product-images')
      .remove([`public/${fileName}`]);
    
    if (storageError) {
      console.error("Error deleting image from storage:", storageError);
      return { success: false, error: storageError.message };
    }
  }

  const { error: dbError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (dbError) {
    console.error("Error deleting product from database:", dbError);
    return { success: false, error: dbError.message };
  }

  revalidatePath('/admin/produk');

  return { success: true, error: null };
}

export async function updateOrderStatus(orderId: number, newStatus: string) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();

  // 1. Update status di tabel 'orders'
  const { error: orderError } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (orderError) {
    console.error("Error updating order status:", orderError);
    return { success: false, error: orderError.message };
  }

  // 2. Tambahkan riwayat status baru
  const statusText = `Status pesanan diubah menjadi: ${newStatus.replace('_', ' ')}`;
  const { error: historyError } = await supabase
    .from('order_status_history')
    .insert({ order_id: orderId, status_text: statusText });
  
  if (historyError) {
    console.error("Error adding to status history:", historyError);
    // Kita tidak menghentikan proses jika ini gagal, tapi kita catat errornya
  }

  // 3. Revalidasi semua path yang relevan
  revalidatePath(`/admin/pesanan/${orderId}`); // Halaman detail admin
  revalidatePath('/admin/pesanan'); // Halaman daftar pesanan admin
  revalidatePath(`/status-pesanan/${orderId}`); // <-- TAMBAHKAN INI (Halaman pengguna)
  revalidatePath('/pesanan_saya'); // <-- Tambahkan ini juga (Halaman daftar pesanan pengguna)

  return { success: true, error: null };
}
