'use client';

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  FileImage, 
  FileText, 
  File, 
  Layers,
  Settings,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type ExportFormat = 'png' | 'svg' | 'pdf' | 'zip';

export type ExportOptions = {
  format: ExportFormat;
  dpi: number;
  includeBleed: boolean;
  includeCropMarks: boolean;
  includeRegistrationMarks: boolean;
  separateLayers: boolean;
  transparency: boolean;
  colorSpace: 'rgb' | 'cmyk';
  compressionQuality: number;
};

interface ExportOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  sheetData: {
    size: string;
    gridRows: number;
    gridCols: number;
    files: Array<{ preview?: string; name: string }>;
  };
}

const exportFormats = [
  {
    id: 'png' as ExportFormat,
    name: 'PNG',
    description: 'High-quality raster with transparency',
    icon: FileImage,
    useCases: ['Digital proofing', 'Web sharing', 'Social media'],
    pros: ['Transparency support', 'High quality', 'Universal support'],
    cons: ['Large file size', 'Not scalable'],
    recommended: true
  },
  {
    id: 'svg' as ExportFormat,
    name: 'SVG',
    description: 'Vector format with cut lines',
    icon: File,
    useCases: ['Cutting machines', 'Vector editing', 'Scalable graphics'],
    pros: ['Infinitely scalable', 'Small file size', 'Editable'],
    cons: ['Limited raster support', 'Browser compatibility'],
    recommended: false
  },
  {
    id: 'pdf' as ExportFormat,
    name: 'PDF',
    description: 'Print-ready professional format',
    icon: FileText,
    useCases: ['Professional printing', 'Client proofs', 'Archive'],
    pros: ['Print standard', 'Preserves quality', 'Universal'],
    cons: ['Larger file size', 'Not easily editable'],
    recommended: true
  },
  {
    id: 'zip' as ExportFormat,
    name: 'ZIP Package',
    description: 'Multiple formats bundled together',
    icon: Layers,
    useCases: ['Complete package', 'Multiple uses', 'Client delivery'],
    pros: ['All formats included', 'Organized', 'Future-proof'],
    cons: ['Large download', 'Complex'],
    recommended: false
  }
];

export function ExportOptionsModal({ isOpen, onClose, onExport, sheetData }: ExportOptionsModalProps) {
  const [selectedFormat, setSelectedFormat] = React.useState<ExportFormat>('png');
  const [dpi, setDpi] = React.useState([300]);
  const [includeBleed, setIncludeBleed] = React.useState(true);
  const [includeCropMarks, setIncludeCropMarks] = React.useState(false);
  const [includeRegistrationMarks, setIncludeRegistrationMarks] = React.useState(false);
  const [separateLayers, setSeparateLayers] = React.useState(false);
  const [transparency, setTransparency] = React.useState(true);
  const [colorSpace, setColorSpace] = React.useState<'rgb' | 'cmyk'>('rgb');
  const [compressionQuality, setCompressionQuality] = React.useState([90]);
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportProgress, setExportProgress] = React.useState(0);

  const selectedFormatData = exportFormats.find(f => f.id === selectedFormat);

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsExporting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    const options: ExportOptions = {
      format: selectedFormat,
      dpi: dpi[0],
      includeBleed,
      includeCropMarks,
      includeRegistrationMarks,
      separateLayers,
      transparency,
      colorSpace,
      compressionQuality: compressionQuality[0],
    };

    // Call the export function
    setTimeout(() => {
      onExport(options);
      clearInterval(progressInterval);
      setIsExporting(false);
      setExportProgress(100);
      
      // Auto-close after successful export
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 2000);
  };

  const estimateFileSize = () => {
    const baseSize = sheetData.gridRows * sheetData.gridCols * 0.5; // MB per sticker
    const dpiMultiplier = (dpi[0] / 300) ** 2;
    const qualityMultiplier = compressionQuality[0] / 100;
    
    let size = baseSize * dpiMultiplier * qualityMultiplier;
    
    if (selectedFormat === 'svg') size *= 0.1;
    if (selectedFormat === 'pdf') size *= 1.2;
    if (selectedFormat === 'zip') size *= 2.5;
    
    return size.toFixed(1);
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[90vh] bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Options
            </DialogTitle>
            <DialogDescription>
              Choose export format and settings for your sticker sheet design.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
            {/* Format Selection */}
            <div className="lg:col-span-2 space-y-4 overflow-auto">
              <div>
                <Label className="text-sm font-medium mb-3 block">Export Format</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {exportFormats.map((format) => {
                    const isSelected = selectedFormat === format.id;
                    const Icon = format.icon;
                    
                    return (
                      <Card
                        key={format.id}
                        onClick={() => setSelectedFormat(format.id)}
                        className={cn(
                          'cursor-pointer transition-all duration-300 group border relative',
                          isSelected
                            ? 'border-accent ring-2 ring-accent/50 bg-gradient-to-br from-accent/20 to-accent/10'
                            : 'border-border hover:border-accent/40 hover:shadow-lg',
                          format.recommended && 'ring-1 ring-green-500/30'
                        )}
                      >
                        {format.recommended && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Recommended
                          </div>
                        )}
                        
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon className={cn('h-5 w-5 mt-0.5', isSelected ? 'text-accent' : 'text-muted-foreground')} />
                            <div className="flex-1">
                              <h3 className={cn(
                                'font-semibold text-sm mb-1',
                                isSelected ? 'text-accent' : 'text-foreground'
                              )}>
                                {format.name}
                              </h3>
                              <p className="text-xs text-muted-foreground mb-2">
                                {format.description}
                              </p>
                              
                              <div className="space-y-1">
                                <div className="text-xs font-medium text-foreground">Best for:</div>
                                <div className="flex flex-wrap gap-1">
                                  {format.useCases.map((useCase, index) => (
                                    <span key={index} className="text-xs bg-secondary px-2 py-0.5 rounded">
                                      {useCase}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Format-Specific Options */}
              {selectedFormatData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      {selectedFormatData.name} Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* DPI Settings */}
                    {selectedFormat !== 'svg' && (
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center justify-between">
                          Resolution (DPI)
                          <span className="text-xs text-muted-foreground">{dpi[0]} DPI</span>
                        </Label>
                        <Slider
                          value={dpi}
                          onValueChange={setDpi}
                          max={600}
                          min={72}
                          step={72}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Web (72)</span>
                          <span>Print (300)</span>
                          <span>High-end (600)</span>
                        </div>
                      </div>
                    )}

                    {/* Quality Settings */}
                    {(selectedFormat === 'png' || selectedFormat === 'pdf') && (
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center justify-between">
                          Compression Quality
                          <span className="text-xs text-muted-foreground">{compressionQuality[0]}%</span>
                        </Label>
                        <Slider
                          value={compressionQuality}
                          onValueChange={setCompressionQuality}
                          max={100}
                          min={10}
                          step={10}
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* Color Space */}
                    <div className="space-y-2">
                      <Label className="text-sm">Color Space</Label>
                      <Select value={colorSpace} onValueChange={(value: 'rgb' | 'cmyk') => setColorSpace(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rgb">RGB (Digital/Web)</SelectItem>
                          <SelectItem value="cmyk">CMYK (Print)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Print Options */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Print Options</Label>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Include Bleed Area</Label>
                          <Switch checked={includeBleed} onCheckedChange={setIncludeBleed} />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Crop Marks</Label>
                          <Switch checked={includeCropMarks} onCheckedChange={setIncludeCropMarks} />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Registration Marks</Label>
                          <Switch checked={includeRegistrationMarks} onCheckedChange={setIncludeRegistrationMarks} />
                        </div>

                        {selectedFormat !== 'svg' && (
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Preserve Transparency</Label>
                            <Switch checked={transparency} onCheckedChange={setTransparency} />
                          </div>
                        )}

                        {selectedFormat === 'zip' && (
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Separate Layers</Label>
                            <Switch checked={separateLayers} onCheckedChange={setSeparateLayers} />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Summary Panel */}
            <div className="space-y-4">
              {/* File Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    Export Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-mono">{selectedFormatData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stickers:</span>
                      <span className="font-mono">{sheetData.gridRows * sheetData.gridCols}</span>
                    </div>
                    {selectedFormat !== 'svg' && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resolution:</span>
                        <span className="font-mono">{dpi[0]} DPI</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Color:</span>
                      <span className="font-mono">{colorSpace.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Size:</span>
                      <span className="font-mono">{estimateFileSize()} MB</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Pros & Cons */}
                  {selectedFormatData && (
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs font-medium text-green-600 mb-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Advantages
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {selectedFormatData.pros.map((pro, index) => (
                            <li key={index}>• {pro}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="text-xs font-medium text-orange-600 mb-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Considerations
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {selectedFormatData.cons.map((con, index) => (
                            <li key={index}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Export Progress */}
              {isExporting && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-accent animate-spin" />
                        <span className="text-sm font-medium">Exporting...</span>
                      </div>
                      <Progress value={exportProgress} className="w-full" />
                      <div className="text-xs text-muted-foreground text-center">
                        {exportProgress}% complete
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="gap-2"
            >
              {isExporting ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isExporting ? 'Exporting...' : `Export ${selectedFormatData?.name}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

export function ExportTrigger({ 
  onOpen, 
  disabled = false 
}: { 
  onOpen: () => void; 
  disabled?: boolean; 
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onOpen}
            disabled={disabled}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export Design
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export your sticker sheet in various formats</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}