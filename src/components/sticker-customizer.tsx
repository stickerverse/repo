'use client';

import { useState } from 'react';
import type { FileWithPath } from 'react-dropzone';
import { ProductSelector } from '@/components/product-selector';
import { ShapeSelector } from '@/components/shape-selector';
import { MaterialSelector } from '@/components/material-selector';
import { FinishSelector } from '@/components/finish-selector';
import { SizeSelector } from '@/components/size-selector';
import { QuantitySelector } from '@/components/quantity-selector';
import { Button } from './ui/button';
import { StickerCanvas } from './sticker-canvas';
import { Card, CardContent } from './ui/card';

export default function StickerCustomizer() {
  const [product, setProduct] = useState('Die Cut Sticker');
  const [shape, setShape] = useState('Contour Cut');
  const [material, setMaterial] = useState('Vinyl');
  const [finish, setFinish] = useState('Glossy');
  const [size, setSize] = useState('2" x 2"');
  const [quantity, setQuantity] = useState('55');
  const [files, setFiles] = useState<FileWithPath[]>([]);

  return (
    <div className="w-full">
      <header className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold font-headline text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          Print customized stickers
        </h2>
        <p className="text-gray-400 mt-2">
          Choose your desired cutline, size, quantity and material. Upload your design and go to our editor.
        </p>
      </header>
      
      <div className="animated-gradient-border p-1 rounded-lg mb-8 shadow-2xl shadow-cyan-500/20">
        <Card className="bg-slate-950/80 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <StickerCanvas files={files} setFiles={setFiles} />
          </CardContent>
        </Card>
      </div>


      <div className="animated-gradient-border p-1 rounded-lg shadow-2xl shadow-cyan-500/20">
        <Card className="bg-slate-950/80 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-12 gap-x-6 gap-y-8">
              <div className="col-span-12 md:col-span-3 space-y-6">
                <ProductSelector value={product} onValueChange={setProduct} />
                <ShapeSelector value={shape} onValueChange={setShape} />
              </div>
              <div className="col-span-12 md:col-span-4 space-y-6">
                  <MaterialSelector value={material} onValueChange={setMaterial} />
                  <FinishSelector value={finish} onValueChange={setFinish} />
              </div>
              <div className="col-span-12 md:col-span-2">
                  <SizeSelector value={size} onValueChange={setSize} />
              </div>
              <div className="col-span-12 md:col-span-3">
                  <QuantitySelector value={quantity} onValueChange={setQuantity} />
              </div>

              <div className="col-span-12 flex justify-end">
                  <div className="w-full md:w-1/4">
                      <Button 
                          className="w-full bg-cyan-400 text-slate-900 font-bold text-base py-6 hover:bg-cyan-500 transition-colors duration-300 shadow-[0_0_20px_theme(colors.cyan.400)]"
                          onClick={() => document.getElementById('file-upload-input')?.click()}
                      >
                          Upload file
                      </Button>
                  </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
