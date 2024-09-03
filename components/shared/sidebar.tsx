'use client';

import React from 'react';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import {Menu} from 'lucide-react';
import Image from 'next/image';
import {useLanguage} from '@/components/providers/language-provider';

const Sidebar = () => {

    const {localize} = useLanguage();

    return (
        <Sheet>
            <SheetTrigger className="inline-block md:hidden">
                <div
                    className="border border-secondary rounded-md mx-5 mt-7">
                    <Menu size={30}/>
                </div>
            </SheetTrigger>
            <SheetContent className="bg-primary" side={'left'}>
                <div className="flex flex-col gap-y-4 h-full">
                    <Image priority={true} src={'/institut-quantique.svg'}
                           alt={'Institut' +
                               ' Quantique Logo'}
                           width={250} height={79}/>
                    <p className="text-lg cursor-pointer
                hover:text-primary-foreground/90 transition-all">
                        {localize('component.header.about')}
                    </p>
                    <p className="text-lg cursor-pointer
                hover:text-primary-foreground/90 transition-all">
                        {localize('component.header.howToPlay')}
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Sidebar;