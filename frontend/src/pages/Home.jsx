import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/home/HeroSection';
import CurrentSituationOverview from '../components/home/CurrentSituationOverview';
import SituationIntelligence from '../components/home/SituationIntelligence';
import LiveCrisisMap from '../components/home/LiveCrisisMap';
import RiskAnalytics from '../components/home/RiskAnalytics';
import RecommendationBanner from '../components/home/RecommendationBanner';

const Home = () => {
  const [crisisData, setCrisisData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    // Simulating API data fetch
    const fetchCrisisData = async () => {
      try {
        // const response = await fetch('/api/crisis/overview');
        // const data = await response.json();
        
        // Mock data for now
        const mockData = {
          activeAlert: {
            type: 'FLOOD ALERT',
            province: 'WESTERN PROVINCE',
            message: 'Evacuation ongoing in Colombo, Gampaha',
            updatedMinsAgo: 8
          },
          currentSituations: [
            {
              id: 1,
              type: 'Floods',
              severity: 'High',
              affectedDistricts: 5,
              riskLevel: 'High Risk',
              updatedMinsAgo: 2,
              color: 'red'
            },
            {
              id: 2,
              type: 'Landslides',
              severity: 'Warning',
              affectedAreas: '2 Areas reported',
              riskLevel: 'Medium Risk',
              updatedMinsAgo: 2,
              color: 'orange'
            },
            {
              id: 3,
              type: 'Strong Winds',
              severity: 'Low',
              affectedAreas: 'Coastal areas',
              riskLevel: 'Low Risk',
              updatedMinsAgo: 2,
              color: 'yellow'
            }
          ],
          intelligence: {
            peopleAffected: 12450,
            peopleAffectedTrend: 'Increasing',
            homesDamaged: 3120,
            homesDamagedImpact: 'High Impact',
            safeZonesActive: 28,
            safeZonesStatus: 'Stable',
            riskEscalation: 62,
            riskEscalationTime: 'Next 24 Hours'
          },
          riskProbability: [
            { type: 'Flood', probability: 85 },
            { type: 'Landslides', probability: 65 },
            { type: 'Strong Winds', probability: 45 }
          ],
          affectedPopulationTrend: {
            message: 'Rapid increase detected in last 6 hours',
            data: [
              { time: '6h ago', count: 8000 },
              { time: '5h ago', count: 8500 },
              { time: '4h ago', count: 9200 },
              { time: '3h ago', count: 10100 },
              { time: '2h ago', count: 11200 },
              { time: '1h ago', count: 11800 },
              { time: 'Now', count: 12450 }
            ]
          },
          geographicRisk: [
            { district: 'Western Province', percentage: 35 },
            { district: 'Sabaragamuwa Province', percentage: 25 },
            { district: 'Central Province', percentage: 20 },
            { district: 'Southern Province', percentage: 12 },
            { district: 'Other Areas', percentage: 8 }
          ],
          recommendation: {
            message: 'Residents in Western Province should prepare for possible evacuation within the next 6-12 hours.'
          },
          dataSources: [
            'Disaster Management Centre (DMC)',
            'Field Coordinators',
            'Verified Volunteer Reports'
          ],
          confidenceLevel: 'High',
          lastUpdated: '8 minutes ago'
        };

        setCrisisData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching crisis data:', error);
        setLoading(false);
      }
    };

    fetchCrisisData();
    
    // Refresh data every 2 minutes
    const interval = setInterval(fetchCrisisData, 120000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        {/* Add padding-top to account for fixed navbar */}
        <div className="flex-grow flex items-center justify-center bg-gray-50 pt-16 sm:pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading crisis data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Add padding-top to account for fixed navbar (h-16 sm:h-20) */}
      <div className="flex-grow pt-16 sm:pt-20">
        <HeroSection activeAlert={crisisData?.activeAlert} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <CurrentSituationOverview situations={crisisData?.currentSituations} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <SituationIntelligence intelligence={crisisData?.intelligence} />
              <RiskAnalytics 
                riskProbability={crisisData?.riskProbability}
                affectedPopulationTrend={crisisData?.affectedPopulationTrend}
                geographicRisk={crisisData?.geographicRisk}
              />
            </div>
            
            <div className="lg:col-span-1">
              <LiveCrisisMap />
            </div>
          </div>

          <RecommendationBanner 
            recommendation={crisisData?.recommendation}
            dataSources={crisisData?.dataSources}
            confidenceLevel={crisisData?.confidenceLevel}
            lastUpdated={crisisData?.lastUpdated}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Home;