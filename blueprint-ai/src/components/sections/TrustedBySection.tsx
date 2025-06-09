

interface LogoItem {
  src: string;
  alt: string;
}

interface TrustedBySectionProps {
  title?: string;
  logos?: LogoItem[];
}

export function TrustedBySection({
  title = "Trusted by QA teams at",
  logos = [
    {
      src: "/images/logos/sekure.svg",
      alt: "Sekure"
    },
    {
      src: "/images/logos/litmus.svg",
      alt: "Litmus"
    },
    {
      src: "/images/logos/brickdata.svg",
      alt: "Brickdata"
    },
    {
      src: "/images/logos/remotino.svg",
      alt: "Remotino"
    },
    {
      src: "/images/logos/queso.svg",
      alt: "Queso"
    }
  ]
}: TrustedBySectionProps) {
  return (
    <section className="py-12 md:py-16 border-y border-border bg-accent/20 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">{title}</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-10 md:h-12 max-w-[120px] md:max-w-[140px] object-contain opacity-70 hover:opacity-100 transition-opacity dark:filter dark:brightness-0 dark:invert"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
