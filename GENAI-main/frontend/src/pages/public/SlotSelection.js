import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { interviewService } from '../../services/interviewService';
import { CalendarDaysIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const SlotSelection = () => {
  const { applicationId } = useParams();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadSlots = async () => {
      try {
        setLoading(true);
        const data = await interviewService.getAvailableSlots(applicationId);
        setSlots(data.available_slots || []);
      } catch (err) {
        // Handle specific error cases
        if (err.response?.status === 400) {
          setError('Interview slot has already been selected for this application.');
        } else if (err.response?.status === 404) {
          setError('No available slots found. Please ensure you have a valid link or contact HR.');
        } else {
          setError('Failed to load available slots. Please try again or contact HR.');
        }
        console.error('Error loading slots:', err);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      loadSlots();
    }
  }, [applicationId]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = async () => {
    if (!selectedSlot) return;

    try {
      setSubmitting(true);
      await interviewService.selectSlot(applicationId, {
        selected_date: selectedSlot.date,
        selected_time: selectedSlot.time
      });
      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('This slot is no longer available or has already been selected.');
      } else if (err.response?.status === 404) {
        setError('Application not found. Please check your link.');
      } else {
        setError('Failed to select slot. Please try again or contact HR.');
      }
      console.error('Error selecting slot:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available slots...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Slot Selected Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your interview slot has been confirmed. You will receive a confirmation email shortly with all the details.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              Selected: {selectedSlot?.display}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <CalendarDaysIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Interview Slot</h1>
            <p className="text-gray-600">
              Please choose your preferred date and time for the interview
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {slots.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No available slots found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {slots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlotSelect(slot)}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      selectedSlot?.datetime_display === slot.datetime_display
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">
                        {slot.display}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      1 hour duration
                    </div>
                  </button>
                ))}
              </div>

              {selectedSlot && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-900 mb-2">Selected Slot:</h3>
                  <p className="text-blue-800">{selectedSlot.display}</p>
                  <p className="text-sm text-blue-600 mt-1">Duration: 1 hour</p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedSlot || submitting}
                  className={`px-8 py-3 rounded-lg font-medium ${
                    selectedSlot && !submitting
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {submitting ? 'Confirming...' : 'Confirm Selection'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotSelection;
