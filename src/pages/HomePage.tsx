import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Activity, 
  Shield, 
  TrendingUp, 
  Bell, 
  Brain, 
  BarChart3,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Real-Time Monitoring",
      description: "Continuous tracking of temperature, humidity, vibration, gas emissions, and electrical current with instant alerts.",
      color: "text-blue-500"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Analysis",
      description: "Machine learning algorithms predict maintenance needs and identify patterns before issues become critical.",
      color: "text-purple-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Predictive Maintenance",
      description: "Advanced analytics help prevent costly downtime by predicting when maintenance is needed.",
      color: "text-green-500"
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Smart Alerts",
      description: "Intelligent notifications with recommended actions help you respond quickly to critical situations.",
      color: "text-orange-500"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Comprehensive Reports",
      description: "Detailed analytics and performance reports help optimize your industrial operations.",
      color: "text-indigo-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "High Performance",
      description: "Optimized for industrial environments with reliable ESP32 integration and real-time data processing.",
      color: "text-yellow-500"
    }
  ];

  const benefits = [
    "Reduce equipment downtime by up to 40%",
    "Lower maintenance costs through predictive insights",
    "Improve operational efficiency and safety",
    "Real-time monitoring from anywhere"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24 lg:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="animate-scale-in">
              <Sparkles className="h-3 w-3 mr-1" />
              Next-Generation Industrial IoT
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
              Smart Monitoring for
              <br />
              <span className="text-gradient">Healthier Machines</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your industrial operations with AI-powered monitoring. 
              Prevent costly downtime, optimize performance, and ensure the longevity 
              of your critical equipment with real-time insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" asChild className="group hover-scale">
                <Link to="/dashboard">
                  View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="hover-scale">
                <Link to="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose SmartMonitor?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology meets industrial reliability
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="hover-scale group hover:shadow-lg transition-all duration-300 animate-fade-in border-0 bg-card/50 backdrop-blur"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className={`${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Measurable Results for Your Business
              </h2>
              <p className="text-xl text-muted-foreground">
                Our customers see immediate improvements in efficiency, 
                cost savings, and operational reliability.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={benefit} 
                    className="flex items-center gap-3 animate-fade-in"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button size="lg" asChild className="hover-scale">
                <Link to="/dashboard">
                  Start Monitoring Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl" />
              <Card className="relative bg-card/50 backdrop-blur border-0 p-8">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">System Health</span>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      Excellent
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Temperature</span>
                      <span className="text-sm font-mono">23.5°C</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Efficiency</span>
                      <span className="text-sm font-mono text-green-500">91.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Uptime</span>
                      <span className="text-sm font-mono text-green-500">94.2%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            About SmartMonitor
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              SmartMonitor is an advanced Industrial IoT monitoring solution designed to 
              revolutionize how you maintain and optimize your critical equipment. 
              Our platform combines cutting-edge sensor technology with AI-powered analytics 
              to provide unprecedented insights into your industrial operations.
            </p>
            <p>
              Built for industrial environments, SmartMonitor integrates seamlessly with 
              ESP32 microcontrollers and provides real-time monitoring of temperature, 
              humidity, vibration, gas emissions, and electrical current. Our machine 
              learning algorithms continuously learn from your data to predict maintenance 
              needs and prevent costly equipment failures.
            </p>
            <p>
              Whether you're managing a single machine or an entire industrial facility, 
              SmartMonitor scales to meet your needs while providing the reliability 
              and precision that industrial applications demand.
            </p>
          </div>
          
          <div className="mt-12">
            <Button size="lg" asChild className="hover-scale">
              <Link to="/dashboard">
                Experience SmartMonitor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
        <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the future of industrial monitoring today
          </p>
          <Button size="lg" asChild className="hover-scale">
            <Link to="/dashboard">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}