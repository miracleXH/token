'use client';

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation'
import { getTickerInfoByAddress } from "@/api/unisat";
import { getLuckyDrawSummary, getLuckyDrawUser, createLuckyDrawUser, getLuckyDrawResult } from "@/api/ordinalsLuckyDraw";
import { FaRegCopy, FaXTwitter } from "react-icons/fa6";
import copy from 'copy-to-clipboard';
import { motion, useAnimation } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LuckyDraw() {
    const controls = useAnimation();
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [isUpfiHolder, setIsUpfiHolder] = useState<boolean>(false);
    const [entries, setEntries] = useState<number>(0);
    const [drew, setDrew] = useState<number>(0);
    const [totalWon, setTotalWon] = useState<number>(0);
    const [won, setWon] = useState<number>(0);
    const [referralCode, setReferralCode] = useState('');
    const [overallWon, setOverallWon] = useState<number>(0);
    const [overallParticipate, setOverallParticipate] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const [drawStep, setDrawStep] = useState(0) // 0 done, 1 end, 2 load
    const [result, setResult] = useState<number>(0); // 0 nothing, 1 won, 2 lose
    const drawRef = useRef<boolean | null>(false);
    const searchParams = useSearchParams();

    const handleCopyClipboard = (text: string) => {
        copy(text);
        toast('Copied to clipboard');
    }

    const startAnimation = async () => {
        await controls.start({ x: [-10, 10, -10, 10, 0] });
        setTimeout(() => {
            startAnimation();
        }, 3000);
    };

    const draw = async () => {
        setDrawStep(2);
        setResult(0);
        let res = await getLuckyDrawResult({ address: walletAddress });

        if (res.code === 1001) {
            if (drawRef.current) {
                setTimeout(() => {
                    setDrawStep(1);
                }, 2500);
            } else {
                setDrawStep(1);
            }

            // first time draw
            if (drew === 0) {
                setOverallParticipate(overallParticipate + 1);
            }

            setDrew(drew + 1);

            if (res.data.won) {
                setResult(1)
                // setWon(won + 1)
                setTotalWon(totalWon + 1);
                setOverallWon(overallWon + 1);
            } else {
                setResult(2)
            }

            if (!drawRef.current) {
                drawRef.current = true;
            }
        } else {
            toast(res.message);
        }
    }

    const createUser = async () => {
        const referralBy = searchParams.get('r') || '';

        let res = await createLuckyDrawUser({
            address: localStorage.getItem('walletAddress') || "",
            referralBy: referralBy
        });

        if (res.code === 1001) {
            setEntries(1);
            setDrew(0);
            setReferralCode(res.data.referralCode);
        }
    }

    const handleProgress = () => {
        // setProgress(108);
        // const presaleStartTime = 1703160000000;
        // const currentTime = new Date().getTime();

        // if (currentTime > presaleStartTime) {
        //     const progressData = [30, 35, 36, 48];
        //     const intervalDuration = 10 * 60 * 1000; // 10 minutes in milliseconds

        //     // Calculate the time difference in minutes
        //     const timeDifference = Math.floor((currentTime - presaleStartTime) / 60000);

        //     // Calculate the progress index based on the time difference and interval duration
        //     const progressDataIndex = Math.floor(timeDifference / (intervalDuration / 60000));

        //     if (progressDataIndex < progressData.length) {
        //         setProgress(Math.floor(progressData[progressDataIndex] * 10) / 10);
        //     }
        // }
    };



    const init = async () => {
        setDrawStep(0);
        setResult(0);
        drawRef.current = false;

        // Get lucky draw summary
        let luckyDrawRes = await getLuckyDrawSummary();

        if (luckyDrawRes.code === 1001) {
            setOverallParticipate(luckyDrawRes.data.totalParticipate);
            setOverallWon(luckyDrawRes.data.totalWon);
        }

        handleProgress();

        // Check is holder
        let walletAddress = localStorage.getItem('walletAddress') || "";
        setWalletAddress(walletAddress);

        if (walletAddress) {
            let tickerInfoRes = await getTickerInfoByAddress({
                address: walletAddress,
                ticker: 'upfi'
            });

            // test
            // let tickerInfoRes = await getTickerInfoByAddress({
            //     address: 'bc1pwwa97z5gduasvk3ltvzsu7r3hfanzxk4ad8hsj9f5909zgwgnvtqd84hsc',
            //     ticker: 'upfi'
            // });

            // console.log(tickerInfoRes.data.overallBalance)
            // return;
            // end test

            let _isUpfiHolder = false; // DEFAULT MUST FALSE

            if (tickerInfoRes.code === 0) {
                if (tickerInfoRes.data.overallBalance > 0) {
                    _isUpfiHolder = true
                    setIsUpfiHolder(true);
                }
            }

            // if holder, check has created before
            if (_isUpfiHolder) {
                let luckyDrawUserRes = await getLuckyDrawUser({
                    address: walletAddress
                });

                if (luckyDrawUserRes.code === 1001) {
                    setEntries(luckyDrawUserRes.data.entries);
                    setDrew(luckyDrawUserRes.data.drew);
                    setTotalWon(luckyDrawUserRes.data.won);
                    setReferralCode(luckyDrawUserRes.data.referralCode);
                } else if (luckyDrawUserRes.code === 1005) {
                    createUser();
                } else {
                }
            }
        }
    }

    useEffect(() => {
        const handleWalletAddressChange = () => {
            init();
        };

        window.addEventListener('walletAddressChanged', handleWalletAddressChange);

        return () => {
            window.removeEventListener('walletAddressChanged', handleWalletAddressChange);
        };
    }, []);

    useEffect(() => {
        startAnimation()
        init()
    }, [])

    return (
        <>
            <ToastContainer autoClose={4000} draggable={false} />
            <div className="container mx-auto px-5 pt-36 pb-28 lg:px-0">
                <div className="text-center">
                    <label className="uppercase text-primary-color tracking-wider">up to the moon ordinals NFT</label>
                    <h3 className="text-[2rem] lg:text-[2.5rem] xl:text-[2.7rem]">Whitelist Lucky Draw</h3>
                    <label className="block -mt-1 text-gray-400">Draw for OG NFT whitelist then get huge UPFI airdrops!</label>
                </div>
                <div className="relative w-[350px] mx-auto text-center lg:w-[400px]">
                    <div className="relative grid grid-cols-2 mt-6 border border-gray-500">
                        <div className="absolute -top-px -left-px w-6 h-auto aspect-square border-r border-b border-gray-500 bg-[#171717]
                before:absolute before:-bottom-px before:-right-px before:w-1/2 before:h-auto before:aspect-square before:border-t before:border-l before:border-gray-500 before:bg-[#171717]"></div>
                        <div className="absolute -bottom-px -left-px w-6 h-auto aspect-square border-r border-b border-gray-500 bg-[#171717]
                before:absolute before:-bottom-px before:-right-px before:w-1/2 before:h-auto before:aspect-square before:border-t before:border-l before:border-gray-500 before:bg-[#171717] -rotate-90"></div>
                        <div className="absolute -top-px -right-px w-6 h-auto aspect-square border-r border-b border-gray-500 bg-[#171717]
                before:absolute before:-bottom-px before:-right-px before:w-1/2 before:h-auto before:aspect-square before:border-t before:border-l before:border-gray-500 before:bg-[#171717] rotate-90"></div>
                        <div className="absolute -bottom-px -right-px w-6 h-auto aspect-square border-r border-b border-gray-500 bg-[#171717]
                before:absolute before:-bottom-px before:-right-px before:w-1/2 before:h-auto before:aspect-square before:border-t before:border-l before:border-gray-500 before:bg-[#171717] rotate-180"></div>
                        <div className="px-5 py-5 xl:py-6 border-r border-gray-500">
                            <p className="mb-0">Winners</p>
                            {/* <h3 className="font-light text-[2.2rem] text-[#FEC253]">{overallWon + Math.floor(progress / 10) || 0}<span className="mx-1 text-sm text-gray-400"> / 300</span></h3> */}
                            <h3 className="font-light text-[2.2rem] text-[#FEC253]">{16 + overallWon}<span className="mx-1 text-sm text-gray-400"> / 300</span></h3>
                        </div>
                        <div className="px-5 py-5 xl:py-6">
                            <p className="mb-0">Participants</p>
                            {/* <h3 className="font-light text-[2.2rem] text-[#FEC253]">{overallParticipate + progress || 0}</h3> */}
                            <h3 className="font-light text-[2.2rem] text-[#FEC253]">{108 + overallParticipate}</h3>
                        </div>
                    </div>
                </div>
                <div className="mt-10 lg:mt-20 lg:grid lg:grid-cols-[30%_40%_30%] lg:items-center xl:px-10">
                    <div>
                        <h3 className="mb-4 lg:text-2xl">How to join</h3>
                        <ul className="list-decimal pl-5 text-gray-400">
                            <li>Address holding UPFI.</li>
                            <li>Share it on Twitter and fill in the form sent to TG&apos;s mod, you can get another chance to draws
                                <a href="https://forms.gle/WbweunyueC4znfp6A" target="_blank" className="block text-primary-color font-light">https://forms.gle/WbweunyueC4znfp6A</a>
                            </li>
                        </ul>
                    </div>
                    <motion.div
                        className="relative w-[40%] h-[200px] mt-14 mx-auto lg:w-[180px] lg:h-full lg:mt-0 xl:w-[205px] 2xl:w-[240px]"
                        animate={drawStep !== 1 ? controls : {}}
                        transition={{ duration: 0.6 }}
                    >
                        {result === 2 &&
                            <motion.img
                                src="/images/try-again.png"
                                alt=""
                                className="absolute top-[50%] left-0 right-0 mx-auto w-[27%] h-auto object-contain"
                                initial={{ scale: 0 }}
                                animate={drawStep === 1 ? { scale: [0, 1.2, 1] } : {}}
                                transition={{ duration: 0.6, delay: .5 }}
                            />
                        }
                        {result === 1 &&
                            <motion.img
                                src="/images/utm1.jpg"
                                alt=""
                                className="absolute top-[25%] left-0 right-0 mx-auto w-[70%] h-auto object-contain rounded-2xl border-2 border-[#FCBD02]"
                                style={{ boxShadow: '0 0 160px rgba(252, 189, 2, .6)' }}
                                initial={{ scale: 0 }}
                                animate={drawStep === 1 ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                                transition={{ duration: 0.6, delay: .5 }}
                            />
                        }
                        <motion.img
                            src="/images/box-top.png"
                            alt=""
                            className="absolute top-0 w-full h-auto object-contain"
                            initial={{ top: 0 }}
                            animate={drawStep === 1 ? { top: -50 } : { top: 0 }}
                            transition={{ duration: 0.5 }}
                        />
                        <motion.img
                            src="/images/box-left.png"
                            alt=""
                            className="absolute top-0 w-full h-auto object-contain"
                            initial={{ top: 0, left: 0 }}
                            animate={drawStep === 1 ? { top: 10, left: -50 } : {}}
                            transition={{ duration: 0.5 }}
                        />
                        <motion.img
                            src="/images/box-right.png"
                            alt=""
                            className="absolute top-0 w-full h-auto object-contain"
                            initial={{ top: 0, right: 0 }}
                            animate={drawStep === 1 ? { top: 10, right: -50 } : {}}
                            transition={{ duration: 0.5 }}
                        />
                    </motion.div>

                    <div className="relative mt-8 mb-6 border border-gray-500 lg:mt-0 lg:mb-0">
                        <div className="flex items-center justify-between px-4 xl:px-5 py-5 border-b border-gray-500">
                            <label className="text-gray-400">Your entries</label>
                            <label>{drew}/{entries}</label>
                        </div>
                        <div className="flex items-center justify-between px-4 xl:px-5 py-5">
                            <label className="text-gray-400">Whitelist won</label>
                            <label>{totalWon > 0 ? totalWon : 0}</label>
                        </div>
                        <div className="px-4 xl:px-5 py-5 bg-[#3d3d3d]">
                            <div className="flex items-center justify-between">
                                <label className="block text-gray-400">Referral Link</label>
                                {referralCode &&
                                    <FaRegCopy
                                        className="text-gray-400 cursor-pointer"
                                        onClick={() => handleCopyClipboard(`https://uplinkfi.com/luckydraw?r=${referralCode}`)}
                                    />
                                }
                            </div>
                            {referralCode &&
                                <label
                                    className="block truncate cursor-pointer"
                                    onClick={() => handleCopyClipboard(`https://uplinkfi.com/luckydraw?r=${referralCode}`)}>https://www.uplinkfi.com/luckydraw?r={referralCode}</label>
                            }
                        </div>
                    </div>
                </div>

                {!walletAddress &&
                    <div className="relative lg:mt-16 xl:mt-24 2xl:mt-40 text-center">
                        <label className="text-primary-color">Connect wallet to continue</label>
                    </div>
                }

                {walletAddress &&
                    <>
                        {isUpfiHolder
                            ? <div className="relative lg:mt-16 xl:mt-24 2xl:mt-36 text-center">
                                {
                                    result === 1 &&
                                    <motion.h3 className="mt-32 mb-12 text-[#FEC253] text-2xl"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={drawStep === 1 ? { opacity: 1, scale: [0, 1.5, 1] } : {}}
                                        transition={{ duration: 0.4, delay: .8 }}
                                    >Congrats! you won a whitelist!</motion.h3>
                                }
                                {
                                    result === 2 &&
                                    <>
                                        <motion.h3 className="mt-32 mb-1 text-2xl text-primary-color"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={drawStep === 1 ? { opacity: 1, scale: [0, 1.5, 1] } : {}}
                                            transition={{ duration: 0.4, delay: .8 }}
                                        >Thanks for trying</motion.h3>
                                        <p className="mx-auto mb-8 text-center lg:w-[60%] xl:w-[45%]">Don&apos;t lose heart if luck isn&apos;t on your side – switch to a wallet with UPFI or share this on Twitter, Telegram, and WeChat Group to get another shot at the draw!, and you&apos;ll get another chance to win big!</p>
                                    </>
                                }
                                <div
                                    className={`inline-flex items-center h-12 px-8 rounded-full bg-primary-color font-bold uppercase text-lg cursor-pointer ${drew < entries && overallWon < 300 && drawStep !== 2 ? '' : '!bg-[#195158] text-[#4f919a]'}`}
                                    onClick={() => {
                                        if (drew < entries && overallWon < 300 && drawStep !== 2) {
                                            draw();
                                        }
                                    }}
                                    // onClick={() => draw()}
                                >Draw</div>
                            </div>
                            : <div className="mt-44 text-center">
                                <h3 className="mb-4 text-2xl text-primary-color">You need to hold $UPFI to join the lucky draw.</h3>
                                <label className="text-lg">Get <span className="text-primary-color font-bold">$UPFI</span></label>
                                <div className="grid grid-cols-2 gap-3 w-60 mt-4 mx-auto">
                                    <a href="https://www.okx.com/web3/marketplace/ordinals/brc20/UPFI" target="_blank">
                                        <div className="flex items-center justify-center h-12 rounded-full border border-primary-color cursor-pointer">
                                            <img src="/images/okx-white.png" alt="" className="w-5 h-auto mr-2" />
                                            <label className="cursor-pointer">OKX</label>
                                        </div>
                                    </a>
                                    <a href="https://unisat.io/market/brc20?tick=UPFI" target="_blank">
                                        <div className="flex items-center justify-center h-12 rounded-full border border-primary-color cursor-pointer">
                                            <img src="/images/unisat.png" alt="" className="w-5 h-auto mr-2" />
                                            <label className="cursor-pointer">Unisat</label>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        }
                    </>
                }
            </div>
        </>
    )
}