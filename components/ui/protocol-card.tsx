import React from 'react';
import Link from 'next/link';

const ProtocolCard = ({href, title, description, img}: {href: string, title: string, description?: string, img?:string}) => {
    return (
        <Link href={href}>
            <div className='hover:scale-105 cursor-pointer drop-shadow-2xl transition-all duration-150 w-[300px] h-[250px] rounded-md border-2 border-secondary'>
                {/*<div className='h-[70%] rounded-t-md w-full bg-neutral-600'></div>*/}
                <div className='w-full h-fit p-3 overflow-y-scroll'>
                    <h1 className='text-2xl font-bold'>{title}</h1>
                    <br/>
                    <p>{description}</p>
                </div>
            </div>
        </Link>
    );
};

export default ProtocolCard;