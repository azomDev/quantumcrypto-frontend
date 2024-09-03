'use client';

import {useSocket} from '@/components/providers/socket-provider';

import React from 'react';
import {Badge} from '@/components/ui/badge';

const SocketIndicator = () => {

    const {isPlayRoomConnected} = useSocket();

    if (!isPlayRoomConnected) {
        return (
            <Badge variant="outline"
                   className="bg-yellow-600 text-white border-none">Not
                connected...</Badge>
        );
    }

    return (
        <Badge variant="outline"
               className="bg-emerald-600 text-white border-none">Connected!</Badge>
    );

};

export default SocketIndicator;