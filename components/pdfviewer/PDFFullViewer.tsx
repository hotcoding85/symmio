"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface HybridPDFViewerProps {
  pdfUrl: string;
  className?: string;
}

export function HybridPDFViewer({
  pdfUrl,
  className = "",
}: HybridPDFViewerProps) {
  const [scale, setScale] = useState(1.0);

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  return (
    <iframe
      src={`${pdfUrl}#view=fitH`}
      className="w-full min-h-[60vh] border-0"
      style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}
    />
  );
}
