'use client';
import React, {MutableRefObject, useEffect} from 'react';
import {useLanguage} from '@/components/providers/language-provider';
import Image from 'next/image';
import ProtocolNavigationMenu
    from '@/components/shared/protocol-navigation-menu';
import {useRouter} from 'next/navigation';
import Sidebar from '@/components/shared/sidebar';
import Link from 'next/link';

export interface HeaderLink {
    label: string,
    href?: string,
    ref?: MutableRefObject<any>,
}

const Header = ({links}: { links?: HeaderLink[] }) => {

    const {localize, setLanguage} = useLanguage();
    const router = useRouter();

    useEffect(() => {
        const language = localStorage.getItem('language');
        if (language) {
            // @ts-ignore
            setLanguage(JSON.parse(language));
        }
    }, [])

    const onLinkClick = (link: HeaderLink) => {
        if (link.ref) {
            link.ref.current.scrollIntoView({behavior: 'smooth'});
        } else if (link.href) {
            router.push(link.href);
        }
    };

    return (
        <>
            <div
                className="hidden md:block h-fit bg-primary px-6 py-1
            text-primary-foreground">
                <div className="flex gap-x-11 items-center">
                    <Link href={'/'}>
                        <Image className="my-2" priority={true}
                               src={'/institut-quantique.svg'}
                               alt={'Institut' +
                                   ' Quantique Logo'}
                               width={250} height={79}/>
                    </Link>
                    {links?.map((link, index) => (
                        <p key={index}
                           onClick={() => onLinkClick(link)}
                           className="text-md cursor-pointer
                           hover:text-primary-foreground/90 transition-all">
                            {localize(link.label)}
                        </p>
                    ))}
                    <ProtocolNavigationMenu/>
                </div>
            </div>
            <Sidebar/>
        </>
    );
};

export default Header;