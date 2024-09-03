'use client';

import React, {forwardRef, ReactNode} from 'react';
import {Blocks, PackageOpen, Smile, UsersRound} from 'lucide-react';
import {useLanguage} from '@/components/providers/language-provider';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

const FeatureCard = ({icon, title, description}: FeatureCardProps) => {
    return (
        <div
            className="w-[300px] border border-secondary  items-center p-5 rounded-md drop-shadow-2xl flex flex-col gap-y-2">
            <div>
                {React.cloneElement(icon as React.ReactElement<any>,
                    {className: 'mb-2', size: 70})}
            </div>
            <div>
                <p className="font-bold text-2xl mb-3 text-primary">{title}</p>
                <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
            </div>
        </div>
    );
};

const AboutSection = forwardRef<HTMLElement>((_, ref) => {

    const {localize} = useLanguage();

    return (
        <section ref={ref}
                 className="w-full h-full mt-5 px-5 md:px-20"
                 id={'aboutSection'}>
            <h1 className="font-bold text-3xl md:text-5xl mb-3">{localize(
                'component.header.about')}</h1>
            <p className="text-lg">{localize(
                'component.homePage.aboutSection')}</p>
            <div
                className="flex flex-wrap mt-10 gap-5 justify-center mx-auto w-fit">
                <FeatureCard icon={<Smile/>} title={localize(
                    'component.homePage.userFriendlyTitle') ?? ''}
                             description={localize(
                                 'component.homePage.userFriendly') ?? ''}/>
                <FeatureCard icon={<UsersRound/>}
                             title={localize(
                                 'component.homePage.multiplayerTitle') ?? ''}
                             description={localize(
                                 'component.homePage.multiplayer') ?? ''}/>
                <FeatureCard icon={<Blocks/>} title={localize(
                    'component.homePage.extensibleTitle') ?? ''}
                             description={localize(
                                 'component.homePage.extensible') ?? ''}/>
                <FeatureCard icon={<PackageOpen/>} title={'Open-source'}
                             description={localize(
                                 'component.homePage.openSource') ?? ''}/>
            </div>
        </section>
    );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;