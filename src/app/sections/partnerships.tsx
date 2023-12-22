'use client';

import { useState, useEffect } from 'react';
import { Parallax } from 'react-scroll-parallax';
import { motion } from "framer-motion";
import { FaEllipsis } from "react-icons/fa6";

export default function Partnerships() {
    const [partners, setPartners] = useState(['btc', 'ordi', 'sat', 'eth', 'bsc', 'binance', 'okx', 'ellipsis']);

    return (
        <motion.div
            initial={{ opacity: 0, y: -200 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <Parallax className="self-start p-8 rounded-3xl bg-[#1f1f1f]">
                <h4>Strategic Partnership</h4>
                <h3 className="mb-5 text-2xl lg:text-3xl">At the heart of Uplink&apos;s ecosystem are our collaborations with industry vanguards.</h3>
                <div className="grid grid-cols-4 gap-4 md:gap-8 mt-12 mx-auto">
                    {partners.map((partner: string, index: number) => (
                        <div className="flex items-center justify-center w-full h-auto aspect-square" key={index}>
                            {
                                partner !== 'ellipsis'
                                    ? <img src={`/images/partners/${partner}.png`} alt="" className="w-[74%] aspect-square object-contain" />
                                    : <FaEllipsis className="w-8 h-auto text-white text-center" />
                            }
                        </div>
                    ))}
                </div>
            </Parallax>
        </motion.div>
    )
}