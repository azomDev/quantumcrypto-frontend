import React from 'react';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Bb84ResultsRow from '@/components/bb84/results-page/bb84-results-row';

interface ResultsTableProps {
    rooms: any[];
    players: any[];
}

const Bb84ResultsTable = ({rooms, players}: ResultsTableProps) => {

    const getPlayerName = (playerId: number) => {
        return players.filter(player => player.id === playerId)[0]?.name;
    };

    const sortRooms = () => {
        return rooms.sort((a, b) => {
            const shortestA = Math.min(...a.iterations.map((iter: any) => iter.elapsed_time));
            const shortestB = Math.min(...b.iterations.map((iter: any) => iter.elapsed_time));
            return shortestA - shortestB;
        });
    }

    return (
        <div
            className="mt-4 block border w-fit mx-auto min-w-[50%]
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
            <Table>
                <TableHeader className="bg-card top-0 sticky">
                    <TableRow className="text-sm md:text-lg">
                        <TableHead>Room</TableHead>
                        <TableHead>Iteration</TableHead>
                        <TableHead>Eve Present</TableHead>
                        <TableHead>Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortRooms().map((room, index) => <Bb84ResultsRow key={index}
                                                                room={room}
                                                                player1={getPlayerName(
                                                                    room.player1)}
                                                                player2={getPlayerName(
                                                                    room.player2)}/>)}
                </TableBody>
            </Table>
            {rooms.length === 0 && <p className='font-bold text-lg text-center py-2'>No rooms have finished playing yet</p>}
        </div>
    );
};

export default Bb84ResultsTable;