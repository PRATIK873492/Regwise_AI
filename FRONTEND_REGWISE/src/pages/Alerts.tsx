import { useState, useEffect } from 'react';
import { alertsAPI } from '../services/api';
import { Alert as AlertType } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { COUNTRIES, SEVERITY_COLORS } from '../utils/constants';
import { Bell, ExternalLink, CheckCircle, AlertCircle, Filter, RefreshCw, TrendingUp, XCircle } from 'lucide-react';

export const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [showReadFilter, setShowReadFilter] = useState<string>('all');

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [alerts, countryFilter, severityFilter, showReadFilter]);

  const loadAlerts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await alertsAPI.getAlerts();
      setAlerts(data);
    } catch (err) {
      setError('Failed to load alerts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...alerts];

    if (countryFilter !== 'all') {
      filtered = filtered.filter((alert) => alert.country === countryFilter);
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter((alert) => alert.severity === severityFilter);
    }

    if (showReadFilter === 'unread') {
      filtered = filtered.filter((alert) => !alert.isRead);
    } else if (showReadFilter === 'read') {
      filtered = filtered.filter((alert) => alert.isRead);
    }

    // Sort by date (newest first) and unread status
    filtered.sort((a, b) => {
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    setFilteredAlerts(filtered);
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await alertsAPI.markAsRead(alertId);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, isRead: true } : alert
        )
      );
    } catch (err) {
      console.error('Failed to mark alert as read:', err);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5" />;
      case 'high':
        return <AlertCircle className="w-5 h-5" />;
      case 'medium':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getSeverityGradient = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'from-red-600 to-red-700';
      case 'high':
        return 'from-orange-500 to-red-500';
      case 'medium':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const criticalCount = alerts.filter((a) => a.severity === 'critical' && !a.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                    {unreadCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-foreground">Regulatory Alerts</h1>
                <p className="text-muted-foreground">
                  {unreadCount} unread • {criticalCount} critical
                </p>
              </div>
            </div>
            <Button
              onClick={loadAlerts}
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800">Total Alerts</p>
                  <p className="text-2xl font-bold text-blue-900">{alerts.length}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-800">Critical</p>
                  <p className="text-2xl font-bold text-red-900">{criticalCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800">Read</p>
                  <p className="text-2xl font-bold text-green-900">
                    {alerts.filter((a) => a.isRead).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-800">Unread</p>
                  <p className="text-2xl font-bold text-orange-900">{unreadCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <CardTitle>Filters</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.id} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={showReadFilter} onValueChange={setShowReadFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Alerts</SelectItem>
                    <SelectItem value="unread">Unread Only</SelectItem>
                    <SelectItem value="read">Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Alerts List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAlerts.length > 0 ? (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  !alert.isRead ? 'ring-2 ring-accent/20' : ''
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${getSeverityGradient(alert.severity)}`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="outline" className="font-medium">
                          {alert.country}
                        </Badge>
                        <Badge className={SEVERITY_COLORS[alert.severity]}>
                          <span className="flex items-center space-x-1">
                            {getSeverityIcon(alert.severity)}
                            <span className="ml-1">{alert.severity.toUpperCase()}</span>
                          </span>
                        </Badge>
                        {!alert.isRead && (
                          <Badge className="bg-accent text-white animate-pulse">
                            New
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2">{alert.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <span>
                          {new Date(alert.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground leading-relaxed">{alert.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      {alert.sourceUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={alert.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 flex items-center space-x-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Source</span>
                          </a>
                        </Button>
                      )}
                    </div>
                    {!alert.isRead && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="bg-gradient-to-r from-secondary to-teal-600"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Alerts Found
              </h3>
              <p className="text-muted-foreground">
                {countryFilter !== 'all' || severityFilter !== 'all' || showReadFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No regulatory alerts at this time'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
