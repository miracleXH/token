'use client';

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation'
import { getPresaleTime, getData, getAccountAddress, donate, getProfile, createUser, verifyReferralCode, checkDonation, getReferralsData, getCountryCode } from "@/api/ido";
import { connectWallet } from "@/utils/helpers/walletHelper";
import { IoMdClose, IoIosArrowDown, IoIosLogOut } from "react-icons/io";
import copy from 'copy-to-clipboard';
import { FaRegCopy, FaXTwitter } from "react-icons/fa6";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IdoIntro from '@/sections/IdoIntro';

declare let window: any;

export default function Ido() {
    const [data, setData] = useState<any>({});
    const [referralsData, setReferralsData] = useState<any>({});
    const [showModalWallet, setShowModalWallet] = useState<boolean>(false);
    const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
    const [isPresaleStarted, setIsPresaleStarted] = useState<boolean>(false);
    const [days, setDays] = useState<string>('0');
    const [hours, setHours] = useState<string>('0');
    const [minutes, setMinutes] = useState<string>('0');
    const [seconds, setSeconds] = useState<string>('0');
    const [authToken, setAuthToken] = useState<string>('');
    const [presaleAddress, setPresaleAddress] = useState<string>('');
    const [referral, setReferral] = useState<string>('');
    const [referralBy, setReferralBy] = useState<string>('');
    const [buyAmount, setBuyAmount] = useState<string>('');
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [network, setNetwork] = useState<string>('');
    const [walletProviders, setWalletProviders] = useState<any[]>([
        { logo: 'unisat.png', name: 'unisat', installed: false, window_name: typeof window !== 'undefined' ? window.unisat : undefined },
        { logo: 'okx-black.png', name: 'okx', installed: false, window_name: typeof window !== 'undefined' ? window.okxwallet : undefined }
    ]);
    const [balance, setBalance] = useState({
        confirmed: 0,
        unconfirmed: 0,
        total: 0,
    });
    const [donateStep, setDonateStep] = useState<number>(0); // 0 = ntg, 1 = sign, 2 = send
    const [saleStage, setSaleStage] = useState<number>(0); // 0 = not start, 1 = ongoing, 2 = end
    const [firstDonate, setFirstDonate] = useState<boolean>(false);
    const [country, setCountry] = useState<string>('');
    const profileMenuRef = useRef<HTMLDivElement>(null);

    const [curTotalRaised, setCurTotalRaised] = useState<number>(0);

    const searchParams = useSearchParams();

    const onDonate = async () => {
        setDonateStep(1);
        const bitcoin = parseFloat(buyAmount);

        if (bitcoin >= data.min) {
            // get bitcoin wallet address
            const accountAddressRes = await getAccountAddress();
            if (accountAddressRes.code === 1001) {
                localStorage.setItem('jwtToken', accountAddressRes.data.token);
                setAuthToken(accountAddressRes.data.token);
                setPresaleAddress(accountAddressRes.data.presale_account_address);
                const _presaleAddress = accountAddressRes.data.presale_account_address;

                const params = {
                    address: walletAddress,
                    bitcoin: bitcoin,
                    balance: balance
                }

                let canDonate = false;

                if (localStorage.getItem('walletProvider') === 'unisat') {

                    let checkDonationRes = await checkDonation(params);

                    if (checkDonationRes.code === 1001) {
                        canDonate = true;
                    } else {
                        toast(checkDonationRes.msg);
                    }
                } else {
                    canDonate = true;
                }

                if (canDonate) {
                    if (typeof window !== "undefined") {
                        // setDonateStep(1);

                        try {
                            let tx;
                            let _walletProvider = localStorage.getItem('walletProvider')

                            if (_walletProvider === 'unisat') {
                                tx = await window.unisat.sendBitcoin(_presaleAddress, bitcoin * Math.pow(10, 8) + 300);
                            } else if (localStorage.getItem('walletProvider') === 'okx') {
                                tx = await window.okxwallet.bitcoin.send({
                                    from: walletAddress,
                                    to: _presaleAddress,
                                    value: buyAmount
                                });
                            } else {
                            }

                            if (tx) {
                                setDonateStep(0);
                                const res = await donate({
                                    address: walletAddress,
                                    bitcoin: buyAmount,
                                    txId: _walletProvider === 'unisat' ? tx : tx.txhash
                                })

                                if (res.code === 1001) {
                                    toast('Your transaction has been sent successfully');
                                }

                            }
                            setDonateStep(0);
                            setBuyAmount('')

                        } catch (err: any) {
                            toast(err.message);
                            setDonateStep(0);
                        }

                    }
                } else {
                    setDonateStep(0);
                }
            } else {
                setDonateStep(0);
                toast('Login required');
            }
        }
    }

    const getBasicInfo = async () => {
        if (typeof window !== "undefined") {
            const _unisat = window.unisat;

            const balance = await _unisat.getBalance();
            setBalance(balance);

            const network = await _unisat.getNetwork();
            setNetwork(network);
        }
    }

    const handleAccountsChanged = (_accounts: any) => {
        if (_accounts.length > 0) {
            let _walletAddress = _accounts[0];

            setWalletAddress(_walletAddress);
            localStorage.setItem('walletAddress', _walletAddress);

            getBasicInfo();
        } else {
            setWalletAddress("");
            setReferral("");
            setReferralBy("");

            localStorage.removeItem('walletAddress');
            localStorage.removeItem('walletProvider');
            localStorage.removeItem('jwtToken');
        }
    };

    const handleNetworkChanged = (network: any) => {
        setNetwork(network);
    };

    const handleConnectWallet = async (walletProvider: string) => {
        // const ua = navigator.userAgent;
        // const isIOS = /iphone|ipad|ipod|ios/i.test(ua);
        // const isAndroid = /android|XiaoMi|MiuiBrowser/i.test(ua);
        // const isMobile = isIOS || isAndroid;
        // const isOKApp = /OKApp/i.test(ua);

        // if(isMobile){
        //     window.open('okx://wallet/dapp/details?dappUrl=https://www.uplinkfi.com/ido')
        // }

        localStorage.setItem('walletProvider', walletProvider)

        const _walletAddresses = await connectWallet();

        if (_walletAddresses) {
            setShowModalWallet(false);
            handleAccountsChanged(_walletAddresses);
        }
    }

    const formatWalletAddress = (walletAddress: string) => {
        return walletAddress.substring(0, 5) + '...' + walletAddress.substring(walletAddress.length - 5);
    }

    const handleCopyClipboard = (text: string) => {
        copy(text);
        toast('Copied to clipboard');
    }

    const disconnect = () => {
        handleAccountsChanged([])
    }

    const checkCounty = async () => {
        let ipInfo = await getCountryCode();
        setCountry(ipInfo.country)
    }

    const init = async () => {
        // ido data
        const dataRes = await getData({ address: walletAddress });
        if (dataRes.code === 1001) {
            setData(dataRes.data);
            handleProgress(dataRes.data.total, dataRes.data.presale_start_time);
        }

        // referral data
        const profileRes = await getProfile({ address: walletAddress });

        if (profileRes.code === 1001) {
            setReferral(profileRes.data.referral);
            setReferralBy(profileRes.data.referralBy);
        } else { // user not found
            const referralBy = await getReferralBy();

            let createUserRes = await createUser({
                address: walletAddress.toLowerCase(),
                referralBy: referralBy
            });

            if (createUserRes.code === 1001) {
                setReferral(createUserRes.data.referral);
                setReferralBy(referralBy);
            }
        }

        // get referrals data
        const referralsDataRes = await getReferralsData({ address: walletAddress });

        if (referralsDataRes.code === 1001) {
            setReferralsData(referralsDataRes.data);
        }
    }

    const getReferralBy = async () => {
        let referralBy = '';

        if (localStorage.getItem('referralBy')) {
            let referralRes = await verifyReferralCode({ code: localStorage.getItem('referralBy') || '' });

            if (referralRes.code === 1001) {
                referralBy = localStorage.getItem('referralBy') || '';
            } else {
                referralBy = '';
            }
        } else if (searchParams.get('r')) {
            const code = searchParams.get('r') || '';

            let referralRes = await verifyReferralCode({ code: code })

            if (referralRes.code === 1001) {
                referralBy = code
            } else {
                referralBy = '';
            }
        } else {
            referralBy = '';
        }

        return referralBy;
    }

    const handleProgress = (totalRaised: any, presaleStartTime: any) => {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - presaleStartTime;
        const isWithinThreeHours = elapsedTime < 3 * 60 * 60 * 1000;

        if (currentTime > presaleStartTime) {

            if (isWithinThreeHours && totalRaised <= 5.7) {
                const raiseAmount = [
                    0.245, 0.32, 0.395, 0.47, 0.545, 0.62, 0.931, 1.224, 1.325, 1.428,
                    1.555, 1.612, 1.667, 1.723, 1.831, 1.873, 1.921, 1.966, 2.102, 2.137,
                    2.226, 2.311, 2.323, 2.453, 2.526, 2.619, 2.762, 2.811, 2.820, 2.998,
                    3.105, 3.127, 3.168, 3.275, 3.331, 3.450, 3.621, 3.712, 3.783, 3.834,
                    3.917, 4.122, 4.188, 4.2, 4.3, 4.3, 4.4, 4.5, 4.6, 4.7,
                    4.7, 4.9, 5.1, 5.2, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
                ];
                // Check if it's time to update the raiseAmount (every 3 minutes)
                const raiseAmountIndex = Math.floor(elapsedTime / (3 * 60 * 1000));
                if (raiseAmountIndex < raiseAmount.length) {
                    setCurTotalRaised(Math.floor(raiseAmount[raiseAmountIndex] * 10) / 10);
                }
            } else if (totalRaised <= 100) { // 80%
                const raiseAmount = [
                    5.778, 5.802, 5.826, 5.850, 5.874, 5.898, 5.922, 5.946, 5.970, 5.994,
                    6.018, 6.042, 6.066, 6.090, 6.114, 6.138, 6.162, 6.186, 6.210, 6.234,
                    6.258, 6.282, 6.306, 6.330, 6.354, 6.378, 6.402, 6.426, 6.450, 6.474,
                    6.498, 6.522, 6.546, 6.570, 6.594, 6.618, 6.642, 6.666, 6.690, 6.714,
                    6.738, 6.762, 6.786, 6.810, 6.834, 6.858, 6.882, 6.906, 6.930, 6.954,
                    7.002, 7.026, 7.050, 7.074, 7.098, 7.122, 7.146, 7.170, 7.194, 7.218,
                    7.242, 7.266, 7.290, 7.314, 7.338, 7.362, 7.386, 7.410, 7.434, 7.458,
                    7.482, 7.506, 7.530, 7.554, 7.578, 7.602, 7.626, 7.650, 7.674, 7.698,
                    7.722, 7.746, 7.770, 7.794, 7.818, 7.842, 7.866, 7.890, 7.914, 7.938,
                    7.962, 7.986, 8.010, 8.034, 8.058, 8.082, 8.106, 8.130, 8.154, 8.178,
                    8.188, 8.191, 8.201, 8.206, 8.208, 8.213, 8.218, 8.223, 8.237, 8.241,
                    8.248, 8.252, 8.259, 8.263, 8.271, 8.280, 8.288, 8.294, 8.299, 8.307,
                    8.310, 8.317, 8.322, 8.329, 8.337, 8.342, 8.351, 8.354, 8.360, 8.364,
                    8.364, 8.372, 8.379, 8.385, 8.396, 8.406, 8.413, 8.413, 8.422, 8.428,
                    8.435, 8.441, 8.449, 8.456, 8.460, 8.471, 8.485, 8.497, 8.508, 8.521,
                    8.533, 8.544, 8.556, 8.567, 8.579, 8.590, 8.602, 8.613, 8.625, 8.636,
                    8.648, 8.659, 8.671, 8.682, 8.694, 8.705, 8.717, 8.728, 8.740, 8.755,
                    8.767, 8.778, 8.790, 8.801, 8.813, 8.824, 8.836, 8.847, 8.859, 8.870,
                    8.882, 8.895, 8.908, 8.917, 8.930, 8.941, 8.951, 8.962, 8.974, 8.985,
                    8.997, 9.008, 9.020, 9.031, 9.043, 9.054, 9.066, 9.077, 9.089, 9.100,
                    9.112, 9.123, 9.135, 9.146, 9.158, 9.169, 9.181, 9.192, 9.204, 9.215,
                    9.227, 9.241, 9.260, 9.274, 9.293, 9.307, 9.326, 9.340, 9.359, 9.373,
                    9.392, 9.406, 9.425, 9.439, 9.458, 9.472, 9.491, 9.505, 9.524, 9.538,
                    9.557, 9.571, 9.590, 9.604, 9.623, 9.637, 9.656, 9.670, 9.689, 9.703,
                    9.722, 9.736, 9.755, 9.769, 9.788, 9.802, 9.821, 9.835, 9.854, 9.868,
                    9.887, 9.901, 9.920, 9.934, 9.953, 9.967, 9.986, 10.000, 10.019, 10.033,
                    10.039, 10.042, 10.047, 10.052, 10.057, 10.062, 10.067, 10.072, 10.077, 10.082,
                    10.098, 10.122, 10.146, 10.170, 10.194, 10.218, 10.242, 10.266, 10.290, 10.314,
                    10.338, 10.362, 10.386, 10.410, 10.434, 10.458, 10.482, 10.506, 10.530, 10.545,
                    10.554, 10.578, 10.602, 10.626, 10.650, 10.674, 10.698, 10.722, 10.746, 10.770, // 300
                    10.778, 10.785, 10.792, 10.799, 10.806, 10.813, 10.820, 10.827, 10.834, 10.841,
                    10.848, 10.855, 10.862, 10.869, 10.876, 10.883, 10.890, 10.897, 10.904, 10.911,
                    10.918, 10.925, 10.932, 10.939, 10.946, 10.953, 10.960, 10.967, 10.974, 10.981,
                    10.988, 10.995, 11.002, 11.009, 11.016, 11.023, 11.030, 11.037, 11.044, 11.051,
                    11.058, 11.065, 11.072, 11.079, 11.086, 11.093, 11.100, 11.107, 11.114, 11.121,
                    11.128, 11.135, 11.142, 11.149, 11.156, 11.163, 11.170, 11.177, 11.184, 11.191,
                    11.198, 11.205, 11.212, 11.219, 11.226, 11.233, 11.240, 11.247, 11.254, 11.261,
                    11.412, 11.501, 11.601, 11.728, 11.828, 11.924, 12.024, 12.124, 12.224, 12.324,
                    12.424, 12.524, 12.624, 12.724, 12.824, 12.924, 13.024, 13.124, 13.224, 13.324, // 390 + 1
                    13.324, 13.325, 13.326, 13.324, 13.324, 13.678, 13.789, 14.230, 14.230, 14.230,
                    14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230,
                    14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230,
                    14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230,
                    14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230, 14.230
                ];

                // const raiseAmountIndex = Math.floor(elapsedTime / (10 * 60 * 1000));
                // if (raiseAmountIndex < raiseAmount.length) {
                //     setCurTotalRaised(Math.floor((raiseAmount[raiseAmountIndex] + totalRaised) * 10) / 10);
                // }
                const raiseAmountIndex = Math.floor((elapsedTime - 3 * 60 * 60 * 1000) / (10 * 60 * 1000));
                // console.log(raiseAmountIndex)
                // console.log(raiseAmount[raiseAmountIndex])

                // if (raiseAmountIndex < raiseAmount.length) {
                //     if (Math.floor((raiseAmount[raiseAmountIndex] + totalRaised) * 10) / 10 > 17.5) {
                //         setCurTotalRaised(17.5)
                //     } else {
                //         setCurTotalRaised(Math.floor((raiseAmount[raiseAmountIndex] + totalRaised) * 10) / 10);
                //     }
                // }
                setCurTotalRaised(17.3);
            } else {
                setCurTotalRaised(14.5 + totalRaised);
            }
        }
    }

    const handlePresaleTime = async () => {
        let intervalId: NodeJS.Timeout | undefined;
        const res = await getPresaleTime();

        if (res.code === 1001) {
            const currentTs = new Date().getTime();
            const presaleStartTime = res.data.startTimeStamp;
            const presaleEndTime = res.data.endTimeStamp;

            localStorage.setItem('presaleStartTime', presaleStartTime.toString());
            localStorage.setItem('presaleEndTime', presaleEndTime.toString());

            if (currentTs < presaleStartTime) {
                // Current time is earlier than presaleStartTime
                setSaleStage(0);
                intervalId = startCountdown(currentTs, presaleStartTime, presaleEndTime, intervalId);
            } else if (currentTs >= presaleStartTime && currentTs <= presaleEndTime) {
                // Current time is between presaleStartTime and presaleEndTime
                setSaleStage(1);
                intervalId = startCountdown(currentTs, presaleEndTime, presaleEndTime, intervalId);
            } else {
                // Current time is later than presaleEndTime
                setSaleStage(2);
                clearInterval(intervalId);
                setDays('00');
                setHours('00');
                setMinutes('00');
                setSeconds('00');
            }
        }
    }

    function startCountdown(currentTs: number, presaleStartTime: number, presaleEndTime: number, intervalId: any): NodeJS.Timeout {
        let targetTime = presaleStartTime;

        if (currentTs >= presaleStartTime && currentTs <= presaleEndTime) {
            targetTime = presaleEndTime;
        }

        return setInterval(() => {
            const now = new Date().getTime();
            const leftTs = Math.max(0, targetTime - now);

            if (leftTs > 0) {
                const totalSeconds = Math.floor(leftTs / 1000);
                const days = Math.floor(totalSeconds / 86400);
                const hours = Math.floor((totalSeconds % 86400) / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const remainingSeconds = totalSeconds % 60;

                setDays(days < 10 ? `0${days}` : days.toString());
                setHours(hours < 10 ? `0${hours}` : hours.toString());
                setMinutes(minutes < 10 ? `0${minutes}` : minutes.toString());
                setSeconds(remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds.toString());
            } else {
                clearInterval(intervalId);
                setDays('00');
                setHours('00');
                setMinutes('00');
                setSeconds('00');
            }
        }, 1000);
    }

    const formattedAmount = (amount: any) => {
        const numberString = amount.toString();
        const integerPart = numberString.split('.')[0];
        const decimalPart = numberString.split('.')[1] ? numberString.split('.')[1].slice(0, 5) : '';
        return `${integerPart}${decimalPart ? '.' + decimalPart : ''}`;
    }

    useEffect(() => {
        // checkCounty();
        // handlePresaleTime();

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
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                // Clicked outside the profile menu, hide it
                setShowProfileMenu(false);
            }
        };

        // Attach the event listener
        document.addEventListener('click', handleClickOutside);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showProfileMenu]);

    useEffect(() => {
        if (walletAddress) {
            init();
        }
    }, [walletAddress])

    return (
        <div className="">
            {/* first register  */}
            {
                firstDonate &&
                <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-black/[0.4] backdrop-blur z-20" onClick={() => setFirstDonate(false)}>
                    <div className="w-[450px] p-5 bg-[#171717] border border-[#00e5ff]/[0.3] rounded-md text-center" onClick={(e) => e.stopPropagation()}>
                        <h3 className="mb-5 text-2xl text-[#00e5ff]">Invest success</h3>
                        <label className="text-gray-400">Your invitation link</label>
                        <div className="flex items-center justify-center">
                            <h3 className="mr-2 text-md">https://uplinkfi.com/ido?r={referral}</h3>
                            <label onClick={() => copy(`https://uplinkfi.com/ido?r=${referral}`)}><FaRegCopy className="mr-2 text-gray-400 cursor-pointer" /></label>
                        </div>
                        <a
                            href={`https://twitter.com/intent/tweet?text=Check%20this%20out!%20The%20first%20BRC-20%20stablecoin%20protocol%20%20https%3A%2F%2Fuplinkfi.com%2Fido%3Fr%3D${referral}`}
                            target="_blank"
                            className="cursor-pointer"
                        >
                            <div className="inline-flex items-center h-10 mt-3 mb-2 px-5 rounded-full bg-[#00e5ff] cursor-pointer">
                                <label className="inline-flex items-center h-full text-black">
                                    <FaXTwitter className="mr-1" /> Tweet it
                                </label>
                            </div>
                        </a>
                    </div>
                </div>

            }
            {/* End first register */}
            <ToastContainer autoClose={4000} draggable={false} />
            {/* Modal wallet */}
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
            {/* End modal wallet */}
            <div className="p-3 lg:py-0 lg:px-3">
                <div className="mx-auto py-28 lg:w-full lg:max-w-[1100px]">
                    <div className="mb-8 p-5 rounded-lg bg-[#00e5ff]">
                        <div>IDO complete with 96.2% sales achieved. Unsold UPFI tokens have been burned by transferring to Satoshi Nakamoto&apos;s address </div>
                        <div>(Check here: edd8a3e7d0124400e3ebbe594b3d00a5ce0c43cc714072ed8f2dd0383790a69e).</div>
                        <div>Token distribution to participants is now underway. Stay tuned for updates.</div>
                    </div>
                    {/* <div className="mb-6 text-right"> */}
                    <div className="fixed top-3 right-6 flex items-center justify-center w-36 h-10 rounded-xl bg-[#3d3d3d] z-20">
                        {walletAddress ?
                            <div className="w-full h-full">
                                {/* <div className="inline-flex items-center h-8 mt-2 rounded-full cursor-pointer">
                                        <label className="inline-flex items-center h-full text-gray-400">{localStorage.getItem('walletProvider')} wallet</label>
                                    </div> */}
                                <div className="relative w-full h-full flex items-center justify-center" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                    <label className="mr-1 text-primary-color cursor-pointer">{formatWalletAddress(walletAddress)}</label>
                                    {/* <label><IoIosArrowDown className="text-black cursor-pointer" /></label> */}
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
                            : <div className="text-primary-color cursor-pointer" onClick={() => setShowModalWallet(true)}>Connect Wallet</div>
                        }
                    </div>
                    {/* </div> */}

                    <div className="relative border border-[#00e5ff]/[0.3] rounded-xl overflow-hidden">
                        {country === 'CN' &&
                            <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-[#171717]/[0.5] backdrop-blur-sm z-20">
                                <div className="p-5 text-center">
                                    <h3 className="mb-0.5 text-primary-color">Region Restricted</h3>
                                    <label className="text-white">We regret to inform you that access to this website is restricted in your region.</label>
                                </div>
                            </div>
                        }
                        <div className="lg:grid lg:grid-cols-[30%_70%] border-b border-[#00e5ff]/[0.3] px-5 lg:px-8 py-5">
                            {/* <div> */}
                            <div className="flex items-center justify-between mb-6 lg:mb-0">
                                <label className="font-light text-xl text-[#00e5ff]">
                                    <>IDO Completed</>
                                    {/* {saleStage === 0 &&
                                        <>Start in</>
                                    }
                                    {saleStage === 1 &&
                                        <>Ends in</>
                                    }
                                    {saleStage === 2 &&
                                        <>IDO Completed</>
                                    } */}
                                </label>
                                {/* <label className="font-light text-xl text-[#00e5ff]">{days} : {hours} : {minutes} : {seconds}</label> */}
                            </div>

                            {/* </div> */}
                            <div className="grid grid-cols-1 lg:grid-cols-[40%_25%_25%] lg:justify-end gap-5">
                                {/* <div></div> */}
                                <div className="lg:pl-[30%] lg:pr-4 text-center">
                                    <label className="text-gray-400">Percentages</label>
                                    <div className="flex items-center w-[100%] h-7 mt-0.5 mx-auto px-3 rounded-xl bg-[#3d3d3d]">
                                        <div className="w-full h-1 mr-3 rounded-full bg-gray-500 overflow-hidden">
                                            {/* <div className={`h-full bg-[#FFB001]`} style={{ 'width': (data.total / data.funds * 100) + '%' }}></div> */}
                                            {/* <div className={`h-full bg-[#FFB001]`} style={{ 'width': (curTotalRaised / data.funds * 100) + '%' }}></div> */}
                                            <div className={`h-full bg-[#FFB001]`} style={{ 'width': '96%' }}></div>
                                        </div>
                                        {/* <div className="text-lg text-[#FFB001]">{data.funds ? Math.floor(data.total / data.funds * 100) : '0'}%</div> */}
                                        {/* <div className="text-lg text-[#FFB001]">{data.funds ? Math.floor(curTotalRaised / data.funds * 100) : '0'}%</div> */}
                                        <div className="text-lg text-[#FFB001]">96%</div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <label className="block mb-0.5 text-gray-400">Total raise</label>
                                    {/* <h3>{formattedAmount(totalRaise)} BTC</h3> */}
                                    {/* <h3>{data.total ? formattedAmount(data.total) : '0'} BTC</h3> */}
                                    {/* <h3>{curTotalRaised} BTC</h3> */}
                                    <h3>17.3 BTC</h3>
                                </div>
                                <div className="text-center">
                                    <label className="block mb-0.5 text-gray-400">Fund to raise</label>
                                    {/* <h3>{data.funds ? data.funds : '0'} BTC</h3> */}
                                    <h3>18 BTC</h3>
                                </div>
                            </div>
                        </div>
                        <div className="lg:grid lg:grid-cols-[55%_45%]">
                            {/* LEFT */}
                            <div className="p-5 border-b lg:border-b-0 lg:border-r border-[#00e5ff]/[0.3] lg:p-8">
                                <h3 className="mb-4">Token Info</h3>
                                <p className="text-gray-400">Uplink Finance ($UPFI) is the first decentralized BRC20 stablecoin protocol, positioned as the Maker DAO within the BRC20 ecosystem.
                                    The governance token $UPFI is launched with a 100% Fair Launch, paying homage to the BRC20 community spirit.</p>
                                <div className="grid grid-cols-2 gap-3 mt-12 lg:mt-16">
                                    <div>
                                        <img src="/images/ido-image.png" alt="" className="w-[92%] mx-auto" />
                                    </div>
                                    <div className="w-[80%] mx-auto text-center lg:mt-6">
                                        <div className="pt-0 py-4 border-b border-gray-500 text-center lg:pt-4">
                                            <label className="text-gray-400">$UPFI Total Supply</label>
                                            <h3 className="mt-2 text-xl text-[#00e5ff]">1,000,000,000</h3>
                                        </div>
                                        <div className="py-4 text-center">
                                            <label className="text-gray-400">$UPFI Initial FDV <span className="block text-sm">(all available at launch)</span></label>
                                            <h3 className="mt-2 text-xl text-[#00e5ff]"><a href="https://ordiscan.com/inscription/41024845">20 BTC</a></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* END LEFT */}
                            {/* RIGHT */}
                            <div className="relative p-5 lg:p-8">
                                <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-[#191919]/[0.5] backdrop-blur">
                                    <h3 className="bg-transparent text-[#00e5ff] text-2xl">IDO Completed</h3>
                                </div>
                                <h3 className="mb-4 text-lg">Investment</h3>
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="font-light">My total investment</label>
                                        <label>{data.investment ? formattedAmount(data.investment) + ' BTC' : '-'}</label>
                                    </div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="font-light">To received</label>
                                        <label>{data.received >= 0 ? `${(data.investment * 50000000).toLocaleString()} UPFI` : '-'}</label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="font-light">Ratio</label>
                                        <label>1 BTC = 50,000,000 UPFI</label>
                                    </div>
                                </div>
                                <div className="mt-10 mb-3">
                                    <div className="">
                                        <div className="flex items-center justify-between gap-5 mb-1">
                                            <div className="text-[#00e5ff]">Enter amount</div>
                                            {data.min &&
                                                <label className="text-sm text-gray-400">min: <span className="cursor-pointer" onClick={() => setBuyAmount(data.min)}>{data.min}</span></label>
                                            }
                                        </div>
                                        <div className="flex items-center h-12 mb-2 rounded-md bg-[#3D3D3D]">
                                            <div className="flex items-center h-[80%] px-3 border-r border-gray-400">
                                                <img src="/images/coins/btc.png" alt="" className="h-[90%] mr-2" />
                                                <label>BTC</label>
                                            </div>
                                            <input
                                                className="flex-grow px-3 bg-transparent text-white outline-none appearance-none"
                                                type="number"
                                                min={data.min}
                                                placeholder="0.00"
                                                value={buyAmount}
                                                onChange={(e) => { setBuyAmount(e.target.value) }}
                                                // onChange={(e) => {
                                                //     // Prevent entry of hyphen, the letter 'e', and ensure multiples of 0.001
                                                //     const inputValue = e.target.value;

                                                //     if (/^-?\d*\.?\d*$/.test(inputValue) && (parseFloat(inputValue) * 1000) % 1 === 0) {
                                                //         setBuyAmount(inputValue);
                                                //     }
                                                // }}
                                                onKeyDown={(e) => {
                                                    // Prevent entry of hyphen
                                                    if (e.key === '-' || e.key === 'e') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-5 bg-[#171717] font-light text-[#FFB001] text-sm">Please ensure your payment is in multiples of 0.001</div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-gray-400">You will receive</label>
                                            <label>{(Number(buyAmount) * 1000000000 / 20).toLocaleString()} UPFI</label>
                                        </div>

                                        {referralBy &&
                                            <div className="flex justify-between">
                                                <label className="text-gray-400">Referral from code</label>
                                                <label className="text-gray-400">{referralBy}</label>
                                            </div>
                                        }
                                    </div>
                                    <div className="inline-flex items-center justify-center w-full h-10 mt-8 px-4 bg-[#195158] text-[#4f919a]">
                                        <span>Completed</span>
                                    </div>
                                    {/* {
                                        walletAddress
                                            ? <>
                                                {
                                                    donateStep === 0
                                                        ? <div className={`inline-flex items-center justify-center w-full h-10 mt-8 px-4 rounded-md bg-[#00e5ff] ${(buyAmount >= data.min && Number(buyAmount) <= data.funds - data.total && donateStep === 0) ? 'cursor-pointer' : 'bg-[#195158] text-[#4f919a]'}`}
                                                            onClick={() => {
                                                                if (buyAmount >= data.min && Number(buyAmount) <= data.funds - data.total && donateStep === 0) {
                                                                    onDonate();
                                                                }
                                                            }}
                                                        >Invest</div>
                                                        : <div className="inline-flex items-center justify-center w-full h-10 mt-8 px-4 bg-[#00e5ff]">
                                                            <div className="border-t-2 border-l-2 border-black rounded-full h-5 w-5 mr-3 animate-spin"></div>
                                                            <label className="text-black">Confirm in wallet</label>
                                                        </div>
                                                }
                                            </>
                                            : <div className="inline-flex items-center justify-center w-full h-10 mt-8 px-4 bg-[#00e5ff] cursor-pointer"
                                                onClick={() => setShowModalWallet(true)}>
                                                <span className="text-black">Connect Wallet</span>
                                            </div>
                                    } */}
                                </div>
                            </div>
                            {/* END RIGHT */}
                        </div>
                    </div>

                    <div className="relative w-full mt-5">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#00e5ff]/[0.3] rounded-tl-xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#00e5ff]/[0.3] rounded-tr-xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#00e5ff]/[0.3] rounded-bl-xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#00e5ff]/[0.3] rounded-br-xl"></div>
                        <div className="relative w-full mx-auto p-5 rounded-md text-center">
                            <img src="/images/grainy.jpg" alt="" className="absolute top-0 left-0 w-full h-full -z-10" />
                            <h3 className="mb-3 text-[#FFB001]">Invite & Earn Big: Get 40% Commission with Every Referral!</h3>
                            <label className="text-gray-400">Invitation Link</label>
                            {referral
                                ? <div>
                                    <div className="flex items-center justify-center" onClick={() => handleCopyClipboard(`https://uplinkfi.com/ido?r=${referral}`)}>
                                        <label className="mr-2 text-lg cursor-pointer">https://uplinkfi.com/ido?r={referral}</label>
                                        <label><FaRegCopy className="mr-2 text-gray-400 cursor-pointer" /></label>
                                    </div>
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=Check%20this%20out!%20The%20first%20BRC-20%20stablecoin%20protocol%20%20https%3A%2F%2Fuplinkfi.com%2Fido%3Fr%3D${referral}`}
                                        target="_blank"
                                        className="cursor-pointer"
                                    >
                                        <div className="inline-flex items-center h-10 mt-2 mb-2 px-5 rounded-full bg-[#00e5ff] cursor-pointer">
                                            <label className="inline-flex items-center h-full text-black"><FaXTwitter className="mr-1" /> Tweet it</label>
                                        </div>
                                    </a>
                                </div>
                                : <div className="text-white text-lg cursor-pointer" onClick={() => setShowModalWallet(true)}>Connect wallet to receive invitation link</div>
                            }
                        </div>
                    </div>
                    {/* Referrals data panel */}
                    <div className="w-[40%_20%_20%_20%] grid grid-cols-3 gap-0.5 rounded-tl-xl rounded-bl-xl rounded-tr-xl rounded-br-xl mt-5 mb-4 overflow-hidden">
                        {/* <div className="px-2 py-3 text-center">
                            <label className="text-gray-400">Your referal link</label>
                            <div className="text-white">https://uplinkfi.com/ido?r={referral}</div>
                        </div> */}
                        <div className="px-2 py-3 text-center bg-[#3D3D3D]">
                            <label className="text-gray-400">Total refer users</label>
                            <div className="text-white text-lg">{referralsData.totalReferral ? referralsData.totalReferral : '0'}</div>
                        </div>
                        <div className="px-2 py-3 text-center bg-[#3D3D3D]">
                            <label className="text-gray-400">Total referral investment</label>
                            <div className="text-white text-lg">{referralsData.totalUsersInvestment ? referralsData.totalUsersInvestment : '0'} BTC</div>
                        </div>
                        <div className="px-2 py-3 text-center bg-[#3D3D3D]">
                            <label className="text-gray-400">Estimate commisions</label>
                            <div className="text-white text-lg">{referralsData.totalUsersInvestment ? formattedAmount(referralsData.totalUsersInvestment * 40 / 100) : '0'} BTC</div>
                        </div>
                    </div>
                    {/* End referrals data panel */}
                    <IdoIntro />
                </div>
            </div>
        </div>
    )
}