'use client';

import React, {useEffect, useState} from 'react';
import ProtocolCard from '@/components/ui/protocol-card';
import {useLanguage} from '@/components/providers/language-provider';
import {protocols} from '@/components/shared/protocol-data';
import axios from 'axios';

const ProtocolsSection = () => {

    const {localize} = useLanguage();
    const [protocolStats, setProtocolStats] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get_protocol_stats/`);
                const stats = response.data.protocols.reduce((acc: Record<string, number>, stat: {protocol_type: string, total_games: number}) => {
                    acc[stat.protocol_type] = stat.total_games;
                    return acc;
                }, {});
                setProtocolStats(stats);
            } catch (error) {
                console.error("Error fetching protocol stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div
            className="flex w-fit justify-center mx-auto gap-x-5 gap-y-5 flex-wrap p-10 mt-3">
            {protocols.map(({name, description, href}, index) => (
                <ProtocolCard 
                    key={index} 
                    href={href} 
                    title={name}
                    description={localize(description)}
                    stats={protocolStats[name.toLowerCase()] || 0}
                />
            ))}
        </div>
    );
};

export default ProtocolsSection;