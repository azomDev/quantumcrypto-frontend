'use client';

import React from 'react';
import {useLanguage} from '@/components/providers/language-provider';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card, CardContent} from '@/components/ui/card';

const HowToPlaySection = React.forwardRef<HTMLElement>((_, ref) => {

    const {localize} = useLanguage();

    return (
        <section ref={ref}
                 className="w-full text-lg h-fit mt-20 px-5 md:px-20">
            <h1 className="font-bold text-3xl md:text-5xl mb-4">{localize(
                'component.e91.howToPlayTitle')}</h1>
            <p>{localize('component.e91.howToPlayDescription')}</p>
            <Tabs defaultValue={'alice'} className="mt-4">
                <TabsList className="grid w-full grid-cols-2 h-fit">
                    <TabsTrigger value={'alice'}
                                 className="text-lg md:text-xl">Alice</TabsTrigger>
                    <TabsTrigger value={'bob'}
                                 className="text-lg md:text-xl">Bob</TabsTrigger>
                </TabsList>
                <TabsContent value={'alice'}>
                    <Card className="border-secondary">
                        <CardContent className="p-5">
                            <div className="flex flex-row gap-x-2">
                                <span>1.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.e91.highlights.highlight1')}</span>
                                    {localize(
                                        'component.e91.steps.step1')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>2.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.e91.highlights.highlight2')}</span>{localize(
                                    'component.e91.steps.step2Alice')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>3.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.e91.highlights.highlight3')}</span>{localize(
                                    'component.e91.steps.step3')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>4.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.e91.highlights.highlight4')}</span>{localize(
                                    'component.e91.steps.step4')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>5.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.e91.highlights.highlight5Alice')}</span>{localize(
                                    'component.e91.steps.step5Alice')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value={'bob'}>
                    <Card className="border-secondary">
                        <CardContent className="p-5">
                            <div className="flex flex-row gap-x-2">
                                <span>1.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.e91.highlights.highlight1')}</span>{localize(
                                    'component.e91.steps.step1')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>2.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.e91.highlights.highlight2')}</span>{localize(
                                    'component.e91.steps.step2Bob')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>3.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.e91.highlights.highlight3')}</span>{localize(
                                    'component.e91.steps.step3')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>4.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.e91.highlights.highlight4')}</span>{localize(
                                    'component.e91.steps.step4')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>5.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.e91.highlights.highlight5Bob')}</span>{localize(
                                    'component.e91.steps.step5Bob')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </section>
    );
});

HowToPlaySection.displayName = 'HowToPlaySection';

export default HowToPlaySection;