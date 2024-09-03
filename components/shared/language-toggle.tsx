'use client';

import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {Language, useLanguage} from '@/components/providers/language-provider';

const LanguageToggle = () => {

    const {language, setLanguage} = useLanguage();

    const initials = [
        'EN',
        'FR',
        'ES',
        'DE',
    ];

    const onSetLanguage = (language: Language) => {
        localStorage.setItem('language', JSON.stringify(language));
        setLanguage(language);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-3xl">
                    <p>{initials[language]}</p>
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='border-secondary' align="end">
                <DropdownMenuItem
                    onClick={() => onSetLanguage(Language.ENGLISH)}>
                    EN
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSetLanguage(Language.FRENCH)}>
                    FR
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onSetLanguage(Language.SPANISH)}>
                    ES
                </DropdownMenuItem>
                {/*<DropdownMenuItem onClick={() => setLanguage(Language.GERMAN)}>*/}
                {/*    DE*/}
                {/*</DropdownMenuItem>*/}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageToggle;