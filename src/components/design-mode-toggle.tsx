'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Wand2, 
  Move, 
  Grid3X3, 
  Layers, 
  RotateCcw,
  Zap,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type DesignMode = 'auto-fill' | 'manual' | 'mix';

interface DesignModeToggleProps {
  mode: DesignMode;
  onModeChange: (mode: DesignMode) => void;
  gridCount: number;
  hasImages: boolean;
}

export function DesignModeToggle({ 
  mode, 
  onModeChange, 
  gridCount, 
  hasImages 
}: DesignModeToggleProps) {
  const [autoFillOptions, setAutoFillOptions] = React.useState({
    maintainAspectRatio: true,
    centerImages: true,
    scaleToFit: true,
    uniformSpacing: true
  });

  const handleAutoFill = () => {
    onModeChange('auto-fill');
    // Trigger auto-fill logic
  };

  const handleMixMode = () => {
    onModeChange('mix');
  };

  const modes = [
    {
      id: 'auto-fill' as DesignMode,
      name: 'Auto-Fill',
      description: 'Same design in all cells',
      icon: Wand2,
      features: ['Quick setup', 'Consistent layout', 'Bulk editing'],
      color: 'text-blue-500'
    },
    {
      id: 'manual' as DesignMode,
      name: 'Manual',
      description: 'Different design per cell',
      icon: Move,
      features: ['Full control', 'Custom per cell', 'Flexible design'],
      color: 'text-green-500'
    },
    {
      id: 'mix' as DesignMode,
      name: 'Mix Mode',
      description: 'Combination of both',
      icon: Layers,
      features: ['Best of both', 'Selective editing', 'Advanced workflow'],
      color: 'text-purple-500'
    }
  ];

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xl font-black text-white">Design Mode</Label>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Grid3X3 className="h-3 w-3" />
            <span>{gridCount} cells</span>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {modes.map((modeOption) => {
            const isSelected = mode === modeOption.id;
            const Icon = modeOption.icon;
            
            return (
              <Card
                key={modeOption.id}
                onClick={() => onModeChange(modeOption.id)}
                className={cn(
                  'cursor-pointer transition-all duration-300 group border rounded-xl relative backdrop-blur-sm',
                  isSelected
                    ? 'border-accent ring-2 ring-accent/50 bg-gradient-to-br from-accent/20 to-accent/10 shadow-xl shadow-accent/20'
                    : 'border-border bg-card/50 hover:bg-card/80 hover:border-accent/40 hover:shadow-lg',
                  'min-h-[120px]'
                )}
              >
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={cn('h-4 w-4', isSelected ? 'text-accent' : modeOption.color)} />
                    <h3 className={cn(
                      'font-semibold text-sm transition-colors duration-200',
                      isSelected 
                        ? 'text-accent' 
                        : 'text-foreground group-hover:text-accent'
                    )}>
                      {modeOption.name}
                    </h3>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3 flex-1">
                    {modeOption.description}
                  </p>
                  
                  <div className="space-y-1">
                    {modeOption.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-accent rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mode-Specific Controls */}
        {mode === 'auto-fill' && (
          <Card className="bg-card/60 border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-blue-500" />
                Auto-Fill Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Maintain Aspect Ratio</Label>
                  <Switch
                    checked={autoFillOptions.maintainAspectRatio}
                    onCheckedChange={(checked) => 
                      setAutoFillOptions(prev => ({ ...prev, maintainAspectRatio: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Center Images</Label>
                  <Switch
                    checked={autoFillOptions.centerImages}
                    onCheckedChange={(checked) => 
                      setAutoFillOptions(prev => ({ ...prev, centerImages: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Scale to Fit</Label>
                  <Switch
                    checked={autoFillOptions.scaleToFit}
                    onCheckedChange={(checked) => 
                      setAutoFillOptions(prev => ({ ...prev, scaleToFit: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Uniform Spacing</Label>
                  <Switch
                    checked={autoFillOptions.uniformSpacing}
                    onCheckedChange={(checked) => 
                      setAutoFillOptions(prev => ({ ...prev, uniformSpacing: checked }))
                    }
                  />
                </div>
              </div>

              {hasImages && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        onClick={handleAutoFill}
                        className="h-7 gap-1"
                      >
                        <Zap className="h-3 w-3" />
                        Apply Auto-Fill
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Fill all cells with the first uploaded image</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Reset all cells */}}
                        className="h-7 gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset All
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear all cells and start over</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {mode === 'mix' && (
          <Card className="bg-card/60 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-500" />
                Mix Mode Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                In Mix Mode, you can select multiple cells and apply bulk operations, 
                while keeping individual cell customization available.
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Select all cells */}}
                  className="h-7 gap-1"
                >
                  <Grid3X3 className="h-3 w-3" />
                  Select All
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Apply to selected */}}
                  className="h-7 gap-1"
                >
                  <Zap className="h-3 w-3" />
                  Apply to Selected
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Advanced settings */}}
                  className="h-7 gap-1"
                >
                  <Settings className="h-3 w-3" />
                  Advanced
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {mode === 'manual' && (
          <Card className="bg-card/60 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Move className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">Manual Mode Active</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload different images to each cell. Use drag & drop or click on empty cells to add designs.
                    Each cell can be customized independently with its own settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}