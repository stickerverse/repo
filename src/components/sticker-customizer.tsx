
'use client';

import { useState } from 'react';
import type { FileWithPath } from 'react-dropzone';
import { ProductSelector } from '@/components/product-selector';
import { ShapeSelector } from '@/components/shape-selector';
import { MaterialSelector } from '@/components/material-selector';
import { FinishSelector } from '@/components/finish-selector';
import { SizeSelector, type SizeOption as SheetSizeOption } from '@/components/size-selector';
import { QuantitySelector } from '@/components/quantity-selector';
import { StickerCanvas, type GridOption, type FileWithPreview } from './sticker-canvas';
import { GridSelector, type GridLayout } from './grid-selector';
import { Label } from './ui/label';
import type { StickerShape } from './sticker-studio';
import { Card, CardContent } from './ui/card';
import { LaminationSelector } from './lamination-selector';
import { GradientBorderButton } from './ui/gradient-border-button';
import { Upload } from 'lucide-react';

export default function StickerCustomizer() {
  const [product, setProduct] = useState('Die Cut Sticker');
  const [lamination, setLamination] = useState('No');
  const [shape, setShape] = useState<StickerShape>('Contour Cut');
  const [material, setMaterial] = useState('Vinyl');
  const [finish, setFinish] = useState('Glossy');
  const [size, setSize] = useState('2" x 2"');
  const [quantity, setQuantity] = useState('55');
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [sheetSizeOption, setSheetSizeOption] = useState<SheetSizeOption>('A4');
  const [gridOption, setGridOption] = useState<GridOption>(12);
  const [gridLayout, setGridLayout] = useState<GridLayout>({ rows: 3, cols: 4, spacing: 5, margin: 10, total: 12 });


  return (
    <div className="w-full max-w-none">
      <div className="p-1 rounded-lg mb-8 shadow-2xl shadow-cyan-500/20">
        <Card className="bg-slate-950/80 backdrop-blur-sm border-0">
          <CardContent className="p-6 max-w-7xl mx-auto">
            <StickerCanvas 
              files={files} 
              setFiles={setFiles} 
              sizeOption={sheetSizeOption}
              gridOption={gridOption}
              gridLayout={gridLayout}
              product={product}
              shape={shape}
            />
          </CardContent>
        </Card>
      </div>

      <div className="animated-gradient-border p-1 rounded-lg shadow-2xl shadow-cyan-500/20">
        <Card className="bg-slate-950/80 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-12 gap-x-6 gap-y-8 max-w-7xl mx-auto">
              <div className="col-span-12 md:col-span-4 space-y-6">
                <ProductSelector value={product} onValueChange={setProduct} />
                {product === 'Sticker Sheet' ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Grid Layout</Label>
                      <GridSelector 
                        maxCols={8}
                        maxRows={8}
                        value={gridOption}
                        onValueChange={(value) => setGridOption(value as GridOption)}
                        onLayoutChange={(layout) => setGridLayout(layout)}
                      />
                    </div>
                    <ShapeSelector value={shape} onValueChange={(value: string) => setShape(value as StickerShape)} />
                  </>
                ) : (
                  <>
                    <LaminationSelector value={lamination} onValueChange={setLamination} />
                    <ShapeSelector value={shape} onValueChange={(value: string) => setShape(value as StickerShape)} />
                  </>
                 )}
              </div>
              <div className="col-span-12 md:col-span-4 space-y-6">
                  <MaterialSelector value={material} onValueChange={setMaterial} />
                  <FinishSelector value={finish} onValueChange={setFinish} />
              </div>
              <div className="col-span-12 md:col-span-4 space-y-6">
                  {product === 'Sticker Sheet' ? (
                    <>
                      <SizeSelector
                        value={sheetSizeOption}
                        onValueChange={(value: string) => setSheetSizeOption(value as SheetSizeOption)}
                        product="Sticker Sheet"
                      />
                      <QuantitySelector value={quantity} onValueChange={setQuantity} />
                    </>
                  ) : (
                    <>
                      <SizeSelector value={size} onValueChange={setSize} product={product} />
                      <QuantitySelector value={quantity} onValueChange={setQuantity} />
                    </>
                  )}
              </div>

              <div className="col-span-12 flex justify-end">
                  <div className="w-full md:w-1/4">
                      <GradientBorderButton 
                          size="lg"
                          className="w-full text-lg font-bold"
                          onClick={() => document.getElementById('file-upload-input')?.click()}
                      >
                          <Upload className="mr-2 h-5 w-5" />
                          Upload file
                      </GradientBorderButton>
                  </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
