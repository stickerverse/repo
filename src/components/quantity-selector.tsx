'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

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
    { quantity: '600', price: '$136', discount: '-52%' },
    { quantity: '900', price: '$175', discount: '-59%' },
    { quantity: '1200', price: '$201', discount: '-65%' },
    { quantity: '1500', price: '$252', discount: '-65%' },
    { quantity: 'Custom quantity', price: null, discount: null },
];

export function QuantitySelector({ value, onValueChange }: QuantitySelectorProps) {
  return (
    <div>
      <h3 className="text-xl font-black text-white mb-3">Quantity</h3>
      <RadioGroup value={value} onValueChange={onValueChange} className="bg-white/10 rounded-lg border border-white/20">
        {quantities.map((item, index) => (
          <Label
            key={item.quantity}
            htmlFor={`quantity-${item.quantity.replace(/\s/g, '-')}`}
            className={cn(
              'flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-white/20',
              value === item.quantity ? 'bg-white/20 font-extrabold text-cyan-400' : 'font-normal',
              index > 0 && 'border-t border-white/20'
            )}
          >
            <span className="flex-1 text-white ml-3">{item.quantity} pcs</span>
            {item.price && <span className="text-white text-right">{item.price}</span>}
            {item.discount && <Badge variant="destructive" className="bg-transparent text-green-400 font-bold text-sm w-16 justify-end">{item.discount}</Badge>}
            <RadioGroupItem value={item.quantity} id={`quantity-${item.quantity.replace(/\s/g, '-')}`} className="sr-only" />
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
