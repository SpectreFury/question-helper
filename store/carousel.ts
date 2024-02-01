import { create } from "zustand";

interface CarouselStore {
  currentItem: number;
  setNextItem: (quizLength: number) => void;
  setPreviousItem: (quizLength: number) => void;
}

const useCarouselStore = create<CarouselStore>((set) => ({
  currentItem: 0,
  setNextItem: (quizLength: number) =>
    set((state) => ({
      currentItem:
        state.currentItem < quizLength - 1
          ? state.currentItem + 1
          : state.currentItem,
    })),
  setPreviousItem: (quizLength: number) =>
    set((state) => ({
      currentItem:
        state.currentItem > 0 ? state.currentItem - 1 : state.currentItem,
    })),
}));

export { useCarouselStore };
