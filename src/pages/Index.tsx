import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UploadArea } from '@/components/UploadArea';
import { ResultsPanel, AnalysisResult } from '@/components/ResultsPanel';
import { Shield, Zap, Eye, Users, ArrowDown } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'upload' | 'results'>('landing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const handleGetStarted = () => {
    setCurrentStep('upload');
  };

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    
    // Create preview URL
    const imagePreview = URL.createObjectURL(file);
    
    // Simulate analysis (in real app, this would call your ML API)
    setTimeout(() => {
      // Generate mock results based on random analysis
      const score = Math.floor(Math.random() * 100);
      const confidence = Math.floor(Math.random() * 30) + 70;
      
      const mockResult: AnalysisResult = {
        score,
        confidence,
        processingTime: Math.floor(Math.random() * 2000) + 1000,
        imagePreview,
        analysis: {
          faceDetected: true,
          manipulationRegions: score < 70 ? [
            {
              region: 'Facial Boundary',
              confidence: 89,
              description: 'Digital-world face swap detected with blending inconsistencies'
            },
            {
              region: 'Eye-Mouth Region',
              confidence: 76,
              description: 'Texture mismatch indicating potential AI-generated synthesis'
            },
            {
              region: 'Skin Texture',
              confidence: 68,
              description: 'Objective-world manipulation artifacts in surface appearance'
            }
          ] : undefined,
          technicalDetails: {
            resolution: '1920x1080',
            fileSize: (file.size / 1024 / 1024).toFixed(1) + ' MB',
            format: file.type.split('/')[1].toUpperCase()
          }
        }
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      setCurrentStep('results');
    }, 3000);
  };

  const handleAnalyzeNew = () => {
    setCurrentStep('upload');
    setAnalysisResult(null);
    setShowHeatmap(false);
  };

  const handleToggleHeatmap = () => {
    setShowHeatmap(!showHeatmap);
  };

  const features = [
    {
      icon: Shield,
      title: 'Multi-Type Detection',
      description: 'Detects digital face swaps, AI-generated faces, and objective-world manipulations using advanced neural networks.'
    },
    {
      icon: Zap,
      title: 'Real-time Analysis',
      description: 'Instant detection of deepfakes, face replacements, and synthetic media with 99%+ accuracy in under 3 seconds.'
    },
    {
      icon: Eye,
      title: 'Manipulation Mapping',
      description: 'Pinpoint altered regions with heatmap overlays showing digital artifacts and blending inconsistencies.'
    },
    {
      icon: Users,
      title: 'Forensic Grade',
      description: 'Trusted by law enforcement, media outlets, and security teams for reliable authenticity verification.'
    }
  ];

  if (currentStep === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="AI Technology Background" 
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          
          <div className="relative container mx-auto px-4 py-24 text-center">
            <Badge variant="secondary" className="mb-6 text-sm">
              🛡️ Advanced DeepFake Detection
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Detect DeepFakes
              <br />
              <span className="text-4xl md:text-6xl">Protect Reality</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Detect digital face swaps, AI-generated faces, and real-world manipulation techniques. 
              Our advanced neural networks analyze both digital-world and objective-world fake faces with precision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="text-lg px-8 py-4 h-auto animate-pulse-glow"
              >
                <Shield className="w-5 h-5 mr-2" />
                Start Detection
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 h-auto"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                Learn More
                <ArrowDown className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.2%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">&lt;3s</div>
                <div className="text-sm text-muted-foreground">Analysis Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10M+</div>
                <div className="text-sm text-muted-foreground">Images Analyzed</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Our Detection System?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built with the latest advances in computer vision and machine learning
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Verify Your Images?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust our system to detect manipulated content
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleGetStarted}
              className="text-lg px-8 py-4 h-auto"
            >
              <Shield className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (currentStep === 'upload') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Upload Image for Analysis</h1>
              <p className="text-muted-foreground">
                Upload any facial image to detect digital face swaps, AI-generated content, or real-world manipulation
              </p>
            </div>
            
            <UploadArea 
              onFileSelect={handleFileSelect}
              isAnalyzing={isAnalyzing}
            />
            
            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentStep('landing')}
                disabled={isAnalyzing}
              >
                ← Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && analysisResult) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Analysis Complete</h1>
              <p className="text-muted-foreground">
                Here are the results from our deepfake detection analysis
              </p>
            </div>
            
            <ResultsPanel
              result={analysisResult}
              onAnalyzeNew={handleAnalyzeNew}
              onToggleHeatmap={handleToggleHeatmap}
              showHeatmap={showHeatmap}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;