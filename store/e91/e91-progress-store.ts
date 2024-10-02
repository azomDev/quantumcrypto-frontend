import {BB84GameStep, Line} from '@/types';
import {create} from 'zustand';

interface E91ProgressStore {
    step: BB84GameStep;
    e91Tab: string;
    displayedLines: Line[];
    setStep: (step: BB84GameStep) => void;
    setBb84Tab: (tab: string) => void;
    setDisplayedLines: (lines: Line[]) => void;
    pushLines: (lines: Line[]) => void;
    resetProgress: () => void;
}

export const useE91ProgressStore = create<E91ProgressStore>((set) => ({
    step: BB84GameStep.EXCHANGE,
    e91Tab: 'exchange',
    displayedLines: [],
    setStep: (step) => {
        localStorage.setItem('e91Step', JSON.stringify(step));
        set({step});
    },
    setBb84Tab: (tab) => {
        localStorage.setItem('e91Tab', tab);
        set({e91Tab: tab});
    },
    setDisplayedLines: (lines) => set({displayedLines: lines}),
    pushLines: (lines) => set((state) => {
        const updatedLines = [...state.displayedLines, ...lines];
        localStorage.setItem('e91DisplayedLines',
            JSON.stringify(updatedLines));
        return {
            displayedLines: updatedLines,
        };
    }),
    resetProgress: () => set({
        e91Tab: 'exchange',
        step: BB84GameStep.EXCHANGE,
        displayedLines: [],
    }),
}));