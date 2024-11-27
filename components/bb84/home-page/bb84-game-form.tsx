'use client';
import React, {useEffect, useState} from 'react';
import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {TailSpin} from 'react-loading-icons';
import {useForm} from 'react-hook-form';
import {Button} from '@/components/ui/button';
import axios from '@/commons/http';
import {useSocket} from '@/components/providers/socket-provider';
import {useLanguage} from '@/components/providers/language-provider';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import usePlayerStore from '@/store/player-store';
import {
    Card, CardContent,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import CreateGameModal from '@/components/bb84/home-page/create-game-modal';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {clearBB84LocalStorage} from '@/lib/bb84/utils';
import SoloGameModal from '@/components/bb84/home-page/solo-game-modal';

const BB84Main: React.FC = () => {

    const {
        connectToWaitingRoom,
        isWaitingRoomConnected,
        waitingRoomConnecting,
        isPlayRoomConnected,
        connectToPlayRoom,
    } = useSocket();
    const [creatingGame, setCreatingGame] = useState(false);
    const [rejoinDialogOpen, setRejoinDialogOpen] = useState(false);
    const {localize} = useLanguage();
    const {
        setGameCode,
        setGameHasEve,
        setValidationBitsLength,
        setPhotonNumber,
    } = useBB84GameStore();
    const {
        setPlayerName,
        setPlayerRole,
        setPartner,
        setIsAdmin,
    } = usePlayerStore();
    const {
        setBb84Tab,
        setStep,
        setDisplayedLines,
        resetProgress,
    } = useBB84ProgressStore();
    const {restoreGame, resetRoom} = useBB84RoomStore();
    const router = useRouter();

    useEffect(() => {
        resetRoom();
        resetProgress();
        if (isPlayRoomConnected) {
            router.push('/bb84/play');
            return;
        }
        const previousGame = localStorage.getItem('bb84PlayerData');
        if (previousGame) {
            setRejoinDialogOpen(true);
        }
    }, [isPlayRoomConnected]);

    const getGameProgress = () => {

        const getItem = (key: string) => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        };

        const previousGame = getItem('bb84PlayerData');

        if (previousGame) {
            const {
                gameCode,
                role,
                partner,
                gameHasEve,
                playerName,
            } = previousGame;

            setGameHasEve(gameHasEve);
            setGameCode(gameCode);
            setPartner(partner);
            setPlayerRole(role);
            setPlayerName(playerName);
        }

        const stepJSON = getItem('bb84Step');
        if (stepJSON) {
            setStep(stepJSON);
        }

        const tab = localStorage.getItem('bb84Tab');
        if (tab) {
            setBb84Tab(tab);
        }

        const photonNumber = getItem('bb84PhotonNumber');
        if (photonNumber) {
            setPhotonNumber(photonNumber);
        }

        const validationBitsLength = getItem('bb84ValidationBitsLength');
        if (validationBitsLength) {
            setValidationBitsLength(validationBitsLength);
        }

        const previousDisplayedLines = getItem('bb84DisplayedLines');
        if (previousDisplayedLines) {
            setDisplayedLines(previousDisplayedLines);
        }

        const gameDataJSON = getItem('bb84GameData');
        if (gameDataJSON) {
            restoreGame(gameDataJSON);
        }

        if (previousGame && previousGame.role && previousGame.room) {
            connectToPlayRoom(previousGame.role, previousGame.room);
        }
    };

    const formSchema = z.object({
        playerName: z.string({
            required_error: localize('component.main.nameRequired'),
        }).min(2, {
            message: localize('component.main.nameMin'),
        }).max(10, {
            message: localize('component.main.nameMax'),
        }),
        gamePIN: z.string({
            required_error: localize('component.main.pinRequired'),
        }).length(5, {
            message: localize('component.main.pinLength'),
        }).toUpperCase(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            playerName: '',
            gamePIN: '',
        },
    });

    const onJoinGame = async ({
                                  gamePIN,
                                  playerName,
                              }: z.infer<typeof formSchema>) => {

        if (isWaitingRoomConnected) return;

        setGameCode(gamePIN);
        setPlayerName(playerName);
        setIsAdmin(false);

        const data = {
            gameCode: gamePIN,
            playerName,
            admin: 0,
        };

        connectToWaitingRoom(data);
    };

    const onCreateGame = async (photonNumber: number, eve: boolean,
                                validationBits: number,
                                evePercentage: number) => {

        if (isWaitingRoomConnected) return;

        setCreatingGame(true);

        try {

            const gameData = {
                photon_number: photonNumber,
                eve,
                validation_bits_length: validationBits,
                eve_percentage: evePercentage,
            };

            const response = await axios.post('/games/bb84/', gameData);
            const {code: gamePIN} = response.data;

            setGameCode(gamePIN);
            setPlayerName('admin');
            setIsAdmin(true);

            const data = {
                gameCode: gamePIN,
                playerName: 'admin',
                admin: 1,
            };
            connectToWaitingRoom(data);

        } catch (e) {
            setCreatingGame(false);
            console.log(e);
            toast.error(localize('component.main.errorCreating'));
        }
    };

    const onCancelRejoin = () => {
        setRejoinDialogOpen(false);
        clearBB84LocalStorage();
    };

    const onRejoin = () => {
        setRejoinDialogOpen(false);
        getGameProgress();
    };

    return (
        <>
            <AlertDialog open={rejoinDialogOpen}>
                <AlertDialogContent className="border-secondary">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {localize('component.bb84.gameFound')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {localize('component.bb84.gameFound.desc')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={onCancelRejoin}>
                            {localize('general.close')}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={onRejoin}>
                            {localize('component.bb84.gameFound.action')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div
                className="h-fit w-fit mx-auto p-2 mt-6 flex flex-col gap-y-16">
                <div className="flex flex-col gap-y-4 text-center">
                    <h1 className="text-5xl font-bold text-primary">BB84</h1>
                    <h1 className="text-4xl font-bold">{localize(
                        'component.main.game')}</h1>
                </div>
                <Card
                    className="pt-4 pb-2 border-none w-[350px] md:w-[500px] mx-auto
                 shadow-md">
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onJoinGame)}
                                  className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="playerName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className="text-lg">{localize(
                                                'component.main.nameLabel')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={localize(
                                                        'component.main.name')} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                {localize(
                                                    'component.main.nameDescription')}
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gamePIN"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className="text-lg">{localize(
                                                'component.main.pinLabel')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="SR117" {...field}
                                                    value={field.value.toUpperCase()}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div
                                    className="flex gap-x-3 w-full">
                                    <Button type="submit"
                                            disabled={waitingRoomConnecting}
                                            className="text-md w-full p-2">{creatingGame ?
                                        <TailSpin className="p-2"/> :
                                        localize(
                                            'component.main.join')}</Button>
                                </div>
                            </form>
                        </Form>
                        <div className="flex flex-row justify-center gap-x-2">
                            <SoloGameModal />
                            <CreateGameModal connecting={waitingRoomConnecting}
                                             creatingGame={creatingGame}
                                             onCreateGame={onCreateGame}/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default BB84Main;