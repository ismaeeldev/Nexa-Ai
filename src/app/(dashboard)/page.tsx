"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <h1 className="text-3xl font-bold mt-8 text-center">Loading...</h1>
    );
  }

  return (
    <h1 className="text-3xl font-bold mt-8 text-center">
      {user ? `Welcome, ${user.name}` : "Not logged in"}
    </h1>
  );
}
