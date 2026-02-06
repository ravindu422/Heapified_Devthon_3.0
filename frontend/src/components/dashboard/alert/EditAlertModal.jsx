import React, { useState, useEffect, useRef } from 'react'
import LocationInput from './LocationInput'
import { AlertTriangle, Droplet, Mountain, X, ChevronDown, Check } from 'lucide-react';

const EditAlertModal = ({ alert, onClose, onUpdate, loading }) => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        alertType: '',
        severityLevel: '',
        affectedAreas: [],
        remarks: ''
    });

    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const alertTypes = [
        { value: 'Flood', label: 'Flood', icon: Droplet, colorClass: 'text-blue-600', bgClass: 'bg-blue-50' },
        { value: 'Landslide', label: 'Landslide', icon: Mountain, colorClass: 'text-amber-600', bgClass: 'bg-amber-50' },
        { value: 'Other', label: 'Other', icon: AlertTriangle, colorClass: 'text-gray-600', bgClass: 'bg-gray-50' }
    ];

    useEffect(() => {
        if (alert) {
            setFormData({
                title: alert.title || '',
                message: alert.message || '',
                alertType: alert.alertType || '',
                severityLevel: alert.severityLevel || '',
                affectedAreas: alert.affectedAreas || [],
                remarks: alert.remarks || ''
            });
        }
    }, [alert]);

    // Click outside handler for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsTypeDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'title':
                if (!value.trim()) error = 'Alert title is required';
                else if (value.trim().length > 200) error = 'Title cannot exceed 200 characters';
                break;
            case 'message':
                if (!value.trim()) error = 'Message is required';
                else if (value.trim().length > 1000) error = 'Message cannot exceed 1000 characters';
                break;
            case 'alertType':
                if (!value || !value.trim()) error = 'Please select an alert type';
                break;
            case 'severityLevel':
                if (!value || !value.trim()) error = 'Please select a severity level';
                break;
            case 'affectedAreas':
                if (!value || value.length === 0) error = 'At least one affected area is required';
                break;
            case 'remarks':
                if (value.trim().length > 500) error = 'Remarks cannot exceed 500 characters';
                break;
            default: break;
        }
        return error;
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (key !== 'remarks') {
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleTypeSelect = (typeValue) => {
        setFormData(prev => ({ ...prev, alertType: typeValue }));
        setTouched(prev => ({ ...prev, alertType: true }));
        const error = validateField('alertType', typeValue);
        setErrors(prev => ({ ...prev, alertType: error }));
        setIsTypeDropdownOpen(false);
    };

    const handleSeverityClick = (level) => {
        setFormData(prev => ({ ...prev, severityLevel: level }));
        setTouched(prev => ({ ...prev, severityLevel: true }));
        const error = validateField('severityLevel', level);
        setErrors(prev => ({ ...prev, severityLevel: error }));
    };

    const handleLocationsChange = (locations) => {
        setFormData(prev => ({ ...prev, affectedAreas: locations }));
        if (touched.affectedAreas) {
            const error = validateField('affectedAreas', locations);
            setErrors(prev => ({ ...prev, affectedAreas: error }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allTouched = {};
        Object.keys(formData).forEach(key => allTouched[key] = true);
        setTouched(allTouched);

        if (validateForm()) {
            await onUpdate(alert._id, formData);
        }
    };

    const getSeverityButtonClass = (level) => {
        const baseClass = "px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
        const isSelected = formData.severityLevel === level;
        const colorClasses = {
            Critical: isSelected ? "bg-red-600 text-white border-2 border-red-600 shadow-md" : "bg-white text-red-600 border-2 border-red-600 hover:text-white hover:bg-red-600",
            High: isSelected ? "bg-amber-500 text-white border-2 border-amber-500 shadow-md" : "bg-white text-amber-500 border-2 border-amber-500 hover:text-white hover:bg-amber-500",
            Medium: isSelected ? "bg-amber-300 text-white border-2 border-amber-300 shadow-md" : "bg-white text-amber-300 border-2 border-amber-300 hover:text-white hover:bg-amber-300",
            Low: isSelected ? "bg-green-500 text-white border-2 border-green-500 shadow-md" : "bg-white text-green-500 border-2 border-green-500 hover:text-white hover:bg-green-500"
        };
        return `${baseClass} ${colorClasses[level]}`
    };

    const inputClasses = (hasError) => `
        peer block w-full px-4 py-2.5 rounded-lg border bg-transparent text-sm
        text-gray-900 placeholder-transparent
        focus:outline-none focus:ring-1 
        transition-all duration-220
        ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-teal-400 focus:border-teal-500 focus:ring-teal-200'}
    `;

    const labelClasses = (hasError) => `
        absolute left-3 -top-2.5 bg-white px-1 text-sm font-medium transition-all duration-220 ease-out
        peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5 
        peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-medium pointer-events-none
        ${hasError ? 'text-red-500 peer-focus:text-red-600' : 'text-teal-500 peer-focus:text-teal-500'}
    `;

    useEffect(() => {
        const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Helper to get selected type object
    const selectedTypeObj = alertTypes.find(t => t.value === formData.alertType);

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-121.5 w-full max-h-180 flex flex-col">
                <div className="shrink-0 bg-white px-6 py-4 flex items-center justify-between rounded-t-2xl border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Manage Alert</h2>
                    <button onClick={onClose} className="p-2 bg-teal-100 rounded-full transition-colors cursor-pointer -mr-2">
                        <X className="w-5 h-5 text-teal-700" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <form onSubmit={handleSubmit} className="pr-6 pl-6 space-y-5">
                        
                        {/* Title Input */}
                        <div className="relative">
                            <input
                                type="text" id="title" name="title"
                                value={formData.title} onChange={handleChange}
                                placeholder=" " className={inputClasses(touched.title && errors.title)}
                            />
                            <label htmlFor="title" className={labelClasses(touched.title && errors.title)}>
                                Alert Title
                            </label>
                            {touched.title && errors.title && <p className="mt-1 ml-1 text-xs text-red-500">{errors.title}</p>}
                        </div>

                        {/* Message Input */}
                        <div className="relative">
                            <textarea
                                id="message" name="message" rows="4"
                                value={formData.message} onChange={handleChange}
                                placeholder=" " className={`${inputClasses(touched.message && errors.message)} resize-none`}
                            />
                            <label htmlFor="message" className={labelClasses(touched.message && errors.message)}>
                                Message
                            </label>
                            {touched.message && errors.message && <p className="mt-1 ml-1 text-xs text-red-500">{errors.message}</p>}
                        </div>

                        <div className="relative" ref={dropdownRef}>
                             <label className={`block text-sm font-medium mb-1.5 ml-1 transition-colors ${touched.alertType && errors.alertType ? 'text-red-500' : 'text-gray-500'}`}>
                                Alert Type
                            </label>

                            <button
                                type="button"
                                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                className={`
                                    w-full px-4 py-2.5 rounded-lg border bg-white flex items-center justify-between
                                    text-sm transition-all duration-200
                                    focus:outline-none focus:ring-1 
                                    ${touched.alertType && errors.alertType 
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                                        : 'border-teal-400 focus:border-teal-500 focus:ring-teal-200'
                                    }
                                    ${isTypeDropdownOpen ? 'ring-1 ring-teal-200 border-teal-500' : ''}
                                `}
                            >
                                {formData.alertType ? (
                                    <div className="flex items-center gap-2">
                                        {selectedTypeObj && (
                                            <selectedTypeObj.icon className={`w-4 h-4 ${selectedTypeObj.colorClass}`} />
                                        )}
                                        <span className="text-gray-900 font-medium">{selectedTypeObj?.label || formData.alertType}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-400">Select Alert Type...</span>
                                )}
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isTypeDropdownOpen && (
                                <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                    <div className="p-1">
                                        {alertTypes.map((type) => {
                                            const isSelected = formData.alertType === type.value;
                                            return (
                                                <div
                                                    key={type.value}
                                                    onClick={() => handleTypeSelect(type.value)}
                                                    className={`
                                                        flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                                                        ${isSelected ? 'bg-teal-100' : 'hover:bg-teal-200/40'}
                                                    `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-1.5 rounded-md ${type.bgClass}`}>
                                                            <type.icon className={`w-4 h-4 ${type.colorClass}`} />
                                                        </div>
                                                        <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                                                            {type.label}
                                                        </span>
                                                    </div>
                                                    {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {touched.alertType && errors.alertType && (
                                <p className="mt-1 ml-1 text-xs text-red-500">{errors.alertType}</p>
                            )}
                        </div>

                        {/* Severity Level */}
                        <div className="py-2">
                            <label className="block text-sm font-medium text-gray-500 mb-3 ml-1">
                                Severity Level
                            </label>
                            <div className="flex flex-wrap gap-3 justify-start ml-5">
                                {['Critical', 'High', 'Medium', 'Low'].map(level => (
                                    <button
                                        key={level} type="button"
                                        onClick={() => handleSeverityClick(level)}
                                        className={getSeverityButtonClass(level)}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                            {touched.severityLevel && errors.severityLevel && (
                                <p className="mt-2 ml-1 text-xs text-red-500">{errors.severityLevel}</p>
                            )}
                        </div>

                        {/* Location Input */}
                        <div>
                            <LocationInput
                                selectedLocations={formData.affectedAreas}
                                onLocationsChange={handleLocationsChange}
                                error={touched.affectedAreas && errors.affectedAreas}
                            />
                        </div>

                        {/* Remarks Input */}
                        <div className="relative">
                            <textarea
                                id="remarks" name="remarks" rows="3"
                                value={formData.remarks} onChange={handleChange}
                                placeholder=" " className={`${inputClasses(touched.remarks && errors.remarks)} resize-none`}
                            />
                            <label htmlFor="remarks" className={labelClasses(touched.remarks && errors.remarks)}>
                                Remarks (Optional)
                            </label>
                            {touched.remarks && errors.remarks && <p className="mt-1 ml-1 text-xs text-red-500">{errors.remarks}</p>}
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-between pt-4 border-t border-gray-200">
                            <button
                                type="button" onClick={onClose}
                                className="px-6 py-2 text-gray-500 border-2 border-gray-200 rounded-xl font-medium hover:text-teal-500 hover:border-teal-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit" disabled={loading}
                                className="px-8 py-2.5 text-teal-500 border-2 border-teal-500 rounded-xl font-medium hover:bg-teal-500 hover:text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditAlertModal