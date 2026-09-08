export default function NotFound(){
    return(
        <main className="flex min-h-[70vh] items-center justify-center px-6">
            <section className="text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
                    404
                </p>
                <h1 className="mt-4 text-5xl font-light tracking-tight">
                   ❌ Destination not found
                </h1>
                <p className="mt-4 text-gray-500">
                    Sorry,we couldnt find the destination youre looking for.
                </p>
            </section>
        </main>
    )
}