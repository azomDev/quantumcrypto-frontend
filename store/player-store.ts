import {create} from 'zustand';

interface PlayerStore {
    playerName: string;
    playerId: number | null;
    playerRole: string;
    playingSolo: boolean;
    isAdmin: boolean;
    partner: string;
    setPlayerName: (playerName: string) => void;
    setPlayerId: (playerName: number) => void;
    setPlayerRole: (role: string) => void;
    setPlayingSolo: (playingSolo: boolean) => void;
    setIsAdmin: (isAdmin: boolean) => void;
    setPartner: (partner: string) => void;
}

const usePlayerStore = create<PlayerStore>((set) => ({
    playerName: '',
    playerId: null,
    playerRole: 'A',
    playingSolo: false,
    isAdmin: false,
    partner: '',
    setPlayerName: (playerName) => set({playerName: playerName}),
    setPlayerId: (playerId) => set({playerId: playerId}),
    setPlayerRole: (role) => set({playerRole: role}),
    setPlayingSolo: (playingSolo) => set({playingSolo: playingSolo}),
    setIsAdmin: (isAdmin) => set({isAdmin: isAdmin}),
    setPartner: (partner) => set({partner}),
}));

export default usePlayerStore;