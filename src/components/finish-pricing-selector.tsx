
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import type { StickerFinish } from './sticker-studio';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

type FinishPricingSelectorProps = {
  value: StickerFinish;
  onValueChange: (value: StickerFinish) => void;
};

const finishes: {name: StickerFinish, description: string}[] = [
  { name: 'Standard', description: 'Glossy, vibrant finish' },
  { name: 'UV Protected', description: 'Fade-resistant coating' },
  { name: 'Laminated', description: 'Extra durable & waterproof' },
];

const pricingData = [
  { size: '2" x 2"', quantity: 50, price: '$29' },
  { size: '3" x 3"', quantity: 50, price: '$35' },
  { size: '4" x 4"', quantity: 50, price: '$42' },
  { size: '2" x 2"', quantity: 100, price: '$48' },
];

export function FinishPricingSelector({ value, onValueChange }: FinishPricingSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-xl font-black text-foreground">Finish</Label>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {finishes.map((finish) => {
            const isSelected = value === finish.name;
            return (
              <div key={finish.name} className="relative">
                <Card
                  onClick={() => onValueChange(finish.name)}
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
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full min-h-[100px]">
                     <h3 className={cn(
                      'font-semibold text-base transition-colors duration-200 line-clamp-1',
                      isSelected 
                        ? 'font-extrabold text-accent' 
                        : 'text-foreground group-hover:text-accent'
                    )}>
                      {finish.name}
                    </h3>
                     <p className={cn(
                      'text-sm mt-1 transition-all duration-200 line-clamp-2',
                      isSelected 
                        ? 'text-accent/80 opacity-100' 
                        : 'text-muted-foreground'
                    )}>
                      {finish.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
      
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-headline text-foreground">Size / Quantity / Price</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="animated-gradient-border p-px rounded-lg">
            <Table className="bg-card/80 rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-accent/10 border-border">
                    <TableCell className="font-medium">{row.size}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell className="text-right font-mono">{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
