import ShareButton from "./ShareButton"

export default function Hero() {
  return (
    <section className="py-8 sm:py-10">
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">مرحبًا بك في AI/ML Pulse</h1>
        <p className="opacity-80 max-w-2xl">تابع آخر أخبار الذكاء الاصطناعي واكتشف أبرز المشاريع المفتوحة المصدر — بواجهة بسيطة وسريعة.</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <form action="/news" className="flex gap-2">
          <input
            name="q" placeholder='ابحث في الأخبار (مثال: "LLM")'
            className="flex-1 border rounded-md px-3 py-2 bg-white/80 dark:bg-neutral-900/80
                       border-gray-200 dark:border-neutral-700"
          />
          <button className="btn" type="submit">بحث أخبار</button>
        </form>

        <form action="/repos" className="flex gap-2">
          <input
            name="topics" placeholder="مواضيع المشاريع (ai, machine-learning, ...)"
            className="flex-1 border rounded-md px-3 py-2 bg-white/80 dark:bg-neutral-900/80
                       border-gray-200 dark:border-neutral-700"
          />
          <button className="btn" type="submit">بحث مشاريع</button>
        </form>
      </div>

      <div className="mt-4">
        <ShareButton />
      </div>
    </section>
  )
}
