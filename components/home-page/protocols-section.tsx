'use client';

import React from 'react';
import ProtocolCard from '@/components/ui/protocol-card';
import {useLanguage} from '@/components/providers/language-provider';
import {protocols} from '@/components/shared/protocol-data';

const ProtocolsSection = () => {

    const {localize} = useLanguage();

    return (
        <div
            className="flex w-fit justify-center mx-auto gap-x-5 gap-y-5 flex-wrap p-10 mt-3">
            {protocols.map(({name, description, href}, index) => (
                <ProtocolCard key={index} href={href} title={name}
                              description={localize(description)}/>
            ))}
        </div>
    );
};

export default ProtocolsSection;