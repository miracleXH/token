import { useState, useEffect } from "react";
import Container from "@/components/Container";
import { Parallax } from "react-scroll-parallax";
import { motion } from "framer-motion";
import Button from "@/components/Button";

export default function About() {
    const [showComingSoon, setShowComingSoon] = useState(false);

    return (
        <section id="about">
            <Container>
                <div className="lg:flex lg:items-center">
                    <div className="relative w-full lg:w-1/2">
                        <Parallax translateY={[40, -40]} className="relative top-0 left-[20%] w-[65%]">
                            <img src="/images/block-3.png" alt="" />
                        </Parallax>
                        <Parallax translateY={[30, -30]} className="absolute top-0 left-[20%] w-[65%]">
                            <img src="/images/block-2.png" alt="" />
                        </Parallax>
                        <Parallax translateY={[20, -20]} className="absolute top-0 left-[20%] w-[65%]">
                            <img src="/images/block-1.png" alt="" />
                        </Parallax>
                    </div>
                    <div className="lg:w-[50%] xl:w-[36%] 2xl:w-[33%]">
                        <motion.div
                            className="w-full mt-6 p-6 rounded-3xl lg:mt-0 lg:w-[90%] xl:w-full xl:p-8 bg-[#1f1f1f]"
                            initial={{ opacity: 0, x: 200 }}
                            transition={{ duration: 1 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h4>Uplink Protocol</h4>
                            <h3 className="mb-5 text-2xl lg:text-3xl">Injecting Unparalleled Liquidity into the BRC-20 Ecosystem.</h3>
                            <p>The First Decentralized BRC-20 Stablecoin Protocol. Seamlessly store $ORDI and $BTC, and access Stablecoin borrowing with $UPSD.</p>
                        </motion.div>

                        <div className="relative">
                            <Button
                                text="Open App"
                                className="mt-8 mx-auto"
                                onMouseEnter={() => setShowComingSoon(true)}
                                onMouseLeave={() => setShowComingSoon(false)}
                            />
                            {showComingSoon &&
                                <label className="ml-4 text-gray-400">Coming soon</label>
                            }
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}