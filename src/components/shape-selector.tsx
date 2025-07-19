
'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';

type ShapeSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const shapes = [
  { value: 'Contour Cut', label: 'Contour Cut', icon: 'https://d6ce0no7ktiq.cloudfront.net/images/web/wizard/ic_contourcut.svg' },
  { value: 'Square', label: 'Square', icon: 'https://d6ce0no7ktiq.cloudfront.net/images/web/wizard/ic_square.svg' },
  { value: 'Circle', label: 'Circle', icon: 'https://d6ce0no7ktiq.cloudfront.net/images/web/wizard/ic_circle.svg' },
  { value: 'Rounded Corners', label: 'Rounded Corners', icon: 'https://d6ce0no7ktiq.cloudfront.net/images/web/wizard/ic_round-corners.svg' },
];

export function ShapeSelector({ value, onValueChange }: ShapeSelectorProps) {
  return (
    <div className="space-y-4">
      <Label className="text-xl font-black text-foreground flex items-center gap-2">
        Shape
      </Label>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {shapes.map((shape) => {
          const isSelected = value === shape.value;
          return (
            <div key={shape.value} className="relative">
              <Card
                onClick={() => onValueChange(shape.value)}
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
                <div className="flex flex-col items-center justify-center p-2 sm:p-4 h-full min-h-[120px] sm:min-h-[140px]">
                  <div className={cn(
                    "relative w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110 invert",
                     isSelected && "ring-2 ring-accent/30 rounded-lg"
                  )}>
                    <Image 
                      src={shape.icon} 
                      alt={shape.label} 
                      fill 
                      className="object-contain"
                    />
                  </div>
                  <h3 className={cn(
                    'font-semibold text-center text-xs sm:text-sm transition-colors duration-200 line-clamp-1',
                    isSelected 
                      ? 'font-extrabold text-accent' 
                      : 'text-foreground group-hover:text-accent'
                  )}>
                    {shape.label}
                  </h3>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
