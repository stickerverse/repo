
'use client';

import React, { useCallback, useMemo } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { UploadCloud, X, Image, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EditorPanel } from './editor-panel';

type StickerCanvasProps = {
  files: FileWithPath[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPath[]>>;
};

export function StickerCanvas({ files, setFiles }: StickerCanvasProps) {
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Upload Error',
          description: 'Only PNG files are accepted. Please try again.',
        });
        return;
      }
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'] },
    maxFiles: 1,
    noClick: files.length > 0, // Disable click if a file is present
    noKeyboard: files.length > 0,
  });

  const removeFile = () => {
    if (files.length > 0 && files[0].preview) {
        URL.revokeObjectURL(files[0].preview);
    }
    setFiles([]);
  };

  const filePreview = useMemo(() => {
    if (files.length > 0 && files[0].preview) {
      return (
        <div className="relative w-full h-full flex items-center justify-center group">
          <img
            src={files[0].preview}
            alt={files[0].name}
            className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-105"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4 z-20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* File info overlay */}
          <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div className="flex items-center gap-2 text-sm">
              <Image className="h-4 w-4 text-accent" />
              <span className="font-medium text-foreground">{files[0].name}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {(files[0].size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      );
    }
    return null;
  }, [files]);

  return (
    <div className="relative aspect-video w-full h-auto min-h-[400px] md:min-h-[500px] bg-card/80 border-dashed border-2 border-border hover:border-accent transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden shadow-2xl rounded-lg">
      {/* Background stars effect */}
      <div className="absolute inset-0 stars opacity-20 pointer-events-none" />
      
      <div {...getRootProps({ 
        className: `w-full h-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'bg-accent/10 scale-105' : ''
        }` 
      })}>
        <input {...getInputProps()} id="file-upload-input" />
        
        {files.length === 0 && (
          <div className="text-center p-8 text-muted-foreground relative z-10">
            <div className="relative mb-6">
              <UploadCloud className={`mx-auto h-16 w-16 mb-4 text-accent transition-all duration-300 ${
                isDragActive ? 'scale-110 animate-bounce' : ''
              }`} />
              {isDragActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-accent animate-spin" />
                </div>
              )}
            </div>
            
            <h3 className="font-bold text-lg text-foreground mb-2">
              {isDragActive ? 'Drop your design here!' : 'Upload Your Design'}
            </h3>
            
            <p className="text-sm mb-4">
              {isDragActive 
                ? 'Release to upload your file' 
                : "Drag 'n' drop a PNG file here, or click to select"
              }
            </p>
            
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-accent" />
                <span>PNG format</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-accent" />
                <span>Transparent backgrounds</span>
              </div>
            </div>
            
            {/* Upload suggestions */}
            <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground font-medium mb-2">💡 Pro Tips:</p>
              <ul className="text-xs text-muted-foreground space-y-1 text-left">
                <li>• Use high-resolution PNG files (300+ DPI)</li>
                <li>• Transparent backgrounds work best</li>
                <li>• Keep designs under 10MB for optimal performance</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {filePreview}
      
      {files.length > 0 && (
        <div className="absolute top-0 left-0 h-full p-4 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <EditorPanel />
          </div>
        </div>
      )}
      
      {/* Corner accent elements */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-accent/30 pointer-events-none" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-accent/30 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-accent/30 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-accent/30 pointer-events-none" />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            hsl(var(--accent) / 0.1),
            transparent
          );
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
