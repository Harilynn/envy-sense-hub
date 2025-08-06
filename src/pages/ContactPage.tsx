import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { useSensorData } from "@/contexts/SensorDataContext";
import { Mail, Phone, MessageSquare, Send, CheckCircle, User, Building } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const { getActiveAlerts } = useSensorData();
  const activeAlerts = getActiveAlerts();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-bg-primary">
      <Navigation activeAlerts={activeAlerts.length} />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            How can I help you?
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Fill in the form or drop an email 📧
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6 animate-fade-in">
            <Card className="bg-gradient-card border-0 shadow-tech hover-dramatic">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Phone className="h-6 w-6 text-primary" />
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">+1 012 345 678</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-tech hover-dramatic">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Mail className="h-6 w-6 text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">eren@webflow.com</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-tech hover-dramatic">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Building className="h-6 w-6 text-primary" />
                  Social
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">webflow</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Card className="bg-gradient-card border-0 shadow-tech">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="bg-background/50 border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="bg-background/50 border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                      className="bg-background/50 border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell me more about your project or inquiry..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                      rows={5}
                      className="bg-background/50 border-primary/20 focus:border-primary resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-primary to-accent text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 group"
                  >
                    <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Submit
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Message Area */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-br from-white via-green-100 to-green-200 border border-success/20 shadow-md max-w-md mx-auto">
            <CardContent className="pt-6">
              <CheckCircle className="h-12 w-12 text-green-700 mx-auto mb-4" />
              <p className="text-green-800 font-medium">
                Thank you for reaching out! I'll get back to you within 24 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
