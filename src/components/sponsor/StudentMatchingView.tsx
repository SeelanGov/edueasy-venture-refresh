import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { matchingRulesService, type MatchingResult } from '@/services/MatchingRulesService';
import {
    AlertTriangle,
    Award,
    Building2,
    CheckCircle,
    Clock,
    DollarSign,
    ExternalLink,
    Filter,
    GraduationCap,
    Heart,
    MapPin,
    RefreshCw,
    Star,
    TrendingUp,
    Users,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SponsorMatch extends MatchingResult {
  sponsor: {
    id: string;
    name: string;
    organization_type: string;
    industry?: string;
    location: string;
    description?: string;
    website?: string;
    logo_url?: string;
    funding_capacity: string;
    preferred_academic_levels: string[];
    preferred_fields: string[];
    funding_amount_range: {
      min: number;
      max: number;
    };
    funding_frequency: string;
  };
}

export const StudentMatchingView = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [matches, setMatches] = useState<SponsorMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'amount' | 'date'>('score');
  const [selectedMatch, setSelectedMatch] = useState<SponsorMatch | null>(null);
  const [stats, setStats] = useState({
    totalMatches: 0,
    averageScore: 0,
    highConfidence: 0,
    mediumConfidence: 0,
    lowConfidence: 0
  });

  useEffect(() => {
    if (user) {
      loadMatches();
      loadStats();
    }
  }, [user]);

  const loadMatches = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get matches for the current student
      const matchingResults = await matchingRulesService.findMatches({
        student_id: user.id,
        limit: 50
      });

      // Get detailed sponsor information for each match
      const matchesWithSponsors: SponsorMatch[] = [];
      
      for (const match of matchingResults) {
        const { data: sponsor } = await supabase
          .from('sponsors')
          .select(`
            *,
            sponsor_profiles!inner(*)
          `)
          .eq('id', match.sponsor_id)
          .single();

        if (sponsor) {
          matchesWithSponsors.push({
            ...match,
            sponsor: {
              id: sponsor.id,
              name: sponsor.name,
              organization_type: sponsor.organization_type,
              industry: sponsor.sponsor_profiles?.industry,
              location: sponsor.sponsor_profiles?.location,
              description: sponsor.sponsor_profiles?.description,
              website: sponsor.sponsor_profiles?.website,
              logo_url: sponsor.sponsor_profiles?.logo_url,
              funding_capacity: sponsor.sponsor_profiles?.funding_capacity,
              preferred_academic_levels: sponsor.sponsor_profiles?.preferred_academic_levels || [],
              preferred_fields: sponsor.sponsor_profiles?.preferred_fields || [],
              funding_amount_range: sponsor.sponsor_profiles?.funding_amount_range,
              funding_frequency: sponsor.sponsor_profiles?.funding_frequency
            }
          });
        }
      }

      setMatches(matchesWithSponsors);
    } catch (error) {
      console.error('Error loading matches:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sponsor matches',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const matchingStats = await matchingRulesService.getMatchingStats();
      setStats({
        totalMatches: matchingStats.totalMatches,
        averageScore: matchingStats.averageScore,
        highConfidence: matchingStats.highConfidenceMatches,
        mediumConfidence: matchingStats.mediumConfidenceMatches,
        lowConfidence: matchingStats.lowConfidenceMatches
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAcceptMatch = async (match: SponsorMatch) => {
    try {
      // Create sponsorship application
      const { error } = await supabase
        .from('sponsor_applications')
        .insert({
          student_id: user?.id,
          sponsor_id: match.sponsor_id,
          requested_amount: match.funding_amount,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update match status
      await supabase
        .from('sponsor_matching_results')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('student_id', user?.id)
        .eq('sponsor_id', match.sponsor_id);

      toast({
        title: 'Match Accepted',
        description: `You've accepted the match with ${match.sponsor.name}`,
      });

      // Reload matches
      loadMatches();
    } catch (error) {
      console.error('Error accepting match:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept match',
        variant: 'destructive',
      });
    }
  };

  const handleRejectMatch = async (match: SponsorMatch) => {
    try {
      // Update match status
      await supabase
        .from('sponsor_matching_results')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('student_id', user?.id)
        .eq('sponsor_id', match.sponsor_id);

      toast({
        title: 'Match Rejected',
        description: `You've rejected the match with ${match.sponsor.name}`,
      });

      // Reload matches
      loadMatches();
    } catch (error) {
      console.error('Error rejecting match:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject match',
        variant: 'destructive',
      });
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <CheckCircle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      case 'low':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const getOrganizationTypeIcon = (type: string) => {
    switch (type) {
      case 'company':
        return <Building2 className="h-4 w-4" />;
      case 'ngo':
        return <Heart className="h-4 w-4" />;
      case 'government':
        return <Award className="h-4 w-4" />;
      case 'foundation':
        return <Star className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  // Filter and sort matches
  const filteredAndSortedMatches = matches
    .filter(match => {
      if (filter === 'all') return true;
      if (filter === 'high') return match.confidence_level === 'high';
      if (filter === 'medium') return match.confidence_level === 'medium';
      if (filter === 'low') return match.confidence_level === 'low';
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'amount':
          return b.funding_amount - a.funding_amount;
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading sponsor matches...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sponsor Matches</h2>
          <p className="text-gray-600 mt-1">Find sponsors who match your profile and needs</p>
        </div>
        <Button onClick={loadMatches} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Matches
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMatches}</div>
            <p className="text-xs text-muted-foreground">Available sponsors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Match quality</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Confidence</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.highConfidence}</div>
            <p className="text-xs text-muted-foreground">Excellent matches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Confidence</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.mediumConfidence}</div>
            <p className="text-xs text-muted-foreground">Good matches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Confidence</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.lowConfidence}</div>
            <p className="text-xs text-muted-foreground">Basic matches</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sorting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Sorting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Confidence</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="all">All Matches</option>
                <option value="high">High Confidence</option>
                <option value="medium">Medium Confidence</option>
                <option value="low">Low Confidence</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border rounded px-3 py-2"
              >
                <option value="score">Match Score</option>
                <option value="amount">Funding Amount</option>
                <option value="date">Date</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedMatches.map((match) => (
          <Card key={`${match.student_id}-${match.sponsor_id}`} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getOrganizationTypeIcon(match.sponsor.organization_type)}
                  <div>
                    <CardTitle className="text-lg">{match.sponsor.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {match.sponsor.organization_type}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getConfidenceColor(match.confidence_level)}>
                  {getConfidenceIcon(match.confidence_level)}
                  <span className="ml-1">{match.confidence_level}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Match Score */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Match Score</span>
                  <span className="font-medium">{match.score}%</span>
                </div>
                <Progress value={match.score} className="h-2" />
              </div>

              {/* Funding Amount */}
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">{formatCurrency(match.funding_amount)}</span>
                <span className="text-sm text-gray-500">
                  ({formatCurrency(match.sponsor.funding_amount_range.min)} - {formatCurrency(match.sponsor.funding_amount_range.max)})
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{match.sponsor.location}</span>
              </div>

              {/* Preferred Fields */}
              {match.sponsor.preferred_fields.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Preferred Fields</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {match.sponsor.preferred_fields.slice(0, 3).map((field, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                    {match.sponsor.preferred_fields.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{match.sponsor.preferred_fields.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Matched Criteria */}
              {match.matched_criteria.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Why you match:</div>
                  <div className="space-y-1">
                    {match.matched_criteria.slice(0, 3).map((criteria, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>{criteria}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={() => handleAcceptMatch(match)}
                  className="flex-1"
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  onClick={() => handleRejectMatch(match)}
                  variant="outline"
                  size="sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>

              {/* View Details Button */}
              <Button
                onClick={() => setSelectedMatch(selectedMatch?.sponsor_id === match.sponsor_id ? null : match)}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                {selectedMatch?.sponsor_id === match.sponsor_id ? 'Hide Details' : 'View Details'}
              </Button>

              {/* Detailed Information */}
              {selectedMatch?.sponsor_id === match.sponsor_id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                  {match.sponsor.description && (
                    <div>
                      <div className="text-sm font-medium mb-1">About</div>
                      <p className="text-sm text-gray-600">{match.sponsor.description}</p>
                    </div>
                  )}

                  {match.sponsor.website && (
                    <div>
                      <div className="text-sm font-medium mb-1">Website</div>
                      <a
                        href={match.sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit Website
                      </a>
                    </div>
                  )}

                  <div>
                    <div className="text-sm font-medium mb-1">Funding Frequency</div>
                    <span className="text-sm text-gray-600 capitalize">
                      {match.sponsor.funding_frequency.replace('_', ' ')}
                    </span>
                  </div>

                  {match.sponsor.industry && (
                    <div>
                      <div className="text-sm font-medium mb-1">Industry</div>
                      <span className="text-sm text-gray-600">{match.sponsor.industry}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedMatches.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No sponsor matches available at the moment. Check back later or update your profile.'
                : `No ${filter} confidence matches found. Try adjusting your filters.`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 