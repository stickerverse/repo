'use client';

import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { StickerMaterial } from './sticker-studio';

type MaterialSelectorProps = {
  value: StickerMaterial;
  onValueChange: (value: StickerMaterial) => void;
};

const materials: { name: StickerMaterial; image: string; hint: string }[] = [
  { name: 'Matte', image: 'https://placehold.co/300x200.png', hint: 'sticker texture' },
  { name: 'Glossy', image: 'https://placehold.co/300x200.png', hint: 'shiny sticker' },
  { name: 'Holographic', image: 'https://placehold.co/300x200.png', hint: 'holographic texture' },
];

export function MaterialSelector({ value, onValueChange }: MaterialSelectorProps) {
  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-xl font-headline">Material</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {materials.map((material) => (
            <Card
              key={material.name}
              onClick={() => onValueChange(material.name)}
              className={cn(
                'cursor-pointer transition-all duration-300 overflow-hidden group',
                value === material.name
                  ? 'border-primary ring-2 ring-primary/50 shadow-lg shadow-primary/20'
                  : 'border-border hover:border-primary/50 hover:shadow-md'
              )}
            >
              <div className="relative aspect-video">
                <Image
                  src={material.image}
                  alt={material.name}
                  data-ai-hint={material.hint}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="font-semibold text-center py-3">{material.name}</p>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
