import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 transition-opacity">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-100 p-6 relative animate-in fade-in zoom-in duration-200">

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <Trash2 className="w-8 h-8 text-red-500" />
                    </div>

                    {/* Text Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Are you sure want to delete this?
                    </h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                        This action cannot be undone
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 w-full justify-between">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors w-32 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="px-6 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-700 transition-colors w-32 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 cursor-pointer"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Delete'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;