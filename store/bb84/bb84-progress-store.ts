import {BB84GameStep, Line} from '@/types';
import {create} from 'zustand';

interface BB84ProgressStore {
    step: BB84GameStep;
    bb84Tab: string;
    displayedLines: Line[];
    setStep: (step: BB84GameStep) => void;
    setBb84Tab: (tab: string) => void;
    setDisplayedLines: (lines: Line[]) => void;
    pushLines: (lines: Line[]) => void;
    resetProgress: () => void;
}

export const useBB84ProgressStore = create<BB84ProgressStore>((set) => ({
    step: BB84GameStep.EXCHANGE,
    bb84Tab: 'exchange',
    displayedLines: [],
    setStep: (step) => {
        localStorage.setItem('bb84Step', JSON.stringify(step));
        set({step});
    },
    setBb84Tab: (tab) => {
        localStorage.setItem('bb84Tab', tab);
        set({bb84Tab: tab});
    },
    setDisplayedLines: (lines) => set({displayedLines: lines}),
    pushLines: (lines) => set((state) => {
        const updatedLines = [...state.displayedLines, ...lines];
        localStorage.setItem('bb84DisplayedLines',
            JSON.stringify(updatedLines));
        return {
            displayedLines: updatedLines,
        };
    }),
    resetProgress: () => set({
        bb84Tab: 'exchange',
        step: BB84GameStep.EXCHANGE,
        displayedLines: [],
    }),
}));