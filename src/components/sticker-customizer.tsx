'use client';

import { useState } from 'react';
import { ProductSelector } from '@/components/product-selector';
import { ShapeSelector } from '@/components/shape-selector';
import { MaterialSelector } from '@/components/material-selector';
import { FinishSelector } from '@/components/finish-selector';
import { SizeSelector } from '@/components/size-selector';
import { QuantitySelector } from '@/components/quantity-selector';
import { Button } from './ui/button';

export default function StickerCustomizer() {
  const [product, setProduct] = useState('Die Cut Sticker');
  const [shape, setShape] = useState('Contour Cut');
  const [material, setMaterial] = useState('Vinyl');
  const [finish, setFinish] = useState('Glossy');
  const [size, setSize] = useState('2" x 2"');
  const [quantity, setQuantity] = useState('55');

  return (
    <div>
      <header className="max-w-7xl mx-auto mb-8">
        <h2 className="text-3xl font-black text-gray-800 mb-3">Print customized stickers</h2>
        <p className="text-gray-600">
          Choose your desired cutline, size, quantity and material. Upload your design and go to our editor.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-x-4 gap-y-8">
        <div className="col-span-12 md:col-span-3">
          <ProductSelector value={product} onValueChange={setProduct} />
          <div className="mt-5">
            <ShapeSelector value={shape} onValueChange={setShape} />
          </div>
        </div>
        <div className="col-span-12 md:col-span-4">
            <MaterialSelector value={material} onValueChange={setMaterial} />
            <div className="mt-5">
                <FinishSelector value={finish} onValueChange={setFinish} />
            </div>
        </div>
        <div className="col-span-12 md:col-span-2">
            <SizeSelector value={size} onValueChange={setSize} />
        </div>
        <div className="col-span-12 md:col-span-3">
            <QuantitySelector value={quantity} onValueChange={setQuantity} />
        </div>

        <div className="col-span-12 flex justify-end">
            <div className="w-full md:w-1/4">
                <Button className="w-full bg-yellow-400 text-black font-bold text-base py-6 hover:bg-yellow-500">
                    Upload file
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
