import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Menu, X, Activity, BarChart3, History, FileText, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSensorData } from "@/contexts/SensorDataContext";

interface NavigationProps {
  activeAlerts?: number;
}

export const Navigation = ({ activeAlerts = 0 }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const location = useLocation();
  const { getActiveAlerts, getAcknowledgedAlerts, sensorData } = useSensorData();
  
  const alerts = getActiveAlerts();
  const acknowledgedAlerts = getAcknowledgedAlerts();
  const recentData = sensorData.slice(-5);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/#features" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/contact" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const dashboardItems = [
    { name: "Live Dashboard", path: "/dashboard", icon: BarChart3 },
    { name: "Alert History", path: "/dashboard/alerts", icon: History },
    { name: "Analysis", path: "/dashboard/analysis", icon: Activity },
    { name: "Reports", path: "/dashboard/reports", icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/#features" && location.hash === "#features") return true;
    if (path === "/#about" && location.hash === "#about") return true;
    if (path !== "/" && !path.includes("#") && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-gradient-navbar backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SmartMonitor
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.name === "Features") {
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection('features')}
                    className={cn(
                      "text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md hover:bg-primary/5",
                      location.pathname === "/" && location.hash === "#features" ? "text-foreground bg-accent" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </button>
                );
              }
              if (item.name === "About") {
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection('about')}
                    className={cn(
                      "text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md hover:bg-primary/5",
                      location.pathname === "/" && location.hash === "#about" ? "text-foreground bg-accent" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </button>
                );
              }
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md hover:bg-primary/5",
                    isActive(item.path) ? "text-foreground bg-accent" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            
            {/* Dashboard with Dropdown */}
            <Popover open={isDashboardOpen} onOpenChange={setIsDashboardOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md hover:bg-primary/5",
                    location.pathname.startsWith('/dashboard') 
                      ? "text-foreground bg-gradient-card border border-primary/20" 
                      : "text-muted-foreground hover:text-muted-foreground"
                  )}
                >
                  Dashboard
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                <div className="space-y-1">
                  {dashboardItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-white",
                        isActive(item.path) ? "bg-accent text-white" : ""
                      )}
                      onClick={() => setIsDashboardOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Notifications & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Enhanced Notification Panel */}
            <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {alerts.length > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {alerts.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      System Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                    {/* Active Alert Summary Banner */}
                    {alerts.length > 0 && (
                      <div className="p-3 rounded-lg bg-destructive border border-destructive/20 mb-4">
                        <div className="flex items-center justify-center text-white">
                          <AlertTriangle className="h-4 w-4 mr-2 animate-pulse" />
                          <span className="font-medium">
                            {alerts.length} active alert{alerts.length > 1 ? 's' : ''}: Immediate attention required
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Active Alerts */}
                    {alerts.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-destructive flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Critical Alerts ({alerts.length})
                        </h4>
                        {alerts.slice(0, 3).map((alert) => (
                          <div key={alert.id} className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                            <p className="text-sm font-medium text-destructive">{alert.title}</p>
                            <p className="text-xs text-muted-foreground">{alert.message}</p>
                            <p className="text-xs text-destructive mt-1">Requires immediate attention</p>
                          </div>
                        ))}
                        {alerts.length > 3 && (
                          <Link to="/dashboard" className="text-sm text-primary hover:underline block">
                            View {alerts.length - 3} more alerts in dashboard →
                          </Link>
                        )}
                      </div>
                    )}

                    {/* System Status */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-info flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        System Status
                      </h4>
                      <div className="p-3 rounded-lg bg-info/10 border border-info/20">
                        <p className="text-sm">ESP32 Device Connected</p>
                        <p className="text-xs text-muted-foreground">Signal: -42 dBm (Excellent)</p>
                      </div>
                      {recentData.length > 0 && (
                        <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                          <p className="text-sm text-success">Data Stream Active</p>
                          <p className="text-xs text-muted-foreground">
                            Last update: {new Date(recentData[0]?.timestamp || '').toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Recent Activity */}
                    {acknowledgedAlerts.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-success flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Recent Activity
                        </h4>
                        {acknowledgedAlerts.slice(-2).map((alert) => (
                          <div key={alert.id} className="p-3 rounded-lg bg-success/10 border border-success/20">
                            <p className="text-sm text-success">{alert.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {alert.isFixed ? 'Resolved & Fixed' : 'Acknowledged - Pending Fix'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* System Status Summary */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-info flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        System Overview
                      </h4>
                      <div className="grid gap-2">
                        <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">ESP32 Status</span>
                            <span className="text-xs text-success">● Online</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-info/10 border border-info/20">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Data Collection</span>
                            <span className="text-xs text-info">● Active</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">AI Analysis</span>
                            <span className="text-xs text-primary">● Processing</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {alerts.length === 0 && acknowledgedAlerts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success opacity-50" />
                        <p className="text-success">All systems normal</p>
                        <p className="text-xs">No alerts or issues detected</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                if (item.name === "Features") {
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        scrollToSection('features');
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm font-medium transition-colors text-left w-full",
                        location.pathname === "/" && location.hash === "#features"
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                      )}
                    >
                      {item.name}
                    </button>
                  );
                }
                if (item.name === "About") {
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        scrollToSection('about');
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm font-medium transition-colors text-left w-full",
                        location.pathname === "/" && location.hash === "#about"
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                      )}
                    >
                      {item.name}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Mobile Dashboard Items */}
              <div className="pt-2 border-t">
                <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Dashboard
                </p>
                {dashboardItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Alert Banner */}
      {alerts.length > 0 && (
        <div className="bg-destructive/10 border-b border-destructive/20 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-center text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive mr-2 animate-pulse" />
              <span className="text-destructive font-medium">
                {alerts.length} active alert{alerts.length > 1 ? 's' : ''}: Immediate attention required
              </span>
              <Link to="/dashboard/alerts" className="ml-2 text-destructive hover:underline font-medium">
                View Details →
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};