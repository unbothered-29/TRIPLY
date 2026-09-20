"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute left-0 right-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10 lg:px-12">
        
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition duration-300 group-hover:bg-white group-hover:text-black">
            <span className="text-sm">✦</span>
          </div>

          <span className="text-xl font-medium tracking-tight text-white">
            Triply
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">
          <Link
            href="/"
            className="relative text-sm text-white/60 transition hover:text-white"
          >
            Home
          </Link>

          <Link
            href="/explore"
            className="relative text-sm text-white/60 transition hover:text-white"
          >
            Explore
          </Link>

          <Link
            href="/about"
            className="relative text-sm text-white/60 transition hover:text-white"
          >
            About
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/explore"
            className="rounded-full border border-white/20 bg-white px-5 py-2.5 text-sm font-medium text-black transition duration-300 hover:bg-white/80"
          >
            Start exploring →
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md md:hidden"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-px w-5 bg-white transition ${
                menuOpen ? "translate-y-1 rotate-45" : ""
              }`}
            />

            <span
              className={`block h-px w-5 bg-white transition ${
                menuOpen ? "-rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-6 right-6 top-20 rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-5">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-lg text-white"
            >
              Home
            </Link>

            <Link
              href="/explore"
              onClick={() => setMenuOpen(false)}
              className="text-lg text-white/70 transition hover:text-white"
            >
              Explore
            </Link>

            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="text-lg text-white/70 transition hover:text-white"
            >
              About
            </Link>

            <Link
              href="/explore"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-white px-5 py-3 text-center text-sm font-medium text-black"
            >
              Start exploring →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}