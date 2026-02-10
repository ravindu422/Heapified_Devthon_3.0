import React, { useState } from 'react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

const TaskManage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    urgency: '',
    remarks: ''
  })

  const [errors, setErrors] = useState({
    title: '',
    location: '',
    urgency: ''
  })

  const [touched, setTouched] = useState({
    title: false,
    location: false,
    urgency: false
  })

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return value.trim() === '' ? 'Task title is required' : ''
      case 'location':
        return value.trim() === '' ? 'Location is required' : ''
      case 'urgency':
        return value === '' ? 'Please select urgency level' : ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validate if field has been touched
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }))
  }

  const handleUrgencyClick = (level) => {
    setFormData(prev => ({
      ...prev,
      urgency: level
    }))
    setTouched(prev => ({
      ...prev,
      urgency: true
    }))
    setErrors(prev => ({
      ...prev,
      urgency: validateField('urgency', level)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate all fields
    const newErrors = {
      title: validateField('title', formData.title),
      location: validateField('location', formData.location),
      urgency: validateField('urgency', formData.urgency)
    }

    setErrors(newErrors)
    setTouched({
      title: true,
      location: true,
      urgency: true
    })

    // Check if there are any errors
    if (!newErrors.title && !newErrors.location && !newErrors.urgency) {
      // Submit form
      console.log('Form submitted:', formData)
      // Add your submit logic here
    }
  }

  return (
    <DashboardLayout activePage="task">
      <div className='px-8 py-6'>
        <h1 className='text-2xl font-semibold text-gray-900 mb-8'>Manage Tasks</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Form */}
          <div className='lg:col-span-2'>
            <h2 className='text-lg font-medium text-gray-700 mb-6'>Add New Task</h2>

            <form onSubmit={handleSubmit} className='space-y-5'>
              {/* Task Title */}
              <div>
                <label className='block text-sm text-teal-500 mb-2'>Task Title</label>
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder='Water Bottle Distribution – Kaduwela'
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.title && touched.title
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-teal-400 focus:border-teal-500 focus:ring-teal-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                />
                {errors.title && touched.title && (
                  <p className='mt-1 text-sm text-red-500'>{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className='block text-sm text-gray-600 mb-2'>description</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows='4'
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 focus:outline-none transition-colors resize-none'
                />
              </div>

              {/* Location */}
              <div>
                <label className='block text-sm text-gray-600 mb-2'>Location</label>
                <input
                  type='text'
                  name='location'
                  value={formData.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.location && touched.location
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                />
                {errors.location && touched.location && (
                  <p className='mt-1 text-sm text-red-500'>{errors.location}</p>
                )}
              </div>

              {/* Urgency Level */}
              <div>
                <label className='block text-sm text-gray-600 mb-3'>urgency level</label>
                <div className='flex gap-3'>
                  <button
                    type='button'
                    onClick={() => handleUrgencyClick('Critical')}
                    className={`px-6 py-2 rounded-full border-2 font-medium transition-all ${
                      formData.urgency === 'Critical'
                        ? 'border-red-500 text-red-500 bg-red-50'
                        : 'border-red-500 text-red-500 hover:bg-red-50'
                    }`}
                  >
                    Critical
                  </button>
                  <button
                    type='button'
                    onClick={() => handleUrgencyClick('High')}
                    className={`px-6 py-2 rounded-full border-2 font-medium transition-all ${
                      formData.urgency === 'High'
                        ? 'border-orange-400 text-orange-400 bg-orange-50'
                        : 'border-orange-400 text-orange-400 hover:bg-orange-50'
                    }`}
                  >
                    High
                  </button>
                  <button
                    type='button'
                    onClick={() => handleUrgencyClick('Medium')}
                    className={`px-6 py-2 rounded-full border-2 font-medium transition-all ${
                      formData.urgency === 'Medium'
                        ? 'border-yellow-400 text-yellow-500 bg-yellow-50'
                        : 'border-yellow-400 text-yellow-500 hover:bg-yellow-50'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    type='button'
                    onClick={() => handleUrgencyClick('Low')}
                    className={`px-6 py-2 rounded-full border-2 font-medium transition-all ${
                      formData.urgency === 'Low'
                        ? 'border-teal-400 text-teal-500 bg-teal-50'
                        : 'border-teal-400 text-teal-500 hover:bg-teal-50'
                    }`}
                  >
                    Low
                  </button>
                </div>
                {errors.urgency && touched.urgency && (
                  <p className='mt-2 text-sm text-red-500'>{errors.urgency}</p>
                )}
              </div>

              {/* Remarks */}
              <div>
                <label className='block text-sm text-gray-600 mb-2'>Remarks</label>
                <textarea
                  name='remarks'
                  value={formData.remarks}
                  onChange={handleChange}
                  rows='3'
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 focus:outline-none transition-colors resize-none'
                />
              </div>

              {/* Submit Button */}
              <div className='flex justify-center pt-2'>
                <button
                  type='submit'
                  className='px-12 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors shadow-sm'
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Task Preview */}
          <div className='lg:col-span-1'>
            <div className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Task Preview</h3>
              
              <div className='space-y-4'>
                <div>
                  <h4 className='text-base font-semibold text-gray-900'>
                    {formData.title || 'Water Bottle Distribution'}
                  </h4>
                  <p className='text-sm text-gray-600 mt-1'>
                    Location - {formData.location || 'Kaduwela'}
                  </p>
                </div>

                {formData.urgency && (
                  <div>
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium border-2 ${
                      formData.urgency === 'Critical'
                        ? 'border-red-500 text-red-500 bg-red-50'
                        : formData.urgency === 'High'
                        ? 'border-orange-400 text-orange-400 bg-orange-50'
                        : formData.urgency === 'Medium'
                        ? 'border-yellow-400 text-yellow-500 bg-yellow-50'
                        : 'border-teal-400 text-teal-500 bg-teal-50'
                    }`}>
                      {formData.urgency}
                    </span>
                  </div>
                )}

                <div className='bg-gray-50 rounded-lg p-4 min-h-20'>
                  <p className='text-sm text-gray-500'>
                    {formData.description || 'no description added'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TaskManage;