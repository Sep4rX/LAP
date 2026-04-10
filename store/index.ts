import { create } from 'zustand'
import { StoreState } from '@/types'

const useStore = create<StoreState>((set) => ({
  selectedTicker: null,
  setSelectedTicker: (ticker: string) => set({ selectedTicker: ticker }),

  watchlist: [],
  addToWatchlist: (ticker: string) =>
    set((state) => {
      if (!state.watchlist.includes(ticker) && state.watchlist.length < 20) {
        return { watchlist: [...state.watchlist, ticker] }
      }
      return state
    }),
  removeFromWatchlist: (ticker: string) =>
    set((state) => ({
      watchlist: state.watchlist.filter((t) => t !== ticker),
    })),

  theme: 'dark',
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),

  alerts: [],
  addAlert: (message: string, type: string, ticker?: string) =>
    set((state) => ({
      alerts: [
        ...state.alerts,
        {
          id: `${Date.now()}-${Math.random()}`,
          message,
          type,
          ticker,
        },
      ].slice(-50), // Keep last 50
    })),
  removeAlert: (id: string) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),
}))

export default useStore
