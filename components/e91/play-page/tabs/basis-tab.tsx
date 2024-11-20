'use client';

import GameRestartDialog from '@/components/bb84/play-page/game-restart-dialog';
import { useLanguage } from '@/components/providers/language-provider';
import { useSocket } from '@/components/providers/socket-provider';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import useE91GameStore from '@/store/e91/e91-game-store';
import { useE91ProgressStore } from '@/store/e91/e91-progress-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import { E91GameStep } from '@/types';
import { CheckCircle2, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Dices } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { moveToExchangeTab } from './validation-tab';

const BasisTab = ({playerRole, polarIcons}: { playerRole: string, polarIcons: any[]}) => {

    const [restartModalOpen, setRestartModalOpen] = useState(false);

    const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

    const {localize} = useLanguage();
    const {sharePreference, shareDiceValue, shareIndices} = useSocket();

    const {
        setStep,
        pushLines,
        resetProgress,
        setE91Tab,
    } = useE91ProgressStore();

    const {
        resetRoom, 
        setCompared, 
        setAlicePreference, 
        setBobPreference, 
        setAliceDiceRoll, 
        setBobDiceRoll, 
        setAliceBases, 
        setBobBases,
        setAliceBits,
        setBobBits,
        setAliceValidBits,
        setBobValidBits,
        setAliceInvalidBits,
        setBobInvalidBits,
        setAliceInvalidBases,
        setBobInvalidBases,
        setReroll,
        setEveReadCount,
    } = useE91RoomStore();
    const {
        validationIndices,
        aliceBases,
        bobBases,
        aliceBits,
        bobBits,
        keyBits,
        compared,
        utilizeValidBits,
        diceRollWinner,
        alicePreference,
        bobPreference,
        aliceDiceRoll,
        bobDiceRoll,
        reroll,
        evePresent,
        conflict
    } = useE91RoomStore();

    const { setValidationBitsLength } = useE91GameStore();

    const {gameHasEve} = useE91GameStore();
    const bits = playerRole === 'A' ? aliceBits : bobBits;
    const setPreference = playerRole === 'A' ? setAlicePreference : setBobPreference;
    const diceValue = playerRole === 'A' ? aliceDiceRoll : bobDiceRoll;
    const setDiceValue = playerRole === 'A' ? setAliceDiceRoll : setBobDiceRoll;
    const [preferenceSent, setPreferenceSent] = useState(false);
    const [invalidBitsRemoved, setInvalidBitsRemoved] = useState(false);
    const bothBasesSet = aliceBases.length > 0 && bobBases.length > 0;
    const choicesSubmitted = alicePreference !== null && bobPreference !== null;
    const [validationInput, setValidationInput] = useState(0);
    

    const [validatedBits, setValidatedBits] = useState(() => {
        return [...bits].map(value => ({
            value,
            error: false,
            discarded: false,
        }));
    });

    const validBits = validatedBits.filter(bit => !bit.error);

    useEffect(() => {
        if (validationIndices.length > 0) {
            pushLines([
                {
                    content: 'component.e91.validation.start'
                }
            ]);
            setStep(E91GameStep.VALIDATION);
            setE91Tab('validation');  
        }
    }, [validationIndices]);

    useEffect(() => {
        if (reroll) {
            pushLines([
                {
                    content: 'component.e91.reroll'
                }
            ]);
            setReroll(false);
        }
    }, [reroll]);


    useEffect(() => {
        if (diceRollWinner === null && utilizeValidBits !== null && !utilizeValidBits) {
            pushLines([
                {
                    content: 'component.e91.validation.invalid.start'
                }
            ]);
            setStep(E91GameStep.VALIDATION);
            setE91Tab('validation');  
        }
    }, [utilizeValidBits]);

    useEffect(() => {
        if (choicesSubmitted && (conflict || utilizeValidBits)) {
            pushLines([
                {
                    content: 'component.e91.dicePurpose'
                }
            ]);
        }
    }, [alicePreference, bobPreference]);

    useEffect(() => {
        if (diceRollWinner !== null){
            
            if (playerRole === 'A') {
                if (diceRollWinner === 'A') {
                    pushLines([
                        {
                            title: 'component.e91.diceWin',
                            content: 'component.e91.diceWinner.self'
                        }
                    ]);
                    if (utilizeValidBits) {
                        pushLines([
                            {
                                content: 'component.e91.choose.valid'
                            }
                        ]);
                    } else {
                        pushLines([
                            {
                                content: 'component.e91.validation.invalid.start'
                            }
                        ]);
                    }
                } else {
                    pushLines([
                        {
                            title: 'component.e91.diceLoss',
                            content: 'component.e91.diceLooser.self'
                        }
                    ]);
                    if (utilizeValidBits) {
                        pushLines([
                            {
                                content: 'component.e91.awating.bob.bitPreference'
                            }
                        ]);
                    } 
                }
            } else if (playerRole === 'B') {
                if (diceRollWinner === 'B') {
                    pushLines([
                        {
                            title: 'component.e91.diceWin',
                            content: 'component.e91.diceWinner.self'
                        }
                    ]);
                    if (utilizeValidBits) {
                        pushLines([
                            {
                                content: 'component.e91.choose.valid'
                            }
                        ]);
                    } 
                }else {
                    pushLines([
                        {
                            title: 'component.e91.diceLoss',
                            content: 'component.e91.diceLooser.self'
                        }
                    ]);
                    if (utilizeValidBits) {
                        pushLines([
                            {
                                content: 'component.e91.awating.alice.bitPreference'
                            }
                        ]);
                    } else {
                        pushLines([
                            {
                                content: 'component.e91.validation.invalid.start'
                            }
                        ]);
                    }
                }
            }                     
        }
    
    }, [diceRollWinner]);


    const restartGame = () => {
        resetRoom();
        resetProgress();
        setRestartModalOpen(false);
    };

    const onValidate = () => {
        const updatedBits = [...validatedBits].map((field, index) => ({
            ...field,
            error: aliceBases[index] !== bobBases[index] 
        }));
        setValidatedBits(updatedBits); 
        setCompared(true);

        const validBitIndices = updatedBits
            .map((field, index) => (!field.error ? index : null))
            .filter(index => index !== null); 

        const invalidBitIndices = updatedBits
            .map((field, index) => (field.error ? index : null))
            .filter(index => index !== null); 

        
        setAliceValidBits(validBitIndices.map(i => aliceBits[i]));
        setBobValidBits(validBitIndices.map(i => bobBits[i]));
        setAliceInvalidBits(invalidBitIndices.map(i => aliceBits[i]));
        setAliceInvalidBases(invalidBitIndices.map(i => aliceBases[i]));
        setBobInvalidBits(invalidBitIndices.map(i => bobBits[i]));
        setBobInvalidBases(invalidBitIndices.map(i => bobBases[i]));
        
        if (validBitIndices.length < 2) {
            pushLines([{content: 'component.e91.shortKey.restart'}]);
            setRestartModalOpen(true);
            return;
        }
        if (gameHasEve) {
            pushLines([
                {
                    title: 'component.e91.notice',
                    content: 'component.e91.validOrInvalid'
                }]);
        }
        if (evePresent) {
            let eveReadAmount = 0;
            aliceBases.forEach((base, index) => {
                if (base === '2' && bobBases[index] === '2') {
                    eveReadAmount += 1;
                }
            });
            setEveReadCount(eveReadAmount);
        }
    };

    const onMoveToMessaging = () => {
        moveToExchangeTab();
    }

    const onUtilizeValidBits = () => {
        setPreference(true);
        setPreferenceSent(true);
        sharePreference(true);
    };

    const onUtilizeDiscardedBits = () => {
        setPreference(false);
        setPreferenceSent(true);
        sharePreference(false);
    };

    const onRollDice = () => {
        if (diceValue === null) { 
            const randomValue = Math.floor(Math.random() * 6) + 1; 
            console.log(randomValue)
            setDiceValue(randomValue); 
            shareDiceValue(randomValue);

            toast(localize('component.e91.diceRolled') + `: ${randomValue}`);
        }
    };

    const removeIncompatibleBases = () => {
        setInvalidBitsRemoved(true);
        const validIndices = [];
        for (let i = 0; i < aliceBases.length; i++) {
            if ((aliceBases[i] === '2' && bobBases[i] !== '2') || 
                (bobBases[i] === '3' && aliceBases[i] !== '3')) {
                continue; 
            }
            validIndices.push(i);
        }
        const filteredAliceBits = validIndices.map( i => aliceBits[i]);
        const filteredBobBits = validIndices.map( i => bobBits[i]);
        const filteredAliceBases = validIndices.map(i => aliceBases[i]);
        const filteredBobBases = validIndices.map(i => bobBases[i]);
        setAliceBits(filteredAliceBits);
        setBobBits(filteredBobBits);
        setAliceBases(filteredAliceBases);
        setBobBases(filteredBobBases);
        const updatedValidatedBits = validIndices.map(i => validatedBits[i]);
        setValidatedBits(updatedValidatedBits);
        pushLines([{content: 'component.e91.validate'}]);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 

        if (validationInput < 1 || validationInput > validBits.length - 1) {
            toast.error(localize('component.e91.invalidInputRange') + ` (1-${validBits.length - 1})`);
            return;  
        }
        const randomIndices = generateRandomIndices(validationInput, validBits.length);
        shareIndices(randomIndices);
    };

    const generateRandomIndices = (length: number, max: number): number[] => {
        const indices = new Set<number>();
    
        while (indices.size < length) {
            const randomIndex = Math.floor(Math.random() * max);
            indices.add(randomIndex);
        }
    
        return Array.from(indices);
    };
    

    return (
        <>
            <GameRestartDialog restartModalOpen={restartModalOpen}
                               title={localize(
                                   'component.basisTab.alertTitle')}
                               description={localize(
                                   'component.basisTab.alertDescription')}
                               onConfirm={restartGame}/>
            <div className="block border
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
                <Table className="w-full">
                    <TableHeader className="bg-card top-0 sticky">
                        <TableRow
                            className="text-sm md:text-lg border-secondary">
                            <TableHead className="text-center rounded-tl-lg">
                                <p className="text-wrap">{playerRole == 'A' ?
                                    localize('component.basis.yourBases') :
                                    localize('component.basis.aliceBases')}</p>
                            </TableHead>
                            <TableHead className="text-center">
                                <p className="text-wrap">{playerRole == 'B' ?
                                    localize('component.basis.yourBases') :
                                    localize('component.basis.bobBases')}</p>
                            </TableHead>
                            <TableHead className="text-center rounded-tr-lg">
                                <p>Bits</p>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {aliceBases.map((_, i) => (
                            <TableRow key={i}
                                      className="text-center border-secondary">
                                <TableCell>
                                    <Button variant="outline"
                                        disabled={true}
                                        className={cn('disabled:opacity-100')}
                                        size="icon">
                                        {polarIcons[parseInt(aliceBases[i])]}                 
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline"
                                        disabled={true}
                                        className={cn('disabled:opacity-100')}
                                        size="icon">        
                                        {polarIcons[parseInt(bobBases[i])]}                   
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <div
                                         className={cn(
                                             'select-none bg-background' +
                                             ' rounded-md h-10 border' +
                                             ' border-secondary cursor-pointer' +
                                             ' w-10 text-lg text-center' +
                                             ' m-auto align-center pt-1.5 ',
                                             validatedBits[i].error ?
                                                 'border-red' : '')}>
                                        <p>{validatedBits[i].value}</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {!compared && invalidBitsRemoved && (
                    <div
                        className="md:block fixed right-6 bottom-6 shadow-xl">
                        <Button size="lg"
                                disabled={keyBits.length > 0}
                                onClick={onValidate}
                                className="text-lg font-bold">
                            {localize('component.e91.compareBases')}
                        </Button>
                    </div>
                )}
                {compared && !gameHasEve && (
                    <div
                        className="md:block fixed right-6 bottom-6 shadow-xl">
                        <Button size="lg"
                                onClick={onMoveToMessaging}
                                className="text-lg font-bold">
                            {localize('component.e91.moveToMessaging')}
                        </Button>
                    </div>

                )}
                {compared && !choicesSubmitted && gameHasEve && (
                    <div className="md:block fixed right-6 bottom-6 shadow-xl">
                        <Button size="lg" onClick={onUtilizeValidBits} className="text-lg font-bold" disabled={preferenceSent}>
                            {localize('component.e91.useValidBits')}
                        </Button>
                        <Button size="lg" onClick={onUtilizeDiscardedBits} className="text-lg font-bold bg-rose-500 hover:bg-rose-600" disabled={preferenceSent}>
                            {localize('component.e91.useDiscardedBits')}
                        </Button>
                    </div>
                )}
                {choicesSubmitted && (
                    <div className="md:block fixed right-6 bottom-6 shadow-xl">
                        <Button size="lg" onClick={onRollDice} className="text-lg font-bold bg-blue-500 hover:bg-blue-600">
                            {diceValue !== null ? (
                                React.createElement(diceIcons[diceValue - 1], { className: "mr-2" })
                            ) : (
                                <Dices className="mr-2" /> 
                            )}
                            {diceValue !== null ? diceValue : localize('component.e91.diceRoll')}
                        </Button>
                    </div>
                )}
                {diceRollWinner === playerRole && utilizeValidBits && gameHasEve && (
                    <div className="md:block fixed right-6 bottom-6 shadow-xl p-4 bg-gray-500 rounded-md">
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={validationInput} 
                                    onChange={(e) => setValidationInput(e.target.valueAsNumber)}
                                    min={1}
                                    max={validBits.length - 1}
                                    className="border border-gray-300 p-2 rounded mr-2 w-20 text-center"
                                />
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    {localize('component.e91.submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                {bothBasesSet && !invalidBitsRemoved && (
                    <div className="md:block fixed right-6 bottom-6 shadow-xl">
                        <Button size="lg" className="text-lg font-bold"
                                onClick={removeIncompatibleBases}>
                            {localize('component.e91.removeIncompatibleBases')}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default BasisTab;
