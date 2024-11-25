'use client';
import React, {useState} from 'react';
import {
    Dialog,
    DialogContent, DialogFooter,
    DialogHeader, DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Cat, Dog} from 'lucide-react';
import {z} from 'zod';
import usePlayerStore from '@/store/player-store';
import {useLanguage} from '@/components/providers/language-provider';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel, FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Checkbox} from '@/components/ui/checkbox';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {CheckedState} from '@radix-ui/react-checkbox';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import {useRouter} from 'next/navigation';
import {
    generateAliceBases,
    generateAliceBits,
    generateAlicePhotons, mimicEveIntercept,
} from '@/lib/bb84/solo-player';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import {clearBB84LocalStorage} from '@/lib/bb84/utils';

const SoloGameModal = () => {

        const {
            playerRole,
            setPlayerRole,
            setPlayingSolo,
            setPlayerName,
        } = usePlayerStore();
        const {
            setPhotonNumber,
            setGameHasEve,
            setValidationBitsLength,
        } = useBB84GameStore();
        const {
            setEvePresent,
            setAlicePhotons,
            setAliceBits,
            setAliceBases,
            resetRoom,
        } = useBB84RoomStore();
        const {pushLines, resetProgress} = useBB84ProgressStore();

        const {localize} = useLanguage();
        const router = useRouter();
        const [formStep, setFormStep] = useState(0);
        const [eveChecked, setEveChecked] = useState(false);

        const formSchema = z.object({
            photonNumber: z.coerce.number({
                invalid_type_error: localize('component.createGame.keyError'),
            })
                .int()
                .max(30, {
                    message: localize('component.createGame.keyMax'),
                }),
            eve: z.boolean({
                required_error: localize('component.main.pinRequired'),
            }).default(false),
            validationBitsLength: z.coerce.number({
                invalid_type_error: localize('component.createGame.numbersOnly'),
            })
                .int(),
            playerName: z.string({
                required_error: localize('component.main.nameRequired'),
            }).min(2, {
                message: localize('component.main.nameMin'),
            }).max(10, {
                message: localize('component.main.nameMax'),
            }),
        }).refine(schema =>
                (schema.eve &&
                    (schema.photonNumber >= 16 && schema.photonNumber <= 30)) ||
                (!schema.eve &&
                    (schema.photonNumber >= 10 && schema.photonNumber <= 30)),
            {
                message: localize('component.createGame.keyMin'),
                path: ['photonNumber'],
            }).refine(schema => ((schema.eve &&
                (schema.validationBitsLength > 0 && schema.validationBitsLength <=
                    schema.photonNumber / 2)) || !schema.eve),
            {
                message: localize('component.createGame.validationLength'),
                path: ['validationBitsLength'],
            });

        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                photonNumber: 10,
                eve: false,
                validationBitsLength: 0,
                playerName: '',
            },
        });

        const onStartSoloGame = (
            photonNumber: number,
            eve: boolean,
            validationBitsLength: number,
            playerName: string,
        ) => {
            clearBB84LocalStorage();
            resetRoom();
            resetProgress();
            setPlayerName(playerName);
            setPlayingSolo(true);
            setEvePresent(eve);
            setGameHasEve(eve);
            setValidationBitsLength(validationBitsLength);
            setPhotonNumber(photonNumber);
            if (playerRole === 'B') {
                const aliceBits = generateAliceBits(photonNumber);
                const aliceBases = generateAliceBases(photonNumber);
                let alicePhotons = generateAlicePhotons(aliceBits, aliceBases);
                if (eve) {
                    alicePhotons = mimicEveIntercept(alicePhotons);
                }
                setAliceBits(aliceBits);
                setAliceBases(aliceBases);
                setAlicePhotons(alicePhotons);
                pushLines([
                    {
                        title: 'component.exchange.welcome',
                    },
                    {
                        content: 'component.bobExchange.waiting',
                    },
                    {
                        content: 'component.bobExchange.photonsArrived',
                    },
                    {
                        title: 'component.game.step1',
                        content: 'component.bobExchange.choose',
                    },
                ]);
            }
            router.replace('/bb84/play');
        };

        const roleSelection = (
            <div className="flex flex-col gap-y-4 w-full items-center">
                <p className="text-lg">{localize('component.bb84.soloRoleSelect')}</p>
                <div className="flex w-full gap-x-6 justify-center">
                    <div
                        className="bg-background flex flex-col gap-y-2
                            items-center border border-secondary rounded-md
                            p-4 hover:bg-secondary/40 cursor-pointer"
                        onClick={() => {
                            setPlayerRole('A');
                            setFormStep(1);
                        }}>
                        <Cat size={50}/>
                        <p>Alice</p>
                    </div>
                    <div
                        className="flex flex-col gap-y-2 items-center
                            border border-secondary rounded-md p-4
                            hover:bg-secondary/40 cursor-pointer"
                        onClick={() => {
                            setPlayerRole('B');
                            setFormStep(1);
                        }}>
                        <Dog size={50}/>
                        <p>Bob</p>
                    </div>
                </div>
            </div>
        );

        const onEveChecked = (onChange: (...event: any[]) => void,
                              checked: CheckedState) => {
            setEveChecked(!eveChecked);
            onChange(checked);
        };

        const gameSettings = (
            <Form {...form}>
                <form className="flex flex-col gap-y-4"
                      onSubmit={form.handleSubmit(
                          ({
                               photonNumber,
                               eve,
                               validationBitsLength,
                               playerName,
                           }) => onStartSoloGame(photonNumber, eve,
                              validationBitsLength, playerName))}
                >
                    <FormField
                        control={form.control}
                        name="playerName"
                        render={({field}) => (
                            <FormItem
                                className="flex gap-x-5 items-center">
                                <FormLabel
                                    className="text-nowrap col-span-1"
                                >{localize(
                                    'component.main.nameLabel')}</FormLabel>
                                <FormControl className="mx-2">
                                    <Input
                                        placeholder=""
                                        className="w-[150px]"
                                        {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="photonNumber"
                        render={({field}) => (
                            <FormItem
                                className="flex gap-x-5 items-center">
                                <FormLabel
                                    className="text-nowrap col-span-1"
                                >{localize(
                                    'component.createGame.keyLength')}</FormLabel>
                                <FormControl className="mx-2">
                                    <Input
                                        maxLength={2}
                                        placeholder="10"
                                        className="text-center w-[50px]"
                                        {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="eve"
                        render={({field}) => (
                            <FormItem
                                className="space-y-0 flex gap-x-5 items-center">
                                <FormLabel
                                    className="text-nowrap col-span-1"
                                >{localize(
                                    'component.createGame.eve')}</FormLabel>
                                <FormControl className="mx-2">
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checkState) => onEveChecked(
                                            field.onChange,
                                            checkState)}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    {eveChecked && <FormField
                        control={form.control}
                        name="validationBitsLength"
                        render={({field}) => (
                            <FormItem
                                className="space-y-0 flex gap-x-5 items-center">
                                <FormLabel
                                    className="text-nowrap col-span-1"
                                >{localize(
                                    'component.createGame.validationDescription')}</FormLabel>
                                <FormControl className="mx-2">
                                    <Input
                                        type={'number'}
                                        maxLength={2}
                                        min="0"
                                        placeholder="10"
                                        className="text-center w-[50px]"
                                        {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />}
                    <DialogFooter>
                        <Button
                            type="submit">{localize('component.waitingRoom.start')}</Button>
                    </DialogFooter>
                </form>
            </Form>
        );

        return (
            <Dialog onOpenChange={(open) => {
                if (!open) setFormStep(0);
            }}>
                <DialogTrigger asChild>
                    <Button type="button"
                            variant="secondary"
                            className="text-md mt-2 w-[50%] p-2">
                        {localize('component.bb84.playSolo')}
                    </Button>
                </DialogTrigger>
                <DialogContent
                    className="border-secondary w-[90%] md:w-full rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {localize('component.bb84.startSolo')}
                        </DialogTitle>
                    </DialogHeader>
                    {(() => {
                        switch (formStep) {
                            case 0:
                                return roleSelection;
                            case 1:
                                return gameSettings;
                            default:
                                return null;
                        }
                    })()}
                </DialogContent>
            </Dialog>
        );
    }
;

export default SoloGameModal;