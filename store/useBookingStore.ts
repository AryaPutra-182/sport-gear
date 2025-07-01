// store/useBookingStore.ts

import { create } from 'zustand';

// Mendefinisikan tipe data untuk item yang akan kita simpan
export interface BookingItem {
  id: number;
  name: string;
  price_per_day: number;
  image_url: string;
  quantity: number;
  duration: number;
}

// Mendefinisikan tipe data untuk state dan actions di store kita
interface BookingState {
  items: BookingItem[];
  addItem: (item: BookingItem) => void;
  // Nanti kita bisa tambahkan removeItem, clearCart, dll.
}

export const useBookingStore = create<BookingState>((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    // Cek jika item sudah ada, untuk sementara kita tambahkan saja
    // Logika lebih kompleks (update jumlah) bisa ditambahkan nanti
    return { items: [...state.items, item] };
  }),
}));