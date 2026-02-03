import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/home/HeroSection';
import CurrentSituationOverview from '../components/home/CurrentSituationOverview';
import SituationIntelligence from '../components/home/SituationIntelligence';
import LiveCrisisMap from '../components/home/LiveCrisisMap';
import RiskAnalytics from '../components/home/RiskAnalytics';
import RecommendationBanner from '../components/home/RecommendationBanner';
import { crisisAPI } from '../services/api';

const Home = () => {
  const [crisisData, setCrisisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrisisData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using the API service
        const response = await crisisAPI.getOverview();
        setCrisisData(response.data);
        
      } catch (error) {
        console.error('Error fetching crisis data:', error);
        setError(error.response?.data?.message || error.message || 'Failed to load crisis data');
      } finally {
        setLoading(false);
      }
    };

    fetchCrisisData();
    
    // Refresh data every 2 minutes (120000ms)
    const interval = setInterval(fetchCrisisData, 120000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
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

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center bg-gray-50 pt-16 sm:pt-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // No Data State
  if (!crisisData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center bg-gray-50 pt-16 sm:pt-20">
          <div className="text-center">
            <p className="text-gray-600 font-medium">No crisis data available</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Main Content
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-16 sm:pt-20">
        <HeroSection activeAlert={crisisData.activeAlert} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <CurrentSituationOverview situations={crisisData.currentSituations} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <SituationIntelligence intelligence={crisisData.intelligence} />
              <RiskAnalytics 
                riskProbability={crisisData.riskProbability}
                affectedPopulationTrend={crisisData.affectedPopulationTrend}
                geographicRisk={crisisData.geographicRisk}
              />
            </div>
            
            <div className="lg:col-span-1">
              <LiveCrisisMap />
            </div>
          </div>

          <RecommendationBanner 
            recommendation={crisisData.recommendation}
            dataSources={crisisData.dataSources}
            confidenceLevel={crisisData.confidenceLevel}
            lastUpdated={crisisData.lastUpdated}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Home;