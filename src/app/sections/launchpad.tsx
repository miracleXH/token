import Link from 'next/link';
import Button from '@/components/Button';
import { Parallax } from 'react-scroll-parallax';
import { motion } from "framer-motion";

export default function Launchpad() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 200 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <Parallax className="relative self-start rounded-3xl bg-[#1f1f1f] mt-10 overflow-hidden md:mt-20">
                <div className="bg-[#3D3D3D]">
                    <img src="/images/launchpad-cover.png" alt="" />
                </div>
                <div className="p-8">
                    <h4>Be Part of the Revolution</h4>
                    <h3 className="mx-auto text-2xl lg:text-3xl">Our IDO is completed, but you can still get $UPFI token via OKX</h3>
                    <div>
                        <a href="https://www.okx.com/web3/marketplace/ordinals/brc20/UPFI" target="_blank">
                            <Button className="mt-16 mx-auto" text="Get $UPFI" />
                        </a>
                    </div>
                </div>
            </Parallax>
        </motion.div>
    )
}