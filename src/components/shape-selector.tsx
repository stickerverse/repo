'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
    <div>
      <h3 className="text-xl font-black text-gray-800 mb-3">Shape</h3>
      <RadioGroup value={value} onValueChange={onValueChange} className="bg-white rounded-lg border border-gray-200">
        {shapes.map((shape, index) => (
          <Label
            key={shape.value}
            htmlFor={`shape-${shape.value}`}
            className={cn(
              'flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-gray-50',
              value === shape.value ? 'bg-gray-100 font-extrabold' : 'font-normal',
              index > 0 && 'border-t border-gray-200'
            )}
          >
            <div className="w-6 h-6 relative scale-150">
              <Image src={shape.icon} alt={shape.label} fill />
            </div>
            <span className="flex-1 text-gray-800">{shape.label}</span>
            <RadioGroupItem value={shape.value} id={`shape-${shape.value}`} className="sr-only" />
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
