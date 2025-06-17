import { RetroGrid } from '@/components/magicui/retro-grid';
import { CTASection } from '@/components/sections/CTASection';

export function CookiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
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
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Cookie Policy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg max-w-none">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">What Are Cookies</h2>
                <p className="text-lg mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">How We Use Cookies</h2>
                <p className="text-lg mb-4">
                  Blueprint uses cookies to enhance your experience on our platform. We use cookies for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>Authentication and security</li>
                  <li>Remembering your preferences and settings</li>
                  <li>Analyzing how you use our service</li>
                  <li>Improving our platform performance</li>
                  <li>Providing personalized content</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Types of Cookies We Use</h2>

                <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
                <p className="text-lg mb-4">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                </p>

                <h3 className="text-xl font-semibold mb-2">Performance Cookies</h3>
                <p className="text-lg mb-4">
                  These cookies collect information about how visitors use our website, such as which pages are visited most often. This data helps us improve how our website works.
                </p>

                <h3 className="text-xl font-semibold mb-2">Functional Cookies</h3>
                <p className="text-lg mb-4">
                  These cookies allow the website to remember choices you make and provide enhanced, more personal features.
                </p>

                <h3 className="text-xl font-semibold mb-2">Analytics Cookies</h3>
                <p className="text-lg mb-4">
                  We use analytics cookies to understand how our service is being used and to identify areas for improvement.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Third-Party Cookies</h2>
                <p className="text-lg mb-4">
                  We may use third-party services that place cookies on your device. These services include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>Google Analytics for website analytics</li>
                  <li>Authentication providers for secure login</li>
                  <li>Content delivery networks for performance</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Managing Cookies</h2>
                <p className="text-lg mb-4">
                  You can control and manage cookies in various ways:
                </p>

                <h3 className="text-xl font-semibold mb-2">Browser Settings</h3>
                <p className="text-lg mb-4">
                  Most browsers allow you to control cookies through their settings preferences. You can set your browser to refuse cookies or delete certain cookies.
                </p>

                <h3 className="text-xl font-semibold mb-2">Cookie Preferences</h3>
                <p className="text-lg mb-4">
                  You can manage your cookie preferences through our cookie consent banner when you first visit our site.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Impact of Disabling Cookies</h2>
                <p className="text-lg mb-4">
                  Please note that disabling certain cookies may impact the functionality of our service. Essential cookies cannot be disabled as they are necessary for the platform to work properly.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Cookie Retention</h2>
                <p className="text-lg mb-4">
                  Cookies are retained for different periods depending on their purpose:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>Session cookies: Deleted when you close your browser</li>
                  <li>Persistent cookies: Remain until they expire or you delete them</li>
                  <li>Authentication cookies: Typically expire after 30 days</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Updates to This Policy</h2>
                <p className="text-lg mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                <p className="text-lg mb-4">
                  If you have any questions about our use of cookies, please contact us at hello@appexert.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
