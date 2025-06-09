import { useState, useCallback, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { CTASection } from '@/components/sections/CTASection';

interface CustomerLogo {
  name: string;
  logo: string;
}

interface Testimonial {
  company: string;
  quote: string;
  author: string;
  role: string;
  logo?: string;
}

export function CustomersPage() {
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const autoplayPlugin = useCallback(
    () =>
      Autoplay({
        delay: 5000, // 5 seconds
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    []
  );

  const customerLogos: CustomerLogo[] = [
    { name: 'Sekure Payment Experts', logo: '/images/logos/sekure.svg' },
    { name: 'Litmus Learn', logo: '/images/logos/litmus.svg' },
    { name: 'Brickdata', logo: '/images/logos/brickdata.svg' },
    { name: 'Remotino', logo: '/images/logos/remotino.svg' },
    { name: 'Queso', logo: '/images/logos/queso.svg' },
  ];

  const testimonials: Testimonial[] = [
    {
      company: 'Sekure',
      quote: "Blueprint helped us slash test-case authoring time by 60%, letting our QA team focus on critical scenarios instead of boilerplate.",
      author: 'Tony Nero',
      role: 'VP Engineering',
      logo: '/images/logos/sekure.svg'
    },
    {
      company: 'Litmus',
      quote: "Integrating Blueprint with our learning platform was seamless. We cut our nightly regression suite from 400 to 120 tests without losing coverage.",
      author: 'Sarah Johnson',
      role: 'Head of Engineering',
      logo: '/images/logos/litmus.svg'
    },
    {
      company: 'Brickdata',
      quote: "AI-driven test runs boosted our release velocity. We now get clear ship/no-ship signals in minutes, not days.",
      author: 'Luca Bianchi',
      role: 'QA Lead',
      logo: '/images/logos/brickdata.svg'
    }
  ];

  // Update active testimonial index when carousel changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setActiveTestimonialIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    // Initial selection
    setActiveTestimonialIndex(api.selectedScrollSnap());

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const benefits = [
    {
      title: "Instant Test Authoring",
      description: "Create comprehensive test cases from plain-English prompts or ticket links"
    },
    {
      title: "Code-Style Reviews",
      description: "Catch gaps before execution with our PR-style review workflow"
    },
    {
      title: "Smart Test Runs",
      description: "Guarantee maximum coverage with fewer tests through AI optimization"
    },
    {
      title: "Actionable Coverage Signals",
      description: "Get clear insights for confident, on-time shipping"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Join the fast-moving teams across industries who trust Blueprint
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Transform your QA process with AI-powered test case generation and management
            </p>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 md:py-16 border-y border-border bg-accent/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">Trusted by</p>

          {/* Logo Carousel */}
          <div className="flex overflow-hidden">
            <div className="flex animate-carousel">
              {[...customerLogos, ...customerLogos].map((logo, index) => (
                <div key={index} className="flex-shrink-0 w-[200px] mx-8 flex items-center justify-center">
                  <img
                    src={logo.logo}
                    alt={logo.name}
                    className="h-12 max-w-[160px] object-contain opacity-70 hover:opacity-100 transition-opacity dark:filter dark:brightness-0 dark:invert"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Success Stories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Featured Success Stories</h2>

          <div className="relative max-w-4xl mx-auto">
            <Carousel
              setApi={setApi}
              opts={{
                loop: true,
                align: "center",
              }}
              plugins={[autoplayPlugin()]}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="bg-card border border-border rounded-xl p-8 md:p-12 shadow-lg">
                      <div className="flex items-center mb-6">
                        <img
                          src={testimonial.logo}
                          alt={testimonial.company}
                          className="h-10 mr-4"
                        />
                      </div>

                      <blockquote className="text-xl md:text-2xl font-medium mb-6">
                        "{testimonial.quote}"
                      </blockquote>

                      <div className="flex items-center">
                        <div>
                          <p className="font-semibold">— {testimonial.author}</p>
                          <p className="text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-8 gap-4">
                <CarouselPrevious
                  className="relative static transform-none w-10 h-10 rounded-full bg-accent shadow-lg"
                  variant="ghost"
                />
                <div className="flex gap-2 items-center">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={`w-2 h-2 rounded-full ${index === activeTestimonialIndex ? 'bg-primary' : 'bg-border'}`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                <CarouselNext
                  className="relative static transform-none w-10 h-10 rounded-full bg-accent shadow-lg"
                  variant="ghost"
                />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Why These Teams Love Blueprint */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why These Teams Love Blueprint</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-card border border-border/30 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
