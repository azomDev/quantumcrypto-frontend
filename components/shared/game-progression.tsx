'use client';

import React, {ReactNode} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {useLanguage} from '@/components/providers/language-provider';
import usePlayerStore from '@/store/player-store';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import {cn} from '@/lib/utils';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';

const GameProgression = ({className, children}: { children: ReactNode, className?: string }) => {

    const {localize} = useLanguage();

    return (
        <Card className={cn('border-secondary h-full w-full p-3 shadow-lg' +
            ' overflow-y-scroll',
            className)}>
            <CardContent className="p-0 flex-col">
                <p className="font-bold text-2xl md:text-3xl
                        text-foreground mb-2">{localize(
                    'component.game.gameProgressionTitle')}</p>
                <Separator className="mb-1"/>
                {children}
            </CardContent>
        </Card>
    );
};

export default GameProgression;