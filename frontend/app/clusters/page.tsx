"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { RotateCcw, Layers, Circle, X, Filter } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

// Mock cluster data
const generateClusterData = () => {
  const clusters = []
  for (let i = 0; i < 500; i++) {
    clusters.push({
      id: i,
      x: Math.random() * 800 - 400,
      y: Math.random() * 600 - 300,
      cluster: Math.floor(Math.random() * 8),
      relevanceScore: Math.random() * 10,
      interestScore: Math.random() * 10,
      title: `Research Item ${i + 1}`,
      type: Math.random() > 0.5 ? "Paper" : "Repo",
      tags: ["AI", "ML", "NLP", "Vision"].slice(0, Math.floor(Math.random() * 3) + 1),
    })
  }
  return clusters
}

const clusterColors = ["#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#EC4899", "#EF4444", "#F97316", "#EAB308"]

export default function ClustersPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [pointSize, setPointSize] = useState([6])
  const [showDensity, setShowDensity] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 })
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 })
  const [selectedPoints, setSelectedPoints] = useState<number[]>([])
  const [hoveredPoint, setHoveredPoint] = useState<any>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 })

  const [clusterData] = useState(() => generateClusterData())

  // Canvas drawing function
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.fillStyle = "#0E1116"
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Apply transformations
    ctx.save()
    ctx.translate(rect.width / 2 + pan.x, rect.height / 2 + pan.y)
    ctx.scale(zoom, zoom)

    // Draw density overlay if enabled
    if (showDensity) {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 200)
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)")
      gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.1)")
      gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(-400, -300, 800, 600)
    }

    // Draw points
    clusterData.forEach((point, index) => {
      const isSelected = selectedPoints.includes(index)
      const isHovered = hoveredPoint?.id === point.id

      const size = pointSize[0] * (0.5 + point.relevanceScore / 20)
      const color = clusterColors[point.cluster]

      ctx.beginPath()
      ctx.arc(point.x, point.y, size, 0, 2 * Math.PI)

      if (isSelected) {
        ctx.strokeStyle = "#FFFFFF"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      if (isHovered) {
        ctx.fillStyle = color
        ctx.globalAlpha = 1
      } else {
        ctx.fillStyle = color
        ctx.globalAlpha = 0.7
      }

      ctx.fill()
      ctx.globalAlpha = 1
    })

    // Draw selection rectangle
    if (isSelecting) {
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.strokeRect(
        selectionStart.x,
        selectionStart.y,
        selectionEnd.x - selectionStart.x,
        selectionEnd.y - selectionStart.y,
      )
      ctx.setLineDash([])
    }

    ctx.restore()
  }, [
    clusterData,
    zoom,
    pan,
    pointSize,
    showDensity,
    isSelecting,
    selectionStart,
    selectionEnd,
    selectedPoints,
    hoveredPoint,
  ])

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left - rect.width / 2 - pan.x
    const y = e.clientY - rect.top - rect.height / 2 - pan.y

    if (e.shiftKey) {
      // Start lasso selection
      setIsSelecting(true)
      setSelectionStart({ x: x / zoom, y: y / zoom })
      setSelectionEnd({ x: x / zoom, y: y / zoom })
    } else {
      // Start panning
      setIsDragging(true)
      setLastPan({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    setMousePos({ x: e.clientX, y: e.clientY })

    const x = e.clientX - rect.left - rect.width / 2 - pan.x
    const y = e.clientY - rect.top - rect.height / 2 - pan.y

    if (isSelecting) {
      setSelectionEnd({ x: x / zoom, y: y / zoom })
    } else if (isDragging) {
      setPan({
        x: e.clientX - lastPan.x,
        y: e.clientY - lastPan.y,
      })
    } else {
      // Check for hover
      const worldX = x / zoom
      const worldY = y / zoom

      const hovered = clusterData.find((point) => {
        const distance = Math.sqrt((point.x - worldX) ** 2 + (point.y - worldY) ** 2)
        return distance < pointSize[0] + 5
      })

      setHoveredPoint(hovered || null)
    }
  }

  const handleMouseUp = () => {
    if (isSelecting) {
      // Complete selection
      const minX = Math.min(selectionStart.x, selectionEnd.x)
      const maxX = Math.max(selectionStart.x, selectionEnd.x)
      const minY = Math.min(selectionStart.y, selectionEnd.y)
      const maxY = Math.max(selectionStart.y, selectionEnd.y)

      const selected = clusterData
        .map((point, index) => ({ point, index }))
        .filter(({ point }) => point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY)
        .map(({ index }) => index)

      setSelectedPoints(selected)
      setIsSelecting(false)
    }
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const newZoom = Math.max(0.1, Math.min(5, zoom - e.deltaY * 0.001))
    setZoom(newZoom)
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const clearSelection = () => {
    setSelectedPoints([])
  }

  // Redraw canvas when dependencies change
  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  // Handle resize
  useEffect(() => {
    const handleResize = () => drawCanvas()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [drawCanvas])

  return (
    <MainLayout>
      <div className="flex h-full flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border bg-card p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Cluster Map</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetView} className="h-8 bg-transparent">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset View
              </Button>
              <Button
                variant={showDensity ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDensity(!showDensity)}
                className="h-8"
              >
                <Layers className="h-4 w-4 mr-1" />
                Density
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4" />
              <span className="text-sm">Point Size</span>
              <Slider value={pointSize} onValueChange={setPointSize} max={20} min={2} step={1} className="w-20" />
            </div>
            <div className="text-sm text-muted-foreground">Zoom: {(zoom * 100).toFixed(0)}%</div>
          </div>
        </div>

        {/* Selection Bar */}
        {selectedPoints.length > 0 && (
          <div className="flex items-center justify-between bg-primary/10 border-b border-border p-3">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{selectedPoints.length} items selected</Badge>
              <Button size="sm" variant="default">
                <Filter className="h-4 w-4 mr-1" />
                Filter in Search
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-1 relative">
          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
            />

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <Card
                className="absolute z-10 p-3 max-w-xs pointer-events-none"
                style={{
                  left: mousePos.x + 10,
                  top: mousePos.y - 10,
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={hoveredPoint.type === "Paper" ? "default" : "secondary"}>{hoveredPoint.type}</Badge>
                    <span className="text-sm font-medium">{hoveredPoint.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      R: {hoveredPoint.relevanceScore.toFixed(1)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      I: {hoveredPoint.interestScore.toFixed(1)}
                    </Badge>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {hoveredPoint.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Mini-map */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-card border border-border rounded-lg p-2 hidden lg:block">
            <div className="text-xs text-muted-foreground mb-1">Overview</div>
            <div className="w-full h-full bg-background rounded relative overflow-hidden">
              <div
                className="absolute bg-primary/20 border border-primary rounded"
                style={{
                  left: `${((pan.x + 200) / 400) * 100}%`,
                  top: `${((pan.y + 150) / 300) * 100}%`,
                  width: `${100 / zoom}%`,
                  height: `${100 / zoom}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute top-4 left-4 bg-card border border-border rounded-lg p-3 max-w-xs">
            <div className="text-sm space-y-1">
              <div className="font-medium">Controls:</div>
              <div className="text-muted-foreground text-xs space-y-1">
                <div>• Drag to pan</div>
                <div>• Scroll to zoom</div>
                <div>• Shift + drag to select</div>
                <div>• Hover for details</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
