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

const Bb84Progression = () => {

    const {localize} = useLanguage();
    const {sendEvent} = useSocket();
    const router = useRouter();

    const {gameCode} = useBB84GameStore();

    const {playerRole, partner: partnerName} = usePlayerStore();

    const {displayedLines} = useBB84ProgressStore();

    const {
        gameSuccess,
        evePresent,
        validated,
        validatedByPartner,
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
        sendEvent(RESTART_WITHOUT_EVE_EVENT);
    };

    const goToResultsPage = () => {
        router.replace(`/games/bb84/${gameCode}/results`);
    };

    return (
        <GameProgression className="border-none">
            {getFeed()}
            {evePresent && (validated || validatedByPartner) &&
                <div className="w-full h-fit mb-1 flex justify-center">
                    <Button onClick={restartGameWithoutEve}>Restart</Button>
                </div>}
            {gameSuccess && <div className="w-full h-fit mb-1">
                <p className="text-card-foreground text-md md:text-xl">
                    {playerRole === 'A' ?
                        localize('component.messaging.alice.reveal') :
                        localize('component.messaging.bob.reveal')}
                    <span
                        className="font-bold text-highlight"> {partnerName}</span>
                </p>
                <div className="w-full h-fit mb-1 flex justify-center">
                    <Button onClick={goToResultsPage}>See Results</Button>
                </div>
            </div>}
        </GameProgression>
    );
};

export default Bb84Progression;