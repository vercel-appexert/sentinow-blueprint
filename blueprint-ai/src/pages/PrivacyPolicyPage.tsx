import { RetroGrid } from '@/components/magicui/retro-grid';
import { CTASection } from '@/components/sections/CTASection';

export function PrivacyPolicyPage() {
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-xl text-foreground/80 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8 text-foreground">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">1. Information We Collect</h2>
                <p className="text-lg mb-4 text-foreground/90 leading-relaxed">
                  We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
                </p>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Personal Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-lg text-foreground/90">
                  <li>Name and email address</li>
                  <li>Account credentials</li>
                  <li>Profile information</li>
                  <li>Communication preferences</li>
                </ul>
                <h3 className="text-xl font-semibold mb-2 mt-4 text-foreground">Usage Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-lg text-foreground/90">
                  <li>Test cases and related data</li>
                  <li>Usage patterns and preferences</li>
                  <li>Device and browser information</li>
                  <li>Log data and analytics</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">2. How We Use Your Information</h2>
                <p className="text-lg mb-4 text-foreground/90 leading-relaxed">
                  We use the information we collect to provide, maintain, and improve our services:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg text-foreground/90">
                  <li>Provide and operate the Blueprint service</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to comments, questions, and customer service requests</li>
                  <li>Monitor and analyze trends and usage</li>
                  <li>Personalize and improve the service</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">3. Information Sharing</h2>
                <p className="text-lg mb-4 text-foreground/90 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg text-foreground/90">
                  <li>With your consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                  <li>With service providers who assist in our operations</li>
                  <li>In connection with a business transfer</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">4. Data Security</h2>
                <p className="text-lg mb-4 text-foreground/90 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">5. Data Retention</h2>
                <p className="text-lg mb-4 text-foreground/90 leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">6. Your Rights</h2>
                <p className="text-lg mb-4 text-foreground/90 leading-relaxed">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg text-foreground/90">
                  <li>Access and update your information</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">7. Cookies and Tracking</h2>
                <p className="text-lg mb-4 text-foreground/90 leading-relaxed">
                  We use cookies and similar tracking technologies to collect and use personal information about you. For more information about our use of cookies, please see our Cookie Policy.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">8. International Transfers</h2>
                <p className="text-lg mb-4 text-foreground/90 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">9. Changes to This Policy</h2>
                <p className="text-lg mb-4 text-foreground/90 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">10. Contact Us</h2>
                <p className="text-lg mb-4 text-foreground/90 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at hello@appexert.com.
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
