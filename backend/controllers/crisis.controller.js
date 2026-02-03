import {
  ActiveAlert,
  CurrentSituation,
  IntelligenceMetrics,
  RiskProbability,
  PopulationTrendPoint,
  GeographicRisk,
  Recommendation
} from "../models/Crisis.model.js";

// Helper function to calculate time difference in minutes
const getMinutesAgo = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  return Math.floor(diffMs / 60000);
};

// Helper function to format last updated time
const formatLastUpdated = (date) => {
  const minutesAgo = getMinutesAgo(date);
  if (minutesAgo < 1) return 'Just now';
  if (minutesAgo === 1) return '1 minute ago';
  if (minutesAgo < 60) return `${minutesAgo} minutes ago`;
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo === 1) return '1 hour ago';
  if (hoursAgo < 24) return `${hoursAgo} hours ago`;
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo === 1) return '1 day ago';
  return `${daysAgo} days ago`;
};

const getCrisisOverview = async (req, res) => {
  try {
    const activeAlert = await ActiveAlert.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();
    const situations = await CurrentSituation.find({ isActive: true }).sort({ severity: -1, createdAt: -1 }).lean();
    const intelligence = await IntelligenceMetrics.findOne().sort({ updatedAt: -1 }).lean();
    const riskProbabilities = await RiskProbability.find().sort({ probability: -1 }).lean();
    const populationTrend = await PopulationTrendPoint.find().sort({ timestamp: -1 }).limit(7).lean();
    const geographicRisks = await GeographicRisk.find().sort({ percentage: -1 }).lean();
    const recommendation = await Recommendation.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();

    const formattedAlert = activeAlert ? {
      type: activeAlert.type,
      province: activeAlert.province,
      message: activeAlert.message,
      updatedMinsAgo: getMinutesAgo(activeAlert.updatedAt)
    } : null;

    const formattedSituations = situations.map(situation => ({
      id: situation._id,
      type: situation.type,
      severity: situation.severity,
      affectedDistricts: situation.affectedDistricts,
      affectedAreas: situation.affectedAreas,
      riskLevel: situation.riskLevel,
      updatedMinsAgo: getMinutesAgo(situation.updatedAt),
      color: situation.color
    }));

    const formattedIntelligence = intelligence ? {
      peopleAffected: intelligence.peopleAffected,
      peopleAffectedTrend: intelligence.peopleAffectedTrend,
      homesDamaged: intelligence.homesDamaged,
      homesDamagedImpact: intelligence.homesDamagedImpact,
      safeZonesActive: intelligence.safeZonesActive,
      safeZonesStatus: intelligence.safeZonesStatus,
      riskEscalation: intelligence.riskEscalation,
      riskEscalationTime: intelligence.riskEscalationTime
    } : {
      peopleAffected: 0,
      peopleAffectedTrend: 'Stable',
      homesDamaged: 0,
      homesDamagedImpact: 'No Impact',
      safeZonesActive: 0,
      safeZonesStatus: 'Stable',
      riskEscalation: 0,
      riskEscalationTime: 'Next 24 Hours'
    };

    const reversedTrend = populationTrend.reverse();
    const formattedPopulationTrend = {
      message: determineTrendMessage(reversedTrend),
      data: reversedTrend.map(point => ({ time: point.time, count: point.count }))
    };

    const formattedRiskProbabilities = riskProbabilities.map(risk => ({ type: risk.type, probability: risk.probability }));
    const formattedGeographicRisks = geographicRisks.map(risk => ({ district: risk.district, percentage: risk.percentage }));

    const formattedRecommendation = recommendation ? { message: recommendation.message } : { message: 'No specific recommendations at this time. Stay alert and follow official instructions.' };

    const confidenceLevel = determineConfidenceLevel(intelligence);
    const dataSources = ['Disaster Management Centre (DMC)', 'Field Coordinators', 'Verified Volunteer Reports'];
    const lastUpdated = intelligence ? formatLastUpdated(intelligence.updatedAt) : 'Unknown';

    const response = {
      activeAlert: formattedAlert,
      currentSituations: formattedSituations,
      intelligence: formattedIntelligence,
      riskProbability: formattedRiskProbabilities,
      affectedPopulationTrend: formattedPopulationTrend,
      geographicRisk: formattedGeographicRisks,
      recommendation: formattedRecommendation,
      dataSources,
      confidenceLevel,
      lastUpdated
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching crisis overview:', error);
    res.status(500).json({ success: false, message: 'Error fetching crisis overview data', error: error.message });
  }
};

const determineTrendMessage = (trendData) => {
  if (!trendData || trendData.length < 2) return 'Insufficient data for trend analysis';
  const firstCount = trendData[0].count;
  const lastCount = trendData[trendData.length - 1].count;
  const percentageChange = ((lastCount - firstCount) / firstCount) * 100;
  if (percentageChange > 20) return `Rapid increase detected in last ${trendData.length} hours`;
  if (percentageChange > 10) return `Moderate increase detected in last ${trendData.length} hours`;
  if (percentageChange > 0) return `Slight increase detected in last ${trendData.length} hours`;
  if (percentageChange < -20) return `Significant decrease detected in last ${trendData.length} hours`;
  if (percentageChange < -10) return `Moderate decrease detected in last ${trendData.length} hours`;
  if (percentageChange < 0) return `Slight decrease detected in last ${trendData.length} hours`;
  return `Stable situation in last ${trendData.length} hours`;
};

const determineConfidenceLevel = (intelligence) => {
  if (!intelligence) return 'Low';
  const minutesSinceUpdate = getMinutesAgo(intelligence.updatedAt);
  if (minutesSinceUpdate < 15) return 'High';
  if (minutesSinceUpdate < 60) return 'Medium';
  return 'Low';
};

const getCrisisById = async (req, res) => {
  try {
    const crisis = await CurrentSituation.findById(req.params.id);
    if (!crisis) return res.status(404).json({ success: false, message: 'Crisis not found' });
    res.status(200).json({ success: true, data: crisis });
  } catch (error) {
    console.error('Error fetching crisis:', error);
    res.status(500).json({ success: false, message: 'Error fetching crisis data', error: error.message });
  }
};

export default { getCrisisOverview, getCrisisById };