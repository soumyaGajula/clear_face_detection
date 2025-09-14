import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface AuthenticityGaugeProps {
  score: number; // 0-100
  isAnimating?: boolean;
}

export const AuthenticityGauge: React.FC<AuthenticityGaugeProps> = ({ 
  score, 
  isAnimating = false 
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setAnimatedScore(score);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimatedScore(score);
    }
  }, [score, isAnimating]);

  const getStatusInfo = (score: number) => {
    if (score >= 80) {
      return {
        status: 'authentic' as const,
        label: 'Likely Real',
        icon: ShieldCheck,
        color: 'hsl(var(--authentic))',
        bgColor: 'hsl(var(--authentic-light))',
        description: 'High confidence this image is authentic'
      };
    } else if (score >= 40) {
      return {
        status: 'uncertain' as const,
        label: 'Uncertain',
        icon: AlertTriangle,
        color: 'hsl(var(--uncertain))',
        bgColor: 'hsl(var(--uncertain-light))',
        description: 'Analysis shows mixed signals'
      };
    } else {
      return {
        status: 'fake' as const,
        label: 'Likely Fake',
        icon: ShieldAlert,
        color: 'hsl(var(--fake))',
        bgColor: 'hsl(var(--fake-light))',
        description: 'High confidence this image has been manipulated'
      };
    }
  };

  const statusInfo = getStatusInfo(animatedScore);
  const Icon = statusInfo.icon;

  // Calculate the stroke dash array for the circular progress
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Circular Gauge */}
      <div className="relative w-48 h-48">
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 200 200"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="hsl(var(--border))"
            strokeWidth="8"
            fill="none"
          />
          
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={statusInfo.color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-out ${
              isAnimating ? 'gauge-fill' : ''
            }`}
            style={{
              filter: `drop-shadow(0 0 8px ${statusInfo.color}30)`
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon 
            className="w-8 h-8 mb-2" 
            style={{ color: statusInfo.color }}
          />
          <span 
            className="text-3xl font-bold"
            style={{ color: statusInfo.color }}
          >
            {Math.round(animatedScore)}%
          </span>
          <span className="text-sm text-muted-foreground">Authenticity</span>
        </div>
      </div>

      {/* Status Info */}
      <div className="text-center space-y-2">
        <div 
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: statusInfo.bgColor,
            color: statusInfo.color 
          }}
        >
          <Icon className="w-4 h-4 mr-2" />
          {statusInfo.label}
        </div>
        
        <p className="text-sm text-muted-foreground max-w-xs">
          {statusInfo.description}
        </p>
      </div>

      {/* Confidence Bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Confidence</span>
          <span>{Math.round(Math.abs(animatedScore - 50) + 50)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${Math.abs(animatedScore - 50) + 50}%`,
              backgroundColor: statusInfo.color
            }}
          />
        </div>
      </div>
    </div>
  );
};