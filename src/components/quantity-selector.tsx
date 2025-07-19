
'use client';

import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import { Input } from './ui/input';

type QuantitySelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

const quantities = [
    { quantity: '55', price: '$26', discount: null },
    { quantity: '100', price: '$47', discount: null },
    { quantity: '200', price: '$64', discount: '-32%' },
    { quantity: '300', price: '$96', discount: '-32%' },
    { quantity: '500', price: '$114', discount: '-52%' },
    { quantity: 'Custom', price: null, discount: null },
];

export function QuantitySelector({ value, onValueChange }: QuantitySelectorProps) {
  const isCustomSelected = value === 'Custom';

  return (
    <div className="space-y-4">
      <Label className="text-xl font-black text-white mb-3 block">Quantity</Label>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {quantities.map((item) => {
          const isSelected = value === item.quantity;
          return (
            <div key={item.quantity} className="relative">
              <Card
                onClick={() => onValueChange(item.quantity)}
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
                 {item.discount && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 bg-transparent text-green-400 font-bold text-sm">
                    {item.discount}
                  </Badge>
                )}
                <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full min-h-[70px]">
                   <h3 className={cn(
                    'font-semibold text-base transition-colors duration-200 line-clamp-1',
                    isSelected 
                      ? 'font-extrabold text-accent' 
                      : 'text-foreground group-hover:text-accent'
                  )}>
                    {item.quantity}{item.quantity !== 'Custom' && ' pcs'}
                  </h3>
                   {item.price && <p className={cn(
                      'text-sm mt-1 transition-all duration-200',
                      isSelected 
                        ? 'text-accent/80' 
                        : 'text-muted-foreground'
                    )}>
                      {item.price}
                    </p>}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
      {isCustomSelected && (
        <div className="mt-4 space-y-2">
           <Label htmlFor="custom-quantity" className="text-sm font-medium text-white">Enter quantity</Label>
          <Input 
            id="custom-quantity"
            type="number" 
            placeholder="e.g. 1000"
            className="bg-white/20 border-white/30 text-white placeholder:text-gray-400 focus:ring-cyan-400"
          />
        </div>
      )}
    </div>
  );
}
