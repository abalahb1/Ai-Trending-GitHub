"use client";

export default function ShareButton() {
  async function share() {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const data = {
      title: "AI/ML Pulse",
      text: "AI/ML news and open-source projects platform",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(data.url);
      alert("Site URL copied to clipboard");
    } catch {
      /* ignore */
    }
  }

  return (
    <button onClick={share} className="btn">
      Share Site
    </button>
  );
}
