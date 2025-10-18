import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavItems from './NavItems'
import UserDropdown from './UserDropdown'

const Header = () => {
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
                <NavItems />
            </nav>
        {/* USER DROPDOWN COMPONENTS */}
        <UserDropdown />
        </div>
    </header>
  )
}

export default Header