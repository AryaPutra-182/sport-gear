import { create } from 'zustand';

export interface BookingItem {
  id: number;
  name: string;
  price_per_day: number;
  image_url: string;
  quantity: number;
  duration: number;
}

interface BookingState {
  items: BookingItem[];
  addItem: (item: BookingItem) => void;
  clearCart: () => void; 
}

export const useBookingStore = create<BookingState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  clearCart: () => set({ items: [] }), 
}));