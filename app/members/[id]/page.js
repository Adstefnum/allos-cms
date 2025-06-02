import { Suspense } from "react"
import MemberProfileSkeleton from "@/components/member-profile-skeleton"
import MemberProfile from "@/components/member-profile"

// export async function generateStaticParams() {
//   return Array.from({ length: 7 }, (_, i) => ({
//     id: String(i + 1)
//   }))
// }

export default function MemberPage({ params }) {
  return (
    <div>
      <Suspense fallback={<MemberProfileSkeleton />}>
        <MemberProfile memberId={params.id} />
      </Suspense>
    </div>
  )
}