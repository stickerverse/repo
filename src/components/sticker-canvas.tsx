'use client';

import React, { useCallback, useMemo } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
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
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={files[0].preview}
            alt={files[0].name}
            fill
            className="object-contain"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4 z-20 rounded-full"
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);


  return (
    <div className="relative aspect-video w-full h-auto min-h-[400px] md:min-h-[500px] bg-white/5 backdrop-blur-sm border-dashed border-2 border-white/20 hover:border-cyan-400 transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/10 rounded-lg">
      <div {...getRootProps({ className: 'w-full h-full flex items-center justify-center cursor-pointer' })}>
        <input {...getInputProps()} id="file-upload-input" />
        
        {files.length === 0 && (
          <div className="text-center p-8 text-gray-400">
            <UploadCloud className="mx-auto h-16 w-16 mb-4 text-cyan-400/70" />
            <p className="font-bold text-lg text-white">
              {isDragActive ? 'Drop the file here ...' : "Drag 'n' drop a PNG file here, or click to select"}
            </p>
            <p className="text-sm">Transparent PNGs work best</p>
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
    </div>
  );
}
