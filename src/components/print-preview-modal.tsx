'use client';

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Grid3X3,
  Ruler,
  Scissors,
  FileText,
  Share2,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetData: {
    size: string;
    gridRows: number;
    gridCols: number;
    files: Array<{ preview?: string; name: string }>;
    finish: string;
    shape: string;
  };
}

export function PrintPreviewModal({ isOpen, onClose, sheetData }: PrintPreviewModalProps) {
  const [zoom, setZoom] = React.useState([100]);
  const [showGrid, setShowGrid] = React.useState(true);
  const [showCutLines, setShowCutLines] = React.useState(false);
  const [showBleed, setShowBleed] = React.useState(false);
  const [showDieCut, setShowDieCut] = React.useState(true);
  const [view3D, setView3D] = React.useState(false);

  const handleDownloadProof = () => {
    // Logic to generate and download proof PDF
    console.log('Downloading proof...');
  };

  const handleGeneratePDF = () => {
    // Logic to generate print-ready PDF
    console.log('Generating print-ready PDF...');
  };

  const getShapeClasses = (shape: string) => {
    switch (shape) {
      case 'Circle':
        return 'rounded-full';
      case 'Square':
        return 'rounded-none';
      case 'Rounded Corners':
        return 'rounded-lg';
      default:
        return 'rounded-lg';
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl h-[90vh] bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Print Preview & Mockup
            </DialogTitle>
            <DialogDescription>
              Preview how your sticker sheet will look when printed. Adjust settings and download proof or print-ready files.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 overflow-hidden">
            {/* Preview Area */}
            <div className="lg:col-span-3 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Preview:</Label>
                  <span className="text-sm text-muted-foreground">
                    {sheetData.size} • {sheetData.gridCols}×{sheetData.gridRows} • {sheetData.finish}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setZoom([Math.max(25, zoom[0] - 25)])}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomOut className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Zoom out</p></TooltipContent>
                  </Tooltip>

                  <span className="text-xs font-mono w-12 text-center">{zoom[0]}%</span>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setZoom([Math.min(200, zoom[0] + 25)])}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomIn className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Zoom in</p></TooltipContent>
                  </Tooltip>

                  <Separator orientation="vertical" className="h-6" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={view3D ? "default" : "outline"}
                        size="sm"
                        onClick={() => setView3D(!view3D)}
                        className="h-8 gap-1"
                      >
                        <RotateCw className="h-3 w-3" />
                        3D
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Toggle 3D mockup view</p></TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Main Preview Canvas */}
              <div className="flex-1 bg-gray-100 rounded-lg overflow-auto p-4 relative">
                <div 
                  className={cn(
                    "bg-white shadow-2xl mx-auto relative transition-all duration-300",
                    view3D ? "transform rotate-x-12 rotate-y-6" : "",
                  )}
                  style={{
                    width: `${(300 * zoom[0]) / 100}px`,
                    height: `${(400 * zoom[0]) / 100}px`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Bleed Area */}
                  {showBleed && (
                    <div className="absolute -inset-2 border-2 border-red-500 border-dashed opacity-50" />
                  )}

                  {/* Grid Layout */}
                  <div 
                    className="grid gap-1 h-full p-2"
                    style={{
                      gridTemplateColumns: `repeat(${sheetData.gridCols}, 1fr)`,
                      gridTemplateRows: `repeat(${sheetData.gridRows}, 1fr)`
                    }}
                  >
                    {Array.from({ length: sheetData.gridRows * sheetData.gridCols }).map((_, index) => {
                      const file = sheetData.files[index];
                      const shapeClasses = getShapeClasses(sheetData.shape);
                      
                      return (
                        <div
                          key={index}
                          className={cn(
                            'relative border border-gray-200 flex items-center justify-center overflow-hidden',
                            shapeClasses,
                            {
                              'bg-gray-50': !file?.preview,
                              'bg-white': file?.preview,
                            }
                          )}
                        >
                          {file?.preview ? (
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="text-gray-400 text-xs text-center p-1">
                              Empty
                            </div>
                          )}

                          {/* Die-cut overlay */}
                          {showDieCut && sheetData.shape === 'Contour Cut' && file?.preview && (
                            <div className="absolute inset-0 border-2 border-yellow-500 border-dashed opacity-60" />
                          )}

                          {/* Grid lines */}
                          {showGrid && (
                            <div className="absolute inset-0 border border-blue-300 opacity-30" />
                          )}

                          {/* Cut lines */}
                          {showCutLines && (
                            <>
                              <div className="absolute top-0 left-1/2 w-px h-2 bg-red-500 -translate-x-1/2 -translate-y-2" />
                              <div className="absolute bottom-0 left-1/2 w-px h-2 bg-red-500 -translate-x-1/2 translate-y-2" />
                              <div className="absolute left-0 top-1/2 h-px w-2 bg-red-500 -translate-y-1/2 -translate-x-2" />
                              <div className="absolute right-0 top-1/2 h-px w-2 bg-red-500 -translate-y-1/2 translate-x-2" />
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Sheet info overlay */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {sheetData.size}
                  </div>
                </div>

                {/* 3D Base */}
                {view3D && (
                  <div 
                    className="absolute bg-gray-300 shadow-xl"
                    style={{
                      width: `${(300 * zoom[0]) / 100}px`,
                      height: `${(400 * zoom[0]) / 100}px`,
                      transform: 'translateZ(-10px) translateY(10px)',
                      left: '50%',
                      top: '50%',
                      marginLeft: `${(-150 * zoom[0]) / 100}px`,
                      marginTop: `${(-200 * zoom[0]) / 100}px`,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Controls Panel */}
            <div className="space-y-4 overflow-auto">
              {/* View Controls */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Options
                  </Label>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Grid Lines</Label>
                      <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Cut Lines</Label>
                      <Switch checked={showCutLines} onCheckedChange={setShowCutLines} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Bleed Area</Label>
                      <Switch checked={showBleed} onCheckedChange={setShowBleed} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Die-cut Preview</Label>
                      <Switch checked={showDieCut} onCheckedChange={setShowDieCut} />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-sm">Zoom Level</Label>
                    <Slider
                      value={zoom}
                      onValueChange={setZoom}
                      max={200}
                      min={25}
                      step={25}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Print Information */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    Print Specifications
                  </Label>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sheet Size:</span>
                      <span className="font-mono">{sheetData.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Grid:</span>
                      <span className="font-mono">{sheetData.gridCols}×{sheetData.gridRows}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Stickers:</span>
                      <span className="font-mono">{sheetData.gridCols * sheetData.gridRows}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Finish:</span>
                      <span className="font-mono">{sheetData.finish}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shape:</span>
                      <span className="font-mono">{sheetData.shape}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolution:</span>
                      <span className="font-mono">300 DPI</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Options
                  </Label>

                  <div className="space-y-2">
                    <Button 
                      onClick={handleDownloadProof}
                      className="w-full justify-start h-9 gap-2"
                      variant="outline"
                    >
                      <FileText className="h-4 w-4" />
                      Download Proof PDF
                    </Button>

                    <Button 
                      onClick={handleGeneratePDF}
                      className="w-full justify-start h-9 gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Print-Ready PDF
                    </Button>

                    <Button 
                      onClick={() => {/* Share functionality */}}
                      className="w-full justify-start h-9 gap-2"
                      variant="outline"
                    >
                      <Share2 className="h-4 w-4" />
                      Share Preview
                    </Button>

                    <Button 
                      onClick={() => {/* Copy to clipboard */}}
                      className="w-full justify-start h-9 gap-2"
                      variant="outline"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
            <Button onClick={handleGeneratePDF}>
              <Download className="h-4 w-4 mr-2" />
              Export for Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

export function PrintPreviewTrigger({ 
  onOpen, 
  disabled = false 
}: { 
  onOpen: () => void; 
  disabled?: boolean; 
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onOpen}
            disabled={disabled}
            variant="outline"
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Print Preview
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Preview how your sticker sheet will look when printed</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}