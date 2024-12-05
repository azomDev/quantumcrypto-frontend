'use client';

import Header from '@/components/shared/header';
import E91Main from '@/components/e91/home-page/e91-game-form';
import Footer from '@/components/shared/footer';
import {useRef} from 'react';
import HowToPlaySection from '@/components/e91/home-page/how-to-play-section';
import {useLanguage} from '@/components/providers/language-provider';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { Card, CardContent } from '@/components/ui/card';

export default function E91() {

    const howToPlayRef = useRef(null);
    const aboutRef = useRef(null);
    const {localize} = useLanguage();

    const mathJaxConfig = {
        loader: { load: ['[tex]/color'] },
        tex: { packages: { '[+]': ['color'] } },
      };

    const headerLinks = [
        {
            label: 'component.header.howToPlay',
            ref: howToPlayRef,
        },
        {
            label: 'component.header.about.e91',
            ref: aboutRef,
        },
    ];

    return (
        <MathJaxContext config={mathJaxConfig}>
            <Header links={headerLinks}/>
            <E91Main/>
            <HowToPlaySection ref={howToPlayRef}/>
            <section ref={aboutRef}
                     className="w-full h-fit mt-20 px-5 md:px-20">
                <Card className="mb-6 p-6 md:p-8 border-none mx-auto shadow-md">
                    <h1 className="font-bold text-3xl md:text-5xl mb-4">{localize(
                        'component.bb84.aboutTitle')}</h1>
                    <p className="text-lg mb-4">{localize('component.e91.about')}</p>
                </Card>
                <Card className='pt-4 pb-2 border-none mx-auto shadow-md'>
                    <CardContent>
                        <h2 className="text-2xl mb-4">{localize('component.e91.about.figures.title')}</h2>
                        <p className="text-lg mb-4">{localize('component.e91.about.figures.part1')}</p>
                        <div className="mb-4 flex justify-center">
                            <table className="table-auto border-collapse border border-gray-300">
                                <thead className="">
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300 text-left">Alice</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left">Bob</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{color:"#2C6E49"}} className="px-4 py-2 border border-gray-300">a</td>
                                        <td style={{color:"#2C6E49"}} className="px-4 py-2 border border-gray-300">b</td>
                                    </tr>
                                    <tr>
                                        <td style={{color:"#88D4AB"}} className="px-4 py-2 border border-gray-300">a'</td>
                                        <td style={{color:"#88D4AB"}} className="px-4 py-2 border border-gray-300">b</td>
                                    </tr>
                                    <tr>
                                        <td style={{color:"#80d1ef"}} className="px-4 py-2 border border-gray-300">a</td>
                                        <td style={{color:"#80d1ef"}} className="px-4 py-2 border border-gray-300">b'</td>
                                    </tr>
                                    <tr>
                                        <td style={{color:"#0a629e"}} className="px-4 py-2 border border-gray-300">a'</td>
                                        <td style={{color:"#0a629e"}} className="px-4 py-2 border border-gray-300">b'</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-lg mb-4">{localize('component.e91.about.figures.part2')}</p>
                        <p className="text-lg mb-4">{localize('component.e91.about.figures.part3')}</p>
                        <div className="mb-4 flex justify-center">
                            <table className="table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300" colSpan={2}>Alice</th>
                                        <th className="px-4 py-2 border border-gray-300" colSpan={2}>Bob</th>
                                        <th className="px-4 py-2 border border-gray-300" rowSpan={2}> mA x mB </th>
                                    </tr>
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300">Base</th>
                                        <th className="px-4 py-2 border border-gray-300">mA</th>
                                        <th className="px-4 py-2 border border-gray-300">Base</th>
                                        <th className="px-4 py-2 border border-gray-300">mB</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{color:"#2C6E49"}} className="italic px-4 py-2 border border-gray-300">a</td>
                                        <td className="px-4 py-2 border border-gray-300">+1</td>
                                        <td style={{color:"#2C6E49"}} className="italic px-4 py-2 border border-gray-300">b</td>
                                        <td className="px-4 py-2 border border-gray-300">+1</td>
                                        <td className="px-4 py-2 border border-gray-300">+1</td>
                                    </tr>
                                    <tr>
                                        <td style={{color:"#2C6E49"}} className="italic px-4 py-2 border border-gray-300">a</td>
                                        <td className="px-4 py-2 border border-gray-300">+1</td>
                                        <td style={{color:"#2C6E49"}} className="italic px-4 py-2 border border-gray-300">b</td>
                                        <td className="px-4 py-2 border border-gray-300">-1</td>
                                        <td className="px-4 py-2 border border-gray-300">-1</td>
                                    </tr>
                                    <tr>
                                        <td style={{color:"#2C6E49"}} className="italic px-4 py-2 border border-gray-300">a</td>
                                        <td className="px-4 py-2 border border-gray-300">-1</td>
                                        <td style={{color:"#2C6E49"}} className="italic px-4 py-2 border border-gray-300">b</td>
                                        <td className="px-4 py-2 border border-gray-300">-1</td>
                                        <td className="px-4 py-2 border border-gray-300">+1</td>
                                    </tr>
                                    <tr>
                                        <td style={{color:"#88D4AB"}} className="italic px-4 py-2 border border-gray-300">a′</td>
                                        <td className="px-4 py-2 border border-gray-300">+1</td>
                                        <td style={{color:"#88D4AB"}} className="italic px-4 py-2 border border-gray-300">b</td>
                                        <td className="px-4 py-2 border border-gray-300">+1</td>
                                        <td className="px-4 py-2 border border-gray-300">+1</td>
                                    </tr>
                                    <tr>
                                        <td style={{color:"#88D4AB"}} className="italic px-4 py-2 border border-gray-300">a′</td>
                                        <td className="px-4 py-2 border border-gray-300">-1</td>
                                        <td style={{color:"#88D4AB"}} className="italic px-4 py-2 border border-gray-300">b</td>
                                        <td className="px-4 py-2 border border-gray-300">+1</td>
                                        <td className="px-4 py-2 border border-gray-300">-1</td>
                                    </tr>
                                    <tr>
                                        <td style={{color:"#0a629e"}} className="italic px-4 py-2 border border-gray-300">a′</td>
                                        <td className="px-4 py-2 border border-gray-300">+1</td>
                                        <td style={{color:"#0a629e"}} className="italic px-4 py-2 border border-gray-300">b′</td>
                                        <td className="px-4 py-2 border border-gray-300">+1</td>
                                        <td className="px-4 py-2 border border-gray-300">+1</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-lg mb-4">{localize('component.e91.about.figures.part4')}</p>
                        <MathJax>
                            {`
                            \\[
                            E_{a,b} = \\frac{1 - 1 + 1}{3} = 0.33
                            \\]
                            \\[
                            E_{a',b} = \\frac{1 - 1}{2} = 0
                            \\]
                            \\[
                            E_{a',b'} = \\frac{1}{1} = 1
                            \\]
                            \\[
                            E_{a,b'} = 0
                            \\]
                            `}
                        </MathJax>
                        <p className="text-lg mb-4">{localize('component.e91.about.figures.part5')}</p>
                        <MathJax>
                            {`
                            \\[
                            S = \\lvert E_{a,b} + E_{a',b} + E_{a',b'} - E_{a,b'} \\rvert \\leq 2
                            \\]
                            `}
                        </MathJax>
                        <p className="text-lg mb-4">{localize('component.e91.about.figures.part6')}</p>
                        <p className="text-lg mb-4">{localize('component.e91.about.figures.part7')}</p>
                    </CardContent>
                </Card>               
            </section>
            <Footer/>
        </MathJaxContext>
    );
}
