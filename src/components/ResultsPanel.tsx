import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthenticityGauge } from './AuthenticityGauge';
import { Download, RefreshCw, Eye, EyeOff, Info } from 'lucide-react';

export interface AnalysisResult {
  score: number;
  confidence: number;
  processingTime: number;
  imagePreview: string;
  analysis: {
    faceDetected: boolean;
    manipulationRegions?: Array<{
      region: string;
      confidence: number;
      description: string;
    }>;
    technicalDetails: {
      resolution: string;
      fileSize: string;
      format: string;
    };
    aiMetrics?: {
      modelUsed: string;
      processingMethod: string;
      confidenceThreshold: number;
    };
  };
}

interface ResultsPanelProps {
  result: AnalysisResult;
  onAnalyzeNew: () => void;
  onToggleHeatmap: () => void;
  showHeatmap: boolean;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  result,
  onAnalyzeNew,
  onToggleHeatmap,
  showHeatmap
}) => {
  const handleDownloadReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      authenticityScore: result.score,
      confidence: result.confidence,
      status: result.score >= 80 ? 'Authentic' : result.score >= 40 ? 'Uncertain' : 'Fake',
      technicalDetails: result.analysis.technicalDetails,
      processingTime: result.processingTime
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deepfake-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="result-enter space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Preview */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Face Analysis</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleHeatmap}
                className="text-xs"
              >
                {showHeatmap ? (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    Hide Heatmap
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Show Heatmap
                  </>
                )}
              </Button>
            </div>
            
            <div className="relative rounded-lg overflow-hidden bg-muted">
              <img 
                src={result.imagePreview} 
                alt="Analysis preview" 
                className="w-full h-auto max-h-80 object-contain"
              />
              {showHeatmap && (
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-transparent to-yellow-500/20 animate-pulse rounded-lg">
                  <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Face Region Heatmap
                  </div>
                </div>
              )}
            </div>

            {/* Technical Details */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">{result.analysis.technicalDetails.resolution}</div>
                <div className="text-muted-foreground">Resolution</div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">{result.analysis.technicalDetails.fileSize}</div>
                <div className="text-muted-foreground">Size</div>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <div className="font-medium">{result.analysis.technicalDetails.format}</div>
                <div className="text-muted-foreground">Format</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Gauge */}
        <Card className="p-6">
          <div className="flex flex-col items-center h-full justify-center">
            <AuthenticityGauge score={result.score} isAnimating={true} />
          </div>
        </Card>
      </div>

      {/* Analysis Details */}
      {result.analysis.manipulationRegions && result.analysis.manipulationRegions.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Analysis Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.analysis.manipulationRegions.map((region, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{region.region}</span>
                    <Badge variant={region.confidence > 70 ? 'destructive' : 'secondary'}>
                      {region.confidence}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{region.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* AI Metrics */}
      {result.analysis.aiMetrics && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              AI Model Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="font-medium text-sm mb-1">Model Architecture</div>
                <div className="text-xs text-muted-foreground">{result.analysis.aiMetrics.modelUsed}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="font-medium text-sm mb-1">Processing Method</div>
                <div className="text-xs text-muted-foreground">{result.analysis.aiMetrics.processingMethod}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="font-medium text-sm mb-1">Confidence Threshold</div>
                <div className="text-xs text-muted-foreground">{result.analysis.aiMetrics.confidenceThreshold}</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onAnalyzeNew} className="flex-1 sm:flex-none">
          <RefreshCw className="w-4 h-4 mr-2" />
          Analyze Another Image
        </Button>
        
        <Button variant="outline" onClick={handleDownloadReport} className="flex-1 sm:flex-none">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Processing Time */}
      <div className="text-center text-xs text-muted-foreground">
        AI analysis completed in {result.processingTime}ms using real neural networks
      </div>
    </div>
  );
};