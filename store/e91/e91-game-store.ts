import {create} from 'zustand';
import {Player} from '@/types';

interface E91GameStore {
    gameCode: string;
    photonNumber: number;
    validationBitsLength: number;
    playerCount: number;
    players: Player[];
    gameHasEve: boolean;
    setPhotonNumber: (photonNumber: number) => void;
    setGameCode: (gameCode: string) => void;
    setPlayerCount: (count: number) => void;
    setPlayers: (players: Player[]) => void;
    setGameHasEve: (gameHasEve: boolean) => void;
    setValidationBitsLength: (length: number) => void;
}

const useE91GameStore = create<E91GameStore>((set) => ({
    gameCode: '',
    photonNumber: 20,
    validationBitsLength: 0,
    playerCount: 0,
    players: [],
    gameHasEve: false,
    setPhotonNumber: (photonNumber) => set({photonNumber}),
    setGameCode: (gameCode) => set({gameCode: gameCode}),
    setPlayerCount: (count) => set({playerCount: count}),
    setPlayers: (players) => set({players: players}),
    setGameHasEve: (gameHasEve) => set({gameHasEve}),
    setValidationBitsLength: (length) => set({validationBitsLength: length}),
}));

export default useE91GameStore;