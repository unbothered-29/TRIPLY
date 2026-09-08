"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { destinations } from "@/data/destinations";

export default function ExplorePage() {
  const [search, setSearch] = useState(""); 

  const filteredDestinations=destinations.filter((destination)=>
    destination.name.toLowerCase().includes(search.toLowerCase())
   );

  return (
    <main className="px-6 py-20 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-400">
          Explore
        </p>
        <h1 className="mt-4 text-5xl font-light tracking-tight md:text-7xl">
          Discover your next destination.
        </h1>
        <p className="mt-6 max-w-xl text-lg font-light text-gray-500">
          Explore beautiful places and find inspiration for your next
          adventure.
        </p>

<div className="mt-10 max-w-xl">
   <input 
   type="text" 
   placeholder="Search destinations..."
   value={search}
   onChange={(e)=>setSearch(e.target.value)}
   className="w-full rounded-full border border-gray-200 px-6 py-4 outline-none trasition focus:border-black"
   />
</div>

<div className="mt-16 grid gap-6 md:grid-cols-3">
    {filteredDestinations.map((destination)=>(
        <Link
            key={destination.slug}
            href={`/explore/${destination.slug}`}
        > 
            <article className="group relative h-[450px] overflow-hidden rounded-3xl">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 transition duration-300 group-hover:bg-black/50" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                    {destination.country}
                  </p>
                  <h2 className="mt-3 text-4xl font-light tracking-tight">
                    {destination.name}
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                    {destination.tagline}
                  </p>
                  <p className="mt-6 text-sm text-white/70 transition group-hover:text-white">
                    Explore destination →
                  </p>

                </div>
              </article>
            </Link>
          ))}
        </div>
        {filteredDestinations.length===0 && (
            <p className="mt-16 text-center text-gray-500">
               No destinations found.
            </p>
        )}
      </div>
    </main>
  );
}
