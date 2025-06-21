import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to my App
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage your business with our powerful dashboard. Monitor analytics, 
            manage users, and track performance all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-muted-foreground">
            Built with modern technologies for optimal performance
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Real-time insights and reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              Track your business metrics with comprehensive analytics and visual reports.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Secure</CardTitle>
              <CardDescription>
                Enterprise-grade security
              </CardDescription>
            </CardHeader>
            <CardContent>
              Your data is protected with industry-standard security measures.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Fast</CardTitle>
              <CardDescription>
                Lightning-fast performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              Built for speed with optimized code and modern infrastructure.
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}