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

const CHSHTab = ({playerRole, polarIcons}: { playerRole: string, polarIcons: any[]}) => {
    const [sValues, setSValues] = useState<number[]>([]);
    const [flashing, setFlashing] = useState(false);
    const [restartModalOpen, setRestartModalOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const [espAB, setEspAB] = useState<number[]>([]);  
    const [espApB, setEspApB] = useState<number[]>([]); 
    const [espApBp, setEspApBp] = useState<number[]>([]); 
    const [espABp, setEspABp] = useState<number[]>([]); 

    const calculateAverage = (arr: number[]) => {
        if (arr.length === 0) return 0;
        const sum = arr.reduce((acc, value) => acc + value, 0);
        return sum / arr.length; 
    };
    const sValue = calculateAverage(espAB) + calculateAverage(espApB) + calculateAverage(espApBp) - calculateAverage(espABp);

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

    const handleNext = () => {
        setIsDisabled(true);
        if (aliceInvalidBases.length !== 0) {
            setFlashing(true);
            setTimeout(() => {
                setFlashing(false);
                calculateSValue(aliceInvalidBases[0], bobInvalidBases[0], aliceInvalidBits[0], bobInvalidBits[0]); 
                setSValues(prevSValues => [...prevSValues, Math.abs(sValue)]);
                setAliceInvalidBits(aliceInvalidBits.slice(1)); 
                setAliceInvalidBases(aliceInvalidBases.slice(1));
                setBobInvalidBits(bobInvalidBits.slice(1)); 
                setBobInvalidBases(bobInvalidBases.slice(1));
                setIsDisabled(false);
            }, 250); 
        }       
    };

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

    useEffect(() => {
        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };

        const svg = d3.select("#sGraph")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const graph = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        const xScale = d3.scaleLinear().domain([0, 50]).range([0, width]);
        const yScale = d3.scaleLinear().domain([0, 4]).range([height, 0]);

        graph.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale).ticks(10))
            .append("text")
            .attr("fill", "white")
            .attr("x", width / 2)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .text("Photon Count"); 

        graph.append("g")
            .call(d3.axisLeft(yScale).ticks(8)) 
            .append("text")
            .attr("fill", "white")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .text("S Value"); 

        graph.selectAll(".dot")
            .data(sValues)
            .join("circle")
            .attr("class", "dot")
            .attr("cx", (d, i) => xScale(i + 1))
            .attr("cy", d => yScale(d))
            .attr("r", 3)
            .attr("fill", "white");

        svg.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yScale(2 * Math.sqrt(2)))
            .attr("y2", yScale(2 * Math.sqrt(2)))
            .style("stroke", "red")
            .style("stroke-dasharray", "4");

        graph.append("text")
            .attr("x", width - 50)
            .attr("y", yScale(2 * Math.sqrt(2)) - 5)
            .attr("fill", "red")
            .attr("font-size", "14px")
            .attr("text-anchor", "end")
            .text("2√2 Threshold");
    }, [sValues]);

    return (
        <>
        <GameRestartDialog restartModalOpen={restartModalOpen}
                               title={localize(
                                   'component.e91.restart.unsecured')}
                               description={localize(
                                   'component.e91.restart.unsecured.description')}
                               onConfirm={restartGame}/>
        <div className="block border text-card-foreground border-secondary bg-card shadow-lg rounded-lg">
            <div style={{minHeight:"350px", maxHeight:"350px", overflow:"auto"}}>
                <Table className="w-full">
                    <TableHeader className="bg-card top-0 sticky">
                        <TableRow className="text-sm md:text-md border-secondary">
                            <TableHead colSpan={2} className="text-center rounded-tl-lg">
                                Alice
                            </TableHead>
                            <TableHead colSpan={2} className="text-center rounded-tr-lg">
                                Bob
                            </TableHead>
                        </TableRow>
                            <TableRow className="text-sm md:text-md border-secondary">
                            <TableHead className="text-center">Base</TableHead>
                            <TableHead className="text-center">Photon</TableHead>
                            <TableHead className="text-center">Base</TableHead>
                            <TableHead className="text-center">Photon</TableHead>
                        </TableRow>
                    </TableHeader>               
                    <TableBody>
                        {aliceInvalidBases.map((_, index) => (
                            <TableRow key={index} className={`text-center border-secondary ${index === 0 && flashing ? "flash-delete" : ""}`}>
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
                            </TableRow>
                        ))}
                    </TableBody>               
                </Table>
            </div>
            <div className="flex justify-center p-4">                          
                <Button onClick={handleNext} disabled={isDisabled} variant="secondary">Next</Button>
            </div>
            <div className="flex justify-end p-4">              
                <Button onClick={onSecure} variant="default">Secure</Button>
                <Button onClick={onUnsecure} variant="destructive">Not Secure</Button>
            </div>
            <div className="p-6 bg-background border-t border-secondary mt-4 rounded-b-lg">
                <h2 className="text-center font-bold mb-4">CHSH Graph</h2>
                <svg id="sGraph" className="block mx-auto"></svg>
            </div>
        </div>
        </>
    );
};

export default CHSHTab;


