
'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Grid3X3, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { SizeSelector, type SizeOption } from './size-selector';
import type { GridOption } from './sticker-canvas';
import { GridSelector } from './grid-selector';

type SheetOptionsSelectorProps = {
  sizeOption: SizeOption;
  setSizeOption: (value: SizeOption) => void;
  gridOption: GridOption;
  setGridOption: (value: GridOption) => void;
};

export function SheetOptionsSelector({
  sizeOption,
  setSizeOption,
  gridOption,
  setGridOption,
}: SheetOptionsSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Enhanced Size Selector with A4, US Letter, etc. */}
      <SizeSelector
        value={sizeOption}
        onValueChange={(value: string) => setSizeOption(value as SizeOption)}
        product="Sticker Sheet"
      />

      {/* Enhanced Grid Selector with presets */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Grid Layout</Label>
        <GridSelector 
          maxCols={8}
          maxRows={8}
          value={gridOption}
          onValueChange={(value) => setGridOption(value as GridOption)}
        />
      </div>
    </div>
  );
}
