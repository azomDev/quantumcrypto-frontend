'use client';

import React from 'react';
import {useSocket} from '@/components/providers/socket-provider';
import Link from 'next/link';

const Bb84Button = () => {

    const {playRoomSocket} = useSocket();

    return (
        <Link href={'/bb84'}>
            <h1 className="font-bold text-4xl text-primary"
                onClick={() => playRoomSocket.close()}>BB84</h1>
        </Link>
    );
};

export default Bb84Button;