'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  RotateCcw, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  Maximize2, 
  Minimize2,
  Palette,
  Filter,
  Scissors,
  Type,
  Square
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

interface StickerCellEditorProps {
  cellIndex: number;
  isVisible: boolean;
  onClose: () => void;
  file?: File & { preview?: string; scale?: number; rotation?: number };
  onUpdate: (cellIndex: number, updates: { scale?: number; rotation?: number; flip?: string; flipValue?: number; brightness?: number; fitted?: boolean; saturation?: number; contrast?: number; borderWidth?: number }) => void;
}

export function StickerCellEditor({ 
  cellIndex, 
  isVisible, 
  onClose, 
  file, 
  onUpdate 
}: StickerCellEditorProps) {
  const [scale, setScale] = React.useState([file?.scale || 100]);
  const [rotation, setRotation] = React.useState([file?.rotation || 0]);
  const [brightness, setBrightness] = React.useState([100]);
  const [saturation, setSaturation] = React.useState([100]);
  const [contrast, setContrast] = React.useState([100]);
  const [borderWidth, setBorderWidth] = React.useState([0]);
  const [borderColor, setBorderColor] = React.useState('#000000');
  const [textOverlay, setTextOverlay] = React.useState('');
  const [hasBackground, setHasBackground] = React.useState(false);
  const [maintainAspect, setMaintainAspect] = React.useState(true);

  const handleScaleChange = (value: number[]) => {
    setScale(value);
    onUpdate(cellIndex, { scale: value[0] });
  };

  const handleRotationChange = (value: number[]) => {
    setRotation(value);
    onUpdate(cellIndex, { rotation: value[0] });
  };

  const handleQuickRotate = (degrees: number) => {
    const newRotation = [(rotation[0] + degrees) % 360];
    setRotation(newRotation);
    onUpdate(cellIndex, { rotation: newRotation[0] });
  };

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    // For now, just trigger a simple flip update
    onUpdate(cellIndex, { 
      flip: direction,
      flipValue: Math.random() // Force re-render
    });
  };

  const handleReset = () => {
    setScale([100]);
    setRotation([0]);
    setBrightness([100]);
    setSaturation([100]);
    setContrast([100]);
    setBorderWidth([0]);
    onUpdate(cellIndex, { 
      scale: 100, 
      rotation: 0, 
      brightness: 100, 
      saturation: 100, 
      contrast: 100,
      borderWidth: 0 
    });
  };

  const handleFitToCell = () => {
    setScale([100]);
    onUpdate(cellIndex, { scale: 100, fitted: true });
  };

  if (!isVisible || !file) return null;

  return (
    <TooltipProvider>
      <Card className="absolute top-4 right-4 w-80 bg-card/95 backdrop-blur-sm border-border shadow-xl z-30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Edit Cell {cellIndex + 1}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Transform Controls */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <RotateCcw className="h-3 w-3" />
              Transform
            </Label>
            
            {/* Scale */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Scale</Label>
                <span className="text-xs text-muted-foreground">{scale[0]}%</span>
              </div>
              <Slider
                value={scale}
                onValueChange={handleScaleChange}
                max={200}
                min={10}
                step={5}
                className="w-full"
              />
            </div>

            {/* Rotation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Rotation</Label>
                <span className="text-xs text-muted-foreground">{rotation[0]}°</span>
              </div>
              <Slider
                value={rotation}
                onValueChange={handleRotationChange}
                max={360}
                min={0}
                step={15}
                className="w-full"
              />
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickRotate(-90)}
                      className="h-6 px-2"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Rotate left 90°</p></TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickRotate(90)}
                      className="h-6 px-2"
                    >
                      <RotateCw className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Rotate right 90°</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFlip('horizontal')}
                      className="h-6 px-2"
                    >
                      <FlipHorizontal className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Flip horizontal</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFlip('vertical')}
                      className="h-6 px-2"
                    >
                      <FlipVertical className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Flip vertical</p></TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFitToCell}
                className="h-7 px-2 text-xs"
              >
                <Maximize2 className="h-3 w-3 mr-1" />
                Fit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-7 px-2 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          <Separator />

          {/* Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-3 w-3" />
              Filters
            </Label>

            {/* Brightness */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Brightness</Label>
                <span className="text-xs text-muted-foreground">{brightness[0]}%</span>
              </div>
              <Slider
                value={brightness}
                onValueChange={setBrightness}
                max={200}
                min={0}
                step={10}
                className="w-full"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Saturation</Label>
                <span className="text-xs text-muted-foreground">{saturation[0]}%</span>
              </div>
              <Slider
                value={saturation}
                onValueChange={setSaturation}
                max={200}
                min={0}
                step={10}
                className="w-full"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Contrast</Label>
                <span className="text-xs text-muted-foreground">{contrast[0]}%</span>
              </div>
              <Slider
                value={contrast}
                onValueChange={setContrast}
                max={200}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          {/* Border & Outline */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Square className="h-3 w-3" />
              Border
            </Label>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Width</Label>
                <span className="text-xs text-muted-foreground">{borderWidth[0]}px</span>
              </div>
              <Slider
                value={borderWidth}
                onValueChange={setBorderWidth}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="w-12 h-8 p-0 border-0 rounded"
                />
                <Input
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="flex-1 h-8 text-xs font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Text Overlay */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Type className="h-3 w-3" />
              Text Overlay
            </Label>

            <Input
              value={textOverlay}
              onChange={(e) => setTextOverlay(e.target.value)}
              placeholder="Add text overlay..."
              className="h-8 text-xs"
            />
          </div>

          <Separator />

          {/* Background Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Scissors className="h-3 w-3" />
              Background
            </Label>

            <div className="flex items-center justify-between">
              <Label className="text-xs">Remove Background</Label>
              <Switch
                checked={!hasBackground}
                onCheckedChange={(checked) => setHasBackground(!checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs">Maintain Aspect Ratio</Label>
              <Switch
                checked={maintainAspect}
                onCheckedChange={setMaintainAspect}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}