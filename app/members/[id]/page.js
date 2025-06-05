"use client";
import { useEffect, useState } from "react";
import MemberProfileSkeleton from "@/components/member-profile-skeleton";
import MemberProfile from "@/components/member-profile";

// export async function generateStaticParams() {
//   return Array.from({ length: 7 }, (_, i) => ({
//     id: String(i + 1)
//   }))
// }

export default function MemberPage({ params }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMember() {
      setLoading(true);
      const res = await fetch(`/api/members/${params.id}`);
      if (res.ok) {
        setMember(await res.json());
      }
      setLoading(false);
    }
    fetchMember();
  }, [params.id]);

  if (loading) {
    return <MemberProfileSkeleton />;
  }

  return <MemberProfile member={member} />;
}