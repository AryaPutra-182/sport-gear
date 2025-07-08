// app/actions.ts

"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// --- FUNGSI PRODUK ---
export async function deleteProduct(productId: number, imageUrl: string) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  const fileName = imageUrl.split('/').pop();
  if (fileName) {
    await supabase.storage.from('product-images').remove([fileName]);
  }
  await supabase.from('products').delete().eq('id', productId);
  revalidatePath('/admin/produk');
  return { success: true };
}

// --- FUNGSI PESANAN ---
export async function updateOrderStatus(orderId: number, newStatus: string) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  const statusText = `Status pesanan diubah menjadi: ${newStatus.replace('_', ' ')}`;
  await supabase.from('order_status_history').insert({ order_id: orderId, status_text: statusText });
  revalidatePath(`/admin/pesanan/${orderId}`);
  revalidatePath('/admin/pesanan');
  revalidatePath(`/status-pesanan/${orderId}`);
  revalidatePath('/pesanan_saya');
  return { success: true, error: null };
}

export async function requestItemReturn(orderId: number) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  const newStatus = 'proses_pengembalian';
  const statusText = 'Permintaan pengembalian barang telah dibuat. Kurir akan segera menjemput.';
  await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  await supabase.from('order_status_history').insert({ order_id: orderId, status_text: statusText });
  revalidatePath(`/pesanan_saya`);
  revalidatePath(`/status-pesanan/${orderId}`);
  return { success: true, error: null };
}

// --- FUNGSI KATEGORI ---

export async function addCategory(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  const name = formData.get('name') as string;
  const imageFile = formData.get('image') as File;
  if (!name || !imageFile || imageFile.size === 0) {
    return { error: 'Nama dan gambar kategori wajib diisi.' };
  }
  try {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `category-${Date.now()}.${fileExt}`;
    await supabase.storage.from('product-images').upload(fileName, imageFile);
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
    await supabase.from('categories').insert({ name, image_url: urlData.publicUrl });
    revalidatePath('/admin/kategori');
    revalidatePath('/produk');
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateCategory(categoryId: number, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  const name = formData.get('name') as string;
  const imageFile = formData.get('image') as File;
  let imageUrl: string | undefined;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `category-update-${Date.now()}.${fileExt}`;
    await supabase.storage.from('product-images').upload(fileName, imageFile);
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
    imageUrl = urlData.publicUrl;
  }

  const dataToUpdate: { name: string; image_url?: string } = { name };
  if (imageUrl) {
    dataToUpdate.image_url = imageUrl;
  }

  const { error } = await supabase.from('categories').update(dataToUpdate).eq('id', categoryId);
  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/kategori');
  revalidatePath(`/admin/kategori/edit/${categoryId}`);
  revalidatePath('/produk');
  return { success: true };
}

export async function deleteCategory(categoryId: number, imageUrl: string) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();
  const fileName = imageUrl.split('/').pop();
  if (fileName) {
    await supabase.storage.from('product-images').remove([fileName]);
  }
  await supabase.from('categories').delete().eq('id', categoryId);
  revalidatePath('/admin/kategori');
  revalidatePath('/produk');
  return { success: true };
}
