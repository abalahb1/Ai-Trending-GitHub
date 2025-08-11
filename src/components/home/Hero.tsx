import ShareButton from "./ShareButton";

export default function Hero() {
  return (
    <section className="py-8 sm:py-10">
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Welcome to AI/ML Pulse
        </h1>
        <p className="opacity-80 max-w-2xl">
          Stay updated with the latest AI news and discover top open-source
          projects—all in one simple, fast interface.
        </p>
      </div>

      <div className="mt-6">
        <form action="/search" className="flex gap-2">
          <input
            name="q"
            placeholder='Search news and repositories...'
            className="flex-1 border rounded-md px-3 py-2 bg-white/80 dark:bg-neutral-900/80
            border-gray-200 dark:border-neutral-700"
          />
          <button className="btn" type="submit">
            Search
          </button>
        </form>
      </div>

      <div className="mt-4">
        <ShareButton />
      </div>
    </section>
  );
}
