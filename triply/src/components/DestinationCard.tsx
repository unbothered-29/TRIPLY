
import React, { use } from 'react'
import Link from 'next/link';


  type DestinationCardProps={
    name:string;
    country:string;
    slug:string;
  };

  export default function DestinationCard({
name,
country,
slug,
  }:DestinationCardProps){
    return(
    <Link href={`/explore/${slug}`}>
      <article>
        <h3>{name}</h3>
        <p>{country}</p>
      </article>
    </Link>


    );
  }