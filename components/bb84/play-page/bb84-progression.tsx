'use client';

import React from 'react';
import GameProgression from '@/components/shared/game-progression';
import usePlayerStore from '@/store/player-store';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import {useLanguage} from '@/components/providers/language-provider';
import {Button} from '@/components/ui/button';
import {useSocket} from '@/components/providers/socket-provider';
import {RESTART_WITHOUT_EVE_EVENT} from '@/bb84-constants';
import {useRouter} from 'next/navigation';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import {restartWithoutEve} from '@/lib/bb84/utils';
import {toast} from 'sonner';
import {
    generateAliceBases,
    generateAliceBits,
    generateAlicePhotons, mimicEveIntercept,
} from '@/lib/bb84/solo-player';

const Bb84Progression = () => {

    const {localize} = useLanguage();
    const {sendEvent} = useSocket();
    const router = useRouter();

    const {gameCode, photonNumber} = useBB84GameStore();

    const {playerRole, partner: partnerName, playingSolo} = usePlayerStore();

    const {displayedLines, pushLines} = useBB84ProgressStore();

    const {
        gameSuccess,
        evePresent,
        validated,
        validatedByPartner,
        eveUndetected,
        setAlicePhotons,
        setAliceBits,
        setAliceBases
    } = useBB84RoomStore();


    const getFeed = () => displayedLines.map((line: any, index: number) => {
        return (
            <div key={index} className="w-full h-fit mb-1">
                <p className="text-card-foreground text-md md:text-xl">{line.title &&
                    <span className="font-bold text-highlight">{localize(
                        line.title)}</span>}{line.content ?
                    line.extra ? localize(
                        line.content, line.extra) : localize(
                        line.content) : ''}</p>
            </div>
        );
    });

    const restartGameWithoutEve = () => {
        if (playingSolo) {
            restartWithoutEve();
            toast.message('Game restarted', {
                description: localize(
                    'component.validation.gameRestarted'),
            });
            if (playerRole === 'B') {
                const aliceBits = generateAliceBits(photonNumber);
                const aliceBases = generateAliceBases(photonNumber);
                let alicePhotons = generateAlicePhotons(aliceBits, aliceBases);
                setAliceBits(aliceBits);
                setAliceBases(aliceBases);
                setAlicePhotons(alicePhotons);
                pushLines([
                    {
                        title: 'component.exchange.welcome',
                    },
                    {
                        content: 'component.bobExchange.waiting',
                    },
                    {
                        content: 'component.bobExchange.photonsArrived',
                    },
                    {
                        title: 'component.game.step1',
                        content: 'component.bobExchange.choose',
                    },
                ]);
            }
            return;
        }
        sendEvent(RESTART_WITHOUT_EVE_EVENT);
    };

    const goToResultsPage = () => {
        router.replace(`/games/bb84/${gameCode}/results`);
    };

    const goToMainMenu = () => {
        router.replace('/');
    };

    const goToBB84Page = () => {
        router.replace('/bb84');
    }

    return (
        <GameProgression className="border-none">
            {getFeed()}
            {evePresent && !eveUndetected && (validated || validatedByPartner) &&
                <div className="w-full h-fit mb-1 flex justify-center">
                    <Button onClick={restartGameWithoutEve}>{localize('component.gameRestart.restart')}</Button>
                </div>}
            {gameSuccess && <div className="w-full h-fit mb-1">
                {!playingSolo && <p className="text-card-foreground text-md md:text-xl">
                    {playerRole === 'A' ?
                        localize('component.messaging.alice.reveal') :
                        localize('component.messaging.bob.reveal')}
                    <span
                        className="font-bold text-highlight"> {partnerName}</span>
                </p>}
                {!playingSolo && <div className="w-full h-fit mb-1 flex justify-center">
                    <Button onClick={goToResultsPage}>{localize('component.results.seeResults')}</Button>
                </div>}
                {playingSolo && <div className="w-full h-fit mb-1 flex justify-center space-x-4">
                    <Button onClick={goToBB84Page}>{localize('component.gameRestart.playAgain')}</Button>
                    <Button onClick={goToMainMenu}>{localize('component.return.returnToMain')}</Button>
                </div>}
            </div>}
        </GameProgression>
    );
};

export default Bb84Progression;