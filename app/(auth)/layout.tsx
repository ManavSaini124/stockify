import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <main className='auth-layout'>
        <section className='auth-left-section scrollbar-hide-default'>
            <Link href="/" className='auth-logo'>
                <Image src='/assets/icons/logo.svg' alt='Stockify Logo' width={140} height={32} className='h-8 w-auto'/>
            </Link>

            <div className='pb-6 lg:pb-8 flex-1'>
                {children}
            </div>
        </section>

        <section className='auth-right-section'>
            <div className='z-10 relative lg:mt-4 lg:mb-16'>
                <blockquote className='auth-blockquote'>
                    <p>
                        "The stock market is filled with individuals who know the price of everything, but the value of nothing."
                    </p>
                </blockquote>
                <div className='flex items-center justify-between'>
                    <div>
                        <cite className='auth-testimonial-author'>Philip Fisher</cite>
                        <p className='max-md:text-xs text-gray-500'>Retail Investor</p>
                    </div>
                    <div className='flex items-center gap-0.5'>
                        {[1,2,3,4,5].map((star)=>(
                            <Image 
                                key={star}
                                src='/assets/icons/star.svg'
                                alt='Star'
                                width={20}
                                height={20}
                                className='w-5 h-5'
                            />
                        ))}
                    </div>
                </div>

                <div className='flex-1 relative'>
                        <Image 
                            src='/assets/images/dashboard.png'
                            alt='Background Image'
                            width={1440}
                            height={1150}
                            className='auth-dashboard-preview absolute top-0'
                        />
                </div>
            </div>
        </section>
    </main>
  )
}

export default layout