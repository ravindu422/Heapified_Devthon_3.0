import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import alertService from '../../services/alertService';
import { ArrowUpDown, Loader2, Plus, Search } from 'lucide-react';
import AlertCard from '../../components/dashboard/alert/AlertCard';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditAlertModal from '../../components/dashboard/alert/EditAlertModal';
import DeleteConfirmationModal from '../../components/dashboard/alert/DeleteConfirmModal';

const AlertManage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');
    const [severityFilter, setSeverityFilter] = useState('');

    const [editingAlert, setEditingAlert] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [alertToDelete, setAlertToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const response = await alertService.getAllAlerts({
                limit: 100,
                order: sortOrder,
                severityLevel: severityFilter || undefined
            })

            if (response.success) {
                setAlerts(response.data || []);
                setPagination(response.pagination || null);
            } else {
                setAlerts([]);
                setError('Failed to load alerts');
            }
        } catch (err) {
            console.error("Failed to load alerts", err);
            setError(err.message || 'Failed to load alerts. Please try again later.');
            setAlerts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, [sortOrder, severityFilter]);

    const handleEdit = (alert) => {
        setEditingAlert(alert);
        setIsEditModalOpen(true);
    }

    const handleUpdate = async (alertId, updateData) => {
        try {
            setUpdateLoading(true);
            const response = await alertService.updateAlert(alertId, updateData);

            if (response.success) {
                // Update local state
                setAlerts(prev => prev.map(a =>
                    a._id === alertId ? { ...a, ...response.data } : a
                ));

                // Close modal
                setIsEditModalOpen(false);
                setEditingAlert(null);

                toast.success('Alert updated successfully', {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(err.message || 'Failed to update alert', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });
        } finally {
            setUpdateLoading(false);
        }
    }

    const initiateDelete = (alert) => {
        setAlertToDelete(alert);
        setIsDeleteModalOpen(true);
    }

    const confirmDelete = async () => {
        if (!alertToDelete) return;

        try {
            setDeleteLoading(true);
            await alertService.deleteAlert(alertToDelete._id);
            
            setAlerts(prev => prev.filter(a => a._id !== alertToDelete._id));
            
            toast.success('Alert deleted successfully', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            setIsDeleteModalOpen(false);
            setAlertToDelete(null);
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Failed to delete alert', {
                position: "top-right",
                autoClose: 4000,
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const toggleSort = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    const safeAlerts = Array.isArray(alerts) ? alerts : [];

    const filteredAlerts = safeAlerts.filter(alert => 
        alert?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert?.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert?.affectedAreas?.some(area => 
            area?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            area?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <DashboardLayout activePage="alert">
            <ToastContainer />
            <div className="space-y-6 ml-11">
                {/* Page Title */}
                <h1 className='text-2xl font-semibold text-gray-900 mb-12'>Manage Emergency Alerts</h1>

                {/* Search and Actions Bar */}
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="relative max-w-xs flex-1">
                        <input
                            type="text"
                            placeholder="Search alerts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-3 mr-14">
                        <Link to="/publish-alert" className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <Plus className="w-5 h-5" />
                        </Link>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <button 
                            onClick={toggleSort}
                            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            title={`Sort ${sortOrder === 'desc' ? 'oldest first' : 'newest first'}`}
                        >
                            <ArrowUpDown className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                        <p className="text-sm text-gray-500">Loading alerts...</p>
                    </div>
                ) : error ? (
                    <div className="text-red-600 text-center p-6 bg-red-50 rounded-lg border border-red-200">
                        <p className="font-medium">{error}</p>
                        <button 
                            onClick={fetchAlerts}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-260">
                            {filteredAlerts.length > 0 ? (
                                filteredAlerts.map((alert) => (
                                    <AlertCard
                                        key={alert._id}
                                        alerts={alert}
                                        onEdit={handleEdit}
                                        onDelete={initiateDelete}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500 py-16">
                                    <p className="text-lg font-medium mb-2">No alerts found</p>
                                    {searchQuery && (
                                        <p className="text-sm">Try adjusting your search or filters</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {filteredAlerts.length > 0 && (
                            <div className="flex justify-evenly mt-8 text-sm text-gray-500">
                                Showing {filteredAlerts.length} of {pagination?.totalItems || safeAlerts.length} alerts
                            </div>
                        )}
                    </>
                )}
            </div>

            {isEditModalOpen && editingAlert && (
                <EditAlertModal 
                    alert={editingAlert}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingAlert(null);
                    }}
                    onUpdate={handleUpdate}
                    loading={updateLoading}
                />
            )}

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                loading={deleteLoading}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setAlertToDelete(null);
                }}
                onConfirm={confirmDelete}
             />
        </DashboardLayout>
    );
};

export default AlertManage;