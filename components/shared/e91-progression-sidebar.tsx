'use client';

import {Button} from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import {MessageCircle} from 'lucide-react';
import GameProgression from '@/components/shared/game-progression';
import React, {useEffect, useState} from 'react';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import E91Progression from '@/components/e91/play-page/e91-progression';

const E91ProgressionSidebar = () => {

    const [newMessage, setNewMessage] = useState(false);
    const displayedLinesLength = useBB84ProgressStore(
        state => state.displayedLines).length;

    useEffect(() => {
        setNewMessage(true);
    }, [displayedLinesLength]);

    return (
        <div
            className="inline-flex relative md:hidden md:absolute md:top-0 md:z-0 group transition-all">
            {newMessage && <div
                className="absolute top-0 right-0 -mt-1 -mr-1 rounded-full w-2.5 h-2.5 bg-red">
                <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75"></span>
            </div>}
            <Sheet onOpenChange={() => setNewMessage(false)}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <MessageCircle/>
                    </Button>
                </SheetTrigger>
                <SheetContent className="p-2 border-none">
                    <E91Progression />
                </SheetContent>
            </Sheet>
        </div>

    );
};

export default E91ProgressionSidebar;
