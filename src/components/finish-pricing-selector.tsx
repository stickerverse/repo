'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

type FinishPricingSelectorProps = {
  value: StickerFinish;
  onValueChange: (value: StickerFinish) => void;
};

const pricingData = [
  { size: '2" x 2"', quantity: 50, price: '$29' },
  { size: '3" x 3"', quantity: 50, price: '$35' },
  { size: '4" x 4"', quantity: 50, price: '$42' },
  { size: '2" x 2"', quantity: 100, price: '$48' },
];

export function FinishPricingSelector({ value, onValueChange }: FinishPricingSelectorProps) {
  return (
    <div className="space-y-8">
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="p-0 mb-2">
          <Label htmlFor="finish-select" className="text-xl font-headline">Finish</Label>
        </CardHeader>
        <CardContent className="p-0">
          <Select onValueChange={(v) => onValueChange(v as StickerFinish)} defaultValue={value}>
            <SelectTrigger id="finish-select" className="w-full">
              <SelectValue placeholder="Select a finish" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="UV Protected">UV Protected</SelectItem>
              <SelectItem value="Laminated">Laminated</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-headline">Size / Quantity / Price</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Size</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingData.map((row, index) => (
                <TableRow key={index} className="hover:bg-accent/50">
                  <TableCell className="font-medium">{row.size}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell className="text-right font-mono">{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
