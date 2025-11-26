import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Definisikan Interface untuk Data User & Item
interface User {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  [key: string]: any;
}

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
  
  // TAMBAHKAN INI:
  duration?: number; // Durasi sewa dalam hari
}

// 2. Definisikan Interface Utama State (INI YANG PENTING AGAR ERROR HILANG)
interface BookingState {
  // State Data
  items: CartItem[];
  user: User | null;      // <--- Menambahkan tipe data user

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string | number) => void;
  clearCart: () => void;
  
  // Actions Auth (User)
  setUser: (user: User | null) => void; // <--- Menambahkan tipe fungsi setUser
  logout: () => void;                   // <--- Menambahkan tipe fungsi logout
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      // --- Initial State ---
      items: [],
      user: null,

      // --- Actions Keranjang ---
      addItem: (newItem) => set((state) => {
        const exists = state.items.find((item) => item.id === newItem.id);
        if (exists) return state;
        return { items: [...state.items, newItem] };
      }),

      removeItem: (itemId) => set((state) => ({
        items: state.items.filter((item) => item.id !== itemId)
      })),

      clearCart: () => set({ items: [] }),

      // --- Actions Auth (Penyebab error jika bagian ini hilang) ---
      setUser: (userData) => set({ user: userData }),

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null });
        // Opsional: set({ user: null, items: [] }) jika ingin hapus keranjang saat logout
      },
    }),
    {
      name: 'sportgear-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);