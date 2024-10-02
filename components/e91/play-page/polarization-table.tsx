'use client';

import React from 'react';
import {
    Table,
    TableBody, TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    MoveHorizontal, MoveDiagonal2, MoveDiagonal, MoveVertical, Plus,
} from 'lucide-react';
import {useLanguage} from '@/components/providers/language-provider';

const PolarizationTable = () => {

    const {localize} = useLanguage();

    return (
        <Table className="z-40">
            <TableHeader>
                <TableRow className="text-center">
                    <TableHead>
                        <p>Bit</p>
                    </TableHead>
                    <TableHead>
                        <p>{localize('component.aliceGame.basis')}</p>
                    </TableHead>
                    <TableHead>
                        <p>{localize('component.aliceGame.polarization')}</p>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="text-center border-secondary">
                    <TableCell>
                        <p className="text-lg">0</p>
                    </TableCell>
                    <TableCell>
                        <Plus className="mx-auto"/>
                    </TableCell>
                    <TableCell>
                        <MoveHorizontal className="mx-auto"/>
                    </TableCell>
                </TableRow>
                <TableRow className="text-center border-secondary">
                    <TableCell>
                        <p className="text-lg">1</p>
                    </TableCell>
                    <TableCell>
                        <Plus className="mx-auto"/>
                    </TableCell>
                    <TableCell>
                        <MoveVertical className="mx-auto"/>
                    </TableCell>
                </TableRow>
                <TableRow className="text-center border-secondary">
                    <TableCell>
                        <p className="text-lg">0</p>
                    </TableCell>
                    <TableCell>
                        <p className="text-lg">X</p>
                    </TableCell>
                    <TableCell>
                        <MoveDiagonal className="mx-auto"/>
                    </TableCell>
                </TableRow>
                <TableRow className="text-center border-secondary">
                    <TableCell>
                        <p className="text-lg">1</p>
                    </TableCell>
                    <TableCell>
                        <p className="text-lg">X</p>
                    </TableCell>
                    <TableCell>
                        <MoveDiagonal2 className="mx-auto"/>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default PolarizationTable;