import React from 'react';
import {TableCell, TableRow} from '@/components/ui/table';

interface Bb84ResultsRowProps {
    room: any;
    player1: string;
    player2: string;
}

const Bb84ResultsRow = ({room, player1, player2}: Bb84ResultsRowProps) => {
    return (
        <TableRow>
            <TableCell>{`${player1} - ${player2}`}</TableCell>
            <TableCell>{room.iterations.map(
                (_: any, index: number) => <p key={index}>{index +
                    1}</p>)}</TableCell>
            <TableCell>{room.iterations.map(
                ({eve_present}: any, index: number) => <p
                    key={index}>{eve_present ? 'Yes' : 'No'}</p>)}</TableCell>
            <TableCell>{room.iterations.map(
                ({elapsed_time}: any, index: number) => <p
                    key={index}>{`${Math.ceil(
                    elapsed_time)} seconds`}</p>)}</TableCell>
        </TableRow>
    );
};

export default Bb84ResultsRow;