'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { StickerShape } from './sticker-studio';

type ShapeSelectorProps = {
  value: StickerShape;
  onValueChange: (value: StickerShape) => void;
};

export function ShapeSelector({ value, onValueChange }: ShapeSelectorProps) {
  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-xl font-headline">Shape</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <RadioGroup value={value} onValueChange={(v) => onValueChange(v as StickerShape)} className="space-y-3">
          <div className="flex items-center space-x-3 p-4 rounded-md border border-border hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="Square" id="shape-square" />
            <Label htmlFor="shape-square" className="text-base font-normal flex-1 cursor-pointer">Square</Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-md border border-border hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="Circle" id="shape-circle" />
            <Label htmlFor="shape-circle" className="text-base font-normal flex-1 cursor-pointer">Circle</Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-md border border-primary bg-primary/10 ring-2 ring-primary/50">
            <RadioGroupItem value="Custom" id="shape-custom" />
            <Label htmlFor="shape-custom" className="text-base font-medium text-primary-foreground flex-1 cursor-pointer">Custom</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
