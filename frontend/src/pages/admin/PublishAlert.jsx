import React from 'react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import AddAlertForm from '../../components/dashboard/alert/AddAlertForm';
import alertService from '../../services/alertService';
import RecentAlerts from '../../components/dashboard/alert/RecentAlerts';
import toast, { Toaster } from 'react-hot-toast';

const PublishAlert = () => {
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    fetchRecentAlerts();
  }, []);

  const fetchRecentAlerts = async () => {
    try {
      const data = await alertService.getRecentAlerts(5);
      if (data.success) {
        setRecentAlerts(data.data);
      }
    } catch (error) {
      console.error('Error fecthing recent alerts:', error);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await alertService.createAlert(formData);

      if (response.success) {
        // --- Add toast ---
        toast.success('Alert published successfully', {
          duration: 4000,
          position: 'top-center',
          style: { background: '#fff', color: '#000' },
        });

        await fetchRecentAlerts();
        setShowPreview(false);
        setPreviewData(null);
        return true;
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      const errorMessage = error.message || 'An error occured while publishing the alert';

      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (formData) => {
    setPreviewData(formData);
    setShowPreview(true);
  };

  const handleConfirmSubmit = async () => {
    if (previewData) {
      const success = await handleSubmit(previewData);
      if (success) {
        setShowPreview(false);
        setPreviewData(null);
      }
    }
  };

  return (
    <DashboardLayout activePage="alert">
      <Toaster/>
      <div className='space-y-3'>
        <h1 className='text-2xl font-semibold text-gray-900 mb-2 ml-11'>Publish Emergency Alert</h1>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 ml-4 mr-6'>
          <div className='lg:col-span-6'>
            <AddAlertForm
              onSubmit={handleSubmit}
              onPreview={handlePreview}
              loading={loading}
            />
          </div>

          <div className='lg:col-span-6 border-l border-gray-300 pl-2 sticky'>
            <RecentAlerts
              alerts={recentAlerts}
              onRefresh={fetchRecentAlerts}
            />
          </div>
        </div>
      </div>

      {/* {showPreview && (

      )} */}
    </DashboardLayout>
  );
};

export default PublishAlert;