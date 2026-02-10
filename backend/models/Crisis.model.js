import mongoose from "mongoose";

// Active Alert Schema
const activeAlertSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['FLOOD ALERT', 'LANDSLIDE ALERT', 'CYCLONE ALERT', 'TSUNAMI ALERT', 'EARTHQUAKE ALERT'] },
  province: { type: String, required: true },
  message: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Current Situation Schema
const currentSituationSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['Floods', 'Landslides', 'Strong Winds', 'Cyclone', 'Tsunami', 'Earthquake', 'Fire'] },
  severity: { type: String, required: true, enum: ['High', 'Warning', 'Low', 'Critical'] },
  affectedDistricts: { type: Number, default: 0 },
  affectedAreas: { type: String },
  riskLevel: { type: String, required: true, enum: ['High Risk', 'Medium Risk', 'Low Risk', 'Critical Risk'] },
  color: { type: String, required: true, enum: ['red', 'orange', 'yellow', 'green'] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Intelligence Metrics Schema
const intelligenceMetricsSchema = new mongoose.Schema({
  peopleAffected: { type: Number, required: true, default: 0 },
  peopleAffectedTrend: { type: String, enum: ['Increasing', 'Stable', 'Decreasing'], default: 'Stable' },
  homesDamaged: { type: Number, required: true, default: 0 },
  homesDamagedImpact: { type: String, default: 'Low Impact' },
  safeZonesActive: { type: Number, required: true, default: 0 },
  safeZonesStatus: { type: String, enum: ['Stable', 'Critical', 'Full'], default: 'Stable' },
  riskEscalation: { type: Number, required: true, min: 0, max: 100, default: 0 },
  riskEscalationTime: { type: String, default: 'Next 24 Hours' },
  updatedAt: { type: Date, default: Date.now }
});

// Risk Probability Schema
const riskProbabilitySchema = new mongoose.Schema({
  type: { type: String, required: true },
  probability: { type: Number, required: true, min: 0, max: 100 },
  updatedAt: { type: Date, default: Date.now }
});

// Population Trend Data Point Schema
const populationTrendPointSchema = new mongoose.Schema({
  time: { type: String, required: true },
  count: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Geographic Risk Schema
const geographicRiskSchema = new mongoose.Schema({
  district: { type: String, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  updatedAt: { type: Date, default: Date.now }
});

// Recommendation Schema
const recommendationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Create Models
const ActiveAlert = mongoose.model('ActiveAlert', activeAlertSchema);
const CurrentSituation = mongoose.model('CurrentSituation', currentSituationSchema);
const IntelligenceMetrics = mongoose.model('IntelligenceMetrics', intelligenceMetricsSchema);
const RiskProbability = mongoose.model('RiskProbability', riskProbabilitySchema);
const PopulationTrendPoint = mongoose.model('PopulationTrendPoint', populationTrendPointSchema);
const GeographicRisk = mongoose.model('GeographicRisk', geographicRiskSchema);
const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export {
  ActiveAlert,
  CurrentSituation,
  IntelligenceMetrics,
  RiskProbability,
  PopulationTrendPoint,
  GeographicRisk,
  Recommendation
};