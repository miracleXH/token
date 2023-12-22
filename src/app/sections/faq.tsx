'use client';

import { useState, useEffect } from 'react';
import Accordion from '@/components/Accordion';
import Container from '@/components/Container';
import { Parallax } from "react-scroll-parallax";

export default function Faq() {
    const [faqs, setFaqs] = useState([
        {
            question:
                "How can I buy $UPFI?",
            answer:
                "<p>$UPFI, the governance token for Uplink Protocol, is set for an IDO soon.</p>" +
                "<p>Committed to a 100% fair launch, it embodies the purest ethos of the BRC-20 and Ordinals communities.</p>" +
                "<p>Stay tuned for this exciting opportunity to participate.</p>"
        },
        {
            question: "What is Uplink Protocol?",
            answer:
                "<p>Uplink Protocol is the pioneering decentralized BRC-20 stablecoin protocol, facilitating users to store BRC-20 crypto assets like $ORDI and $BTC, and borrow stablecoins such as $UPSD.</p>" +
                "<p>Incubated by a leading crypto exchange and team, our mission is to bridge the BRC-20 and ERC-20 (Especially Ethereum and BNB) ecosystems, unlocking new possibilities in decentralized finance.</p>",
        },
        {
            question: "What sets Uplink apart from other stablecoin platforms?",
            answer:
                "<p>Uplink Protocol distinguishes itself as the Maker DAO within the BRC-20 ecosystem, liberating the liquidity of BRC-20 users. Our platform uniquely caters to the specific needs of the BRC-20 community, offering a decentralized, secure, and efficient solution for stablecoin borrowing and lending.</p>",
        },
        {
            question: "How to Store and Borrow Stablecoins on Uplink Protocol?",
            answer:
                "<p>Getting started with Uplink is straightforward. Simply deposit your BRC-20 assets like $ORDI and $BTC, and then you can borrow $UPSD against them.</p>",
        },
        {
            question: "What are the benefits of staking on Uplink?",
            answer:
                "<p>Staking $UPFI tokens on Uplink rewards users with ERC-20 or BRC-20 tokens. Participants enhance the platform’s stability and earn extra tokens proportionally to their staked amount, benefiting both the platform and themselves.</p>",
        },
        {
            question: "How Does Uplink Protocol Ensure Security of Funds and Transactions?",
            answer:
                "<p>Uplink Protocol prioritizes uncompromised security. We've established an early partnership with Binance, receiving their full support. Before deploying our protocol on the Bitcoin layer, Uplink undergoes rigorous scrutiny and supervision under the Binance wallet system, ensuring 100% compliance and safety.</p>",
        },
    ]);
    const [showAccordionId, setShowAccordionId] = useState(0);

    return (
        <section id="faq">
            <Container>
                <div className="mx-auto lg:w-[60%] 2xl:w-[45%]">
                    <h2 className="text-center">FAQ</h2>
                    <div>
                        {faqs.map((faq, i) => (
                            <Accordion
                                key={i}
                                question={faq.question}
                                answer={faq.answer}
                                isShow={i === showAccordionId}
                                onClick={() => setShowAccordionId(i)}
                                isLast={i === faqs.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}