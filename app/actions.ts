"use server"; 

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deleteProduct(productId: number, imageUrl: string) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient();

  // 1. Hapus gambar dari Supabase Storage
  // Ekstrak nama file dari URL lengkap
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

  // 2. Hapus data produk dari tabel 'products'
  const { error: dbError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (dbError) {
    console.error("Error deleting product from database:", dbError);
    return { success: false, error: dbError.message };
  }

  // 3. Revalidasi path untuk me-refresh data di halaman manajemen produk
  revalidatePath('/admin/produk');

  return { success: true, error: null };
}
