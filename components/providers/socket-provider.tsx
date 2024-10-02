'use client';

import React, {createContext, useContext, useState} from 'react';
// @ts-ignore
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import useE91GameStore from '@/store/e91/e91-game-store';
import {toast} from 'sonner';
import {useLanguage} from '@/components/providers/language-provider';
import {useRouter} from 'next/navigation';
import usePlayerStore from '@/store/player-store';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import {useE91ProgressStore} from '@/store/e91/e91-progress-store';
import {BB84GameStep} from '@/types';
import {
    moveToExchangeTab,
} from '@/components/bb84/play-page/tabs/validation-tab';
import {clearBB84LocalStorage} from '@/lib/utils';
import {
    A_BASES_EVENT,
    A_CIPHER_EVENT,
    A_KEY_EVENT,
    A_PHOTONS_EVENT,
    A_VALIDATED_EVENT,
    B_BASES_EVENT,
    B_KEY_EVENT,
    B_SUCCESS_EVENT,
    B_VALIDATED_EVENT,
    CONNECTED_EVENT,
    END_ADMIN_EVENT,
    END_EVENT,
    END_PLAYER_EVENT,
    GAME_STARTED_EVENT,
    INVALID_CODE_EVENT, PLAYER_COUNT_EVENT,
    PLAYER_JOIN_EVENT, RESTART_WITHOUT_EVE_EVENT,
    ROLES_EVENT,
    START_EVENT,
    TAKEN_NAME_EVENT,
} from '@/bb84-constants';

type SocketContextType = {
    waitingRoomSocket: any | null;
    playRoomSocket: any | null;
    isWaitingRoomConnected: boolean;
    waitingRoomError: boolean;
    waitingRoomConnecting: boolean;
    isPlayRoomConnected: boolean;
    playRoomError: boolean;
    playRoomConnecting: boolean;
    connectToWaitingRoom: (data: { gameType: string, gameCode: string, playerName: string, admin: number }) => void;
    connectToPlayRoom: (gameType:string, gameCode:string, role: string, room: string) => void;
    startGame: (gameType:string) => void;
    sendEvent: (event: string, message?: any) => void;
    sendPhotons: (photons: number[]) => void;
    sendCipher: (cipher: string[]) => void;
    shareBases: (bases: string[], event: string, socket?: any) => void;
    shareKey: (key: string[]) => void;
    shareValidation: (valid: boolean) => void;
    sendBobSuccess: () => void;
    disconnectWaitingRoom: () => void;
}

const SocketContext = createContext<SocketContextType>({
    waitingRoomSocket: null,
    playRoomSocket: null,
    isWaitingRoomConnected: false,
    waitingRoomError: false,
    waitingRoomConnecting: false,
    isPlayRoomConnected: false,
    playRoomError: false,
    playRoomConnecting: false,
    connectToWaitingRoom: () => {
    },
    connectToPlayRoom: () => {
    },
    startGame: () => {
    },
    sendEvent: () => {
    },
    sendPhotons: () => {
    },
    sendCipher: () => {
    },
    shareBases: () => {
    },
    shareKey: () => {
    },
    shareValidation: () => {
    },
    disconnectWaitingRoom: () => {
    },
    sendBobSuccess: () => {
    },
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children}: { children: React.ReactNode }) => {

    const {localize} = useLanguage();
    const router = useRouter();
    const [waitingRoomSocket, setWaitingRoomSocket] = useState(null);
    const [playRoomSocket, setPlayRoomSocket] = useState(null);
    const [isWaitingRoomConnected, setIsWaitingRoomConnected] = useState(
        false);
    const [waitingRoomError, setWaitingRoomError] = useState(false);
    const [waitingRoomConnecting, setWaitingRoomConnecting] = useState(false);
    const [isPlayRoomConnected, setIsPlayRoomConnected] = useState(false);
    const [playRoomError, setPlayRoomError] = useState(false);
    const [playRoomConnecting, setPlayRoomConnecting] = useState(false);

    const connectToWaitingRoom = ({
                                      gameType,
                                      gameCode,
                                      playerName,
                                      admin,
                                  }: { gameType: string, gameCode: string, playerName: string, admin: number }) => {

        setWaitingRoomConnecting(true);

        // Socket instance initialization
        const socketInstance = new W3CWebSocket(
            `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/games/${gameType}/${gameCode}/?player_name=${playerName}?admin=${admin}`);

        (socketInstance as any).onerror = (error: any) => {
            console.log(error);
            setWaitingRoomError(true);
            setWaitingRoomConnecting(false);
        };

        (socketInstance as any).onclose = () => {
            setIsWaitingRoomConnected(false);
            setWaitingRoomConnecting(false);
            setWaitingRoomError(false);
            useBB84GameStore.setState({players: [], playerCount: 0});
        };

        (socketInstance as any).onmessage = (json: any) => {
            setWaitingRoomError(false);

            const data = JSON.parse(json.data)['payload'];
            const message = data['message'];
            const event = data['event'];

            switch (event) {

                case PLAYER_COUNT_EVENT:
                    if (gameType === 'bb84') {
                        useBB84GameStore.setState({playerCount: message['count']});
                    } else if (gameType === 'e91') {
                        useE91GameStore.setState({playerCount: message['count']});
                    }
                    break;

                case CONNECTED_EVENT:
                    if (gameType === 'bb84') {
                        router.push('bb84/waiting-room');
                        setIsWaitingRoomConnected(true);
                        setWaitingRoomConnecting(false);
                        if (!usePlayerStore.getState().isAdmin) {
                            usePlayerStore.setState({playerId: message['player']['id']});
                            useBB84GameStore.setState(
                                {
                                    photonNumber: message['game']['photon_number'],
                                    validationBitsLength: message['game']['validation_bits_length'],
                                });
                            localStorage.setItem('bb84PhotonNumber',
                                JSON.stringify(message['game']['photon_number']));
                            localStorage.setItem('bb84ValidationBitsLength',
                                JSON.stringify(message['game']['validation_bits_length']));
                        }
                    } else if (gameType === 'e91') {
                        router.push('e91/waiting-room');
                        setIsWaitingRoomConnected(true);
                        setWaitingRoomConnecting(false);
                        if (!usePlayerStore.getState().isAdmin) {
                            usePlayerStore.setState({playerId: message['player']['id']});
                            useE91GameStore.setState(
                                {
                                    photonNumber: message['game']['photon_number'],
                                    validationBitsLength: message['game']['validation_bits_length'],
                                });
                            localStorage.setItem('e91PhotonNumber',
                                JSON.stringify(message['game']['photon_number']));
                            localStorage.setItem('e91ValidationBitsLength',
                                JSON.stringify(message['game']['validation_bits_length']));
                        }
                    }                  
                    break;

                case PLAYER_JOIN_EVENT:
                    if (usePlayerStore.getState().isAdmin) {
                        if (gameType === 'bb84') {
                            const updatedPlayers = [...useBB84GameStore.getState().players];
                            const player = { name: message['player']['name'] };
                            updatedPlayers.push(player);
                            useBB84GameStore.setState({players: updatedPlayers});
                        } else if (gameType === 'e91') {
                            const updatedPlayers = [...useE91GameStore.getState().players];
                            const player = { name: message['player']['name'] };
                            updatedPlayers.push(player);
                            useE91GameStore.setState({players: updatedPlayers});
                        }
                    }
                    break;

                case INVALID_CODE_EVENT:
                    toast.error(localize('component.main.invalidCodeTitle'), {
                        description: localize(
                            'component.main.invalidCodeMessage'),
                    });
                    break;

                case GAME_STARTED_EVENT:
                    toast.error(localize('component.main.gameStarted'), {
                        description: localize(
                            'component.main.gameStartedDescription'),
                    });
                    break;

                case TAKEN_NAME_EVENT:
                    toast.error(localize('component.main.takenNameTitle'), {
                        description: localize(
                            'component.main.takenNameDescription'),
                    });
                    break;

                case ROLES_EVENT:
                    if (!usePlayerStore.getState().isAdmin) {
                        const { role, partner, room, eve_present: evePresent } = message[`${(usePlayerStore.getState().playerId as number)}`];
                        const {game_has_eve: gameHasEve} = message;
                        usePlayerStore.setState({playerRole: role, partner});
                        const playerData = {
                            gameCode: useBB84GameStore.getState().gameCode,
                            role,
                            room,
                            partner,
                            gameHasEve,
                            playerName: usePlayerStore.getState().playerName,
                        };
                        if (gameType === 'bb84') {
                            useBB84GameStore.setState({gameHasEve: gameHasEve});
                            useBB84RoomStore.setState({evePresent});
                  
                            localStorage.setItem('bb84PlayerData', JSON.stringify(playerData));
                            localStorage.setItem('bb84Step', JSON.stringify(useBB84ProgressStore.getState().step));
                            localStorage.setItem('bb84Tab', useBB84ProgressStore.getState().bb84Tab);
                            localStorage.setItem('bb84GameData', JSON.stringify({evePresent}));
            
                        } else if (gameType === 'e91') {
                            useE91GameStore.setState({gameHasEve: gameHasEve});
                            useE91RoomStore.setState({evePresent});
            
                            localStorage.setItem('e91PlayerData', JSON.stringify(playerData));
                            localStorage.setItem('e91Step', JSON.stringify(useBB84ProgressStore.getState().step));
                            localStorage.setItem('e91Tab', useE91ProgressStore.getState().e91Tab);
                            localStorage.setItem('e91GameData', JSON.stringify({evePresent}));
            
                        }
                        connectToPlayRoom(gameType, gameCode, role, room);
                        setTimeout(() => socketInstance.close(), 10000);
                    }
                    break;
                case END_EVENT:
                    socketInstance.close();
                    if (gameType === 'bb84') {
                        useBB84GameStore.setState({players: [], playerCount: 0});
                    } else if (gameType === 'e91') {
                        useE91GameStore.setState({players: [], playerCount: 0});
                    }
                    
                    if (!usePlayerStore.getState().isAdmin) {
                        toast.warning(
                            localize('component.waitingRoom.gameEndedTitle'), {
                                description: localize(
                                    'component.waitingRoom.gameEndedDescription'),
                            });
                    }
                    break;

                default:
                    console.log('Event: ' + event);
            }
        };
        setWaitingRoomSocket(socketInstance);
    };

    const connectToPlayRoom = (gameType: string, gameCode:string, role: string, room: string) => {

        setPlayRoomConnecting(true);

        const socketInstance = new W3CWebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/games/${gameType}/${gameCode}/rooms/${room}/`);

        setPlayRoomSocket(socketInstance);

        (socketInstance as any).onerror = (error: any) => {
            console.log(error);
            setPlayRoomError(true);
            setPlayRoomConnecting(false);
        };

        socketInstance.onclose = () => {
            setIsPlayRoomConnected(false);
            setPlayRoomConnecting(false);
        };

        socketInstance.onmessage = async (json: any) => {

            const data = JSON.parse(json.data)['payload'];
            const message = data['message'];
            const event = data['event'];

            switch (event) {

                case CONNECTED_EVENT:
                    setIsPlayRoomConnected(true);
                    setPlayRoomConnecting(false);
                    if (gameType === 'bb84') {
                        router.replace('/bb84/play');
                    } else if (gameType === 'e91') {
                        router.replace('/e91/play')
                    }
                    
                    break;

                case A_PHOTONS_EVENT:
                    if (usePlayerStore.getState().playerRole === 'B') {
                        useBB84RoomStore.getState()
                            .setAlicePhotons(message.photons);
                        useBB84ProgressStore.getState().pushLines([
                            {
                                content: 'component.bobExchange.photonsArrived',
                            },
                            {
                                title: 'component.game.step1',
                                content: 'component.bobExchange.choose',
                            },
                        ]);
                    }
                    break;

                case B_BASES_EVENT:
                    if (usePlayerStore.getState().playerRole === 'A') {
                        useBB84RoomStore.getState().setBobBases(message.bases);
                        const aliceBases = useBB84RoomStore.getState().aliceBases;
                        shareBases(aliceBases,
                            A_BASES_EVENT, socketInstance);
                        useBB84ProgressStore.getState().setBb84Tab('basis');
                        useBB84ProgressStore.getState()
                            .setStep(BB84GameStep.BASIS);
                        useBB84ProgressStore.getState().pushLines([
                            {
                                content: 'component.aliceExchange.basesArrived',
                            },
                            {
                                title: 'component.game.step2',
                                content: 'component.basis.validate',
                            },
                        ]);
                    }
                    break;

                case A_BASES_EVENT:
                    if (usePlayerStore.getState().playerRole === 'B') {
                        useBB84RoomStore.getState()
                            .setAliceBases(message.bases);
                        useBB84ProgressStore.getState().setBb84Tab('basis');
                        useBB84ProgressStore.getState()
                            .setStep(BB84GameStep.BASIS);
                        useBB84ProgressStore.getState().pushLines([
                            {
                                content: 'component.bobExchange.basesArrived',
                            },
                            {
                                title: 'component.game.step3',
                                content: 'component.basis.validate',
                            },
                        ]);
                    }
                    break;

                case A_KEY_EVENT:
                    const {validation_indices: validationIndices} = message;
                    if (usePlayerStore.getState().playerRole === 'B') {
                        useBB84RoomStore.getState()
                            .setPartnerBits(message.key);
                        if (useBB84RoomStore.getState().evePresent &&
                            useBB84ProgressStore.getState().step > 1) {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    content: 'component.validationTab.arrived',
                                },
                                {
                                    content: 'component.validationTab.start',
                                },
                                {
                                    content: 'component.validation.indices',
                                    extra: validationIndices.reduce(
                                        (result: string,
                                         current: number) => result +
                                            current.toString() + ' ', ''),
                                },
                                {
                                    content: 'component.validationTab.select',
                                },
                            ]);
                        }
                    } else {
                        if (useBB84RoomStore.getState().evePresent) {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    content: 'component.validation.indices',
                                    extra: validationIndices.reduce(
                                        (result: string,
                                         current: number) => result +
                                            current.toString() + ' ', ''),
                                },
                            ]);
                        }
                    }
                    useBB84RoomStore.getState()
                        .setValidationIndices(validationIndices);
                    break;

                case B_KEY_EVENT:
                    if (usePlayerStore.getState().playerRole === 'A') {
                        useBB84RoomStore.getState()
                            .setPartnerBits(message.key);
                        if (useBB84ProgressStore.getState().step > 1) {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    content: 'component.validationTab.arrived',
                                },
                                {
                                    content: 'component.validationTab.start',
                                },
                                {
                                    content: 'component.validationTab.select',
                                },
                            ]);
                        }
                    }
                    break;

                case A_VALIDATED_EVENT:
                    if (usePlayerStore.getState().playerRole === 'B') {
                        useBB84RoomStore.getState()
                            .setValidatedByPartner(true);
                        if (message['valid']) {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    title: 'component.validationTab.validated',
                                },
                                {
                                    content: 'component.validationTab.aliceValid',
                                },
                            ]);
                            moveToExchangeTab();
                        } else {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    title: 'component.validationTab.aliceInvalid',
                                },
                                {
                                    content: 'component.validationTab.found',
                                },
                            ]);
                        }
                    }
                    break;

                case B_VALIDATED_EVENT:
                    if (usePlayerStore.getState().playerRole === 'A') {
                        useBB84RoomStore.getState()
                            .setValidatedByPartner(true);
                        if (message['valid']) {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    title: 'component.validationTab.validated',
                                },
                                {
                                    content: 'component.validationTab.bobValid',
                                },
                            ]);
                            moveToExchangeTab();
                        } else {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    title: 'component.validationTab.bobInvalid',
                                },
                                {
                                    content: 'component.validationTab.found',
                                },
                            ]);
                        }
                    }
                    break;

                case A_CIPHER_EVENT:
                    useBB84RoomStore.getState().setAliceCipher(message.cipher);
                    if (usePlayerStore.getState().playerRole === 'A') {
                        useBB84ProgressStore.getState().pushLines([
                            {
                                content: 'component.messaging.alice.sent',
                            },
                        ]);
                    }
                    if (usePlayerStore.getState().playerRole === 'B' &&
                        useBB84ProgressStore.getState().bb84Tab ===
                        'messaging') {
                        useBB84ProgressStore.getState().pushLines([
                            {
                                content: 'component.messaging.bob.arrived',
                            },
                            {
                                content: 'component.messaging.bob.decrypt',
                            },
                        ]);
                    }
                    break;

                case B_SUCCESS_EVENT:
                    if (usePlayerStore.getState().playerRole === 'A') {
                        useBB84ProgressStore.getState().pushLines([
                            {
                                title: 'component.messaging.congratulations',
                                content: 'component.messaging.alice.end',
                            },
                        ]);
                    }
                    useBB84RoomStore.getState().setGameSuccess(true);
                    clearBB84LocalStorage();
                    break;

                case RESTART_WITHOUT_EVE_EVENT:
                    localStorage.removeItem('bb84PhotonNumber');
                    localStorage.setItem('bb84GameData', JSON.stringify({}));
                    localStorage.removeItem('bb84Step');
                    localStorage.removeItem('bb84Tab');
                    localStorage.removeItem('bb84DisplayedLines');
                    toast.message('Game restarted', {
                        description: localize(
                            'component.validation.gameRestarted'),
                    });
                    useBB84RoomStore.getState().resetRoom();
                    useBB84RoomStore.getState().setEvePresent(false);
                    useBB84ProgressStore.getState().resetProgress();
                    break;

                default:
                    console.log('Event: ' + event);
            }
        };
    };

    const startGame = (gameType: string) => {
        if (gameType === 'bb84') {
            const payload = {
                event: START_EVENT,
                message: {
                    game_code: useBB84GameStore.getState().gameCode,
                },
            };
            (waitingRoomSocket as any).send(JSON.stringify(payload));
            toast.success('Game started!');
            setTimeout(() => (waitingRoomSocket as any).close(), 5000);
            useBB84GameStore.setState({players: [], playerCount: 0});
        } else if (gameType === 'e91') {
            const payload = {
                event: START_EVENT,
                message: {
                    game_code: useE91GameStore.getState().gameCode,
                },
            };
            (waitingRoomSocket as any).send(JSON.stringify(payload));
            toast.success('Game started!');
            setTimeout(() => (waitingRoomSocket as any).close(), 5000);
            useE91GameStore.setState({players: [], playerCount: 0});
        }
       
    };

    /**
     * Sends an event to the play room web socket server.
     * @param message the message that will be sent.
     * @param event the type of event. Event types are defined in the
     * constants.ts file under BB84 Web Socket Event Constants.
     */
    const sendEvent = (event: string, message?: any) => {
        const payload: { event: string, message?: any } = {
            event,
        };
        if (message) {
            payload.message = {...message};
        }
        (playRoomSocket as any).send(JSON.stringify(payload));
    };

    const sendPhotons = (photons: number[]) => {
        sendEvent(A_PHOTONS_EVENT, {photons});
    };

    const sendCipher = (cipher: string[]) => {
        sendEvent(A_CIPHER_EVENT, {cipher});
    };

    const sendBobSuccess = () => {
        sendEvent(B_SUCCESS_EVENT, {
            game_code: useBB84GameStore.getState().gameCode,
            player_name: usePlayerStore.getState().playerName,
        });
    };

    const shareBases = (bases: string[], event: string, socket?: any) => {
        const payload = {
            event,
            message: {
                bases,
            },
        };
        if (socket) {
            socket.send(JSON.stringify(payload));
            return;
        }
        (playRoomSocket as any).send(JSON.stringify(payload));
    };

    const shareKey = (key: string[]) => {
        const playerRole = usePlayerStore.getState().playerRole;
        const payload: { event: string, message: any } = {
            event: playerRole === 'A' ? A_KEY_EVENT :
                B_KEY_EVENT,
            message: {
                key,
            },
        };
        if (playerRole === 'A') {
            payload.message.key_length = key.length;
            payload.message.validation_bits_length =
                useBB84GameStore.getState().validationBitsLength;
        }
        (playRoomSocket as any).send(JSON.stringify(payload));
    };

    const shareValidation = (valid: boolean) => {
        const event = usePlayerStore.getState().playerRole === 'A' ?
            A_VALIDATED_EVENT :
            B_VALIDATED_EVENT;
        sendEvent(event, {valid});
    };

    const disconnectWaitingRoom = () => {
        if (usePlayerStore.getState().isAdmin) {
            const payload = {
                event: END_ADMIN_EVENT,
                message: {
                    game_code: useBB84GameStore.getState().gameCode,
                    player_name: usePlayerStore.getState().playerName,
                },
            };
            (waitingRoomSocket as any).send(JSON.stringify(payload));
        } else {
            const payload = {
                event: END_PLAYER_EVENT,
                message: {
                    game_code: useBB84GameStore.getState().gameCode,
                    player_name: usePlayerStore.getState().playerName,
                },
            };
            (waitingRoomSocket as any).send(JSON.stringify(payload));
        }
        (waitingRoomSocket as any).close();
    };

    return (
        <SocketContext.Provider
            value={{
                waitingRoomSocket,
                playRoomSocket,
                isWaitingRoomConnected,
                waitingRoomError,
                waitingRoomConnecting,
                isPlayRoomConnected,
                playRoomError,
                playRoomConnecting,
                connectToWaitingRoom,
                connectToPlayRoom: connectToPlayRoom,
                startGame,
                sendEvent,
                sendPhotons,
                sendCipher,
                shareBases,
                shareKey,
                sendBobSuccess,
                shareValidation,
                disconnectWaitingRoom,
            }}>
            {children}
        </SocketContext.Provider>
    );

};