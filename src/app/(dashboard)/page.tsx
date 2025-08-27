"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
// import { useTRPC } from '@/trpc/client';
// import { useQuery } from '@tanstack/react-query';


export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  // const trpc = useTRPC();

  // const greeting = useQuery(trpc.hello.queryOptions({ text: 'Ismaeel' }));

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [loading, user, router]);

  // if (loading) {
  //   return (
  //     <h1 className="text-3xl font-bold mt-8 text-center">Loading...</h1>
  //   );
  // }

  // if (greeting.isError) {
  //   return (
  //     <h1 className="text-3xl font-bold mt-8 text-center text-red-500">
  //       Something went wrong 🚨
  //     </h1>
  //   );
  // }

  return (
    <h1 className="text-3xl font-bold mt-8 text-center">
      {user ? `Welcome, ${user.name}` : "Not logged in"}
      {/* {greeting.data && <p>Server says: {greeting.data.greeting}</p>} */}
    </h1>
  );
}
