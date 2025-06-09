import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { RetroGrid } from '@/components/magicui/retro-grid';
import { useRef, useEffect, useState } from 'react';

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => {
        setVideoLoaded(true);
      });

      videoRef.current.addEventListener('error', () => {
        setVideoError(true);
      });
    }
  }, []);

  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-background via-background/95 to-background/90">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <RetroGrid
          className="opacity-[0.15]"
          angle={65}
          cellSize={60}
          darkLineColor="gray"
        />
      </div>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent z-0 pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Hero Text Content */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              AI-Powered QA Copilot for Better Test Cases
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Blueprint streamlines your QA process with AI-generated test cases, simplified review workflows, and actionable quality insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link to="/test-cases" className="w-full sm:w-auto">
                    <Button size="lg" className="px-6 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                      My Test Cases
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/dashboard" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="px-6 w-full sm:w-auto">
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button size="lg" className="px-6 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/demo" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="px-6 w-full sm:w-auto">
                      Talk to sales
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Video Section */}
          <div className="relative w-full max-w-5xl mx-auto mt-8">
            {/* Enhanced Adaptive Glow Background - Multiple Layers */}
            <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-3xl blur-3xl opacity-60 dark:opacity-40 animate-pulse"></div>
            <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-primary/20 to-primary/30 rounded-2xl blur-2xl opacity-70 dark:opacity-50"></div>
            <div className="absolute -inset-2 bg-gradient-to-tr from-primary/5 via-transparent to-primary/15 rounded-xl blur-xl opacity-80 dark:opacity-60"></div>
            
            {/* Video Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 dark:ring-white/5 bg-slate-100 dark:bg-slate-800">
              {/* Always show fallback image first */}
              <img
                src="/images/generated-test-cases.png"
                alt="Blueprint AI test case generation demo"
                className={`w-full h-auto object-cover ${videoLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
              />
              
              {/* Video overlay */}
              {!videoError && (
                <video
                  ref={videoRef}
                  className={`absolute inset-0 w-full h-full object-cover ${videoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/videos/blueprint-ai-test-cases.webm" type="video/webm" />
                </video>
              )}

              {/* Subtle Screen Reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}