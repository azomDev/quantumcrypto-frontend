import React from 'react';
import Game from '@/components/e91/play-page/game';
import ProgressionSidebar from '@/components/shared/progression-sidebar';
import E91Button from '@/components/e91/play-page/e91-button';

const PlayPage = () => {

    return (
        <div className="flex flex-col h-full max-h-full">
            <div className="flex w-full gap-x-3 px-6 pt-5">
                <E91Button />
                <ProgressionSidebar/>
            </div>
            <Game/>
        </div>
    );
};

export default PlayPage;