'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Button from "@/components/Button";
import { usePathname, useSearchParams } from 'next/navigation';
import { getCountryCode } from "@/api/ido";
import ConnectWalletButton from "../ConnectWalletButton";

export default function Header() {
    const pathname = usePathname();
    const [curPath, setCurPath] = useState('');
    const [showComingSoon, setShowComingSoon] = useState(false);

    const checkCountry = async () => {
        let ipInfo = await getCountryCode();

        if (ipInfo.country === 'CN') {
            window.location.href = '/restriction';
        }
    }

    useEffect(() => {
        const _curPath = pathname.split('/')[1];
        setCurPath(_curPath);

        if (_curPath === '') {
            checkCountry();
        }
    }, [pathname])

    return (
        <>
            <div className="fixed top-0 left-0 flex items-center justify-between w-full h-14 pl-4 md:h-16 md:pl-10 z-10">
                <Link href="/" className="flex items-center h-full">
                    <img src="/images/logo-full.png" alt="" className="w-auto h-4/5" />
                </Link>
                <div className="items-center h-full border-l border-b border-white bg-[#171717] px-6 hidden sm:flex">
                    <div className="mr-10">
                        <Link href="/#about" scroll={true} className="text-white">About</Link>
                        <Link href="/#howitworks" className="ml-6 text-white">How it works</Link>
                        <Link href="/#faq" className="ml-6 text-white">FAQ</Link>
                        <a href="https://docs.uplinkfi.com/" target="_blank" className="ml-6 text-white">Whitepaper</a>
                        <a href="https://www.okx.com/web3/marketplace/ordinals/brc20/UPFI" target="_blank" className="ml-6 text-white">Get $UPFI</a>
                    </div>
                    <a href="https://twitter.com/Uplink_BTC" target="_blank"><FaXTwitter className="w-5 h-auto text-white" /></a>
                    <a href="https://t.me/uplink_btc" target="_blank"><FaTelegramPlane className="w-5 h-auto ml-4 text-white cursor-pointer" /></a>
                    <div className="relative">
                        <Button
                            text="Product"
                            hasArrow={false}
                            className="ml-6 border-2 border-[#00e5ff] bg-transparent !text-[#00e5ff]"
                            onMouseEnter={() => setShowComingSoon(true)}
                            onMouseLeave={() => setShowComingSoon(false)}
                        />
                        {showComingSoon &&
                            <div className="absolute -bottom-10 left-6 text-gray-400">Coming soon</div>
                        }
                    </div>
                    {/* {curPath !== 'ido'
                        ? <a href="https://www.okx.com/web3/marketplace/ordinals/brc20/UPFI" target="_blank">
                            <Button text="Get $UPFI" className="ml-2" />
                        </a>
                        : <div className="w-44 h-8"></div>
                    } */}
                    <ConnectWalletButton className="ml-2" />
                </div>
            </div>
            <div className="fixed top-0 right-0 h-16 aspect-square flex items-center border-white z-10 md:hidden">
                <a href="https://twitter.com/Uplink_BTC" target="_blank">
                    <FaXTwitter className="w-5 h-auto ml-3 text-white" />
                </a>
                <a href="https://t.me/uplink_btc" target="_blank">
                    <FaTelegramPlane className="w-5 h-auto ml-3 text-white cursor-pointer" />
                </a>
                {curPath !== 'ido'
                    ? <a href="https://www.okx.com/web3/marketplace/ordinals/brc20/UPFI" target="_blank">
                        <Button text="Get $UPFI" className="w-[9.05rem] ml-5 mr-3 cursor-pointer" />
                    </a>
                    : <div className="w-48"></div>
                }
            </div>
        </>
    )
}