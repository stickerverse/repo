'use client';

import { useRef, type MouseEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

import { ShapeSelector } from './shape-selector';
import { MaterialSelector } from './material-selector';
import { FinishPricingSelector } from './finish-pricing-selector';

import type { StickerShape, StickerMaterial, StickerFinish } from './sticker-studio';

type PropertiesMenuProps = {
  shape: StickerShape;
  setShape: (shape: StickerShape) => void;
  material: StickerMaterial;
  setMaterial: (material: StickerMaterial) => void;
  finish: StickerFinish;
  setFinish: (finish: StickerFinish) => void;
  onUploadClick: () => void;
};

export function PropertiesMenu({
  shape,
  setShape,
  material,
  setMaterial,
  finish,
  setFinish,
  onUploadClick,
}: PropertiesMenuProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <Card
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative bg-card/50 backdrop-blur-sm overflow-hidden p-1 animated-gradient-border"
    >
      <div className="bg-card rounded-md p-6">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <ShapeSelector value={shape} onValueChange={setShape} />
            </div>
            <div className="md:col-span-5">
              <MaterialSelector value={material} onValueChange={setMaterial} />
            </div>
            <div className="md:col-span-4">
              <FinishPricingSelector value={finish} onValueChange={setFinish} />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <Button size="lg" className="w-full text-lg font-bold" onClick={onUploadClick}>
              <Upload className="mr-2 h-5 w-5" />
              Upload your artwork
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
