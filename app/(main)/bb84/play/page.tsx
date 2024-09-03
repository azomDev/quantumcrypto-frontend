import React from 'react';
import Game from '@/components/bb84/play-page/game';
import ProgressionSidebar from '@/components/shared/progression-sidebar';
import Bb84Button from '@/components/bb84/play-page/bb84-button';

const PlayPage = () => {

    return (
        <div className="flex flex-col h-full max-h-full">
            <div className="flex w-full gap-x-3 px-6 pt-5">
                <Bb84Button />
                <ProgressionSidebar/>
            </div>
            <Game/>
        </div>
    );
};

export default PlayPage;