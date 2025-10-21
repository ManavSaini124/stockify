import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavItems from './NavItems'
import UserDropdown from './UserDropdown'
import { searchStocks } from '@/lib/actions/finnhub.actions'

const Header = async({user}:{user:User}) => {
    const initialStocks = await searchStocks();

  return (
    // should always stick on top
    <header className='sticky top-0 header'>
        <div className='container header-wrapper'>
            <Link href='/'>
                <Image 
                    src='/assets/icons/logo.svg' 
                    alt='Stockify Logo' 
                    width={140} 
                    height={32} 
                    className='h-8 w-auto cursor-pointer'
                />
            </Link>
            <nav className='hidden sm:block'>
                {/* NAV ITEMS */}
                <NavItems initialStocks={initialStocks}/>
            </nav>
        {/* USER DROPDOWN COMPONENTS */}
        <UserDropdown user = { user } initialStocks={initialStocks}/>
        </div>
    </header>
  )
}

export default Header