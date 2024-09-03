'use client';

import Header from '@/components/shared/header';
import ProtocolsSection from '@/components/home-page/protocols-section';
import React, {useRef} from 'react';
import AboutSection from '@/components/home-page/about-section';
import Title from '@/components/home-page/title';
import Footer from '@/components/shared/footer';

export default function Home() {

    const aboutSectionRef = useRef(null);

    const headerLinks = [
        {
            label: 'component.header.about',
            ref: aboutSectionRef,
        },
    ];

    return (
        <div>
            <Header links={headerLinks}/>
            <div className="w-full h-full flex flex-col gap-y-4">
                <Title/>
                <ProtocolsSection/>
                <AboutSection ref={aboutSectionRef}/>
            </div>
            <Footer/>
        </div>
    );
}
