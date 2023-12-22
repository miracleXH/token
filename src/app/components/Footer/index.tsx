import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-10 p-10 bg-[#1F1F1F]">
            <div className="lg:flex lg:justify-between">
                <div className="">
                    <img src="/images/logo-full.png" alt="" className="w-32 mb-6" />
                    <label className="text-[#00e5ff]">Stay connected with Uplink Protocol. <br />Follow us across social media for cutting-edge updates and insights.</label>
                </div>
                <div>
                    <div className="mt-6 lg:mt-0 lg:grid lg:grid-cols-4 lg:gap-2 lg:text-center">
                        <div className="mb-2 text-white lg:mb-0">
                            <Link href="#about">About</Link>
                        </div>
                        <div className="mb-2 text-white lg:mb-0">
                            <Link href="#howitworks">How it works</Link></div>
                        <div className="mb-2 text-white lg:mb-0">
                            <Link href="#faq">FAQ</Link></div>
                        <div className="mb-2 text-white lg:mb-0">
                            <a href="https://docs.uplinkfi.com/" target="_blank">Whitepaper</a>
                        </div>
                    </div>
                    <div className="flex lg:justify-end mt-8">
                        <div><a href="https://twitter.com/Uplink_BTC" target="_blank"><FaXTwitter className="w-6 h-6 text-white" /></a></div>
                        <div><a href="https://t.me/uplink_btc" target="_blank" ><FaTelegramPlane className="w-6 h-6 ml-4 text-white" /></a></div>
                    </div>
                </div>
            </div>
        </footer >
    )
}