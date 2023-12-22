'use client';

import Button from '@/components/Button';
import ParallaxScroll from '@/components/ParallaxScroll';
import Container from '@/components/Container';
import { Parallax } from 'react-scroll-parallax';
import Banner from '@/sections/banner';
import About from '@/sections/about';
import Faq from '@/sections/faq';
import HowItWorks from '@/sections/howitworks';
import Partnerships from '@/sections/partnerships';
import Launchpad from '@/sections/launchpad';
import Vault from '@/sections/vaults';

export default function Home() {
  return (
    <main>
      <ParallaxScroll>
        <Banner />
        <About />
        <Vault />
        <HowItWorks />
        <section>
          <Container>
            <div className="md:grid md:grid-cols-2 md:gap-10 w-full mx-auto xl:w-[75%] xl:gap-20 2xl:w-[65%] 2xl:gap-24">
              <Partnerships />
              <Launchpad />
            </div>
          </Container>
        </section>
        <Faq />
      </ParallaxScroll>
    </main>
  )
}
