import React from 'react';
import Header from '@/components/shared/header';

const GameResultsLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <div className="h-full">
            <Header/>
            <main>
                {children}
            </main>
        </div>
    );
};

export default GameResultsLayout;