'use client';

import Header from '@/components/shared/header';
import BB84Main from '@/components/bb84/home-page/bb84-game-form';
import Footer from '@/components/shared/footer';
import {useRef} from 'react';
import HowToPlaySection from '@/components/bb84/home-page/how-to-play-section';
import {useLanguage} from '@/components/providers/language-provider';

export default function BB84() {

    const howToPlayRef = useRef(null);
    const aboutRef = useRef(null);
    const {localize} = useLanguage();

    const headerLinks = [
        {
            label: 'component.header.howToPlay',
            ref: howToPlayRef,
        },
        {
            label: 'component.header.about.bb84',
            ref: aboutRef,
        },
    ];

    return (
        <>
            <Header links={headerLinks}/>
            <BB84Main/>
            <HowToPlaySection ref={howToPlayRef}/>
            <section ref={aboutRef}
                     className="w-full h-fit mt-20 px-5 md:px-20">
                <h1 className="font-bold text-3xl md:text-5xl mb-4">{localize(
                    'component.bb84.aboutTitle')}</h1>
                <p className="text-lg">{localize('component.bb84.about')}</p>
            </section>
            <Footer/>
        </>
    );
}
