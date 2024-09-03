'use client';

import React from 'react';
import {useLanguage} from '@/components/providers/language-provider';

const Title = () => {

    const {localize} = useLanguage();

    return (
        <div
            className="h-fit w-fit flex flex-col gap-y-3 mt-20 mx-auto text-center">
            <h1 className="font-bold text-4xl md:text-6xl">QuantumCrypto</h1>
            <p className="text-md md:text-2xl">{localize('component.homePage.title.description')}</p>
        </div>
    );
};

export default Title;