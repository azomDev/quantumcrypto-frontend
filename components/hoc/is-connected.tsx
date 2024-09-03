'use client';
import React, {useEffect} from 'react';
import {useSocket} from '@/components/providers/socket-provider';
import {redirect} from 'next/navigation';

const isConnected = (Component: any) => {

    return function IsAuth(props: any) {
        const {isWaitingRoomConnected, isPlayRoomConnected} = useSocket();
        const connected = isWaitingRoomConnected || isPlayRoomConnected;

        useEffect(() => {
            if (!connected) {
                return redirect('/');
            }
        }, [connected]);

        if (!connected) {
            return null;
        }

        return <Component {...props} />;
    };
};

export default isConnected;