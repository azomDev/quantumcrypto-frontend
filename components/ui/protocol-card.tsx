import React from 'react';
import Link from 'next/link';
import {useLanguage} from '@/components/providers/language-provider';

const ProtocolCard = ({href, title, description, img, stats}: {href: string, title: string, description?: string, img?:string, stats?: number}) => {
    const {localize} = useLanguage();
    return (
        <Link href={href}>
            <div className='hover:scale-105 cursor-pointer drop-shadow-2xl transition-all duration-150 w-[300px] h-[250px] rounded-md border-2 border-secondary flex flex-col justify-between p-3'>
                {/*<div className='h-[70%] rounded-t-md w-full bg-neutral-600'></div>*/}
                <div className='flex-grow'>
                    <h1 className='text-2xl font-bold'>{title}</h1>
                    <br/>
                    <p>{description}</p>
                </div>
                {stats !== undefined && (
                    <div className="mt-3 text-sm text-gray-500">
                        {localize('component.quantumCrypto.gamesPlayed')} {stats}
                    </div>
                )}               
            </div>
        </Link>
    );
};

export default ProtocolCard;