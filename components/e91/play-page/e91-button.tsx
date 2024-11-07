'use client';

import React from 'react';
import {useSocket} from '@/components/providers/socket-provider';
import Link from 'next/link';

const E91Button = () => {

    const {playRoomSocket} = useSocket();

    return (
        <Link href={'/e91'}>
            <h1 className="font-bold text-4xl text-primary"
                onClick={() => playRoomSocket.close()}>E91</h1>
        </Link>
    );
};

export default E91Button;