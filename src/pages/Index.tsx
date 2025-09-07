import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Smartphone, 
  Zap, 
  Tv, 
  Wallet, 
  Shield, 
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';

const features = [
  {
    icon: Smartphone,
    title: 'Instant Airtime',
    description: 'Recharge any phone number instantly across all networks',
  },
  {
    icon: Zap,
    title: 'Data Bundles',
    description: 'Purchase data plans for MTN, Airtel, Glo, and 9mobile',
  },
  {
    icon: Tv,
    title: 'Cable TV',
    description: 'Subscribe to DStv, GOtv, and Startimes packages',
  },
  {
    icon: Wallet,
    title: 'Secure Wallet',
    description: 'Fund your wallet and track all your transactions',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Your transactions are protected with bank-level security',
  },
  {
    icon: Clock,
    title: '24/7 Service',
    description: 'Round-the-clock service with instant transaction processing',
  },
];

const testimonials = [
  {
    name: 'John Doe',
    comment: 'Best VTU platform I\'ve used. Fast and reliable!',
    rating: 5,
  },
  {
    name: 'Sarah Williams',
    comment: 'Love the interface and how quick transactions are processed.',
    rating: 5,
  },
  {
    name: 'Mike Johnson',
    comment: 'Great customer service and competitive rates.',
    rating: 5,
  },
];

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-lg font-bold">
                VT
              </div>
              <span className="text-xl font-bold text-foreground">AIG DATA</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <Button asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Your One-Stop <span className="text-primary">AIG DATA</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Buy airtime, data bundles, pay for cable TV subscriptions, and manage all your digital services in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to={user ? "/dashboard" : "/auth/signup"}>
                {user ? "Go to Dashboard" : "Start Now - It's Free"}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose AIG DATA?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide fast, secure, and reliable virtual top-up services for all your digital needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.comment}"</p>
                  <p className="font-semibold text-foreground">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join AIG DATA today and experience seamless digital transactions.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to={user ? "/dashboard" : "/auth/signup"}>
              <CheckCircle className="h-5 w-5 mr-2" />
              {user ? "Go to Dashboard" : "Create Free Account"}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-lg font-bold">
              VT
            </div>
            <span className="text-xl font-bold text-foreground">AIG DATA</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 AIG DATA. All rights reserved. Your trusted AIG DATA platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
