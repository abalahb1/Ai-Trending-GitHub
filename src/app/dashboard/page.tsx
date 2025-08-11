import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SavedItemsList } from "./SavedItemsList";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <div className="card">
        <p>You need to sign in to view your saved items.</p>
      </div>
    );
  }

  const items = await prisma.savedItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        My Saved Items
      </h1>
      <SavedItemsList initialItems={items} />
    </div>
  );
}
