import { useState, useEffect, useRef } from "react";
import { connectWallet } from "@/utils/helpers/walletHelper";
import { IoMdClose, IoIosArrowDown, IoIosLogOut } from "react-icons/io";
import { FaRegCopy, FaXTwitter } from "react-icons/fa6";
import copy from 'copy-to-clipboard';

declare let window: any;

interface ConnectWalletButtonProps {
    className?: string;
}

export default function ConnectWalletButton({ className }: ConnectWalletButtonProps) {
    const [showModalWallet, setShowModalWallet] = useState(false);
    const [walletProviders, setWalletProviders] = useState<any[]>([
        { logo: 'unisat.png', name: 'unisat', installed: false, window_name: typeof window !== 'undefined' ? window.unisat : undefined },
        { logo: 'okx-black.png', name: 'okx', installed: false, window_name: typeof window !== 'undefined' ? window.okxwallet : undefined }
    ]);
    const [walletAddress, setWalletAddress] = useState("");
    const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    const formatWalletAddress = (walletAddress: string) => {
        return walletAddress.substring(0, 5) + '...' + walletAddress.substring(walletAddress.length - 5);
    }

    const disconnect = () => {
        handleAccountsChanged([])
    }

    const handleConnectWallet = async (walletProvider: string) => {
        localStorage.setItem('walletProvider', walletProvider)

        const _walletAddresses = await connectWallet();

        if (_walletAddresses) {
            setShowModalWallet(false);
            handleAccountsChanged(_walletAddresses);
        }
    }

    const handleAccountsChanged = (_accounts: any) => {
        if (_accounts.length > 0) {
            let _walletAddress = _accounts[0];

            setWalletAddress(_walletAddress);
            localStorage.setItem('walletAddress', _walletAddress);
        } else {
            setWalletAddress("");

            localStorage.removeItem('walletAddress');
            localStorage.removeItem('walletProvider');
        }

        const event = new Event('walletAddressChanged');
        window.dispatchEvent(event);
    };

    const handleNetworkChanged = (network: any) => {
        // setNetwork(network);
    };

    const handleWalletProviders = () => {
        if (typeof window !== "undefined") {
            // Check all wallets and installed state
            for (let i = 0; i < walletProviders.length; i++) {
                if (walletProviders[i].window_name !== undefined) {
                    setWalletProviders((prevWallets: any) => {
                        const updatedWallets = [...prevWallets];
                        updatedWallets[i] = { ...updatedWallets[i], installed: true };
                        return updatedWallets; // Return the updated state
                    });
                }
            }

            // Get accounts
            if (localStorage.getItem('walletAddress')) {
                handleAccountsChanged([localStorage.getItem('walletAddress')]);
            }

            // Wallet events
            let _okxwallet = window.okxwallet;
            let _unisat = window.unisat;
            let _walletProvider = localStorage.getItem('walletProvider');

            if (_okxwallet !== undefined && _walletProvider === 'okx') {
                _okxwallet.on("accountsChanged", handleAccountsChanged);
                _okxwallet.on("networkChanged", handleNetworkChanged); // okx networkchanged do not have networkchanged
            }

            if (_unisat !== undefined && _walletProvider === 'unisat') {
                _unisat.on("accountsChanged", handleAccountsChanged);
                _unisat.on("networkChanged", handleNetworkChanged);
            }

            return () => {
                _okxwallet.on("accountsChanged", handleAccountsChanged);
                _unisat.on("accountsChanged", handleAccountsChanged);
                _okxwallet.removeListener("networkChanged", handleNetworkChanged);
                _unisat.removeListener("networkChanged", handleNetworkChanged);
            };
        }
    }

    useEffect(() => {
        handleWalletProviders();
    }, [])

    return (
        <>
            {showModalWallet &&
                <div
                    className="fixed top-0 left-0 flex items-center justify-center w-screen min-h-screen p-5 bg-black/[0.4] backdrop-blur z-10"
                    onClick={() => setShowModalWallet(false)}>
                    <div className="w-full max-w-[380px] p-5 rounded-lg bg-[#171717] border border-gray-800" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <label className="block">Select wallet to connect</label>
                            <IoMdClose className="text-gray-400 cursor-pointer" onClick={() => setShowModalWallet(false)} />
                        </div>
                        {walletProviders.map((walletProvider: any, index: number) => (
                            <div
                                key={index}
                                className="relative flex px-3 h-12 mb-3 rounded-lg bg-white text-center cursor-pointer"
                                onClick={() => {
                                    if (walletProvider.installed) {
                                        handleConnectWallet(walletProvider.name);
                                    }
                                }}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        <div className="h-[80%] w-6 mr-3">
                                            <img src={`/images/${walletProvider.logo}`} alt="" className="w-full h-full object-contain" />
                                        </div>
                                        <div><label className="text-black">{walletProvider.name} wallet</label></div>
                                    </div>
                                    {!walletProvider.installed &&
                                        <label className="text-gray-400 text-sm">Not installed</label>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
            <div className={className}>
                {walletAddress
                    ? <div className="w-full h-full">
                        <div className="relative w-full h-full flex items-center justify-center" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                            <label className="inline-flex items-center h-10 px-4 rounded-full bg-primary-color mr-1 text-black cursor-pointer">{formatWalletAddress(walletAddress)}</label>
                            {
                                showProfileMenu &&
                                <div
                                    ref={profileMenuRef}
                                    className="absolute right-0 top-12 rounded-lg border border-[#00e5ff]/[0.3] bg-[#1f1f1f] cursor-pointer"
                                >
                                    <div className="flex items-center justify-between h-12 border-b border-[#00e5ff]/[0.3] px-4">
                                        <label className="mr-2 text-primary-color cursor-pointer">{formatWalletAddress(walletAddress)}</label>
                                        <label onClick={() => copy(walletAddress)}><FaRegCopy className="text-gray-400 cursor-pointer" /></label>
                                    </div>
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => disconnect()}
                                    >
                                        <div className="flex items-center justify-between h-12 px-4 text-white text-right">
                                            <label className="mr-2 cursor-pointer">Disconnect</label>
                                            <IoIosLogOut />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    : <div
                        className="inline-flex items-center h-10 px-4 rounded-full bg-primary-color cursor-pointer"
                        onClick={() => setShowModalWallet(true)}
                    >Connect Wallet</div>
                }
            </div>

        </>
    )
}