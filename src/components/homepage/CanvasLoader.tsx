"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const HomePageClient = dynamic(
  () => import("@/components/homepage/HomePageClient"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-screen w-screen" />,
  }
);

export default function CanvasLoader() {
  return <HomePageClient />;
}