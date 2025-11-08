import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Car, DollarSign, Calendar } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Car className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Toyota Agent</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Get Started <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-mono mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            AI-Powered Discovery
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
            Find your perfect Toyota with intelligent guidance
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-10 text-pretty max-w-2xl mx-auto">
            An AI shopping companion that understands your needs, calculates total ownership costs, and guides you to
            your dream Toyota.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" size="lg" className="px-8 h-12 text-base bg-transparent">
                Browse Toyota Models
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="rounded-2xl border border-border bg-card p-2 shadow-2xl">
            <div className="rounded-xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 aspect-[16/9] flex items-center justify-center">
              <div className="text-center p-8">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-primary" />
                <p className="text-lg text-muted-foreground">AI Agent Chat Interface Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Why Toyota Agent?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">A smarter way to shop for your next Toyota</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Guided Discovery</h3>
            <p className="text-muted-foreground">
              Our AI agent asks the right questions to understand your needs and preferences.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Total Cost View</h3>
            <p className="text-muted-foreground">
              See MSRP, insurance estimates, and financing options all in one place.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Car className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Comparison</h3>
            <p className="text-muted-foreground">
              Compare up to 3 models side-by-side with intelligent recommendations.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Test Drives</h3>
            <p className="text-muted-foreground">Schedule test drives at your preferred dealership with one click.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-muted/30 py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">From preferences to purchase in four simple steps</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Tell Us Your Needs",
                desc: "Quick preference quiz to understand what matters to you",
              },
              { step: "02", title: "Chat with Agent", desc: "Our AI guides you through personalized recommendations" },
              { step: "03", title: "Compare & Decide", desc: "See total costs and compare models side-by-side" },
              { step: "04", title: "Schedule Test Drive", desc: "Book your test drive and experience your Toyota" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-mono text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center rounded-2xl border border-border bg-card p-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Ready to find your Toyota?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands discovering their perfect vehicle with AI guidance
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-12 text-base">
              Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Car className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">Toyota Agent</span>
              </div>
              <p className="text-sm text-muted-foreground">Your AI-powered Toyota shopping companion</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 Toyota Agent. Built for HackUTD.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
