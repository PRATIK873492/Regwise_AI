import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { complianceAPI } from '../services/api';
import { ComplianceSummary, SearchResult } from '../types';
import { RegulationModal } from '../components/RegulationModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { COUNTRIES } from '../utils/constants';
import { Search, ExternalLink, AlertCircle, Shield, Filter, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { highlightKeywords } from '../utils/highlightKeywords.tsx';

const CATEGORIES = ['All', 'AML/CTF', 'Data Protection', 'Licensing', 'Risk Management'];
const INDUSTRIES = ['All', 'Financial Services', 'FinTech', 'Banking', 'Insurance'];

export const ComplianceExplorer = () => {
  const location = useLocation();
  const { selectedCountry, addSearchHistory } = useApp();
  const [query, setQuery] = useState(location.state?.query || '');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [summaries, setSummaries] = useState<ComplianceSummary[]>([]);
  const [filteredSummaries, setFilteredSummaries] = useState<ComplianceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRegulation, setSelectedRegulation] = useState<ComplianceSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (selectedCountry) {
      loadSummaries();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (location.state?.query && location.state?.country) {
      performSearch(location.state.query);
    }
  }, [location.state]);

  useEffect(() => {
    applyFilters();
  }, [summaries, categoryFilter, industryFilter, riskFilter]);

  const loadSummaries = async () => {
    if (!selectedCountry) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await complianceAPI.getSummaries(selectedCountry.name);
      setSummaries(data);
    } catch (err) {
      setError('Failed to load compliance summaries. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...summaries];

    if (categoryFilter !== 'All') {
      filtered = filtered.filter((s) => s.category === categoryFilter);
    }

    if (riskFilter !== 'All') {
      filtered = filtered.filter((s) => s.riskLevel === riskFilter.toLowerCase());
    }

    setFilteredSummaries(filtered);
  };

  const performSearch = async (searchQuery: string) => {
    if (!selectedCountry || !searchQuery.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await complianceAPI.search(selectedCountry.name, searchQuery);
      setSearchResult(result);
      addSearchHistory(searchQuery, selectedCountry.name);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleViewDetails = (regulation: ComplianceSummary) => {
    setSelectedRegulation(regulation);
    setIsModalOpen(true);
  };

  const toggleCardExpansion = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskGradient = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'from-blue-500 to-blue-600';
      case 'medium':
        return 'from-yellow-500 to-yellow-600';
      case 'high':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-foreground">Compliance Explorer</h1>
                <p className="text-muted-foreground">
                  Search and explore regulatory requirements
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle>Search Compliance Information</CardTitle>
            <CardDescription>
              Ask specific questions about compliance requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="e.g., What are the KYC requirements?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                type="submit"
                disabled={!query.trim() || !selectedCountry || isLoading}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`${
              isSidebarOpen ? 'block' : 'hidden'
            } lg:block w-full lg:w-64 flex-shrink-0 space-y-4`}
          >
            <Card className="border-0 shadow-lg sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <Select
                    value={selectedCountry?.id || ''}
                    onValueChange={(value) => {
                      const country = COUNTRIES.find((c) => c.id === value);
                      if (country) {
                        const { setSelectedCountry } = useApp();
                        setSelectedCountry(country);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Level</label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Levels</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setCategoryFilter('All');
                    setIndustryFilter('All');
                    setRiskFilter('All');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {error && (
              <Alert variant="destructive" className="mb-8">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Search Results */}
            {searchResult && (
              <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="h-1 bg-gradient-to-r from-primary to-secondary rounded-t-lg" />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Search Result</CardTitle>
                      <CardDescription>
                        "{searchResult.query}" • {searchResult.country}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-white">
                      AI Generated
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <p className="text-foreground leading-relaxed">
                      {highlightKeywords(searchResult.summary)}
                    </p>
                  </div>

                  {searchResult.citations.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Citations</h4>
                      <div className="space-y-2">
                        {searchResult.citations.map((citation) => (
                          <a
                            key={citation.id}
                            href={citation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-primary/50 transition-colors group"
                          >
                            <div>
                              <p className="font-medium text-foreground group-hover:text-primary">
                                {citation.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {citation.source} • {new Date(citation.date).toLocaleDateString()}
                              </p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {isLoading && !searchResult && !summaries.length && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-0 shadow-lg">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Compliance Summaries */}
            {!isLoading && filteredSummaries.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-foreground">
                    {selectedCountry?.name} Regulations
                  </h2>
                  <Badge variant="secondary">
                    {filteredSummaries.length} result{filteredSummaries.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {filteredSummaries.map((summary) => {
                  const isExpanded = expandedCards.has(summary.id);
                  return (
                    <Card
                      key={summary.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className={`h-2 bg-gradient-to-r ${getRiskGradient(summary.riskLevel)}`} />
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline">{summary.category}</Badge>
                              <Badge className={getRiskColor(summary.riskLevel)}>
                                {summary.riskLevel.toUpperCase()} RISK
                              </Badge>
                            </div>
                            <CardTitle className="text-xl">{summary.title}</CardTitle>
                            <CardDescription>
                              Last updated: {new Date(summary.lastUpdated).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-foreground leading-relaxed">
                          {isExpanded
                            ? highlightKeywords(summary.summary)
                            : highlightKeywords(summary.summary.slice(0, 200) + '...')}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCardExpansion(summary.id)}
                            className="text-primary"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                Read More
                              </>
                            )}
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleViewDetails(summary)}
                            className="bg-gradient-to-r from-primary to-secondary"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {!isLoading && filteredSummaries.length === 0 && selectedCountry && (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                  <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No regulations found matching your filters
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Regulation Details Modal */}
      <RegulationModal
        regulation={selectedRegulation}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};
