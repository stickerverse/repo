
'use client';

import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

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
  return (
    <div className="space-y-4">
      <Label className="text-xl font-black text-white mb-3 block">Quantity</Label>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full min-h-[80px]">
                   <h3 className={cn(
                    'font-semibold text-sm transition-colors duration-200 line-clamp-1',
                    isSelected 
                      ? 'font-extrabold text-accent' 
                      : 'text-foreground group-hover:text-accent'
                  )}>
                    {item.quantity}{item.quantity !== 'Custom' && ' pcs'}
                  </h3>
                   {item.price && <p className={cn(
                      'text-xs mt-1 transition-all duration-200',
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
    </div>
  );
}
