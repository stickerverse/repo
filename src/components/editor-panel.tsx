
'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  SlidersHorizontal, 
  Image, 
  Pencil, 
  Pipette,
  Palette,
  Upload,
  RotateCw,
  Move3D,
  Square,
  Download,
  Layers,
  Eye,
  Settings,
  Sparkles,
  Eraser,
  SquarePen,
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { GradientBorderButton } from './ui/gradient-border-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type EditorPanelProps = {
  scale: number;
  setScale: (scale: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
};

const TABS = [
  { value: 'edit', label: 'Transform', icon: <Pencil className="h-5 w-5"/> },
  { value: 'bg-removal', label: 'Background Removal', icon: <Eraser className="h-5 w-5"/> },
  { value: 'add-border', label: 'Add Border', icon: <SquarePen className="h-5 w-5"/> },
  { value: 'background', label: 'Sticker Background', icon: <Pipette className="h-5 w-5"/> },
  { value: 'border', label: 'Border & Effects', icon: <SlidersHorizontal className="h-5 w-5"/> },
  { value: 'upload', label: 'Assets & Layers', icon: <Image className="h-5 w-5"/> },
];

export function EditorPanel({
  scale,
  setScale,
  rotation,
  setRotation,
}: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState('edit');
  const [backgroundColor, setBackgroundColor] = useState('#3b82f6');
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderRadius, setBorderRadius] = useState(8);
  const [opacity, setOpacity] = useState(100);

  const ColorPicker = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center space-x-2">
        <div 
          className="w-8 h-8 rounded border-2 border-border cursor-pointer transition-all hover:scale-105"
          style={{ backgroundColor: value }}
          onClick={() => document.getElementById(`color-${label}`)?.click()}
        />
        <input
          id={`color-${label}`}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <span className="text-sm text-muted-foreground font-mono">{value}</span>
      </div>
    </div>
  );

  const Slider = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = '' }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
        <span className="text-sm text-muted-foreground">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  return (
    <Card className="w-80 h-auto bg-card/90 backdrop-blur-md border-border shadow-2xl">
      <CardContent className="p-4">
        <Tabs defaultValue="edit" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-secondary/50 p-1 h-auto rounded-lg backdrop-blur-sm">
             {TABS.map((tab) => (
                <TooltipProvider key={tab.value}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value={tab.value} 
                        className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200 hover:bg-secondary/80 rounded-md p-3"
                      >
                        {tab.icon}
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tab.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </TabsList>

          <div className="mt-6 text-foreground">
            <TabsContent value="bg-removal" className="space-y-4 mt-0">
               <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <Eraser className="h-5 w-5 text-accent" />
                  Background Removal
                </h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered background removal coming soon!
                </p>
                 <GradientBorderButton 
                  className="w-full font-medium"
                  disabled
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Remove Background
                </GradientBorderButton>
              </div>
            </TabsContent>
            
            <TabsContent value="add-border" className="space-y-4 mt-0">
               <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <SquarePen className="h-5 w-5 text-accent" />
                  Add Image Border
                </h3>
                <p className="text-sm text-muted-foreground">
                  Functionality to add a border to your uploaded image will be available here.
                </p>
                <GradientBorderButton 
                  className="w-full font-medium"
                  disabled
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Border
                </GradientBorderButton>
              </div>
            </TabsContent>

            <TabsContent value="background" className="space-y-4 mt-0">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <Palette className="h-5 w-5 text-accent" />
                  Sticker Background
                </h3>
                
                <ColorPicker 
                  value={backgroundColor} 
                  onChange={setBackgroundColor} 
                  label="Color" 
                />
                
                <Slider
                  label="Opacity"
                  value={opacity}
                  onChange={setOpacity}
                  min={0}
                  max={100}
                  unit="%"
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Pattern</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['None', 'Dots', 'Grid', 'Noise'].map((pattern) => (
                      <button
                        key={pattern}
                        className="p-2 text-sm bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded transition-all duration-200 border border-border hover:border-accent/50"
                      >
                        {pattern}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="text-base font-medium">Preview</span>
                  </div>
                  <div 
                    className="w-full h-16 rounded border border-border"
                    style={{ 
                      backgroundColor: backgroundColor,
                      opacity: opacity / 100
                    }}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="border" className="space-y-4 mt-0">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <Square className="h-5 w-5 text-accent" />
                  Sticker Border & Effects
                </h3>
                
                <Slider
                  label="Border Width"
                  value={borderWidth}
                  onChange={setBorderWidth}
                  min={0}
                  max={20}
                  unit="px"
                />

                <Slider
                  label="Corner Radius"
                  value={borderRadius}
                  onChange={setBorderRadius}
                  min={0}
                  max={50}
                  unit="px"
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Shadow</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['None', 'Soft', 'Hard'].map((shadow) => (
                      <button
                        key={shadow}
                        className="p-2 text-sm bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded transition-all duration-200 border border-border hover:border-accent/50"
                      >
                        {shadow}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-accent" />
                    <span className="text-base font-medium">Preview</span>
                  </div>
                  <div 
                    className="w-full h-16 bg-secondary/50"
                    style={{ 
                      borderWidth: `${borderWidth}px`,
                      borderRadius: `${borderRadius}px`,
                      borderColor: '#06b6d4',
                      borderStyle: 'solid'
                    }}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4 mt-0">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <Upload className="h-5 w-5 text-accent" />
                  Assets & Layers
                </h3>
                
                <button className="w-full p-4 bg-accent/10 hover:bg-accent/20 border-2 border-dashed border-accent/50 rounded-lg transition-all duration-200 group">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-accent group-hover:scale-110 transition-transform" />
                    <p className="text-base font-medium text-foreground">Upload Image</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG, SVG up to 10MB</p>
                  </div>
                </button>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Layers</label>
                  <div className="space-y-2">
                    {['Background', 'Image 1', 'Text Layer'].map((layer, index) => (
                      <div key={layer} className="flex items-center justify-between p-3 bg-secondary/30 rounded border border-border hover:border-accent/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <span className="text-base text-foreground">{layer}</span>
                        </div>
                        <button className="p-1 hover:bg-secondary rounded transition-colors">
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-accent" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="edit" className="space-y-4 mt-0">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <Move3D className="h-5 w-5 text-accent" />
                  Transform
                </h3>
                
                <Slider
                  label="Scale"
                  value={scale}
                  onChange={setScale}
                  min={10}
                  max={200}
                  unit="%"
                />

                <Slider
                  label="Rotation"
                  value={rotation}
                  onChange={setRotation}
                  min={-180}
                  max={180}
                  unit="°"
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Alignment</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['↖', '↑', '↗', '←', '⊙', '→', '↙', '↓', '↘'].map((align, index) => (
                      <button
                        key={index}
                        className="p-3 bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded transition-all duration-200 border border-border hover:border-accent/50 text-lg font-bold"
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                <GradientBorderButton 
                  className="w-full font-medium"
                >
                  <Download className="h-4 w-4" />
                  Export Project
                </GradientBorderButton>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: hsl(var(--accent));
            cursor: pointer;
            border: 2px solid hsl(var(--background));
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
          }
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
          .slider::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: hsl(var(--accent));
            cursor: pointer;
            border: 2px solid hsl(var(--background));
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
