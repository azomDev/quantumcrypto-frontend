'use client';
import {bb84Lines} from '@/lang/bb84-lines';
import React, {
    createContext,
    useContext,
    useState,
} from 'react';

export enum Language {
    ENGLISH,
    FRENCH,
    SPANISH,
    GERMAN,
}

type LanguageContextType = {
    language: Language;
    setLanguage: React.Dispatch<React.SetStateAction<Language>>;
    localize: (str: string, extra?: string) => string | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({children}: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState(Language.FRENCH);
    const localize = (str: string, extra?: string) => {
        const languageItem = bb84Lines[language];
        let result = languageItem ? (languageItem[str] ?? "") : "";
        if (extra) {
            result = result + " " + extra;
        }
        return result;
    };
    const contextValue: LanguageContextType = {
        language,
        setLanguage,
        localize,
    };
    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};