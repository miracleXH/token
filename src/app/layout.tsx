import type { Metadata } from 'next'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import './globals.css'
import './toast.css'
import localFont from 'next/font/local'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Uplink | the First Decentralized BRC-20 Stablecoin Protocol',
  description: 'Uplink, The First Decentralized BRC-20 Stablecoin Protocol',
}

const brown = localFont({
  src: [
    {
      path: '../../public/fonts/brown/Brown-Regular.ttf',
      weight: '400'
    }
  ],
  variable: '--font-brown'
})

const brownLight = localFont({
  src: [
    {
      path: '../../public/fonts/brown/Brown-Light.ttf',
      weight: '300'
    }
  ],
  variable: '--font-brown-light'
})

const brownBold = localFont({
  src: [
    {
      path: '../../public/fonts/brown/Brown-Bold.ttf',
      weight: '700'
    }
  ],
  variable: '--font-brown-bold'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png" />
      </Head>
      <body className={`
      ${inter.className}
      ${brownLight.variable} 
      ${brown.variable} 
      ${brownBold.variable} 
      `}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
