import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Download, Grid3X3, Image as ImageIcon, Video } from 'lucide-react';

interface MediaFrameExtractorProps {
  file: File;
  onFrameAnalysis: (frames: Array<{ timestamp: number; dataUrl: string; analysis?: any }>) => void;
}

const MediaFrameExtractor: React.FC<MediaFrameExtractorProps> = ({ file, onFrameAnalysis }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [extractedFrames, setExtractedFrames] = useState<Array<{ timestamp: number; dataUrl: string }>>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');
  const mediaUrl = URL.createObjectURL(file);

  useEffect(() => {
    if (isImage) {
      // Automatically extract the single frame for images
      extractImageFrame();
    }
  }, [file]);

  const extractImageFrame = async () => {
    if (!isImage || !canvasRef.current || !imageRef.current) return;
    
    setIsExtracting(true);
    
    // Wait for image to load
    const img = imageRef.current;
    if (!img.complete) {
      await new Promise((resolve) => {
        img.onload = resolve;
      });
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const frames = [{ timestamp: 0, dataUrl }];
    
    setExtractedFrames(frames);
    onFrameAnalysis(frames);
    setIsExtracting(false);
  };

  const extractFrameAtTime = (time: number): Promise<string> => {
    return new Promise((resolve) => {
      if (!videoRef.current || !canvasRef.current) {
        resolve('');
        return;
      }
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('');
        return;
      }
      
      const handleSeeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        video.removeEventListener('seeked', handleSeeked);
        resolve(dataUrl);
      };
      
      video.addEventListener('seeked', handleSeeked);
      video.currentTime = time;
    });
  };

  const extractMultipleFrames = async (frameCount: number = 9) => {
    if (!videoRef.current || duration === 0) return;
    
    setIsExtracting(true);
    const frames: Array<{ timestamp: number; dataUrl: string }> = [];
    
    for (let i = 0; i < frameCount; i++) {
      const timestamp = (duration / (frameCount - 1)) * i;
      const dataUrl = await extractFrameAtTime(timestamp);
      if (dataUrl) {
        frames.push({ timestamp, dataUrl });
      }
    }
    
    setExtractedFrames(frames);
    onFrameAnalysis(frames);
    setIsExtracting(false);
  };

  const extractCurrentFrame = async () => {
    if (!videoRef.current) return;
    
    const dataUrl = await extractFrameAtTime(currentTime);
    if (dataUrl) {
      const newFrame = { timestamp: currentTime, dataUrl };
      const updatedFrames = [...extractedFrames, newFrame];
      setExtractedFrames(updatedFrames);
      onFrameAnalysis(updatedFrames);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const seekTo = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadFrame = (dataUrl: string, timestamp: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = isImage 
      ? `${file.name.split('.')[0]}_frame.jpg`
      : `frame_${formatTime(timestamp)}.jpg`;
    link.click();
  };

  const clearFrames = () => {
    setExtractedFrames([]);
    onFrameAnalysis([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isVideo ? <Video className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            {isVideo ? 'Video' : 'Image'} Frame Extractor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            {isVideo ? (
              <video
                ref={videoRef}
                src={mediaUrl}
                className="w-full rounded-lg shadow-medium"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            ) : (
              <img
                ref={imageRef}
                src={mediaUrl}
                alt="Uploaded image"
                className="w-full rounded-lg shadow-medium"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          {isVideo && (
            <>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => seekTo(Math.max(0, currentTime - 10))}
                  variant="outline"
                  size="sm"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button onClick={togglePlay} variant="outline" size="sm">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  onClick={() => seekTo(Math.min(duration, currentTime + 10))}
                  variant="outline"
                  size="sm"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
                
                <div className="flex-1">
                  <Slider
                    value={[currentTime]}
                    onValueChange={([value]) => seekTo(value)}
                    max={duration}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <Badge variant="secondary">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Badge>
              </div>
              
              <div className="flex gap-4 flex-wrap">
                <Button
                  onClick={() => extractMultipleFrames(9)}
                  disabled={isExtracting || duration === 0}
                  className="flex items-center gap-2"
                >
                  {isExtracting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Grid3X3 className="w-4 h-4" />
                  )}
                  Extract 9 Frames
                </Button>
                
                <Button
                  onClick={() => extractMultipleFrames(16)}
                  disabled={isExtracting || duration === 0}
                  variant="outline"
                >
                  Extract 16 Frames
                </Button>
                
                <Button
                  onClick={extractCurrentFrame}
                  disabled={isExtracting || duration === 0}
                  variant="outline"
                >
                  Extract Current Frame
                </Button>
              </div>
            </>
          )}

          {isImage && (
            <div className="flex gap-4">
              <Button
                onClick={extractImageFrame}
                disabled={isExtracting}
                className="flex items-center gap-2"
              >
                {isExtracting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                Extract Image Frame
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {extractedFrames.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5" />
                Extracted Frames ({extractedFrames.length})
              </CardTitle>
              <Button
                onClick={clearFrames}
                variant="outline"
                size="sm"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {extractedFrames.map((frame, index) => (
                <div key={index} className="relative group">
                  <img
                    src={frame.dataUrl}
                    alt={isImage ? `Frame ${index + 1}` : `Frame at ${formatTime(frame.timestamp)}`}
                    className="w-full aspect-video object-cover rounded-lg shadow-soft hover:shadow-medium transition-shadow cursor-pointer"
                    onClick={() => window.open(frame.dataUrl, '_blank')}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFrame(frame.dataUrl, frame.timestamp);
                      }}
                      size="sm"
                      variant="secondary"
                      className="opacity-90"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="absolute bottom-2 left-2 text-xs"
                  >
                    {isImage ? `#${index + 1}` : formatTime(frame.timestamp)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaFrameExtractor;