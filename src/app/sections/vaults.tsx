'use client';

import Container from "@/components/Container";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Parallax } from "react-scroll-parallax";

export default function Vault() {
    const [vaults, setVaults] = useState<any[]>([
        {
            'icon': 'btc.png',
            'coin': 'BTC',
            'tvl': 'coming soon',
            'minted_pusd': '200.0m',
            'ltv': '95%',
            'dept_interested_rate': '0.00%',
            'widthdraw_expense': '0.50%',
        },
        {
            'icon': 'ordi.png',
            'coin': 'ORDI',
            'tvl': 'coming soon',
            'minted_pusd': '150.0m',
            'ltv': '80%',
            'dept_interested_rate': '2.00%',
            'widthdraw_expense': '1.00%',
        },
        {
            'icon': 'sats.png',
            'coin': 'Sats',
            'tvl': 'coming soon',
            'minted_pusd': '100.0m',
            'ltv': '70%',
            'dept_interested_rate': '2.00%',
            'widthdraw_expense': '1.00%',
        },
        {
            'icon': 'rats.png',
            'coin': 'Rats',
            'tvl': 'coming soon',
            'minted_pusd': '100.0m',
            'ltv': '60%',
            'dept_interested_rate': '5.00%',
            'widthdraw_expense': '2.00%',
        }
    ]);

    return (
        <section>
            <Container className="w-full max-w-none 2xl:max-w-screen-2xl">
                <div className="grid px-1 lg:grid-cols-4 2xl:px-0">
                    {vaults.map((vault: any, index: number) => (
                        // <Parallax translateY={[index * 30, index * 30 * -1]}>
                            <motion.div
                                key={index}
                                className="px-4 py-6 border-2 border-[#171717] rounded-3xl bg-[#1f1f1f] 2xl:px-6 2xl:py-7"
                                initial={{ opacity: 0, y: index * 100 }}
                                transition={{ duration: .7 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="mb-8 text-center">
                                    <img src={`/images/coins/${vault.icon}`} alt="" className="w-[4rem] mx-auto mb-4 xl:w-[4.5rem]" />
                                    <h3 className="text-[#00e5ff]">{vault.coin}</h3>
                                </div>
                                <div className="flex items-center text-center h-20 mb-4 border-b border-gray-700">
                                    <div className="flex items-center justify-center w-1/2 h-full border-r border-gray-700">
                                        <div>
                                            <label className="block text-gray-400">TVL</label>
                                            <label className="text-lg">{vault.tvl}</label>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center w-1/2 h-full">
                                        <div>
                                            <label className="block text-gray-400">Minted $UPSD</label>
                                            <label className="text-lg">{vault.minted_pusd}</label>
                                        </div>
                                    </div>

                                </div>
                                <div className="flex items-center justify-between h-10 2xl:h-12">
                                    <label className="text-gray-400">LTV</label>
                                    <label>{vault.ltv}</label>
                                </div>
                                <div className="flex items-center justify-between h-10 2xl:h-12">
                                    <label className="text-gray-400">Debt Interested Rate</label>
                                    <label>{vault.dept_interested_rate}</label>
                                </div>
                                <div className="flex items-center justify-between h-10 2xl:h-12">
                                    <label className="text-gray-400">Withdraw Expense</label>
                                    <label>{vault.widthdraw_expense}</label>
                                </div>
                            </motion.div>
                        // </Parallax>
                    ))}
                </div>
            </Container>
        </section>
    )
}