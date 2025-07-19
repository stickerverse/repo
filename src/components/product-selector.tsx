'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { StickerProduct } from './sticker-studio';

type ProductSelectorProps = {
  value: StickerProduct;
  onValueChange: (value: StickerProduct) => void;
};

export function ProductSelector({ value, onValueChange }: ProductSelectorProps) {
  return (
    <div className="w-full md:w-64">
      <Select onValueChange={onValueChange} defaultValue={value}>
        <SelectTrigger className="w-full bg-card/50 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/50 transition-colors duration-300">
          <SelectValue placeholder="Select a product" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Die Cut Stickers">Die Cut Stickers</SelectItem>
          <SelectItem value="Kiss Cut Stickers">Kiss Cut Stickers</SelectItem>
          <SelectItem value="Sticker Sheets">Sticker Sheets</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
