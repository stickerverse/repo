
'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Grid3X3, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import type { SizeOption } from './size-selector';
import type { GridOption } from './sticker-canvas';

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
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Sheet Size</Label>
        <div className="flex gap-2">
          <Button
            variant={sizeOption === 'Vertical Sheet' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setSizeOption('Vertical Sheet')}
            className="flex items-center gap-2 flex-1"
          >
            <RectangleVertical className="h-4 w-4" />
            Vertical
          </Button>
          <Button
            variant={sizeOption === 'Horizontal Sheet' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setSizeOption('Horizontal Sheet')}
            className="flex items-center gap-2 flex-1"
          >
            <RectangleHorizontal className="h-4 w-4" />
            Horizontal
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Grid Layout</Label>
        <div className="grid grid-cols-3 gap-2">
          {([4, 6, 9, 12, 16] as GridOption[]).map((count) => (
            <Button
              key={count}
              variant={gridOption === count ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setGridOption(count)}
              className="flex items-center gap-2 min-w-[60px]"
            >
              <Grid3X3 className="h-3 w-3" />
              {`${count}`}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
