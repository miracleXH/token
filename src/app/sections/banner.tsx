import Link from "next/link";
import Container from "@/components/Container";
import Button from '@/components/Button';
import { Parallax } from "react-scroll-parallax";

export default function Banner() {
    return (
        <section>
            <Container>
                <div className="relative py-16 lg:py-28">
                    <div className="lg:grid lg:grid-cols-[60%_40%] lg:mt-20">
                        <div className="flex justify-start mt-4 lg:-mt-6 lg:pl-2 lg:pr-0 xl:pl-8 xl:pr-0 2xl:mt-0 2xl:pl-4">
                            <div>
                                <h1 className="w-full text-center text-[#00e5ff] text-[1.5rem] leading-[2.6rem] lg:w-full lg:text-left lg:leading-[3.5rem] lg:text-[1.8rem] xl:w-full xl:text-[2.1rem] xl:leading-[4rem] 2xl:text-[2.6rem] 2xl:leading-[4.5rem]">Trade $UPFI Now on OKX<br />Your Gateway to BRC20 Innovation</h1>    
                                <div className="mt-4 text-center lg:mt-8 lg:text-left">
                                    <a href="https://www.okx.com/web3/marketplace/ordinals/brc20/UPFI" target="_blank">
                                        <Button text="Get $UPFI" className="mx-auto" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <Parallax speed={-10} className="absolute w-7 left-[70%] xl:left-[72%] lg:w-[5%]">
                            <img src="/images/star-1.png" alt="" />
                        </Parallax>
                        <Parallax speed={0} className="absolute w-5 top-[70%] left-[25%] lg:top-[90%] lg:left-[42%] lg:w-[3%] 2xl:top-[87%]">
                            <img src="/images/star-1.png" alt="" />
                        </Parallax>
                        <Parallax speed={15} className="relative w-32 mt-6 mx-auto lg:absolute lg:left-[48%] lg:w-[18%] lg:mt-8">
                            <img src="/images/upfi.png" alt="" />
                        </Parallax>
                        <div className="flex items-end justify-center -mb-32 lg:ml-10 xl:-ml-2">
                            <div className="text-center lg:text-left lg:w-[66%] xl:w-[55%] 2xl:w-[55%]">
                                <p className="mt-16 lg:mt-0">$UPFI, the governance token for Uplink Finance. Committed to a 100% fair launch, it embodies the purest ethos of the BRC-20 and Ordinals communities.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}