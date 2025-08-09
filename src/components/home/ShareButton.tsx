"use client"
export default function ShareButton() {
  async function share() {
    const url = typeof window !== "undefined" ? window.location.origin : ""
    const data = { title: "AI/ML Pulse", text: "منصة أخبار ومشاريع الذكاء الاصطناعي", url }
    try {
      if (navigator.share) { await navigator.share(data); return }
      await navigator.clipboard.writeText(data.url)
      alert("تم نسخ رابط الموقع")
    } catch { /* تجاهل */ }
  }
  return (
    <button onClick={share} className="btn">مشاركة الموقع</button>
  )
}
