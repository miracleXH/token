import Container from "@/components/Container";
import { motion } from "framer-motion";

export default function HowItWorks() {
    return (
        <section id="howitworks" className="text-left lg:text-center ">
            <Container>
                <h2>How It Works</h2>
                <p className="w-full mx-auto lg:w-3/5">Designed for the savvy $ORDI, $BTC holders and BRC-20 asset investors, Uplink Finance enables you to unlock the value of your holdings without selling. By depositing your assets and borrowing $UPSD, Uplink Finance elevates your liquidity and financial flexibility, freeing up capital while maintaining your investment position</p>
                <img src="/images/flow.png" alt="" className="w-full mx-auto mt-10 lg:w-[75%] lg:mt-20" />
            </Container>
        </section>
    )
}