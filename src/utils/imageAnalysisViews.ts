// Utility functions to generate analytical views of images for fake detection

export const generateAnalyticalViews = async (file: File) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Load the image
  const img = new Image();
  const imageUrl = URL.createObjectURL(file);
  
  return new Promise<{
    edgeDetection: string;
    textureAnalysis: string;
    lightingAnalysis: string;
    colorDistribution: string;
  }>((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Generate different analytical views
      const views = {
        edgeDetection: generateEdgeDetection(canvas, ctx, imageData),
        textureAnalysis: generateTextureAnalysis(canvas, ctx, imageData),
        lightingAnalysis: generateLightingAnalysis(canvas, ctx, imageData),
        colorDistribution: generateColorDistribution(canvas, ctx, imageData)
      };
      
      URL.revokeObjectURL(imageUrl);
      resolve(views);
    };
    
    img.src = imageUrl;
  });
};

const generateEdgeDetection = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, imageData: ImageData): string => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const outputData = new ImageData(width, height);
  
  // Simple Sobel edge detection
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Get surrounding pixels for gradient calculation
      const gx = (
        data[((y - 1) * width + (x + 1)) * 4] - data[((y - 1) * width + (x - 1)) * 4] +
        2 * (data[(y * width + (x + 1)) * 4] - data[(y * width + (x - 1)) * 4]) +
        data[((y + 1) * width + (x + 1)) * 4] - data[((y + 1) * width + (x - 1)) * 4]
      );
      
      const gy = (
        data[((y - 1) * width + (x - 1)) * 4] + 2 * data[((y - 1) * width + x) * 4] + data[((y - 1) * width + (x + 1)) * 4] -
        data[((y + 1) * width + (x - 1)) * 4] - 2 * data[((y + 1) * width + x) * 4] - data[((y + 1) * width + (x + 1)) * 4]
      );
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const value = Math.min(255, magnitude);
      
      outputData.data[idx] = value;
      outputData.data[idx + 1] = value;
      outputData.data[idx + 2] = value;
      outputData.data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(outputData, 0, 0);
  return canvas.toDataURL();
};

const generateTextureAnalysis = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, imageData: ImageData): string => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const outputData = new ImageData(width, height);
  
  // Enhance texture patterns using local variance
  const windowSize = 5;
  const halfWindow = Math.floor(windowSize / 2);
  
  for (let y = halfWindow; y < height - halfWindow; y++) {
    for (let x = halfWindow; x < width - halfWindow; x++) {
      let sum = 0;
      let count = 0;
      
      // Calculate local mean
      for (let dy = -halfWindow; dy <= halfWindow; dy++) {
        for (let dx = -halfWindow; dx <= halfWindow; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          sum += (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          count++;
        }
      }
      
      const mean = sum / count;
      let variance = 0;
      
      // Calculate local variance
      for (let dy = -halfWindow; dy <= halfWindow; dy++) {
        for (let dx = -halfWindow; dx <= halfWindow; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          variance += Math.pow(gray - mean, 2);
        }
      }
      
      variance /= count;
      const textureValue = Math.min(255, Math.sqrt(variance) * 3);
      
      const outputIdx = (y * width + x) * 4;
      outputData.data[outputIdx] = textureValue;
      outputData.data[outputIdx + 1] = textureValue * 0.8;
      outputData.data[outputIdx + 2] = textureValue * 0.6;
      outputData.data[outputIdx + 3] = 255;
    }
  }
  
  ctx.putImageData(outputData, 0, 0);
  return canvas.toDataURL();
};

const generateLightingAnalysis = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, imageData: ImageData): string => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const outputData = new ImageData(width, height);
  
  // Analyze lighting gradients and inconsistencies
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Calculate luminance
      const luminance = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      
      // Calculate lighting gradient
      const leftLum = 0.299 * data[(y * width + (x - 1)) * 4] + 0.587 * data[(y * width + (x - 1)) * 4 + 1] + 0.114 * data[(y * width + (x - 1)) * 4 + 2];
      const rightLum = 0.299 * data[(y * width + (x + 1)) * 4] + 0.587 * data[(y * width + (x + 1)) * 4 + 1] + 0.114 * data[(y * width + (x + 1)) * 4 + 2];
      const topLum = 0.299 * data[((y - 1) * width + x) * 4] + 0.587 * data[((y - 1) * width + x) * 4 + 1] + 0.114 * data[((y - 1) * width + x) * 4 + 2];
      const bottomLum = 0.299 * data[((y + 1) * width + x) * 4] + 0.587 * data[((y + 1) * width + x) * 4 + 1] + 0.114 * data[((y + 1) * width + x) * 4 + 2];
      
      const horizontalGrad = Math.abs(rightLum - leftLum);
      const verticalGrad = Math.abs(bottomLum - topLum);
      const gradientMagnitude = Math.sqrt(horizontalGrad * horizontalGrad + verticalGrad * verticalGrad);
      
      const enhancedValue = Math.min(255, gradientMagnitude * 2);
      
      outputData.data[idx] = luminance * 0.5 + enhancedValue * 0.5;
      outputData.data[idx + 1] = enhancedValue;
      outputData.data[idx + 2] = luminance * 0.3;
      outputData.data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(outputData, 0, 0);
  return canvas.toDataURL();
};

const generateColorDistribution = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, imageData: ImageData): string => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const outputData = new ImageData(width, height);
  
  // Analyze color distribution and unnatural patterns
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      // Calculate color saturation and hue shifts
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      
      // Enhance unnatural color distributions
      const colorUniformity = 1 - Math.abs(r - g) / 255 - Math.abs(g - b) / 255 - Math.abs(r - b) / 255;
      const artificialness = saturation > 0.8 || colorUniformity > 0.9 ? 255 : saturation * 255;
      
      outputData.data[idx] = r * 0.3 + artificialness * 0.7;
      outputData.data[idx + 1] = g * 0.3 + artificialness * 0.5;
      outputData.data[idx + 2] = b * 0.3 + artificialness * 0.3;
      outputData.data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(outputData, 0, 0);
  return canvas.toDataURL();
};