import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Brain, Layers, Cpu, Zap } from 'lucide-react';

interface AlgorithmGraphsProps {
  analysisData: {
    cnnConfidence: number;
    gradCamScore: number;
    transformerScore: number;
    processingSteps: Array<{
      step: string;
      confidence: number;
      time: number;
    }>;
  };
}

const AlgorithmGraphs: React.FC<AlgorithmGraphsProps> = ({ analysisData }) => {
  const algorithmData = [
    {
      name: 'CNN Deep Learning',
      confidence: analysisData.cnnConfidence,
      icon: Brain,
      color: '#8B5CF6'
    },
    {
      name: 'Grad-CAM Analysis',
      confidence: analysisData.gradCamScore,
      icon: Layers,
      color: '#06B6D4'
    },
    {
      name: 'Transformer Model',
      confidence: analysisData.transformerScore,
      icon: Cpu,
      color: '#10B981'
    }
  ];

  const radarData = [
    {
      algorithm: 'CNN',
      accuracy: analysisData.cnnConfidence,
      speed: 85,
      reliability: 92
    },
    {
      algorithm: 'Grad-CAM',
      accuracy: analysisData.gradCamScore,
      speed: 78,
      reliability: 88
    },
    {
      algorithm: 'Transformer',
      accuracy: analysisData.transformerScore,
      speed: 72,
      reliability: 95
    }
  ];

  const processingData = analysisData.processingSteps.map((step, index) => ({
    ...step,
    stage: index + 1
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {algorithmData.map((algo, index) => {
          const IconComponent = algo.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <IconComponent className="w-6 h-6" style={{ color: algo.color }} />
                  <Badge variant="secondary">
                    {algo.confidence}% confidence
                  </Badge>
                </div>
                <CardTitle className="text-lg">{algo.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${algo.confidence}%`,
                      backgroundColor: algo.color
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Algorithm performance metric
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Algorithm Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={algorithmData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Confidence']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="confidence" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Processing Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Confidence']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Algorithm Performance Radar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="algorithm" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Accuracy"
                dataKey="accuracy"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Speed"
                dataKey="speed"
                stroke="hsl(var(--authentic))"
                fill="hsl(var(--authentic))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Reliability"
                dataKey="reliability"
                stroke="hsl(var(--uncertain))"
                fill="hsl(var(--uncertain))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlgorithmGraphs;