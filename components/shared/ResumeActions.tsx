"use client"

import { useEffect, useRef, useState } from "react"
import { Eye, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const DEFAULT_PDF_PATH = "/cv/cv.pdf"
const DEFAULT_PREVIEW_IMAGE_PATH = "/cv/cv-img.png"

export interface ResumeActionsProps {
  className?: string
  pdfPath?: string
  fileName?: string
  previewImagePath?: string
}

export function ResumeActions({
  className,
  pdfPath = DEFAULT_PDF_PATH,
  fileName = "frontend-developer-react-typescript.pdf",
  previewImagePath = DEFAULT_PREVIEW_IMAGE_PATH,
}: ResumeActionsProps) {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const zoomRef = useRef(1)
  const draggingRef = useRef(false)
  const offsetRef = useRef({ x: 0, y: 0 })
  const dragStartRef = useRef({ x: 0, y: 0, originX: 0, originY: 0 })

  const applyTransform = () => {
    if (!imageRef.current) return
    const { x, y } = offsetRef.current
    imageRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoomRef.current})`
  }

  const scheduleTransform = () => {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(() => {
      applyTransform()
      rafRef.current = null
    })
  }

  useEffect(() => {
    zoomRef.current = zoom
    if (zoom <= 1) {
      offsetRef.current = { x: 0, y: 0 }
      draggingRef.current = false
      setIsDragging(false)
    }
    scheduleTransform()
  }, [zoom])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setZoom(1)
      offsetRef.current = { x: 0, y: 0 }
      draggingRef.current = false
      setIsDragging(false)
    }
  }

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.4))
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 1))

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (zoom <= 1) return
    event.preventDefault()
    draggingRef.current = true
    setIsDragging(true)
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      originX: offsetRef.current.x,
      originY: offsetRef.current.y,
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingRef.current || zoom <= 1) return

    const dx = event.clientX - dragStartRef.current.x
    const dy = event.clientY - dragStartRef.current.y

    offsetRef.current = {
      x: dragStartRef.current.originX + dx,
      y: dragStartRef.current.originY + dy,
    }
    scheduleTransform()
  }

  const handleMouseUp = () => {
    draggingRef.current = false
    setIsDragging(false)
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button asChild variant={"outline"} className="h-11 px-6 rounded-full text-sm shadow-md transition sm:px-8 sm:text-base hover:text-primary">
        <a href={pdfPath} download={fileName}>
          Download Resume
        </a>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label="Preview resume"
        onClick={() => setOpen(true)}
        className="text-muted-foreground"
      >
        <Eye className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange} >
        {open ? (
          <DialogContent className="max-w-3xl p-4 sm:p-6 border border-muted-foreground/40 ">
            <DialogHeader className="flex-row items-center justify-start gap-3 pr-10">
              <DialogTitle className="mr-auto">Resume Preview</DialogTitle>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={zoomOut}
                  aria-label="Zoom out"
                  disabled={zoom <= 1}
                >
                  <ZoomOut className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={zoomIn}
                  aria-label="Zoom in"
                  disabled={zoom >= 2.4}
                >
                  <ZoomIn className="size-4" />
                </Button>
              </div>
            </DialogHeader>
            <div
              className={cn(
                "relative h-[80vh] overflow-hidden rounded-md border border-border/50 bg-background",
                zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
              )}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={previewImagePath}
                alt="CV preview"
                loading="lazy"
                draggable={false}
                className={cn(
                  "h-full w-full select-none object-contain will-change-transform rounded-2xl",
                  isDragging ? "transition-none" : "transition-transform duration-200 ease-out"
                )}
                style={{ transform: `translate3d(0px, 0px, 0) scale(${zoom})` }}
              />
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  )
}
