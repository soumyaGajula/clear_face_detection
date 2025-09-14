import React, { useCallback, useState } from 'react';
import { Upload, Image, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import uploadIcon from '@/assets/upload-icon.png';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect, isAnalyzing }) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const validateFile = (file: File): string => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setError('');

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <Card className="p-8">
      <div
        className={`upload-area relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          dragOver ? 'drag-over border-primary bg-primary/5' : 'border-muted-foreground/30'
        } ${isAnalyzing ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:border-primary/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isAnalyzing && document.getElementById('file-input')?.click()}
      >
        {isAnalyzing && (
          <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-lg font-medium">Analyzing Image...</p>
              <p className="text-sm text-muted-foreground mt-1">This may take a few moments</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 mb-4">
            <img 
              src={uploadIcon} 
              alt="Upload" 
              className="w-full h-full opacity-60"
            />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Upload Image for Analysis</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your image here, or click to browse
            </p>
          </div>

          <Button 
            variant="outline" 
            className="mx-auto"
            disabled={isAnalyzing}
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Image
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Image className="w-3 h-3" />
              <span>Supports JPEG, PNG, WebP (max 10MB)</span>
            </div>
          </div>
        </div>

        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
          disabled={isAnalyzing}
        />
      </div>

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </Card>
  );
};