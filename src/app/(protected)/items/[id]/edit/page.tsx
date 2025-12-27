import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { EditItemForm } from "./edit-item-form"

export default async function EditItemPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const session = await getServerSession(authOptions)

  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const item = await prisma.item.findUnique({
    where: { id: params.id },
    include: { tags: true },
  })

  if (!item) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <h1 className="mb-8 text-3xl font-bold">Edit Item</h1>
      <EditItemForm item={item} />
    </div>
  )
}
