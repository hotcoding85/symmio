"use client";
import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { useSearchParams } from "next/navigation";
import Dashboard from "@/components/views/Dashboard/dashboard";

// Set PDF.js worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.js/pdf.worker.mjs";

export default function PDFViewer() {
  const searchParams = useSearchParams();
  const id = searchParams.get("reader");
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const loadPDF = async () => {
      const pdf = await pdfjsLib.getDocument("/brand-book.pdf").promise;
      setPdf(pdf);
      setNumPages(pdf.numPages);
    };

    loadPDF();
  }, []);

  return (
    <Dashboard _sidebarOpen={true}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          overflowY: "auto",
          padding: "20px 0",
        }}
      >
        {Array.from({ length: numPages }).map((_, index) => (
          <PDFPage
            key={`page-${index + 1}`}
            pdf={pdf}
            pageNumber={index + 1}
            width={containerRef.current?.clientWidth || 800}
          />
        ))}
      </div>
    </Dashboard>
  );
}

function PDFPage({
  pdf,
  pageNumber,
  width,
}: {
  pdf: any;
  pageNumber: number;
  width: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!pdf) return;

    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({
        scale: width / page.getViewport({ scale: 1 }).width,
      });

      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: canvas.getContext("2d")!,
        viewport,
      }).promise;
    };

    renderPage();
  }, [pdf, pageNumber, width]);

  return (
    <div
      style={{ marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
