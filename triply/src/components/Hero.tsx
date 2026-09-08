import React from 'react'
import Link from 'next/link';
import DestinationCard from './DestinationCard';


const Hero = () => {
  return (

<section className='mt-10 ml-10'>
  <p className='font-thin text-4xl'>YOUR ADVENTURE STARTS HERE</p>
  <h1 className='font-thin text-xl'>Explore the world. <br />Plan your adventure.</h1>
  <p className='font-thin text-xl'>Discover amazing destinations,save your favorite
    places,and build your perfect trip.
  </p>

  <Link href="/explore" 
  className='font-thin text-3xl'
  >Explore destinations</Link>
</section>

  );
}

export default Hero