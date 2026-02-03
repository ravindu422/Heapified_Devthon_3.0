import mongoose, { now } from "mongoose";

const alertSchema = new mongoose.Schema({
    title: {
        type: String,
        requird: [true, 'Alert title required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    message: {
        type: String,
        required: [true, 'Alert message is required'],
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    severityLevel: {
        type: String,
        enum: ['Critical', 'High', 'Medium', 'Low'],
        required: [true, 'Serverity level is required']
    },
    affectedAreas: [{
        name: {
            type: String,
            required: [true, 'Affected areas are required'],
            trim: true
        },
        displayName: String,
        geometry: {
            type: {
                type: String,
                enum: ['Point', 'Polygon', 'Multipolygon', 'LineString'],
                required: true
            }, 
            coordinates: {
                type: mongoose.Schema.Types.Mixed,
                required: true
            }
        },
        centerPoint: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        boundingBox: [Number]
    }],
    remarks: {
        type: String,
        trim: true,
        maxlength: [500, 'Remarks cannot exceed 500 characters'],
        default: ''
    },
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

alertSchema.index({ createAt: -1 });
alertSchema.index({ severityLevel: 1 });
alertSchema.index({ 'affectedAreas.centerPoint': '2dsphere' });
alertSchema.index({ 'affectedAreas.geometry': '2dsphere' });

alertSchema.virtual('timeAgo').get(function() {
    const now = new Date();
    const diff = now - this.createdAt;
    const minutes = Math.floor(diff/ 60000);
    const hours = Math.floor(diff/ 3600000);
    const days = Math.floor(diff/ 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
});

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;