import { CheckCircle, MessageSquare, Zap, BarChart, Plug, Play } from 'lucide-react';
import { RetroGrid } from '@/components/magicui/retro-grid';
import { CTASection } from '@/components/sections/CTASection';
import { TrustedBySection } from '@/components/sections/TrustedBySection';

// Feature icons
const Icons = {
  MessageChat: () => (
    <MessageSquare className="h-6 w-6 text-primary-foreground" />
  ),
  ZapFast: () => (
    <Zap className="h-6 w-6 text-primary-foreground" />
  ),
  BarChart: () => (
    <BarChart className="h-6 w-6 text-primary-foreground" />
  ),
  PlugIntegration: () => (
    <Plug className="h-6 w-6 text-primary-foreground" />
  ),
  PlayRun: () => (
    <Play className="h-6 w-6 text-primary-foreground" />
  ),
  CheckCircle: () => (
    <CheckCircle className="h-5 w-5 text-primary" />
  ),
};

export function ProductFeaturesPage() {

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
            <p className="text-base text-primary font-semibold mb-3">Features</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Empower Every Step of Your QA Workflow
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Blueprint brings AI-driven precision and clarity to test creation, review, execution, reporting, and integration—so your team spends less time on process and more time on quality.
            </p>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <TrustedBySection />

      {/* Features Section */}
      <section className="py-24 relative bg-accent/20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Features for Modern QA Teams</h2>
            <p className="text-lg text-muted-foreground">
              Discover how Blueprint transforms every aspect of your testing workflow with AI-powered precision and intuitive design.
            </p>
          </div>

          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row gap-20 mb-32">
            <div className="flex-1">
              <div className="mb-6">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-5">
                  <Icons.MessageChat />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">AI-Powered Test Generation</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Generate comprehensive test cases from Jira tickets or text prompts in BDD (Gherkin) or step-by-step format in seconds.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">Natural-language prompts to create production-ready test scenarios</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">Integration with Jira, Linear, and Azure DevOps</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">Best practices built-in: business language, real data, focused scenarios</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              {/* Enhanced Adaptive Glow Background - Multiple Layers */}
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-3xl blur-3xl opacity-60 dark:opacity-40 animate-pulse"></div>
              <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-primary/20 to-primary/30 rounded-2xl blur-2xl opacity-70 dark:opacity-50"></div>
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary/5 via-transparent to-primary/15 rounded-xl blur-xl opacity-80 dark:opacity-60"></div>
              
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 dark:ring-white/5 bg-slate-100 dark:bg-slate-800">
                <img
                  src="/images/generated-test-cases.png"
                  alt="Test Generation Interface"
                  className="w-full h-auto object-cover"
                />
                
                {/* Subtle Screen Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col md:flex-row-reverse gap-20 mb-32">
            <div className="flex-1">
              <div className="mb-6">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-5">
                  <Icons.ZapFast />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">PR-Style Test Review</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Review test cases like code with line-by-line diffs, comments, and approvals before execution.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">See exactly what changed with clear visual diffs</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">Auto-organized folder structure for clean test repositories</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">Threaded comments and mentions for collaborative feedback</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              {/* Enhanced Adaptive Glow Background - Multiple Layers */}
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-3xl blur-3xl opacity-60 dark:opacity-40 animate-pulse"></div>
              <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-primary/20 to-primary/30 rounded-2xl blur-2xl opacity-70 dark:opacity-50"></div>
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary/5 via-transparent to-primary/15 rounded-xl blur-xl opacity-80 dark:opacity-60"></div>
              
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 dark:ring-white/5 bg-slate-100 dark:bg-slate-800">
                <img
                  src="/images/test-review-comments.png"
                  alt="Test Review Interface"
                  className="w-full h-auto object-cover"
                />
                
                {/* Subtle Screen Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col md:flex-row gap-20 mb-32">
            <div className="flex-1">
              <div className="mb-6">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-5">
                  <Icons.BarChart />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Insightful Test Reports</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Turn raw test results into actionable coverage signals and clear "ship/not-ship" recommendations.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">Coverage insights showing fully tested, partly tested, or untested features</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">Ship or Don't Ship signals based on test health and blockers</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">Export results to Confluence, Power BI, or your own data stack</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              {/* Enhanced Adaptive Glow Background - Multiple Layers */}
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-3xl blur-3xl opacity-60 dark:opacity-40 animate-pulse"></div>
              <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-primary/20 to-primary/30 rounded-2xl blur-2xl opacity-70 dark:opacity-50"></div>
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary/5 via-transparent to-primary/15 rounded-xl blur-xl opacity-80 dark:opacity-60"></div>
              
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 dark:ring-white/5 bg-slate-100 dark:bg-slate-800">
                <img
                  src="/images/reports.png"
                  alt="Test Reporting Dashboard"
                  className="w-full h-auto object-cover"
                />
                
                {/* Subtle Screen Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Feature 4 - Integrations */}
          <div className="flex flex-col md:flex-row-reverse gap-20 mb-32">
            <div className="flex-1">
              <div className="mb-6">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-5">
                  <Icons.PlugIntegration />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Seamless Integrations</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Connect Blueprint with your existing tools to create a unified testing workflow without disruption.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">Jira integration for test case generation from tickets</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">GitHub and Azure DevOps for version control and CI/CD</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">Slack notifications for test results and review requests</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              {/* Enhanced Adaptive Glow Background - Multiple Layers */}
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-3xl blur-3xl opacity-60 dark:opacity-40 animate-pulse"></div>
              <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-primary/20 to-primary/30 rounded-2xl blur-2xl opacity-70 dark:opacity-50"></div>
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary/5 via-transparent to-primary/15 rounded-xl blur-xl opacity-80 dark:opacity-60"></div>
              
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 dark:ring-white/5 bg-slate-100 dark:bg-slate-800">
                <img
                  src="/images/integrations.png"
                  alt="Integrations"
                  className="w-full h-auto object-cover"
                />
                
                {/* Subtle Screen Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Feature 5 - Run */}
          <div className="flex flex-col md:flex-row gap-20 mb-16">
            <div className="flex-1">
              <div className="mb-6">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-5">
                  <Icons.PlayRun />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Efficient Test Execution</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Run tests with ease, track progress in real-time, and capture results with detailed evidence.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">Organize test runs by sprint, feature, or custom criteria</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">Track pass/fail status with detailed evidence capture</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Icons.CheckCircle /></div>
                  <p className="text-muted-foreground">Real-time progress tracking and test run metrics</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              {/* Enhanced Adaptive Glow Background - Multiple Layers */}
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-3xl blur-3xl opacity-60 dark:opacity-40 animate-pulse"></div>
              <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-primary/20 to-primary/30 rounded-2xl blur-2xl opacity-70 dark:opacity-50"></div>
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary/5 via-transparent to-primary/15 rounded-xl blur-xl opacity-80 dark:opacity-60"></div>
              
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 dark:ring-white/5 bg-slate-100 dark:bg-slate-800">
                <img
                  src="/images/test-runs.png"
                  alt="Test Execution Interface"
                  className="w-full h-auto object-cover"
                />
                
                {/* Subtle Screen Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
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


