export default function Footer() {
  return (
    <footer className="border-t border-gray-100 px-6 py-12 md:px-12 lg:px-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">

        <div>
          <p className="text-xl font-medium tracking-tight">
            Triply
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Discover. Plan. Explore.
          </p>
        </div>

        <div className="text-sm text-gray-400">
          © 2026 Triply. Explore the world.
        </div>

      </div>
    </footer>
  );
}