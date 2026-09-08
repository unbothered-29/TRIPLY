import Link from 'next/link';
import React from 'react'

const Navbar = () => {
  return (
<nav className='w-full flex justify-between items-end mt-5 ml-5'>
  <Link href="/"
  className='font-black text-3xl'
  >Triply</Link>

  <div className='w-[21%] space-x-5 mr-5'>
    <Link href="/explore" className='font-thin text-xl'>Explore</Link>
    <Link href="/trips" className='font-thin text-xl'>My Trips</Link>
    <Link href="/saved" className='font-thin text-xl'>Saved</Link>
    <Link href="/login" className='font-thin text-xl'>Login</Link>
  </div>
</nav>
  )
}

export default Navbar;