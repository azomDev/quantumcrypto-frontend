import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import React from 'react';
import {inputField} from '@/types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const onBasisInputChange = (event: React.ChangeEvent<HTMLInputElement>,
                                   index: number, basisInputs: inputField[],
                                   setBasisInputs: React.Dispatch<React.SetStateAction<inputField[]>>,
                                   validatePolar?: (prevStates: {
                                                        polarList?: inputField[],
                                                        basisInputs?: inputField[],
                                                        bitsInputs?: inputField[],
                                                    }, list: boolean,
                                                    index?: number) => void) => {
    const inputValue = event.target.value.toLowerCase();
    const updatedBases = [...basisInputs];
    const updatedBasis = {...updatedBases[index]};
    updatedBasis.touched = true;
    if (inputValue.length === 0 || /^[+x]$/.test(inputValue) &&
        inputValue.length <= 1) {
        updatedBasis.value = inputValue;
    }
    updatedBasis.error = updatedBasis.value === '';
    updatedBases[index] = updatedBasis;
    setBasisInputs(updatedBases);
    if (validatePolar) {
        validatePolar({
            basisInputs: updatedBases,
        }, false, index);
    }
};

export const forbiddenSymbols = ['e', 'E', '+', '-', '.'];

export const clearBB84LocalStorage = () => {
    localStorage.removeItem('bb84PlayerData');
    localStorage.removeItem('bb84PhotonNumber')
    localStorage.removeItem('bb84Step');
    localStorage.removeItem('bb84Tab');
    localStorage.removeItem('bb84GameData');
    localStorage.removeItem('bb84DisplayedLines');
    localStorage.removeItem('bb84ValidationBitsLength')
}