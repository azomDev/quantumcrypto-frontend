import GameRestartDialog from '@/components/bb84/play-page/game-restart-dialog';
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
import { useE91ProgressStore } from '@/store/e91/e91-progress-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import usePlayerStore from '@/store/player-store';
import { E91GameStep, Line } from '@/types';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDrag, DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import clsx from 'clsx';
import GraphPopup from '../graphPopup';


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

const DraggableButton = ({ index, value, setIsDragging}: { index: number, value: any, setIsDragging: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'BUTTON',
        item: { index, value },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    useEffect(() => {
        setIsDragging(isDragging);  
    }, [isDragging, setIsDragging]);

    return (
        <Button
            ref={drag}
            variant="outline"
            className={`w-10 h-10 mx-1 bg-gray-600 rounded-full text-lg text-center cursor-move ${isDragging ? "opacity-50" : ""}`}
            size="icon"
        >
            {value}
        </Button>
    );
};

const DropZone = ({ onDrop, backgroundColor, label }: { onDrop: (index: number, value: number) => void, backgroundColor: string, label: string }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'BUTTON',
        drop: (item: { index: number, value: string }) => onDrop(item.index, item.value === '+1' ? 1 : -1),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={drop}
            style={{
                backgroundColor: isOver ? 'lightgray' : backgroundColor,
                border: "1px solid var(--border-color)", 
            }}
            className="flex items-center justify-center h-full w-full text-white font-bold"
        >
            {label}
        </div>

    );
};


const CHSHTab = ({playerRole, polarIcons}: { playerRole: string, polarIcons: any[]}) => {
    const [sValues, setSValues] = useState<number[]>([]);
    const [restartModalOpen, setRestartModalOpen] = useState(false);
    const [sValueStarted, setSvalueStarted] = useState(false);

    const [espAB, setEspAB] = useState<number[]>([]);  
    const [espApB, setEspApB] = useState<number[]>([]); 
    const [espApBp, setEspApBp] = useState<number[]>([]); 
    const [espABp, setEspABp] = useState<number[]>([]); 

    const [isDragging, setIsDragging] = useState(false);

    const [isPopupVisible, setPopupVisible] = useState(false);

    const onShowGraph = () => {
      setPopupVisible(true);
    };
  
    const closePopup = () => {
      setPopupVisible(false);
    };

    const calculateAverage = (arr: number[]) => {
        if (arr.length === 0) return 0;
        const sum = arr.reduce((acc, value) => acc + value, 0);
        return sum / arr.length; 
    };
    const sValue = calculateAverage(espAB) + calculateAverage(espApB) + calculateAverage(espApBp) - calculateAverage(espABp);

    const [buttonState, setButtonState] = useState<{ [key: number]: { color: string, value: string } }>({});


    const {localize} = useLanguage();

    const {shareDecision} = useSocket();

    const {
        aliceInvalidBits,
        bobInvalidBits,
        aliceInvalidBases,
        bobInvalidBases,
        securedDecision,
        evePresent,
    } = useE91RoomStore();


    const {
        setAliceInvalidBits,
        setBobInvalidBits,
        setAliceInvalidBases,
        setBobInvalidBases,
        resetRoom,
        setGameSuccess,
    } = useE91RoomStore();

    const {
        pushLines,
        resetProgress,
    } = useE91ProgressStore();

    useEffect(() => {
        if (sValueStarted) {
            const sValue = calculateAverage(espAB) 
                        + calculateAverage(espApB) 
                        + calculateAverage(espApBp) 
                        - calculateAverage(espABp);
        
            setSValues((prevSValues) => [...prevSValues, sValue]);
        }
      }, [espAB, espApB, espApBp, espABp]);

    useEffect(() => {
        if (securedDecision !== null) {
            let partnerName = playerRole === 'B' ? 'Alice': 'Bob';
            if (securedDecision) {
                toast(localize('component.e91.decsion.secured') + `${partnerName}`);
                moveToExchangeTab();
            } else {
                toast(localize('component.e91.decsion.unsecured') + `${partnerName}`);
                if (evePresent) {
                    setRestartModalOpen(true);
                } else {
                    pushLines([
                        {
                            title: 'component.e91.gameLoss.title',
                            content: 'component.e91.gameLoss'
                        }
                    ]);
                    setGameSuccess(true);
                }
            }
             
        }
    }, [securedDecision]);

    const calculateSValue = (aliceBase: string, bobBase: string, aliceBit: string, bobBit: string) => {
        let result = 0;
        if (aliceBit === bobBit) {
            result = 1;
        } else {
            result = -1;
        }
        if (aliceBase === '1' && bobBase === '2') {
            setEspAB(prevValue => [...prevValue, result]);
        } else if (aliceBase === '3' && bobBase === '2') {
            setEspApB(prevValue => [...prevValue, result]);
        } else if (aliceBase === '3' && bobBase === '4') {
            setEspApBp(prevValue => [...prevValue, result]);
        } else {
            setEspABp(prevValue => [...prevValue, result]);
        }    
    }

    const onSecure = () => {
        shareDecision(true);
        moveToExchangeTab();
    };

    const onUnsecure = () => {
        shareDecision(false);
        if (evePresent) {
            setRestartModalOpen(true);
        } else {
            pushLines([
                {
                    title: 'component.e91.gameLoss.title',
                    content: 'component.e91.gameLoss'
                }
            ]);
            setGameSuccess(true);
        }

    };

    const restartGame = () => {
        resetRoom();
        resetProgress();
        setRestartModalOpen(false);
    };

    const handleDrop = (zone: string, index: number, value: number) => {
        let correctValue = aliceInvalidBits[index] === bobInvalidBits[index] ? 1 : -1
        setIsDragging(false);  
        setSvalueStarted(true);
        switch (zone) {
            case 'AB':
                if ((aliceInvalidBases[index] === '1' && bobInvalidBases[index] === '2') && (value === correctValue)) {
                    setEspAB((prev) => [...prev, value]);
                    setButtonState((prev) => ({
                        ...prev,
                        [index]: { color: 'blue', value: value === 1 ? '+1' : '-1' },
                    }));
                }
                break;
            case 'ApB':
                if ((aliceInvalidBases[index] === '3' && bobInvalidBases[index] === '2') && (value === correctValue)) {
                    setEspApB((prev) => [...prev, value]);
                    setButtonState((prev) => ({
                        ...prev,
                        [index]: { color: 'green', value: value === 1 ? '+1' : '-1' },
                    }));
                }
                break;
            case 'ApBp':
                if ((aliceInvalidBases[index] === '3' && bobInvalidBases[index] === '4') && (value === correctValue)) {
                    setEspApBp((prev) => [...prev, value]);
                    setButtonState((prev) => ({
                        ...prev,
                        [index]: { color: 'yellow', value: value === 1 ? '+1' : '-1' },
                    }));
                }
                break;
            case 'ABp':
                if ((aliceInvalidBases[index] === '1' && bobInvalidBases[index] === '4') && (value === correctValue)) {
                    setEspABp((prev) => [...prev, value]);
                    setButtonState((prev) => ({
                        ...prev,
                        [index]: { color: 'rose', value: value === 1 ? '+1' : '-1' },
                    }));
                }
                break;
        }
    };
    

    return (
        <>
        <GameRestartDialog restartModalOpen={restartModalOpen}
                               title={localize(
                                   'component.e91.restart.unsecured')}
                               description={localize(
                                   'component.e91.restart.unsecured.description')}
                               onConfirm={restartGame}/>
        <div className="block border text-card-foreground border-secondary bg-card shadow-lg rounded-lg">
            <DndProvider backend={HTML5Backend}>
                <div style={{minHeight:"500px", maxHeight:"500px", overflow: isDragging ? "hidden" : "auto"}}>
                    <Table className="w-full">
                        <TableHeader className="bg-card top-0 sticky">
                            <TableRow className="text-sm md:text-md border-secondary">
                                <TableHead colSpan={2} className="text-center rounded-tl-lg">
                                    Alice
                                </TableHead>
                                <TableHead colSpan={2} className="text-center rounded-tr-lg">
                                    Bob
                                </TableHead>
                                <TableHead colSpan={2} className="text-center rounded-tr-lg">
                                </TableHead>
                            </TableRow>
                                <TableRow className="text-sm md:text-md border-secondary">
                                <TableHead className="text-center">Base</TableHead>
                                <TableHead className="text-center">Photon</TableHead>
                                <TableHead className="text-center">Base</TableHead>
                                <TableHead className="text-center">Photon</TableHead>
                                <TableHead className="text-center">Values</TableHead>
                            </TableRow>
                        </TableHeader>               
                        <TableBody>
                            {aliceInvalidBases.map((_, index) => (
                                <TableRow key={index} className={`text-center border-secondary`}>
                                    <TableCell>           
                                        <Button variant="outline"
                                            disabled={true}
                                            className="w-10 text-lg text-center mx-auto disabled:opacity-100 disabled:bg-background disabled:cursor-default"
                                            size="icon">
                                            {polarIcons[parseInt(aliceInvalidBases[index])]}                 
                                        </Button>                          
                                    </TableCell>
                                    <TableCell>
                                        <Input disabled value={aliceInvalidBits[index]} className="w-10 text-lg text-center mx-auto disabled:opacity-100 disabled:bg-background disabled:cursor-default"/>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline"
                                            disabled={true}
                                            className="w-10 text-lg text-center mx-auto disabled:opacity-100 disabled:bg-background disabled:cursor-default"
                                            size="icon">
                                            {polarIcons[parseInt(bobInvalidBases[index])]}                 
                                        </Button> 
                                    </TableCell>
                                    <TableCell>
                                        <Input disabled value={bobInvalidBits[index]} className="w-10 text-lg text-center mx-auto disabled:opacity-100 disabled:bg-background disabled:cursor-default"/>
                                    </TableCell>
                                    <TableCell className="flex gap-1 justify-center">
                                        {buttonState[index] ? (
                                            <Button
                                                variant="outline"
                                                className={clsx(`w-10 h-10 mx-1 rounded-full text-lg text-center`, `bg-${buttonState[index].color}-500`)}
                                                size="icon"
                                            >
                                                {buttonState[index].value}
                                            </Button>
                                        ) : (
                                            <>
                                                 <DraggableButton index={index} value="+1" setIsDragging={setIsDragging}/>
                                                 <DraggableButton index={index} value="-1" setIsDragging={setIsDragging}/>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>               
                    </Table>
                </div>
                <div className="flex justify-center p-4">                          
                    <Button onClick={onShowGraph} variant="secondary">Show Graph</Button>
                    <GraphPopup isVisible={isPopupVisible} onClose={closePopup} sValues={sValues} />
                </div>
                <div className="flex justify-end p-4">              
                    <Button onClick={onSecure} variant="default">Secure</Button>
                    <Button onClick={onUnsecure} variant="destructive">Not Secure</Button>
                </div>
                <div className="grid grid-cols-2 grid-rows-2 h-64 w-full border border-secondary rounded-lg overflow-hidden mt-4 gap-0">
                    <DropZone onDrop={(index, value) => handleDrop('AB', index, value)} backgroundColor="blue" label="A-B" />
                    <DropZone onDrop={(index, value) => handleDrop('ApB', index, value)} backgroundColor="green" label="A'-B" />
                    <DropZone onDrop={(index, value) => handleDrop('ABp', index, value)} backgroundColor="red" label="A-B'" />
                    <DropZone onDrop={(index, value) => handleDrop('ApBp', index, value)} backgroundColor="orange" label="A'-B'" />
                </div>
            </DndProvider>
            <div className="p-6 bg-background border-t border-secondary rounded-b-lg text-5xl font-bold text-center mt-2">
                S = 
                <span style={{ color: "blue" }}> E(a, b) [{calculateAverage(espAB)}] </span> + 
                <span style={{ color: "green" }}> E(a', b) [{calculateAverage(espApB)}] </span> -
                <span style={{ color: "red" }}> E(a, b') [{calculateAverage(espABp)}] </span> +              
                <span style={{ color: "orange" }}> E(a', b') [{calculateAverage(espApBp)}] </span>
                = {sValue}
            </div>
        </div>
        </>
    );
};

export default CHSHTab;


