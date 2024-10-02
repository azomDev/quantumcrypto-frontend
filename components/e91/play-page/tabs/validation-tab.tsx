import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import {Input} from '@/components/ui/input';
import React from 'react';
import {Button} from '@/components/ui/button';
import {CheckCircle2, XCircle} from 'lucide-react';
import {useLanguage} from '@/components/providers/language-provider';
import usePlayerStore from '@/store/player-store';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import {BB84GameStep, Line} from '@/types';
import {useSocket} from '@/components/providers/socket-provider';
import useBB84GameStore from '@/store/bb84/bb84-game-store';

export const moveToExchangeTab = () => {

    const playerRole = usePlayerStore.getState().playerRole;
    const aliceCipherLength = useBB84RoomStore.getState().aliceCipher.length;

    const pushLines = (lines: Line[]) => {
        useBB84ProgressStore.getState().pushLines(lines);
    };

    if (playerRole === 'B') {
        const lines = [
            { content: 'component.messaging.bob.start' },
        ];
        if (aliceCipherLength > 0) {
            lines.push(
                { content: 'component.messaging.bob.arrived' },
                { content: 'component.messaging.bob.decrypt' }
            );
        }
        pushLines(lines);
    } else {
        pushLines([
            { content: 'component.messaging.alice.start' },
            { title: 'component.game.step3', content: 'component.messaging.alice.last' }
        ]);
    }

    useBB84ProgressStore.getState().setBb84Tab('messaging');
    useBB84ProgressStore.getState().setStep(BB84GameStep.MESSAGING);
};

const ValidationTab = ({playerRole}: { playerRole: string }) => {

    const {shareValidation} = useSocket();
    const {localize} = useLanguage();

    const {
        keyBits,
        partnerBits,
        validationIndices,
        validatedByPartner,
        validated,
    } = useBB84RoomStore();
    const {setValidated} = useBB84RoomStore();

    const {pushLines} = useBB84ProgressStore();

    const validationKeyBits = validationIndices.map(index => keyBits[index]);
    const validationPartnerBits = validationIndices.map(
        index => partnerBits[index]);
    const validationBitsLength = useBB84GameStore(
        state => state.validationBitsLength);

    const validate = () => {
        for (let i = 0; i < validationKeyBits.length; i++) {
            if (validationKeyBits[i] !==
                validationPartnerBits[i]) return false;
        }
        return true;
    };

    const handleValidationAction = (validClicked: boolean) => {
        const isValid = validate();
        if (validClicked) {
            if (!isValid) {
                pushLines([{ content: 'component.validationTab.areYouSure' }]);
                return;
            }
            pushLines([{ content: 'component.validationTab.validated' }]);
            moveToExchangeTab();
        } else {
            if (isValid) {
                pushLines([{ content: 'component.validationTab.areYouSure' }]);
                return;
            }
            pushLines([{ content: 'component.validationTab.found' }]);
        }
        shareValidation(isValid);
        setValidated(true);
    };

    return (
        <div className="block border
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
            <Table className="w-full">
                <TableHeader className="bg-card top-0 sticky">
                    <TableRow className="text-sm md:text-md border-secondary">
                        <TableHead className="text-center rounded-tl-lg">
                            <p>{localize(
                                'component.validationTab.yourKey')}</p>
                        </TableHead>
                        <TableHead className="text-center rounded-tr-lg">
                            <p>{playerRole === 'A' ?
                                localize('component.validationTab.bobsKey') :
                                localize(
                                    'component.validationTab.alicesKey')}</p>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from(Array(validationBitsLength)).map((_, i) => (
                        <TableRow key={i}
                                  className="text-center border-secondary">
                            <TableCell>
                                <Input disabled
                                       value={validationKeyBits[i] ?? ''}
                                       className={'w-10 text-lg text-center' +
                                           ' mx-auto disabled:opacity-100' +
                                           ' disabled:bg-background' +
                                           ' disabled:cursor-default mx-auto'}/>
                            </TableCell>
                            <TableCell>
                                <Input disabled
                                       value={validationPartnerBits[i] ?? ''}
                                       className={'w-10 text-lg text-center' +
                                           ' mx-auto disabled:opacity-100' +
                                           ' disabled:bg-background' +
                                           ' disabled:cursor-default mx-auto'}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {!(partnerBits.length === 0 ||
                validationIndices.length === 0 ||
                validated || validatedByPartner) && <div
                className="fixed flex gap-x-1 bottom-3 right-3 md:hidden">
                <Button size={'icon'} variant={'destructive'}
                        hidden={partnerBits.length === 0 ||
                            validationIndices.length === 0 ||
                            validated || validatedByPartner}
                        onClick={() => handleValidationAction(false)}>
                    <XCircle/>
                </Button>
                <Button size={'icon'}
                        onClick={() => handleValidationAction(true)}
                        hidden={partnerBits.length === 0 ||
                            validationIndices.length === 0 ||
                            validated || validatedByPartner}>
                    <CheckCircle2/>
                </Button>
            </div>}
            {!(partnerBits.length === 0 ||
                validationIndices.length === 0 ||
                validated || validatedByPartner) && <div className="hidden md:block fixed right-6 bottom-6 shadow-xl">
                <Button size="lg"
                        onClick={() => handleValidationAction(false)}
                        hidden={partnerBits.length === 0 ||
                            validationIndices.length === 0 ||
                            validated || validatedByPartner}
                        variant={'destructive'}
                        className="text-lg font-bold mr-2">
                    <p>{localize('component.validationTab.invalid')}</p>
                </Button>
                <Button size="lg"
                        onClick={() => handleValidationAction(true)}
                        className="text-lg font-bold">
                    <p>{localize('component.validationTab.valid')}</p>
                </Button>
            </div>}
        </div>
    );
};

export default ValidationTab;