"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ScrollytellingCanvas = dynamic(
  () => import("@/components/homepage/ScrollytellingCanvas"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-screen w-screen" />,
  }
);

export default function CanvasLoader() {
  return <ScrollytellingCanvas />;
}
