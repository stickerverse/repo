
'use client';

import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';

export type SizeOption = 'A4' | 'A3' | 'Letter' | 'Legal' | 'Tabloid' | 'Vertical Sheet';

type SizeSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
  product: string;
};

const sizes = [
    '2" x 2"',
    '3" x 3"',
    '4" x 4"',
    '5" x 5"',
    '6" x 6"',
    'Custom size',
];

const sheetSizes = [
  { 
    name: 'A4', 
    dimensions: '8.3" x 11.7"',
    aspectRatio: 8.3 / 11.7,
    description: 'Standard A4 size'
  },
  { 
    name: 'A3', 
    dimensions: '11.7" x 16.5"',
    aspectRatio: 11.7 / 16.5,
    description: 'Large A3 size'
  },
  { 
    name: 'Letter', 
    dimensions: '8.5" x 11"',
    aspectRatio: 8.5 / 11,
    description: 'Standard US Letter'
  },
  { 
    name: 'Legal', 
    dimensions: '8.5" x 14"',
    aspectRatio: 8.5 / 14,
    description: 'US Legal size'
  },
  { 
    name: 'Tabloid', 
    dimensions: '11" x 17"',
    aspectRatio: 11 / 17,
    description: 'Large tabloid size'
  },
  { 
    name: 'Vertical Sheet', 
    dimensions: '8.5" x 11"',
    aspectRatio: 8.5 / 11,
    description: 'Portrait orientation'
  },
];

export function SizeSelector({ value, onValueChange, product }: SizeSelectorProps) {
  const isStickerSheet = product === 'Sticker Sheet';
  const [isMetric, setIsMetric] = useState(false);
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  
  const displaySizes = isStickerSheet ? sheetSizes : sizes;
  const isCustomSelected = value === 'Custom size';

  const convertDimensions = (dimensions: string) => {
    if (!isMetric || dimensions === 'Custom') return dimensions;
    
    return dimensions.replace(/(\d+\.?\d*)" x (\d+\.?\d*)"/g, (match, width, height) => {
      const widthCm = (parseFloat(width) * 2.54).toFixed(1);
      const heightCm = (parseFloat(height) * 2.54).toFixed(1);
      return `${widthCm}cm x ${heightCm}cm`;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xl font-black text-white">Sheet Size</Label>
        {isStickerSheet && (
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-medium", !isMetric ? "text-accent" : "text-white/70")}>
              Inches
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMetric(!isMetric)}
              className="p-0 h-6 w-12"
            >
              {isMetric ? (
                <ToggleRight className="h-6 w-6 text-accent" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-white/50" />
              )}
            </Button>
            <span className={cn("text-sm font-medium", isMetric ? "text-accent" : "text-white/70")}>
              Metric
            </span>
          </div>
        )}
      </div>

      <div className={cn("grid gap-3 sm:gap-4", isStickerSheet ? "grid-cols-2" : "grid-cols-3")}>
        {displaySizes.map((size) => {
          const sizeData = typeof size === 'object' ? size : { name: size, dimensions: '', description: '' };
          const isSelected = value === sizeData.name;
          
          return (
            <div key={sizeData.name} className="relative">
              <Card
                onClick={() => onValueChange(sizeData.name)}
                className={cn(
                  'cursor-pointer transition-all duration-300 group border rounded-xl relative backdrop-blur-sm',
                  isSelected
                    ? 'border-accent ring-2 ring-accent/50 bg-gradient-to-br from-accent/20 to-accent/10 shadow-xl shadow-accent/20'
                    : 'border-border bg-card/50 hover:bg-card/80 hover:border-accent/40 hover:shadow-lg',
                  'min-w-0 max-w-full'
                )}
              >
                {isSelected && (
                  <div className="absolute top-1 sm:top-2 left-1 sm:left-2 z-10">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-accent fill-accent/20" />
                  </div>
                )}
                <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full min-h-[90px]">
                  <h3 className={cn(
                    'font-semibold text-base transition-colors duration-200 line-clamp-1 mb-1',
                    isSelected 
                      ? 'font-extrabold text-accent' 
                      : 'text-foreground group-hover:text-accent'
                  )}>
                    {sizeData.name}
                  </h3>
                  {isStickerSheet && sizeData.dimensions && (
                    <div className="text-xs text-white/60 space-y-1">
                      <div className="font-mono">
                        {convertDimensions(sizeData.dimensions)}
                      </div>
                      <div className="text-white/40">
                        {sizeData.description}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {isCustomSelected && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className='space-y-2'>
              <Label htmlFor="custom-width" className="text-sm font-medium text-white">
                Width ({isMetric ? 'cm' : 'in'})
              </Label>
              <Input 
                id="custom-width" 
                type="number" 
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                placeholder={isMetric ? 'e.g. 21.0' : 'e.g. 8.5'} 
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-400 focus:ring-cyan-400" 
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor="custom-height" className="text-sm font-medium text-white">
                Height ({isMetric ? 'cm' : 'in'})
              </Label>
              <Input 
                id="custom-height" 
                type="number" 
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                placeholder={isMetric ? 'e.g. 29.7' : 'e.g. 11'} 
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-400 focus:ring-cyan-400" 
              />
            </div>
          </div>
          {customWidth && customHeight && (
            <div className="text-center text-accent text-sm font-medium">
              Preview: {customWidth} x {customHeight} {isMetric ? 'cm' : 'in'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
