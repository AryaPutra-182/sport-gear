"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// ... (fungsi deleteProduct dan updateOrderStatus yang sudah ada) ...

export async function updateOrderStatus(orderId: number, newStatus: string) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();

  const { error: orderError } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (orderError) {
    console.error("Error updating order status:", orderError);
    return { success: false, error: orderError.message };
  }

  const statusText = `Status pesanan diubah menjadi: ${newStatus.replace('_', ' ')}`;
  const { error: historyError } = await supabase
    .from('order_status_history')
    .insert({ order_id: orderId, status_text: statusText });
  
  if (historyError) {
    console.error("Error adding to status history:", historyError);
  }

  revalidatePath(`/admin/pesanan/${orderId}`);
  revalidatePath('/admin/pesanan');
  revalidatePath(`/status-pesanan/${orderId}`);
  revalidatePath('/pesanan_saya');

  return { success: true, error: null };
}


// --- FUNGSI BARU DI SINI ---
export async function requestItemReturn(orderId: number) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();

  // Status baru untuk proses pengembalian
  const newStatus = 'proses_pengembalian';
  const statusText = 'Permintaan pengembalian barang telah dibuat. Kurir akan segera menjemput.';

  // 1. Update status di tabel 'orders'
  const { error: orderError } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (orderError) {
    return { success: false, error: orderError.message };
  }

  // 2. Tambahkan riwayat status baru
  const { error: historyError } = await supabase
    .from('order_status_history')
    .insert({ order_id: orderId, status_text: statusText });

  if (historyError) {
    // Tetap lanjutkan meskipun gagal mencatat riwayat
    console.error("Error adding return status history:", historyError);
  }

  // 3. Revalidasi path yang relevan
  revalidatePath(`/pesanan_saya`);
  revalidatePath(`/status-pesanan/${orderId}`);

  return { success: true, error: null };
}