'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SlidersHorizontal, Image as ImageIcon, Pencil, Pipette } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function EditorPanel() {
  const [activeTab, setActiveTab] = useState('background');

  return (
    <Card className="w-80 h-auto bg-slate-950/80 backdrop-blur-md border border-white/20 shadow-2xl">
      <CardContent className="p-4">
        <Tabs defaultValue="background" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white/10 p-1 h-auto">
            <TabsTrigger value="background" className="data-[state=active]:bg-cyan-500/80 data-[state=active]:text-white">
                <Pipette className="h-5 w-5"/>
            </TabsTrigger>
            <TabsTrigger value="border" className="data-[state=active]:bg-cyan-500/80 data-[state=active]:text-white">
                <SlidersHorizontal className="h-5 w-5"/>
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-cyan-500/80 data-[state=active]:text-white">
                <ImageIcon className="h-5 w-5"/>
            </TabsTrigger>
            <TabsTrigger value="edit" className="data-[state=active]:bg-cyan-500/80 data-[state=active]:text-white">
                <Pencil className="h-5 w-5"/>
            </TabsTrigger>
          </TabsList>
          <div className="mt-4 text-white">
            <TabsContent value="background">
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">Background</h3>
                <p className="text-sm text-gray-400">Controls for background color, transparency, patterns, etc.</p>
              </div>
            </TabsContent>
            <TabsContent value="border">
                <div className="p-2">
                    <h3 className="font-bold text-lg mb-2">Border</h3>
                    <p className="text-sm text-gray-400">Controls for stroke, corners, shadows, etc.</p>
                </div>
            </TabsContent>
            <TabsContent value="upload">
                <div className="p-2">
                    <h3 className="font-bold text-lg mb-2">Upload / Artwork</h3>
                    <p className="text-sm text-gray-400">Upload new images, manage layers, etc.</p>
                </div>
            </TabsContent>
            <TabsContent value="edit">
                <div className="p-2">
                    <h3 className="font-bold text-lg mb-2">Edit</h3>
                    <p className="text-sm text-gray-400">Controls for scale, rotation, alignment, etc.</p>
                </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
