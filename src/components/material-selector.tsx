
'use client';

import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MaterialSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const materials = [
  { name: 'Vinyl', image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/06/08/4d0ae46e9e164daa9171d70e51cd46c7acaa2419.png' },
  { name: 'Holographic', image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/48e2c5c8c6ab57d013675b3b245daa2136e0c7cf.png' },
  { name: 'Transparent', image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/2d46e2873ec899b83a152c2f2ad52c1368398333.png' },
  { name: 'Glitter', image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/8d48777356c014861f8e174949f2a382778c0a7e.png' },
  { name: 'Mirror', image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/c5e0f009dbf3aec33b2e8d0caac5ebcd1a10348f.png' },
  { name: 'Pixie Dust', image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/08/23/46dac2bd418951b1412d4225cbdaad579aed03e4.png' },
  { name: 'Prismatic', image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/0912457c4dccf212c92e0802fd36545d90f2bfd6.png' },
  { name: 'Brushed Aluminum', image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/573a155499c9496b21c3f404bffb6499ae99462e.png' },
  { name: 'Kraft Paper', image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/e4ae8c4973e6e530cedcce836d8366638ca4c6d3.png' },
  { name: 'Hi-Tack Vinyl', image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/06/08/4d0ae46e9e164daa9171d70e51cd46c7acaa2419.png' },
  { name: 'Low-Tack Vinyl', image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/06/08/4d0ae46e9e164daa9171d70e51cd46c7acaa2419.png' },
  { name: 'Reflective', image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2024/10/16/3980001d8c15a7ed2b727613c425f8290de317cd.png' },
  { name: 'Glow In The Dark', image: 'https://d6ce0no7ktiq.cloudfront.net/images/attachment/2023/03/09/c23d3c3023560c21da44135bd142dc04affa380e.png' },
];

export function MaterialSelector({ value, onValueChange }: MaterialSelectorProps) {
  return (
    <div>
      <Label className="text-xl font-black text-white mb-3 block">Material</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
        {materials.map((material) => (
          <Card
            key={material.name}
            onClick={() => onValueChange(material.name)}
            className={cn(
              'cursor-pointer transition-all duration-200 group border rounded-lg',
              value === material.name
                ? 'border-transparent ring-2 ring-cyan-400 bg-white/30'
                : 'border-white/30 bg-white/20 hover:bg-white/30',
              'min-w-[112px]'
            )}
          >
            <div className="flex flex-col items-center justify-center p-2">
              <div className="relative w-24 h-24 mb-1 overflow-hidden rounded">
                <Image
                  src={material.image}
                  alt={material.name}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <p className={cn(
                'font-semibold text-center text-sm',
                value === material.name ? 'font-extrabold text-white' : 'text-gray-200'
              )}>{material.name}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
