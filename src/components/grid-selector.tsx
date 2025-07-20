
'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Grid3X3, Wand2, Settings, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import type { GridOption } from './sticker-canvas';

export type GridLayout = {
  rows: number;
  cols: number;
  spacing: number;
  margin: number;
  total: number;
  name?: string;
};

type GridSelectorProps = {
  maxRows?: number;
  maxCols?: number;
  value: GridOption;
  onValueChange: (value: GridOption) => void;
  onLayoutChange?: (layout: GridLayout) => void;
};

const presetLayouts: GridLayout[] = [
  { rows: 3, cols: 3, spacing: 5, margin: 10, total: 9, name: "3x3 Classic" },
  { rows: 4, cols: 5, spacing: 3, margin: 8, total: 20, name: "4x5 Dense" },
  { rows: 6, cols: 8, spacing: 2, margin: 5, total: 48, name: "6x8 Micro" },
  { rows: 2, cols: 4, spacing: 8, margin: 15, total: 8, name: "2x4 Large" },
  { rows: 5, cols: 5, spacing: 4, margin: 10, total: 25, name: "5x5 Square" },
];

export function GridSelector({ maxRows = 8, maxCols = 8, value, onValueChange, onLayoutChange }: GridSelectorProps) {
  const [hovered, setHovered] = useState({ row: -1, col: -1 });
  const [isOpen, setIsOpen] = useState(false);
  const [customRows, setCustomRows] = useState(3);
  const [customCols, setCustomCols] = useState(3);
  const [spacing, setSpacing] = useState([5]);
  const [margin, setMargin] = useState([10]);
  const [activeTab, setActiveTab] = useState("presets");

  const handleSelect = (row: number, col: number) => {
    const total = (row + 1) * (col + 1);
    onValueChange(total);
    onLayoutChange?.({
      rows: row + 1,
      cols: col + 1,
      spacing: spacing[0],
      margin: margin[0],
      total
    });
    setIsOpen(false);
  };

  const handlePresetSelect = (layout: GridLayout) => {
    onValueChange(layout.total);
    onLayoutChange?.(layout);
    setSpacing([layout.spacing]);
    setMargin([layout.margin]);
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    const total = customRows * customCols;
    onValueChange(total);
    onLayoutChange?.({
      rows: customRows,
      cols: customCols,
      spacing: spacing[0],
      margin: margin[0],
      total
    });
    setIsOpen(false);
  };

  const handleAutoFit = () => {
    const total = Math.floor((maxRows * maxCols) * 0.8);
    const rows = Math.ceil(Math.sqrt(total));
    const cols = Math.ceil(total / rows);
    
    onValueChange(total);
    onLayoutChange?.({
      rows,
      cols,
      spacing: 3,
      margin: 8,
      total
    });
    setIsOpen(false);
  };
  
  const getRowsFromValue = (v: GridOption) => {
    if (v <= maxCols) return 1;
    for (let i = Math.floor(Math.sqrt(v)); i > 0; i--) {
        if (v % i === 0 && (v/i) <= maxCols) {
            return i;
        }
    }
    return Math.ceil(v / maxCols);
  }

  const selectedRows = getRowsFromValue(value);
  const selectedCols = Math.ceil(value / selectedRows);


  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal bg-card/50 hover:bg-card/80 border-border">
          <Grid3X3 className="mr-2 h-4 w-4 text-accent" />
          <span className="text-foreground">{`${selectedCols} x ${selectedRows} (${value} stickers)`}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 bg-card border-border" align="start">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="presets" className="text-xs">Presets</TabsTrigger>
            <TabsTrigger value="custom" className="text-xs">Custom</TabsTrigger>
            <TabsTrigger value="visual" className="text-xs">Visual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Quick Layouts</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAutoFit}
                className="h-7 px-2 text-xs"
              >
                <Wand2 className="w-3 h-3 mr-1" />
                Auto-fit
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {presetLayouts.map((layout) => (
                <div
                  key={layout.name}
                  onClick={() => handlePresetSelect(layout)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border",
                    "hover:bg-accent/10 hover:border-accent/40 border-border"
                  )}
                >
                  <div>
                    <div className="font-medium text-sm text-foreground">{layout.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {layout.cols}×{layout.rows} • {layout.total} stickers
                    </div>
                  </div>
                  <div className="text-xs text-accent font-mono">
                    {layout.spacing}mm gap
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rows" className="text-sm">Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min="1"
                  max={maxRows}
                  value={customRows}
                  onChange={(e) => setCustomRows(Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cols" className="text-sm">Columns</Label>
                <Input
                  id="cols"
                  type="number"
                  min="1"
                  max={maxCols}
                  value={customCols}
                  onChange={(e) => setCustomCols(Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm flex items-center justify-between">
                  Spacing
                  <span className="text-xs text-muted-foreground">{spacing[0]}mm</span>
                </Label>
                <Slider
                  value={spacing}
                  onValueChange={setSpacing}
                  max={20}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm flex items-center justify-between">
                  Margin
                  <span className="text-xs text-muted-foreground">{margin[0]}mm</span>
                </Label>
                <Slider
                  value={margin}
                  onValueChange={setMargin}
                  max={30}
                  min={5}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Total: {customRows * customCols} stickers
              </div>
              <Button onClick={handleCustomApply} size="sm" className="h-7">
                Apply
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="visual" className="p-4">
            <div className="space-y-3">
              <Label className="text-sm">Visual Grid Selector</Label>
              <div 
                className="grid gap-1 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
                  maxWidth: `${maxCols * 20}px`
                }}
                onMouseLeave={() => setHovered({ row: -1, col: -1 })}
              >
                {Array.from({ length: maxRows }).map((_, rowIndex) =>
                  Array.from({ length: maxCols }).map((_, colIndex) => {
                    const isHighlighted = rowIndex <= hovered.row && colIndex <= hovered.col;
                    const isSelected = rowIndex < selectedRows && colIndex < selectedCols;
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={cn(
                          "w-4 h-4 border border-border rounded-sm transition-colors cursor-pointer",
                          isHighlighted ? "bg-accent" : "bg-card/50",
                          isSelected && !isHighlighted && "bg-accent/50",
                        )}
                        onMouseEnter={() => setHovered({ row: rowIndex, col: colIndex })}
                        onClick={() => handleSelect(rowIndex, colIndex)}
                      />
                    );
                  })
                )}
              </div>
              <div className="text-center text-xs text-muted-foreground">
                {hovered.row !== -1
                  ? `${hovered.col + 1} × ${hovered.row + 1} (${(hovered.col + 1) * (hovered.row + 1)} stickers)`
                  : 'Hover to preview • Click to select'}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
