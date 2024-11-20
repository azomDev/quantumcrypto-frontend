import React from 'react';
import {TableCell, TableRow} from '@/components/ui/table';

interface E91ResultsRowProps {
    room: any;
    player1: string;
    player2: string;
}

const E91ResultsRow = ({room, player1, player2}: E91ResultsRowProps) => {
    return (
        <TableRow>
            <TableCell>{`${player1} - ${player2}`}</TableCell>
            <TableCell>{room.iterations.map(
                ({eve_present}: any, index: number) => <p
                    key={index}>{eve_present ? 'Yes' : 'No'}</p>)}</TableCell>
            <TableCell>{room.iterations.map(
                ({eve_detected}: any, index: number) => <p
                    key={index}>{eve_detected ? 'Yes' : 'No'}</p>)}</TableCell>
            <TableCell>{room.iterations.map(
                ({elapsed_time}: any, index: number) => <p
                    key={index}>{`${Math.ceil(
                    elapsed_time)} seconds`}</p>)}</TableCell>
            <TableCell>{room.iterations.map(
                ({score}: any, index: number) => <p
                    key={index}>{`${Math.ceil(
                    score)} Points`}</p>)}</TableCell>
        </TableRow>
    );
};

export default E91ResultsRow;