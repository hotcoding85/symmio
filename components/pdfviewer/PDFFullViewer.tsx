"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, FileText, Loader2, ImageIcon, ZoomOut, ZoomIn, PanelLeft, PanelLeftClose } from "lucide-react"
import { GetViewportParameters, RenderParameters } from "pdfjs-dist/types/src/display/api"
import { PageViewport, RenderTask } from "pdfjs-dist"

// PDF.js types
interface TextItem {
  str: string
  dir: string
  width: number
  height: number
  transform: number[]
  fontName: string
}

interface TextContent {
  items: TextItem[]
}

interface PDFPageProxy {
  getTextContent(): Promise<TextContent>
  getOperatorList(): Promise<any>
  getViewport({ scale, rotation, offsetX, offsetY, dontFlip, }?: GetViewportParameters): PageViewport;
  render({ canvasContext, viewport, intent, annotationMode, transform, background, optionalContentConfigPromise, annotationCanvasMap, pageColors, printAnnotationStorage, isEditing, }: RenderParameters): RenderTask;
  commonObjs: any
  objs: any
}

interface PDFDocumentProxy {
  numPages: number
  getPage(pageNumber: number): Promise<PDFPageProxy>
}

interface ExtractedContent {
  text: Array<{
    content: string
    x: number
    y: number
    width: number
    height: number
    fontSize: number
  }>
  images: Array<{
    src: string
    x: number
    y: number
    width: number
    height: number
  }>
}

interface RichPDFViewerProps {
  pdfUrl: string
  className?: string
}

interface TextOverlay {
  content: string
  x: number
  y: number
  width: number
  height: number
  fontSize: number
}

export function RichPDFViewer({ pdfUrl, className = "" }: RichPDFViewerProps) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageImage, setPageImage] = useState<string>("")
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [pageWidth, setPageWidth] = useState(800)
  const [pageHeight, setPageHeight] = useState(600)
  const [thumbnails, setThumbnails] = useState<{page: number, url: string}[]>([])
  const [showThumbnails, setShowThumbnails] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Load PDF.js dynamically
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true)
        setError("")

        // Dynamically import PDF.js
        const pdfjsLib = await import("pdfjs-dist")

        // Set worker source
        pdfjsLib.GlobalWorkerOptions.workerSrc = `./pdf.js/pdf.worker.mjs`

        // Load PDF document
        const loadingTask = pdfjsLib.getDocument(pdfUrl)
        const pdfDoc = await loadingTask.promise

        setPdf(pdfDoc as PDFDocumentProxy)
        setTotalPages(pdfDoc.numPages)
        setCurrentPage(1)
        
        // Generate thumbnails for all pages
        generateThumbnails(pdfDoc as PDFDocumentProxy)
      } catch (err) {
        setError(`Failed to load PDF: ${err instanceof Error ? err.message : "Unknown error"}`)
      } finally {
        setLoading(false)
      }
    }

    if (pdfUrl) {
      loadPDF()
    }
  }, [pdfUrl])

  const generateThumbnails = async (pdfDoc: PDFDocumentProxy) => {
    const thumbScale = 0.2 // Smaller scale for thumbnails
    const thumbs: {page: number, url: string}[] = []
    
    // Only load first 10 thumbnails initially for performance
    const pagesToLoad = Math.min(10, pdfDoc.numPages)
    
    for (let i = 1; i <= pagesToLoad; i++) {
      try {
        const page = await pdfDoc.getPage(i)
        const viewport = page.getViewport({ scale: thumbScale })
        
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        if (!context) continue
        
        canvas.width = viewport.width
        canvas.height = viewport.height
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise
        
        thumbs.push({
          page: i,
          url: canvas.toDataURL("image/png")
        })
      } catch (err) {
        console.error(`Error generating thumbnail for page ${i}:`, err)
      }
    }
    
    setThumbnails(thumbs)
    
    // Load remaining thumbnails in the background
    if (pdfDoc.numPages > 10) {
      setTimeout(async () => {
        for (let i = 11; i <= pdfDoc.numPages; i++) {
          try {
            const page = await pdfDoc.getPage(i)
            const viewport = page.getViewport({ scale: thumbScale })
            
            const canvas = document.createElement("canvas")
            const context = canvas.getContext("2d")
            if (!context) continue
            
            canvas.width = viewport.width
            canvas.height = viewport.height
            
            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise
            
            setThumbnails(prev => [...prev, {
              page: i,
              url: canvas.toDataURL("image/png")
            }])
          } catch (err) {
            console.error(`Error generating thumbnail for page ${i}:`, err)
          }
        }
      }, 1000)
    }
  }

  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || currentPage < 1 || currentPage > totalPages) return

      try {
        setLoading(true)
        const page = await pdf.getPage(currentPage)

        // Get page viewport
        const viewport = page.getViewport({ scale })
        setPageWidth(viewport.width)
        setPageHeight(viewport.height)

        // Create canvas for rendering
        const canvas = canvasRef.current || document.createElement("canvas")
        const context = canvas.getContext("2d")

        if (!context) {
          throw new Error("Could not get canvas context")
        }

        canvas.width = viewport.width
        canvas.height = viewport.height

        // Render PDF page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        }

        await page.render(renderContext).promise

        // Convert canvas to image data URL
        const imageDataUrl = canvas.toDataURL("image/png")
        setPageImage(imageDataUrl)

        // Extract text with positioning for overlay
        // const textContent = await page.getTextContent()
        // const overlays: TextOverlay[] = textContent.items.map((item) => {
        //   const textItem = item as TextItem
        //   return {
        //     content: textItem.str,
        //     x: textItem.transform[4] * scale,
        //     y: (viewport.height - textItem.transform[5]) * scale,
        //     width: textItem.width * scale,
        //     height: textItem.height * scale,
        //     fontSize: Math.abs(textItem.transform[0]) * scale,
        //   }
        // })

        // setTextOverlays(overlays)
      } catch (err) {
        setError(`Failed to render page ${currentPage}: ${err instanceof Error ? err.message : "Unknown error"}`)
        console.error("Page rendering error:", err)
      } finally {
        setLoading(false)
      }
    }

    renderPage()
  }, [pdf, currentPage, totalPages, scale])

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }

  const toggleThumbnails = () => {
    setShowThumbnails(!showThumbnails)
  }

  if (error) {
    return (
      <Card className={`w-full max-w-4xl mx-auto ${className}`}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <FileText className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">Error loading PDF</p>
            <p className="text-gray-600 text-sm mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`w-full max-w-6xl mx-auto ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Hybrid PDF Viewer
        </CardTitle>

        <div className="flex items-center gap-2">
          {/* Thumbnail Toggle */}
          <Button variant="outline" size="sm" onClick={toggleThumbnails}>
            {showThumbnails ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </Button>

          {/* Zoom Controls */}
          <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm px-2">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3.0}>
            <ZoomIn className="w-4 h-4" />
          </Button>

          {/* Page Navigation */}
          {totalPages > 0 && (
            <>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage <= 1 || loading}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium px-2">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage >= totalPages || loading}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-row h-[calc(100vh-200px)] min-h-[500px] overflow-hidden">
          {/* Thumbnail Sidebar */}
          {showThumbnails && (
            <div className="w-48 border-r overflow-y-auto bg-gray-50">
              <div className="p-2 space-y-2">
                {thumbnails.map((thumb) => (
                  <div
                    key={`thumb-${thumb.page}`}
                    className={`relative cursor-pointer border rounded overflow-hidden ${currentPage === thumb.page ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'}`}
                    onClick={() => goToPage(thumb.page)}
                  >
                    <img
                      src={thumb.url}
                      alt={`Page ${thumb.page}`}
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                      {thumb.page}
                    </div>
                  </div>
                ))}
                {thumbnails.length < totalPages && (
                  <div className="text-center text-gray-500 text-sm py-4">
                    Loading more thumbnails...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main PDF Viewer */}
          <div className="flex-1 overflow-auto bg-gray-100">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Rendering PDF page...</span>
              </div>
            ) : (
              <div className="bg-foreground p-0 rounded-lg overflow-auto">
                <div className="relative mx-auto bg-white shadow-lg" style={{ width: pageWidth, height: pageHeight }}>
                  {/* Background PDF Image */}
                  {pageImage && (
                    <img
                      src={pageImage || "/placeholder.svg"}
                      alt={`PDF Page ${currentPage}`}
                      className="absolute inset-0 w-full h-full object-contain"
                      style={{ width: pageWidth, height: pageHeight }}
                    />
                  )}

                  {/* Selectable Text Overlays */}
                  {/* {textOverlays.map((overlay, index) => (
                    <div
                      key={`overlay-${index}`}
                      className="absolute text-transparent select-text cursor-text hover:bg-blue-100 hover:bg-opacity-30"
                      style={{
                        left: `${overlay.x}px`,
                        top: `${overlay.y - overlay.fontSize}px`,
                        width: `${overlay.width}px`,
                        height: `${overlay.fontSize}px`,
                        fontSize: `${overlay.fontSize}px`,
                        lineHeight: "1",
                        overflow: "hidden",
                      }}
                      title={overlay.content} // Show text on hover
                    >
                      {overlay.content}
                    </div>
                  ))} */}

                  {/* Hidden canvas for rendering */}
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t px-4">
          <span>
            Page {currentPage} rendered with {textOverlays.length} text elements
          </span>
          <div className="flex items-center gap-4">
            <span>Scale: {Math.round(scale * 100)}%</span>
            <span>
              Size: {pageWidth} × {pageHeight}px
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}