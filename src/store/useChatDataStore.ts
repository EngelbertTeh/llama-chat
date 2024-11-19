import { create } from 'zustand';

const useStore = create<{
  queries: string[];
  addQuery: (query: string) => void;
  removeAllQueries: () => void;
  updateQuery: (query: string, index: number) => void;
  isSuperUser: boolean;
  setIsSuperUser: (bool: boolean) => void;
}>((set) => ({
  queries: [],
  addQuery: (query) => set((state) => ({ queries: [...state.queries, query] })),
  removeAllQueries: () => set({ queries: [] }),
  updateQuery: (query, index) =>
    set((state) => {
      const queries = [...state.queries];
      queries[index] = query;
      return { queries };
    }),
  isSuperUser: false,
  setIsSuperUser: (bool) => set((state) => ({ isSuperUser: bool })),
}));

export default useStore;
