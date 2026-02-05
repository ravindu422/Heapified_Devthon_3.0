import React, { useState, useEffect } from 'react'
import LocationInput from './LocationInput'
import { X } from 'lucide-react';

const EditAlertModal = ({ alert, onClose, onUpdate, loading }) => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        severityLevel: '',
        affectedAreas: [],
        remarks: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (alert) {
            setFormData({
                title: alert.title || '',
                message: alert.message || '',
                severityLevel: alert.severityLevel || '',
                affectedAreas: alert.affectedAreas || [],
                remarks: alert.remarks || ''
            });
        }
    }, [alert]);

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'title':
                if (!value.trim()) {
                    error = 'Alert title is required';
                } else if (value.trim().length > 200) {
                    error = 'Title cannot exceed 200 characters';
                }
                break;

            case 'message':
                if (!value.trim()) {
                    error = 'Message is required';
                } else if (value.trim().length > 1000) {
                    error = 'Message cannot exceed 1000 characters';
                }
                break;

            case 'severityLevel':
                if (!value || !value.trim()) {
                    error = 'Please select a severity level';
                }
                break;

            case 'affectedAreas':
                if (!value || value.length === 0) {
                    error = 'At least one affected area is required';
                }
                break;

            case 'remarks':
                if (value.trim().length > 500) {
                    error = 'Remarks cannot exceed 500 characters';
                }
                break;

            default:
                break;
        }

        return error;
    };

    const validateForm = () => {
        const newErrors = {};

        Object.keys(formData).forEach(key => {
            if (key !== 'remarks') {
                const error = validateField(key, formData[key]);
                if (error) {
                    newErrors[key] = error;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handleSeverityClick = (level) => {
        setFormData(prev => ({
            ...prev,
            severityLevel: level
        }));

        setTouched(prev => ({
            ...prev,
            severityLevel: true
        }));

        const error = validateField('severityLevel', level);
        setErrors(prev => ({
            ...prev,
            severityLevel: error
        }));
    };

    const handleLocationsChange = (locations) => {
        setFormData(prev => ({
            ...prev,
            affectedAreas: locations
        }));

        if (touched.affectedAreas) {
            const error = validateField('affectedAreas', locations);
            setErrors(prev => ({
                ...prev,
                affectedAreas: error
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allTouched = {};
        Object.keys(formData).forEach(key => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        if (validateForm()) {
            await onUpdate(alert._id, formData);
        }
    };

    const getSeverityButtonClass = (level) => {
        const baseClass = "px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
        const isSelected = formData.severityLevel === level;

        const colorClasses = {
            Critical: isSelected
                ? "bg-red-600 text-white border-2 border-red-600 shadow-md"
                : "bg-white text-red-600 border-2 border-red-600 hover:text-white hover:bg-red-600",
            High: isSelected
                ? "bg-amber-500 text-white border-2 border-amber-500 shadow-md"
                : "bg-white text-amber-500 border-2 border-amber-500 hover:text-white hover:bg-amber-500",
            Medium: isSelected
                ? "bg-amber-300 text-white border-2 border-amber-300 shadow-md"
                : "bg-white text-amber-300 border-2 border-amber-300 hover:text-white hover:bg-amber-300",
            Low: isSelected
                ? "bg-green-500 text-white border-2 border-green-500 shadow-md"
                : "bg-white text-green-500 border-2 border-green-500 hover:text-white hover:bg-green-500"
        };

        return `${baseClass} ${colorClasses[level]}`
    };

    const inputClasses = (hasError) => `
        peer block w-full px-4 py-2.5 rounded-lg border bg-transparent text-sm
        text-gray-900 placeholder-transparent
        focus:outline-none focus:ring-1 
        transition-all duration-220
        ${hasError
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-teal-400 focus:border-teal-500 focus:ring-teal-200'
        }
    `;

    const labelClasses = (hasError) => `
        absolute left-3 -top-2.5 bg-white px-1 text-sm font-medium transition-all duration-220 ease-out
        peer-placeholder-shown:text-base 
        peer-placeholder-shown:text-gray-400 
        peer-placeholder-shown:top-2.5 
        peer-focus:-top-2.5 
        peer-focus:text-sm 
        peer-focus:font-medium
        pointer-events-none
        ${hasError
            ? 'text-red-500 peer-focus:text-red-600'
            : 'text-teal-500 peer-focus:text-teal-500'
        }
    `;  
    
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-[486px] w-full max-h-[720px] flex flex-col">
                <div className="shrink-0 bg-white px-6 py-4 flex items-center justify-between rounded-t-2xl border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Manage Alert</h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-teal-100 rounded-full transition-colors cursor-pointer -mr-2"
                    >
                        <X className="w-5 h-5 text-teal-700" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <form onSubmit={handleSubmit} className="pr-6 pl-6 space-y-5">
                        <div className="relative">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder=" "
                                className={inputClasses(touched.title && errors.title)}
                            />
                            <label
                                htmlFor="title"
                                className={labelClasses(touched.title && errors.title)}
                            >
                                Alert Title
                            </label>
                            {touched.title && errors.title && (
                                <p className="mt-1 ml-1 text-xs text-red-500">{errors.title}</p>
                            )}
                        </div>

                        <div className="relative">
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                placeholder=" "
                                className={`${inputClasses(touched.message && errors.message)} resize-none`}
                            />
                            <label
                                htmlFor="message"
                                className={labelClasses(touched.message && errors.message)}
                            >
                                Message
                            </label>
                            {touched.message && errors.message && (
                                <p className="mt-1 ml-1 text-xs text-red-500">{errors.message}</p>
                            )}
                        </div>

                        <div className="py-2">
                            <label className="block text-sm font-medium text-gray-500 mb-3 ml-1">
                                Severity Level
                            </label>
                            <div className="flex flex-wrap gap-3 justify-start ml-5">
                                {['Critical', 'High', 'Medium', 'Low'].map(level => (
                                    <button
                                        key={level}
                                        type="button"
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

                        <div>
                            <LocationInput
                                selectedLocations={formData.affectedAreas}
                                onLocationsChange={handleLocationsChange}
                                error={touched.affectedAreas && errors.affectedAreas}
                            />
                        </div>

                        <div className="relative">
                            <textarea
                                id="remarks"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                rows="3"
                                placeholder=" "
                                className={`${inputClasses(touched.remarks && errors.remarks)} resize-none`}
                            />
                            <label
                                htmlFor="remarks"
                                className={labelClasses(touched.remarks && errors.remarks)}
                            >
                                Remarks (Optional)
                            </label>
                            {touched.remarks && errors.remarks && (
                                <p className="mt-1 ml-1 text-xs text-red-500">{errors.remarks}</p>
                            )}
                        </div>

                        <div className="flex justify-between pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-gray-500 border-2 border-gray-200 rounded-xl font-medium hover:text-teal-500 hover:border-teal-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2.5 text-teal-500 border-2 border-teal-500 rounded-xl font-medium hover:bg-teal-500 hover:text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    'Update'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditAlertModal