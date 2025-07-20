
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Scissors, 
  Shield, 
  AlertTriangle,
  Info,
  Ruler
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SafeZonesOverlayProps {
  isVisible: boolean;
  canvasWidth: number;
  canvasHeight: number;
  gridRows: number;
  gridCols: number;
  bleedSize?: number; // in mm
  safeZoneSize?: number; // in mm
}

export function SafeZonesOverlay({ 
  isVisible, 
  canvasWidth, 
  canvasHeight, 
  gridRows, 
  gridCols,
  bleedSize = 3,
  safeZoneSize = 3 
}: SafeZonesOverlayProps) {
  const [showBleed, setShowBleed] = React.useState(true);
  const [showSafeZone, setShowSafeZone] = React.useState(true);
  const [showCutLines, setShowCutLines] = React.useState(false);
  const [showGridGuides, setShowGridGuides] = React.useState(true);
  const [isControlsVisible, setIsControlsVisible] = React.useState(false);

  // Convert mm to pixels (assuming 96 DPI)
  const mmToPx = (mm: number) => (mm * 96) / 25.4;

  const bleedPx = mmToPx(bleedSize);
  const safeZonePx = mmToPx(safeZoneSize);

  if (!isVisible) return null;

  return (
    <TooltipProvider>
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Bleed Area */}
        {showBleed && (
          <div 
            className="absolute border-2 border-red-500 border-dashed opacity-60"
            style={{
              top: -bleedPx,
              left: -bleedPx,
              right: -bleedPx,
              bottom: -bleedPx,
              width: canvasWidth + (bleedPx * 2),
              height: canvasHeight + (bleedPx * 2),
            }}
          >
            {/* Bleed Labels */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-red-500 bg-black/50 px-2 py-1 rounded">
              {bleedSize}mm Bleed
            </div>
            <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs font-mono text-red-500 bg-black/50 px-2 py-1 rounded">
              Bleed Zone
            </div>
          </div>
        )}

        {/* Safe Zone */}
        {showSafeZone && (
          <>
            {Array.from({ length: gridRows }).map((_, rowIndex) =>
              Array.from({ length: gridCols }).map((_, colIndex) => {
                const cellWidth = canvasWidth / gridCols;
                const cellHeight = canvasHeight / gridRows;
                const cellX = colIndex * cellWidth;
                const cellY = rowIndex * cellHeight;

                return (
                  <div
                    key={`safe-${rowIndex}-${colIndex}`}
                    className="absolute border-2 border-blue-500 border-dashed opacity-60"
                    style={{
                      left: cellX + safeZonePx,
                      top: cellY + safeZonePx,
                      width: cellWidth - (safeZonePx * 2),
                      height: cellHeight - (safeZonePx * 2),
                    }}
                  >
                    {rowIndex === 0 && colIndex === 0 && (
                      <div className="absolute -top-6 left-0 text-xs font-mono text-blue-500 bg-black/50 px-2 py-1 rounded whitespace-nowrap">
                        {safeZoneSize}mm Safe Zone
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {/* Cut Lines */}
        {showCutLines && (
          <>
            {/* Vertical cut lines */}
            {Array.from({ length: gridCols + 1 }).map((_, index) => (
              <div
                key={`v-cut-${index}`}
                className="absolute w-0.5 bg-yellow-500 opacity-80"
                style={{
                  left: (index * canvasWidth) / gridCols,
                  top: -bleedPx,
                  height: canvasHeight + (bleedPx * 2),
                }}
              />
            ))}
            
            {/* Horizontal cut lines */}
            {Array.from({ length: gridRows + 1 }).map((_, index) => (
              <div
                key={`h-cut-${index}`}
                className="absolute h-0.5 bg-yellow-500 opacity-80"
                style={{
                  top: (index * canvasHeight) / gridRows,
                  left: -bleedPx,
                  width: canvasWidth + (bleedPx * 2),
                }}
              />
            ))}
          </>
        )}

        {/* Grid Guides */}
        {showGridGuides && (
          <>
            {/* Vertical grid lines */}
            {Array.from({ length: gridCols - 1 }).map((_, index) => (
              <div
                key={`v-grid-${index}`}
                className="absolute w-px bg-white/30"
                style={{
                  left: ((index + 1) * canvasWidth) / gridCols,
                  top: 0,
                  height: canvasHeight,
                }}
              />
            ))}
            
            {/* Horizontal grid lines */}
            {Array.from({ length: gridRows - 1 }).map((_, index) => (
              <div
                key={`h-grid-${index}`}
                className="absolute h-px bg-white/30"
                style={{
                  top: ((index + 1) * canvasHeight) / gridRows,
                  left: 0,
                  width: canvasWidth,
                }}
              />
            ))}
          </>
        )}

        {/* Controls Panel */}
        <div className="absolute top-4 left-4 pointer-events-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsControlsVisible(!isControlsVisible)}
                className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
              >
                {isControlsVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isControlsVisible ? 'Hide' : 'Show'} safe zone controls</p>
            </TooltipContent>
          </Tooltip>

          {isControlsVisible && (
            <Card className="mt-2 w-64 bg-black/80 border-gray-600">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-white flex items-center gap-2">
                    <Shield className="h-3 w-3 text-blue-500" />
                    Safe Zone
                  </Label>
                  <Switch
                    checked={showSafeZone}
                    onCheckedChange={setShowSafeZone}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm text-white flex items-center gap-2">
                    <Scissors className="h-3 w-3 text-red-500" />
                    Bleed Area
                  </Label>
                  <Switch
                    checked={showBleed}
                    onCheckedChange={setShowBleed}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm text-white flex items-center gap-2">
                    <Scissors className="h-3 w-3 text-yellow-500" />
                    Cut Lines
                  </Label>
                  <Switch
                    checked={showCutLines}
                    onCheckedChange={setShowCutLines}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm text-white flex items-center gap-2">
                    <Ruler className="h-3 w-3 text-white" />
                    Grid Guides
                  </Label>
                  <Switch
                    checked={showGridGuides}
                    onCheckedChange={setShowGridGuides}
                  />
                </div>

                <Separator className="bg-gray-600" />

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs text-gray-300">
                    <Info className="h-3 w-3 mt-0.5 text-blue-400" />
                    <div>
                      <p className="font-medium text-white">Design Guidelines:</p>
                      <ul className="mt-1 space-y-1">
                        <li>• Keep text inside safe zone</li>
                        <li>• Extend backgrounds to bleed area</li>
                        <li>• Avoid important elements near cut lines</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-600" />

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Bleed:</span>
                    <span className="font-mono">{bleedSize}mm</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Safe Zone:</span>
                    <span className="font-mono">{safeZoneSize}mm</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Grid:</span>
                    <span className="font-mono">{gridCols}×{gridRows}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Corner Markers */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white/50" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white/50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white/50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white/50" />
      </div>
    </TooltipProvider>
  );
}

export function SafeZonesToggle({ 
  isVisible, 
  onToggle 
}: { 
  isVisible: boolean; 
  onToggle: (visible: boolean) => void; 
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isVisible ? "default" : "outline"}
            size="sm"
            onClick={() => onToggle(!isVisible)}
            className="h-8 gap-2"
          >
            {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            <span className="text-xs">Safe Zones</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isVisible ? 'Hide' : 'Show'} print guidelines</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
