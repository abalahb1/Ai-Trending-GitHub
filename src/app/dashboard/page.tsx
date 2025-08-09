import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return (
      <div className="card">
        <p>You need to sign in to view your saved items.</p>
      </div>
    )
  }

  const items = await prisma.savedItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">My Saved Items</h1>
      {items.length === 0 && <div className="card">No saved items yet.</div>}
      <div className="grid gap-3">
        {items.map(i => (
          <div key={i.id} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">{i.title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{i.type} • {i.source}</div>
            </div>
            <div className="flex gap-2">
              <a className="btn" href={i.url} target="_blank" rel="noreferrer">Open</a>
              <form action={`/api/saved/${i.id}`} method="post" >
                <button
                  className="btn"
                  formAction={`/api/saved/${i.id}`}
                  formMethod="delete"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
