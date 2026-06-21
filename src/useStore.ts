import { create } from 'zustand'

interface StoreState {
  cartCount: number;
  wishlistCount: number;
  setInitialCounts: (cart: number, wishlist: number) => void;
  incrementCart: () => void;
  incrementWishlist: () => void;
}

export const useStore = create<StoreState>((set) => ({
  cartCount: 0,
  wishlistCount: 0,
  
 
  setInitialCounts: (cart, wishlist) => set({ cartCount: cart, wishlistCount: wishlist }),
  

  incrementCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  incrementWishlist: () => set((state) => ({ wishlistCount: state.wishlistCount + 1 })),
}))