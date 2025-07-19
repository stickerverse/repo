
'use client';

import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import { Input } from './ui/input';

type SizeSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const sizes = [
    '2" x 2"',
    '3" x 3"',
    '4" x 4"',
    '5" x 5"',
    '6" x 6"',
    'Custom size',
];

export function SizeSelector({ value, onValueChange }: SizeSelectorProps) {
  const isCustomSelected = value === 'Custom size';

  return (
    <div className="space-y-4">
      <Label className="text-xl font-black text-white mb-3 block">Size (WxH)</Label>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {sizes.map((size) => {
          const isSelected = value === size;
          return (
            <div key={size} className="relative">
              <Card
                onClick={() => onValueChange(size)}
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
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full min-h-[80px]">
                   <h3 className={cn(
                    'font-semibold text-sm transition-colors duration-200 line-clamp-1',
                    isSelected 
                      ? 'font-extrabold text-accent' 
                      : 'text-foreground group-hover:text-accent'
                  )}>
                    {size}
                  </h3>
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
              <Label htmlFor="custom-width" className="text-sm font-medium text-white">Width (in)</Label>
              <Input id="custom-width" type="number" placeholder='e.g. 3.5' className="bg-white/20 border-white/30 text-white placeholder:text-gray-400 focus:ring-cyan-400" />
            </div>
             <div className='space-y-2'>
              <Label htmlFor="custom-height" className="text-sm font-medium text-white">Height (in)</Label>
              <Input id="custom-height" type="number" placeholder='e.g. 4' className="bg-white/20 border-white/30 text-white placeholder:text-gray-400 focus:ring-cyan-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
