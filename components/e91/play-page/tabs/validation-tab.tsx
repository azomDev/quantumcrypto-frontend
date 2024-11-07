import { useLanguage } from '@/components/providers/language-provider';
import { useSocket } from '@/components/providers/socket-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import useE91GameStore from '@/store/e91/e91-game-store';
import { useE91ProgressStore } from '@/store/e91/e91-progress-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import usePlayerStore from '@/store/player-store';
import { E91GameStep, Line } from '@/types';
import { CheckCircle2, XCircle } from 'lucide-react';


export const moveToExchangeTab = () => {

    const playerRole = usePlayerStore.getState().playerRole;

    const pushLines = (lines: Line[]) => {
        useE91ProgressStore.getState().pushLines(lines);
    };

    if (playerRole === 'B') {
        const lines = [
            { 
                title: 'component.game.step3',
                content: 'component.messaging.bob.start' 
            }
        ];
        pushLines(lines);
    } else {
        pushLines([
            { 
                title: 'component.game.step3', 
                content: 'component.messaging.alice.last' 
            }
        ]);
    }

    useE91ProgressStore.getState().setE91Tab('messaging');
    useE91ProgressStore.getState().setStep(E91GameStep.MESSAGING);
};

const ValidationTab = ({playerRole}: { playerRole: string }) => {

    const {localize} = useLanguage();

    const {
        aliceValidBits,
        bobValidBits,
        validationIndices,
        validatedByPartner,
        validated,
    } = useE91RoomStore();
    const {setValidated, setAliceValidBits, setBobValidBits, setEveSpotted} = useE91RoomStore();

    const {
        pushLines,
    } = useE91ProgressStore();

    const keyBits = playerRole === 'A' ? aliceValidBits : bobValidBits;
    const partnerBits = playerRole === 'A' ? bobValidBits : aliceValidBits;

    const validationKeyBits = validationIndices.map(index => keyBits[index]);
    const validationPartnerBits = validationIndices.map(
        index => partnerBits[index]);
    const validationBitsLength = useE91GameStore(
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
            setValidated(true);
            setEveSpotted(true);
            return;
        }
        setValidated(true);
        const filteredAliceValidBits = aliceValidBits.filter((_, index) => !validationIndices.includes(index));
        const filteredBobValidBits = bobValidBits.filter((_, index) => !validationIndices.includes(index));
        setAliceValidBits(filteredAliceValidBits);
        setBobValidBits(filteredBobValidBits);
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