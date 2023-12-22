import { useState } from "react";

export default function IdoIntro() {
    const [tabs, setTabs] = useState(['Products', 'Tokenomics', 'Unique Selling Points', 'Roadmap']);
    const [tab, setTab] = useState(0);

    return (
        <div className="mt-20">
            <div className="mb-6 lg:mb-12">
                {
                    tabs.map((item, index) => {
                        return (
                            <label
                                key={index}
                                className={`relative inline-block mr-8 mb-4 py-1 font-medium text-lg text-gray-400 cursor-pointer lg:mb-0 ${tab === index ? "font-bold text-primary-color bg-[#005963] text-primary-color px-3 rounded-full" : ""}`}
                                onClick={() => setTab(index)}
                            >
                                {item}
                            </label>
                        )
                    })
                }
            </div>
            <div>
                {
                    tab === 0 &&
                    <div>
                        <p>Uplink Finance is the First Decentralized BRC-20 Stablecoin Protocol, positioned as the Maker DAO within the BRC20 ecosystem. </p>
                        <p>Users can deposit assets such as <span className="text-primary-color">$BTC</span>, <span className="text-primary-color">$ORDI</span>, <span className="text-primary-color">$Sats</span> to obtain stablecoin <span className="text-primary-color">$UPSD</span>, thereby gaining liquidity.</p>
                        <p>For more information, please read our whitepaper: <a href="https://docs.uplinkfi.com/product" target="_blank" className="text-primary-color">https://docs.uplinkfi.com/product</a></p>
                    </div>
                }
                {
                    tab === 1 &&
                    <div>
                        <p>
                            <span className="text-primary-color">$UPFI</span> Total Supply: 1,000,000,000
                        </p>
                        <ul className="ml-4 mb-4 text-white">
                            <li>1) IDO Distribution – 90%</li>
                            <li>2) DEX Liquidity and Permanent Locking – 5%</li>
                            <li>3) Airdrop for Early Users and BRC20 Community – 5%</li>
                        </ul>
                        <p>At the core of Uplink Finance&apos;s tokenomics is the Fair Launch strategy, which we consider a fundamental tribute to the BRC20 spirit.</p>
                        <p>In a commitment to uphold the principles of a 100% fair launch, Uplink Finance mandates its team members to participate in the IDO to acquire their share of tokens. This approach ensures an equitable and transparent distribution process, aligning the team&apos;s interests with those of the wider investor community.</p>
                        <p>For more information, please read our whitepaper: <a href="https://docs.uplinkfi.com/usdupfi-tokenomicst" target="_blank" className="text-primary-color">https://docs.uplinkfi.com/usdupfi-tokenomics</a></p>
                    </div>
                }

                {
                    tab === 2 &&
                    <div>
                        <label className="block font-bold mb-2">1. Embracing True BRC20 Essence</label>
                        <p>Absolutely No VC coins, Zero Insider Warehousing. <span className="text-primary-color">$UPFI</span> proudly pledges a 100% Fair Launch, guaranteeing equitable access for every participant. This stance is more than just a nod to the BRC20 spirit; it&apos;s our unwavering commitment to the principles of decentralization.</p>
                        <label className="block font-bold mt-8 mb-2">2. Leading the Race in the BRC20 Ecosystem</label>
                        <p>The future of BRC20 isn&apos;t just about pure meme hype; it hinges on practical applications to support a substantial market value. From this perspective,  <span className="text-primary-color">$UPFI</span>, as the leader in the BRC20 stablecoin race and comparable to Maker DAO, has tremendous potential.</p>
                        <label className="block font-bold mt-8 mb-2">3. Secure and Reliable Technical Foundation</label>
                        <p>The project&apos;s technology is based on MultiBit, a leading cross-chain project within the BRC20 ecosystem, and the Ethereum stablecoin protocol Liquity Protocol. This ensures the security and reliability of the stablecoin protocol.</p>
                        <label className="block font-bold mt-8 mb-2">4. Ecosystem Positioning</label>
                        <p>Uplink&apos;s stablecoin mechanism effectively mitigates the selling pressure on BRC20 assets while providing liquidity to holders, successfully solving a range of practical problems. This has won widespread support within the BRC20 community.</p>
                    </div>
                }

                {
                    tab === 3 &&
                    <div>
                        <label className="block font-bold mb-2">2023 Q4:</label>
                        <p>- Launch of the <span className="text-primary-color">$UPSD</span> stablecoin, with the initial collateral assets including mainstream BRC20 assets like <span className="text-primary-color">$BTC</span>, <span className="text-primary-color">$ORDI</span>, <span className="text-primary-color">$SATS</span>.</p>
                        <p>- Complete the IDO of the governance token $UPFI and list it on two major Centralized Exchanges (CEX).</p>
                        <label className="block font-bold mt-8 mb-2">2024 Q1:</label>
                        <p>- Expand collateral assets to include a wider range of BRC20 assets.</p>
                        <p>- Establish partnerships with more BRC20 projects and communities to solidify our position in the ecosystem.</p>
                        <label className="block font-bold mt-8 mb-2">2024 Q2:</label>
                        <p>- Expand into mainstream Layer 2 solutions to enhance scalability and transaction efficiency.</p>
                        <p>- List on 3-5 top-tier CEXs, significantly increasing market visibility and liquidity.</p>
                    </div>
                }
            </div>
        </div>
    )
}