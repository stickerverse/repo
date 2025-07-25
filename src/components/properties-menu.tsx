
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { GradientBorderButton } from './ui/gradient-border-button';
import { BackgroundGradientAnimation } from './ui/background-gradient-animation';

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
    <div className="rounded-lg overflow-hidden">
      <BackgroundGradientAnimation>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12">
            <div className="md:col-span-3">
              <ShapeSelector 
                value={shape} 
                onValueChange={(value: string) => setShape(value as StickerShape)} 
              />
            </div>
            <div className="md:col-span-6">
              <MaterialSelector 
                value={material} 
                onValueChange={(value: string) => setMaterial(value as StickerMaterial)} 
              />
            </div>
            <div className="md:col-span-3">
              <FinishPricingSelector value={finish} onValueChange={setFinish} />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/20">
            <GradientBorderButton 
              size="lg" 
              className="w-full text-lg font-bold" 
              onClick={onUploadClick}
              containerClassName="bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload your artwork
            </GradientBorderButton>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </div>
  );
}
