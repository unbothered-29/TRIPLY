"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { destinations } from "@/data/destinations";
import {
  removeSaved,
  subscribeSaved,
  getSavedSnapshot,
  getSavedServerSnapshot,
} from "@/lib/savedStorage";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const savedSlugs = useSyncExternalStore(
    subscribeSaved,
    getSavedSnapshot,
    getSavedServerSnapshot
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const savedDropdownRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for responsive floating dock effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K to open search, Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        setSavedDrawerOpen(false);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
        setSavedDrawerOpen(false);
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Track pathname change during render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
    setSavedDrawerOpen(false);
  }

  // Focus search input when search modal opens
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Close saved dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        savedDropdownRef.current &&
        !savedDropdownRef.current.contains(e.target as Node)
      ) {
        setSavedDrawerOpen(false);
      }
    };

    if (savedDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [savedDrawerOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "Plan", href: "/plan" },
    { label: "About", href: "/about" },
  ];

  const filteredSearchResults = searchQuery.trim()
    ? destinations.filter((dest) => {
        const q = searchQuery.toLowerCase();
        return (
          dest.name.toLowerCase().includes(q) ||
          dest.country.toLowerCase().includes(q) ||
          dest.category.toLowerCase().includes(q) ||
          dest.tagline.toLowerCase().includes(q)
        );
      })
    : destinations.slice(0, 4);

  const savedDestinationsList = destinations.filter((dest) =>
    savedSlugs.includes(dest.slug)
  );

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-out ${
          isScrolled ? "py-2.5 sm:py-3.5" : "py-4 sm:py-6"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Main Navigation"
            className={`flex items-center justify-between rounded-full border transition-all duration-500 ease-out ${
              isScrolled
                ? "border-white/15 bg-neutral-950/80 px-4 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl md:px-6 md:py-2.5"
                : "border-white/10 bg-white/[0.04] px-5 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-xl md:px-7 md:py-3"
            }`}
          >
            {/* Left: Brand Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 sm:gap-3 transition-transform duration-300 active:scale-95"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-white/20 via-white/10 to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md transition-all duration-300 group-hover:border-white/60 group-hover:bg-white group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                <span className="text-sm font-semibold transition-transform duration-500 group-hover:rotate-45">
                  ✦
                </span>
                <span className="absolute -inset-0.5 -z-10 rounded-full bg-gradient-to-r from-amber-400/20 to-teal-400/20 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-medium tracking-tight text-white transition duration-300 group-hover:text-white/90">
                  Triply
                </span>
              </div>
            </Link>

            {/* Center: Desktop Navigation Links */}
            <div className="hidden items-center gap-1 rounded-full border border-white/[0.08] bg-black/30 p-1.5 backdrop-blur-lg md:flex">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 lg:text-sm ${
                      isActive
                        ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                        : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_white]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right: Actions Cluster */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Search Button */}
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true);
                  setSavedDrawerOpen(false);
                }}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/[0.09] hover:text-white active:scale-95"
                aria-label="Search destinations"
              >
                <svg
                  className="h-3.5 w-3.5 text-white/50 transition-colors group-hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <span className="hidden lg:inline text-[11px] text-white/40">Search</span>
                <kbd className="hidden sm:inline-block rounded border border-white/15 bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-mono text-white/40 group-hover:border-white/30 group-hover:text-white/80">
                  ⌘K
                </kbd>
              </button>

              {/* Saved Destinations Trigger */}
              <div className="relative" ref={savedDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setSavedDrawerOpen((prev) => !prev);
                    setSearchOpen(false);
                  }}
                  className={`group relative flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs transition-all duration-300 active:scale-95 ${
                    savedDrawerOpen || savedSlugs.length > 0
                      ? "border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                      : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/30 hover:bg-white/[0.09] hover:text-white"
                  }`}
                  aria-label="View saved destinations"
                  aria-expanded={savedDrawerOpen}
                >
                  <span
                    className={`text-sm transition-transform duration-300 ${
                      savedSlugs.length > 0
                        ? "text-rose-400 group-hover:scale-110"
                        : "text-white/50 group-hover:text-white"
                    }`}
                  >
                    {savedSlugs.length > 0 ? "♥" : "♡"}
                  </span>
                  <span className="hidden sm:inline text-xs font-medium">Saved</span>
                  {savedSlugs.length > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                      {savedSlugs.length}
                    </span>
                  )}
                </button>

                {/* Saved Destinations Popover */}
                {savedDrawerOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-white/15 bg-neutral-950/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400">♥</span>
                        <h3 className="text-xs font-medium tracking-wider uppercase text-white/80">
                          Saved Destinations ({savedDestinationsList.length})
                        </h3>
                      </div>
                      {savedDestinationsList.length > 0 && (
                        <Link
                          href="/explore"
                          onClick={() => setSavedDrawerOpen(false)}
                          className="text-[10px] uppercase tracking-wider text-white/40 hover:text-white transition"
                        >
                          Explore More
                        </Link>
                      )}
                    </div>

                    <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                      {savedDestinationsList.length > 0 ? (
                        savedDestinationsList.map((dest) => (
                          <div
                            key={dest.slug}
                            className="group flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-2 transition duration-200 hover:border-white/20 hover:bg-white/[0.07]"
                          >
                            <Link
                              href={`/explore/${dest.slug}`}
                              onClick={() => setSavedDrawerOpen(false)}
                              className="flex items-center gap-3 overflow-hidden"
                            >
                              <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg">
                                <Image
                                  src={dest.image}
                                  alt={dest.name}
                                  fill
                                  sizes="44px"
                                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                              </div>
                              <div className="truncate">
                                <p className="truncate text-xs font-medium text-white group-hover:text-white/90">
                                  {dest.name}
                                </p>
                                <p className="text-[10px] text-white/40">
                                  {dest.country} • {dest.category}
                                </p>
                              </div>
                            </Link>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <Link
                                href={`/plan/${dest.slug}`}
                                onClick={() => setSavedDrawerOpen(false)}
                                className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-white/70 transition hover:bg-white hover:text-black"
                              >
                                Plan
                              </Link>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSaved(dest.slug);
                                }}
                                className="flex h-6 w-6 items-center justify-center rounded-full text-white/30 hover:bg-rose-500/20 hover:text-rose-400 transition"
                                title="Remove bookmark"
                                aria-label={`Remove ${dest.name}`}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-2xl text-white/20">♡</p>
                          <p className="mt-2 text-xs text-white/60">
                            No saved destinations yet
                          </p>
                          <p className="mt-1 text-[11px] text-white/40">
                            Click &quot;♡ Save destination&quot; on any place to keep it here.
                          </p>
                          <Link
                            href="/explore"
                            onClick={() => setSavedDrawerOpen(false)}
                            className="mt-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs text-white transition hover:bg-white hover:text-black"
                          >
                            Explore destinations
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop CTA Button */}
              <div className="hidden sm:block">
                <Link
                  href="/plan"
                  className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-white px-4 py-2 text-xs font-medium text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] active:scale-95 md:px-5 md:py-2.5 md:text-sm"
                >
                  <span>Plan a trip</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>

              {/* Mobile Menu Hamburger Button */}
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-colors hover:border-white/40 md:hidden"
              >
                <div className="flex flex-col justify-center items-center w-4 h-4 gap-1">
                  <span
                    className={`block h-0.5 w-4 bg-white transition-all duration-300 origin-center ${
                      menuOpen ? "translate-y-1.5 rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-4 bg-white transition-all duration-200 ${
                      menuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-4 bg-white transition-all duration-300 origin-center ${
                      menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Drawer */}
        {menuOpen && (
          <div className="mx-4 mt-3 rounded-3xl border border-white/15 bg-neutral-950/95 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 md:hidden animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col gap-4">
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="flex items-center justify-between rounded-full border border-white/15 bg-white/[0.05] px-4 py-3 text-xs text-white/60"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-white/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  <span>Search destinations...</span>
                </div>
                <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-white/60">
                  ⌘K
                </span>
              </button>

              {/* Navigation links */}
              <div className="flex flex-col gap-1 pt-2">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
                        isActive
                          ? "bg-white/15 font-medium text-white"
                          : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <span className="text-xs text-white/60">●</span>}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Saved Quick Access */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setSavedDrawerOpen(true);
                }}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/80 transition hover:bg-white/[0.06]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-rose-400">♥</span>
                  <span>Saved Destinations</span>
                </div>
                <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-300">
                  {savedSlugs.length}
                </span>
              </button>

              {/* Mobile Primary CTA */}
              <Link
                href="/plan"
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-center text-sm font-medium text-black transition hover:bg-white/90"
              >
                <span>Plan a trip</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Quick Search Modal Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/80 px-4 pt-20 sm:pt-28 backdrop-blur-md animate-in fade-in"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-white/20 bg-neutral-950/95 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center border-b border-white/15 pb-4">
              <svg
                className="h-5 w-5 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>

              <input
                ref={searchInputRef}
                type="text"
                placeholder="Where do you want to go? (e.g. Norway, Paris, Fuji)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-3 flex-1 bg-transparent text-sm sm:text-base text-white placeholder-white/40 outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mr-2 text-xs text-white/40 hover:text-white"
                >
                  Clear
                </button>
              )}

              <kbd className="hidden sm:inline-block rounded border border-white/20 bg-white/10 px-2 py-1 text-[10px] font-mono text-white/60">
                ESC
              </kbd>
            </div>

            {/* Results / Suggestions */}
            <div className="mt-4">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[10px] uppercase tracking-wider text-white/40">
                  {searchQuery.trim() ? "Search Results" : "Featured Destinations"}
                </span>
                <span className="text-[10px] text-white/40">
                  {filteredSearchResults.length} places
                </span>
              </div>

              <div className="mt-2 max-h-80 space-y-2 overflow-y-auto pr-1">
                {filteredSearchResults.length > 0 ? (
                  filteredSearchResults.map((dest) => (
                    <Link
                      key={dest.slug}
                      href={`/explore/${dest.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="group flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-3 transition duration-200 hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={dest.image}
                            alt={dest.name}
                            fill
                            sizes="48px"
                            className="object-cover transition duration-300 group-hover:scale-110"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-white group-hover:text-white/90">
                              {dest.name}
                            </h4>
                            <span className="text-xs text-white/40">•</span>
                            <span className="text-xs text-white/50">{dest.country}</span>
                          </div>
                          <p className="line-clamp-1 text-xs text-white/40">
                            {dest.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="hidden sm:inline-block rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] text-white/60">
                          {dest.category}
                        </span>
                        <span className="text-sm text-white/40 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white">
                          →
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm text-white/50">
                      No destinations matching &quot;{searchQuery}&quot;
                    </p>
                    <p className="mt-1 text-xs text-white/30">
                      Try searching for a different country, city, or category.
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Filter Tags Footer */}
              <div className="mt-4 flex flex-wrap items-center justify-between border-t border-white/10 pt-3 text-[11px] text-white/40">
                <div className="flex items-center gap-2">
                  <span>Quick jump:</span>
                  {["Norway", "Paris", "Amalfi Coast"].map((popular) => (
                    <button
                      key={popular}
                      type="button"
                      onClick={() => setSearchQuery(popular)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-white/60 hover:border-white/30 hover:text-white transition"
                    >
                      {popular}
                    </button>
                  ))}
                </div>

                <Link
                  href="/explore"
                  onClick={() => setSearchOpen(false)}
                  className="hover:text-white transition"
                >
                  View all in Explore →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}