import Alert from "../models/alert.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

//const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const handleChat = async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const { message } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing in environment variables");
        }

        // Fetch recent alerts with more context
        const recentAlerts = await Alert.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // Separate by severity
        const criticalAlerts = recentAlerts.filter(a => a.severityLevel === 'Critical');
        const highAlerts = recentAlerts.filter(a => a.severityLevel === 'High');
        const mediumAlerts = recentAlerts.filter(a => a.severityLevel === 'Medium');

        // Build structured alert context
        const buildAlertContext = (alerts, severity) => {
            if (alerts.length === 0) return '';
            return `\n${severity} ALERTS:\n` + alerts.map(a => {
                const areas = a.affectedAreas.map(area => area.displayName || area.name).join(', ');
                const timeAgo = getTimeAgo(a.createdAt);
                return `  • [${a.alertType}] ${a.title}
                    Location: ${areas}
                    Details: ${a.message}
                    Issued: ${timeAgo}
                    ${a.remarks ? `Notes: ${a.remarks}` : ''}`;
            }).join('\n\n');
        };

        const alertContext = `
            CURRENT EMERGENCY SITUATION IN SRI LANKA:
            ${buildAlertContext(criticalAlerts, '🔴 CRITICAL')}
            ${buildAlertContext(highAlerts, '🟠 HIGH')}
            ${buildAlertContext(mediumAlerts, '🟡 MEDIUM')}

            ${recentAlerts.length === 0 ? '✅ No active alerts at the moment.' : ''}
        `.trim();

        // Enhanced system instruction
        const systemInstruction = `You are SafeLanka Emergency AI Assistant, a specialized chatbot for disaster management in Sri Lanka.

            YOUR ROLE:
            - Provide accurate, timely information about active emergency alerts
            - Answer questions about specific locations, disaster types, and safety measures
            - Guide users to safety zones and emergency resources
            - Remain calm, clear, and supportive during emergencies

            AVAILABLE DATA:
            ${alertContext}

            RESPONSE GUIDELINES:
            1. If user asks about a specific location/district, check if it's in the active alerts
            2. For "is [location] safe?" queries, refer to the alerts and provide clear yes/no with explanation
            3. For "what's happening in [location]?" queries, summarize relevant alerts
            4. If no alerts for a location, say "No active alerts for [location] currently"
            5. Always prioritize Critical alerts in your responses
            6. Provide actionable safety advice when relevant
            7. Use emojis sparingly for severity indicators (🔴 Critical, 🟠 High, 🟡 Medium)
            8. Keep responses concise but informative
            9. If user asks about alert details, provide full information including time issued
            10. For general safety questions, provide Sri Lanka-specific disaster preparedness advice

            EXAMPLE QUERIES YOU SHOULD HANDLE:
            - "Is Kandy safe right now?"
            - "What's happening in Colombo?"
            - "Are there any flood warnings?"
            - "Show me critical alerts"
            - "What should I do if there's a landslide?"
            - "Which areas are affected by floods?"`;

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",  // Changed
            systemInstruction
        });

        const result = await model.generateContent(message);
        const response = result.response.text();

        res.json({
            success: true,
            reply: response,
            metadata: {
                alertsChecked: recentAlerts.length,
                criticalCount: criticalAlerts.length,
                highCount: highAlerts.length,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({
            success: false,
            error: 'I apologize, but I encountered an error. Please try again.',
            details: error.message
        });
    }
};

// Helper function for time formatting
function getTimeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
}