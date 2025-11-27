import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CountryCardSelector } from "../components/CountryCardSelector";
import { AlertsTicker } from "../components/AlertsTicker";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ROUTES } from "../utils/constants";
import {
  Search,
  ShieldCheck,
  TrendingUp,
  Globe,
  Sparkles,
  ArrowRight,
  Zap,
  FileText,
} from "lucide-react";

const SAMPLE_QUESTIONS = [
  "What are the AML requirements for financial institutions?",
  "Data protection and privacy regulations overview",
  "KYC document requirements for customer onboarding",
  "Transaction monitoring thresholds and reporting",
  "Beneficial ownership disclosure requirements",
  "Cross-border payment compliance guidelines",
];

export const Home = () => {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const { selectedCountry, addSearchHistory } = useApp();
  const navigate = useNavigate();

  // Typewriter effect for placeholder
  useEffect(() => {
    const currentQuestion = SAMPLE_QUESTIONS[placeholderIndex];
    let currentChar = 0;

    const typeInterval = setInterval(() => {
      if (currentChar <= currentQuestion.length) {
        setPlaceholder(currentQuestion.slice(0, currentChar));
        currentChar++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % SAMPLE_QUESTIONS.length);
          setPlaceholder("");
        }, 2000);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [placeholderIndex]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && selectedCountry) {
      addSearchHistory(query, selectedCountry.name);
      navigate(ROUTES.EXPLORER, {
        state: { query, country: selectedCountry.name },
      });
    }
  };

  const quickActions = [
    {
      icon: Search,
      title: "Compliance Explorer",
      description: "Browse regulations by country",
      color: "bg-primary",
      route: ROUTES.EXPLORER,
    },
    {
      icon: FileText,
      title: "Onboarding Workflows",
      description: "Generate KYC/AML processes",
      color: "bg-secondary",
      route: ROUTES.ONBOARDING,
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "View compliance metrics",
      color: "bg-accent",
      route: ROUTES.DASHBOARD,
    },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description:
        "Get instant answers to complex compliance questions using advanced AI",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access regulatory data from 10+ jurisdictions worldwide",
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description:
        "Stay informed with automatic regulatory change notifications",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Alerts Ticker */}
      <AlertsTicker />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            {/* Powered by badge removed per request */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Intelligent Compliance
              <br />
              <span className="text-primary">Management Platform</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Navigate global regulatory requirements with AI-powered insights,
              automated workflows, and real-time compliance monitoring across
              multiple jurisdictions.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="text"
                    placeholder={placeholder + "|"}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-14 pr-32 h-14 text-lg bg-white border border-input focus:ring-2 focus:ring-ring/30"
                    aria-label="Search compliance"
                  />
                  <Button
                    type="submit"
                    disabled={!query.trim() || !selectedCountry}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary/90"
                    aria-label="Search"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Country Selection Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Select Your Jurisdiction
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose a country to explore its regulatory framework and compliance
            requirements
          </p>
        </div>
        <CountryCardSelector />
      </div>

      {/* Quick Actions */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 overflow-hidden"
                  onClick={() => navigate(action.route)}
                >
                  <div className={`h-2 ${action.color}`} />
                  <CardHeader className="pb-4">
                    <div
                      className={`w-14 h-14 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      style={{ color: "white" }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {action.title}
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground text-center mb-10">
          Why Choose RegWise AI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheck className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Streamline Your Compliance?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Generate custom onboarding workflows and stay ahead of regulatory
            changes
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            onClick={() => navigate(ROUTES.ONBOARDING)}
          >
            <FileText className="w-5 h-5 mr-2" />
            Generate Onboarding Flow
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
