
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { GradientBorderButton } from './ui/gradient-border-button';

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

  return (
    <Card
      className="relative bg-card/50 backdrop-blur-sm p-1 animated-gradient-border"
    >
      <div className="bg-card rounded-md p-6">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12">
            <div className="md:col-span-4">
              <ShapeSelector value={shape} onValueChange={setShape} />
            </div>
            <div className="md:col-span-4">
              <MaterialSelector value={material} onValueChange={setMaterial} />
            </div>
            <div className="md:col-span-4">
              <FinishPricingSelector value={finish} onValueChange={setFinish} />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <GradientBorderButton 
              size="lg" 
              className="w-full text-lg font-bold" 
              onClick={onUploadClick}
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload your artwork
            </GradientBorderButton>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
