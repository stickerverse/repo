'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Grid3X3, Move, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GridLayout } from './grid-selector';
import type { SizeOption as SheetSizeOption } from './size-selector';

export type StickerMode = 'grid' | 'freeform';

export type HybridStickerConfig = {
  mode: StickerMode;
  gridLayout: GridLayout;
  sheetSize: SheetSizeOption;
  freeformSettings: {
    snapToGrid: boolean;
    gridSize: number;
    showGuides: boolean;
  };
};

type HybridStickerSelectorProps = {
  config: HybridStickerConfig;
  onConfigChange: (config: HybridStickerConfig) => void;
};

const gridPresets: GridLayout[] = [
  { rows: 3, cols: 3, spacing: 5, margin: 10, total: 9, name: "3x3 Classic" },
  { rows: 4, cols: 4, spacing: 4, margin: 8, total: 16, name: "4x4 Square" },
  { rows: 3, cols: 4, spacing: 5, margin: 10, total: 12, name: "3x4 Standard" },
  { rows: 4, cols: 5, spacing: 3, margin: 8, total: 20, name: "4x5 Dense" },
  { rows: 2, cols: 4, spacing: 8, margin: 15, total: 8, name: "2x4 Large" },
  { rows: 5, cols: 5, spacing: 4, margin: 10, total: 25, name: "5x5 Grid" },
];

const sheetSizes: SheetSizeOption[] = ['A4', 'A3', 'Letter', 'Legal', 'Tabloid', 'Vertical Sheet'];

export function HybridStickerSelector({ config, onConfigChange }: HybridStickerSelectorProps) {
  const [activeMode, setActiveMode] = useState<StickerMode>(config.mode);

  const handleModeChange = (mode: StickerMode) => {
    setActiveMode(mode);
    onConfigChange({
      ...config,
      mode
    });
  };

  const handleGridPresetSelect = (preset: GridLayout) => {
    onConfigChange({
      ...config,
      gridLayout: preset
    });
  };

  const handleCustomGridChange = (field: keyof GridLayout, value: number) => {
    const updatedLayout = {
      ...config.gridLayout,
      [field]: value
    };
    
    if (field === 'rows' || field === 'cols') {
      updatedLayout.total = updatedLayout.rows * updatedLayout.cols;
    }

    onConfigChange({
      ...config,
      gridLayout: updatedLayout
    });
  };

  const handleSheetSizeChange = (size: SheetSizeOption) => {
    onConfigChange({
      ...config,
      sheetSize: size
    });
  };

  const handleFreeformSettingChange = (field: keyof typeof config.freeformSettings, value: boolean | number) => {
    onConfigChange({
      ...config,
      freeformSettings: {
        ...config.freeformSettings,
        [field]: value
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          Sticker Placement System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Placement Mode</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={activeMode === 'grid' ? 'default' : 'outline'}
              onClick={() => handleModeChange('grid')}
              className="flex items-center gap-2"
            >
              <Grid3X3 className="h-4 w-4" />
              Grid Mode
            </Button>
            <Button
              variant={activeMode === 'freeform' ? 'default' : 'outline'}
              onClick={() => handleModeChange('freeform')}
              className="flex items-center gap-2"
            >
              <Move className="h-4 w-4" />
              Freeform Mode
            </Button>
          </div>
        </div>

        {/* Sheet Size */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Sheet Size</Label>
          <div className="grid grid-cols-3 gap-2">
            {sheetSizes.map((size) => (
              <Button
                key={size}
                variant={config.sheetSize === size ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSheetSizeChange(size)}
                className="text-xs"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <Tabs value={activeMode} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">Grid Settings</TabsTrigger>
            <TabsTrigger value="freeform">Freeform Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-4 mt-4">
            {/* Grid Presets */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Layouts</Label>
              <div className="grid grid-cols-2 gap-2">
                {gridPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant={config.gridLayout.total === preset.total ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleGridPresetSelect(preset)}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <span className="text-xs font-medium">{preset.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {preset.cols}×{preset.rows}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Grid Controls */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Custom Layout</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Rows: {config.gridLayout.rows}</Label>
                  <Slider
                    value={[config.gridLayout.rows]}
                    onValueChange={([value]) => handleCustomGridChange('rows', value)}
                    min={1}
                    max={8}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Columns: {config.gridLayout.cols}</Label>
                  <Slider
                    value={[config.gridLayout.cols]}
                    onValueChange={([value]) => handleCustomGridChange('cols', value)}
                    min={1}
                    max={8}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Spacing: {config.gridLayout.spacing}mm</Label>
                <Slider
                  value={[config.gridLayout.spacing]}
                  onValueChange={([value]) => handleCustomGridChange('spacing', value)}
                  min={0}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Margin: {config.gridLayout.margin}mm</Label>
                <Slider
                  value={[config.gridLayout.margin]}
                  onValueChange={([value]) => handleCustomGridChange('margin', value)}
                  min={5}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="text-center text-sm text-muted-foreground pt-2 border-t">
                Total: {config.gridLayout.total} stickers
              </div>
            </div>
          </TabsContent>

          <TabsContent value="freeform" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Snap to Grid</Label>
                <Switch
                  checked={config.freeformSettings.snapToGrid}
                  onCheckedChange={(checked) => handleFreeformSettingChange('snapToGrid', checked)}
                />
              </div>

              {config.freeformSettings.snapToGrid && (
                <div className="space-y-2">
                  <Label className="text-xs">Grid Size: {config.freeformSettings.gridSize}px</Label>
                  <Slider
                    value={[config.freeformSettings.gridSize]}
                    onValueChange={([value]) => handleFreeformSettingChange('gridSize', value)}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label className="text-sm">Show Alignment Guides</Label>
                <Switch
                  checked={config.freeformSettings.showGuides}
                  onCheckedChange={(checked) => handleFreeformSettingChange('showGuides', checked)}
                />
              </div>

              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <p className="font-medium mb-1">Freeform Mode Tips:</p>
                <ul className="text-xs space-y-1">
                  <li>• Drag stickers anywhere on the canvas</li>
                  <li>• Hold Shift to select multiple stickers</li>
                  <li>• Right-click for context menu options</li>
                  <li>• Use Ctrl+Z/Y for undo/redo</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}