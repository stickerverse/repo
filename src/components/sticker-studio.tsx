"use client";

import { useState } from 'react';
import type { FileWithPath } from 'react-dropzone';
import { StickerCanvas } from '@/components/sticker-canvas';
import { PropertiesMenu } from '@/components/properties-menu';
import { ProductSelector } from '@/components/product-selector';

export type StickerMaterial = 'Matte' | 'Glossy' | 'Holographic';
export type StickerShape = 'Square' | 'Circle' | 'Custom';
export type StickerFinish = 'Standard' | 'UV Protected' | 'Laminated';
export type StickerProduct = 'Die Cut Stickers' | 'Kiss Cut Stickers' | 'Sticker Sheets';

export default function StickerStudio() {
  const [product, setProduct] = useState<StickerProduct>('Die Cut Stickers');
  const [shape, setShape] = useState<StickerShape>('Custom');
  const [material, setMaterial] = useState<StickerMaterial>('Matte');
  const [finish, setFinish] = useState<StickerFinish>('Standard');
  const [files, setFiles] = useState<FileWithPath[]>([]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          Cosmic Sticker Studio
        </h1>
        <ProductSelector value={product} onValueChange={setProduct} />
      </header>

      <div className="flex flex-col gap-8">
        <StickerCanvas files={files} setFiles={setFiles} />
        <PropertiesMenu
          shape={shape}
          setShape={setShape}
          material={material}
          setMaterial={setMaterial}
          finish={finish}
          setFinish={setFinish}
          onUploadClick={() => document.getElementById('file-upload-input')?.click()}
        />
      </div>
    </div>
  );
}