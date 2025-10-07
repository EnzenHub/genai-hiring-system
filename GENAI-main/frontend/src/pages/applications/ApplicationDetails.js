import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { interviewService } from '../../services/interviewService';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  StarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const id = applicationId; // For backward compatibility with existing code
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [interviewReviews, setInterviewReviews] = useState([]);

  const loadApplication = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await applicationService.getApplication(id);
      setApplication(data);
    } catch (err) {
      setError('Failed to load application details');
      console.error('Error loading application:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadApplication();
  }, [loadApplication]);

  // Auto-refresh for applications with resume update requests
  useEffect(() => {
    if (!application) return;
    
    // Check if this application has an active resume update request
    const hasResumeUpdateRequest = application.status === 'resume_update_requested' || 
                                   application.status === 'pending_llm_evaluation';
    
    if (hasResumeUpdateRequest) {
      // Poll every 30 seconds to check for updates
      const interval = setInterval(() => {
        loadApplication();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [application, loadApplication]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await applicationService.updateApplicationStatus(id, newStatus);
      await loadApplication(); // Reload data
    } catch (err) {
      setError('Failed to update application status');
      console.error('Error updating application:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleFetchAvailability = async () => {
    try {
      setUpdating(true);
      await interviewService.fetchAvailability(id);
      await loadApplication(); // Reload data
      setError('');
    } catch (err) {
      setError('Failed to fetch availability slots');
      console.error('Error fetching availability:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleScheduleInterview = async (interviewerData) => {
    try {
      setUpdating(true);
      await interviewService.scheduleInterview(id, interviewerData);
      await loadApplication(); // Reload data
      setShowScheduleModal(false);
      setError('');
    } catch (err) {
      setError('Failed to schedule interview');
      console.error('Error scheduling interview:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkInterviewCompleted = async () => {
    try {
      setUpdating(true);
      const result = await interviewService.markInterviewCompleted(id);
      
      // Show success message with review token info
      if (result && result.message) {
        alert(result.message);
      } else {
        alert('Interview marked as completed and review tokens sent successfully!');
      }
      
      await loadApplication(); // Reload data
      setError('');
    } catch (err) {
      setError('Failed to mark interview as completed and send review tokens');
      console.error('Error marking interview completed:', err);
    } finally {
      setUpdating(false);
    }
  };


  const handleFinalDecision = async (decision) => {
    try {
      setUpdating(true);
      const result = await interviewService.makeFinalDecision(id, decision);
      await loadApplication(); // Reload data
      setError('');
      alert(result.message || `Candidate ${decision === 'hired' ? 'hired' : 'rejected'} successfully! Email notification sent.`);
    } catch (err) {
      setError('Failed to make final decision');
      console.error('Error making final decision:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Load interview details and review data when application loads
  useEffect(() => {
    const loadInterviewData = async () => {
      if (application && ['slot_selected', 'interview_confirmed', 'interview_completed', 'review_received'].includes(application.status)) {
        try {
          const details = await interviewService.getInterviewDetails(id);
          setInterviewDetails(details);
        } catch (err) {
          console.error('Error loading interview details:', err);
        }
      }

      if (application && application.status === 'review_received') {
        try {
          // Load all interview reviews
          const reviewsData = await interviewService.getAllInterviewReviews(id);
          setInterviewReviews(reviewsData.reviews || []);
          
          // Keep the old single review for backward compatibility
          const review = await interviewService.getInterviewReview(id);
          setReviewData(review);
        } catch (err) {
          console.error('Error loading review data:', err);
        }
      }
    };

    if (application) {
      loadInterviewData();
    }
  }, [application, id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-orange-100 text-orange-800';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'selected':
        return 'bg-emerald-100 text-emerald-800';
      case 'availability_requested':
        return 'bg-sky-100 text-sky-800';
      case 'slot_selected':
        return 'bg-violet-100 text-violet-800';
      case 'interview_confirmed':
        return 'bg-indigo-100 text-indigo-800';
      case 'interview_completed':
        return 'bg-amber-100 text-amber-800';
      case 'review_received':
        return 'bg-orange-100 text-orange-800';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'under_review':
        return 'Under Review';
      case 'selected':
        return 'Selected';
      case 'availability_requested':
        return 'Availability Requested';
      case 'slot_selected':
        return 'Slot Selected';
      case 'interview_confirmed':
        return 'Interview Confirmed';
      case 'interview_completed':
        return 'Interview Completed';
      case 'review_received':
        return 'Review Received';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const canUpdateStatus = user?.user_type === 'hr' || user?.user_type === 'admin';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button onClick={() => navigate('/applications')} className="mr-4">
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600">Loading application information...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button onClick={() => navigate('/applications')} className="mr-4">
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600">Error loading application</p>
          </div>
        </div>
        <div className="card">
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md">
            {error || 'Application not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <button onClick={() => navigate('/applications')} className="mr-4">
            <ArrowLeftIcon className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{application.candidate_name}</h1>
            <p className="text-gray-600">Application for {application.job_title}</p>
            <div className="flex items-center mt-2 space-x-4">
              <span className={`status-badge ${getStatusColor(application.status)}`}>
                {getStatusText(application.status)}
              </span>
              {application.updated_at && (
                <span className="text-sm text-gray-500">
                  Last updated: {new Date(application.updated_at).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex space-x-2">
          <button
            onClick={loadApplication}
            disabled={loading}
            className="btn-secondary flex items-center"
            title="Refresh application data"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Status Update Actions */}
        {canUpdateStatus && (
          <div className="flex space-x-2">
            {(application.status === 'pending' || application.status === 'under_review') && (
              <>
                <button
                  onClick={() => handleStatusUpdate('shortlisted')}
                  disabled={updating}
                  className="btn-secondary flex items-center"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Shortlist
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={updating}
                  className="btn-danger flex items-center"
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Reject
                </button>
              </>
            )}
            
            {application.status === 'shortlisted' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('interview_scheduled')}
                  disabled={updating}
                  className="btn-primary flex items-center"
                >
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Schedule Interview
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={updating}
                  className="btn-danger flex items-center"
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Reject
                </button>
              </>
            )}
            
            {/* SELECTED - HR needs to fetch availability */}
            {application.status === 'selected' && (
              <button
                onClick={handleFetchAvailability}
                disabled={updating}
                className="btn-primary flex items-center"
              >
                <CalendarDaysIcon className="h-4 w-4 mr-2" />
                Fetch Availability
              </button>
            )}

            {/* SLOT_SELECTED - HR can schedule interview */}
            {application.status === 'slot_selected' && (
              <button
                onClick={() => setShowScheduleModal(true)}
                disabled={updating}
                className="btn-success flex items-center"
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Schedule Interview
              </button>
            )}

            {/* INTERVIEW_CONFIRMED - HR can mark as completed (auto-sends review tokens) */}
            {application.status === 'interview_confirmed' && (
              <button
                onClick={handleMarkInterviewCompleted}
                disabled={updating}
                className="btn-warning flex items-center"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Mark Interview Completed & Send Review Tokens
              </button>
            )}

            {/* REVIEW_RECEIVED - HR makes final decision */}
            {application.status === 'review_received' && (
              <>
                <button
                  onClick={() => handleFinalDecision('hired')}
                  disabled={updating}
                  className="btn-success flex items-center"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Hire Candidate
                </button>
                <button
                  onClick={() => handleFinalDecision('rejected')}
                  disabled={updating}
                  className="btn-danger flex items-center"
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Reject Candidate
                </button>
              </>
            )}

            {/* Legacy support for old interview_scheduled status */}
            {application.status === 'interview_scheduled' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('hired')}
                  disabled={updating}
                  className="btn-success flex items-center"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Hire
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={updating}
                  className="btn-danger flex items-center"
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Reject
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main Content */}
        <div className="xl:col-span-3 lg:col-span-2 space-y-4 lg:space-y-6">
          {/* AI Analysis */}
          {(application.ai_score || application.match_score || application.ats_score) && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-3">AI Analysis</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {application.ai_score && (
                  <div className={`p-3 rounded-lg ${getScoreColor(application.ai_score)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Overall AI Score</span>
                      <StarIcon className="h-4 w-4" />
                    </div>
                    <div className="text-xl font-bold">{application.ai_score}%</div>
                  </div>
                )}
                {application.match_score && (
                  <div className={`p-3 rounded-lg ${getScoreColor(application.match_score)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Match Score</span>
                      <CheckCircleIcon className="h-4 w-4" />
                    </div>
                    <div className="text-xl font-bold">{application.match_score}%</div>
                  </div>
                )}
                {application.ats_score && (
                  <div className={`p-3 rounded-lg ${getScoreColor(application.ats_score)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">ATS Score</span>
                      <DocumentTextIcon className="h-4 w-4" />
                    </div>
                    <div className="text-xl font-bold">{application.ats_score}%</div>
                  </div>
                )}
              </div>
              
              {application.ai_summary && (
                <div>
                  <h3 className="font-medium mb-2">AI Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{application.ai_summary}</p>
                </div>
              )}
            </div>
          )}

          {/* Cover Letter */}
          {application.cover_letter && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Cover Letter</h2>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">
                  {application.cover_letter}
                </div>
              </div>
            </div>
          )}

          {/* Resume Content */}
          {application.resume_text && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Resume Content</h2>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 text-sm">
                  {application.resume_text}
                </div>
              </div>
            </div>
          )}

          {/* Skills Match */}
          {application.skills_match && application.skills_match.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Skills Analysis</h2>
              <div className="space-y-2">
                {application.skills_match.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{skill.skill}</span>
                    <span className={`text-sm ${skill.match ? 'text-green-600' : 'text-red-600'}`}>
                      {skill.match ? '✓ Match' : '✗ Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:space-y-6">
          {/* Candidate Info */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Candidate Information</h3>
            <div className="space-y-2.5">
              <div className="flex items-start">
                <UserIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Name</div>
                  <div className="font-medium text-sm truncate">{application.candidate_name}</div>
                </div>
              </div>

              <div className="flex items-start">
                <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Email</div>
                  <div className="font-medium text-sm truncate" title={application.candidate_email}>
                    {application.candidate_email}
                  </div>
                </div>
              </div>

              {application.candidate_phone && (
                <div className="flex items-start">
                  <UserIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Phone</div>
                    <div className="font-medium text-sm">{application.candidate_phone}</div>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <BriefcaseIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Position</div>
                  <div className="font-medium text-sm">{application.job_title}</div>
                </div>
              </div>

              <div className="flex items-start">
                <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Applied</div>
                  <div className="font-medium text-sm">
                    {new Date(application.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Download */}
          {application.resume_filename && (
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Resume</h3>
                {application.resume_filename && application.resume_filename.includes('updated') && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Updated
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center min-w-0 flex-1">
                  <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate" title={application.resume_filename}>
                      {application.resume_filename.split('-').slice(-1)[0] || 'Resume File'}
                    </div>
                    <div className="text-xs text-gray-500">PDF Document</div>
                  </div>
                </div>
                <button
                  onClick={() => window.open(application.resume_url, '_blank')}
                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors flex-shrink-0"
                  title="View Resume"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Additional Info */}
          {application.additional_info && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {application.additional_info}
              </p>
            </div>
          )}

          {/* Application Timeline */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Timeline</h3>
            <div className="space-y-2.5">
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2.5 mt-1.5 flex-shrink-0"></div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">Application Submitted</div>
                  <div className="text-xs text-gray-500">
                    {new Date(application.created_at).toLocaleDateString()} at {new Date(application.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
              
              {application.processed_at && (
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2.5 mt-1.5 flex-shrink-0"></div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">AI Processing Complete</div>
                    <div className="text-xs text-gray-500">
                      {new Date(application.processed_at).toLocaleDateString()} at {new Date(application.processed_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              )}
              
              {application.updated_at !== application.created_at && (
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2.5 mt-1.5 flex-shrink-0"></div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">Status Updated</div>
                    <div className="text-xs text-gray-500">
                      {new Date(application.updated_at).toLocaleDateString()} at {new Date(application.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <ScheduleInterviewModal
          application={application}
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleInterview}
          updating={updating}
        />
      )}

      {/* Interview Details Section */}
      {interviewDetails && (
        <div className="mt-6">
          <InterviewDetailsCard 
            details={interviewDetails}
            application={application}
          />
        </div>
      )}

      {/* Interview Reviews Section */}
      {interviewReviews.length > 0 && (
        <div className="mt-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Interview Reviews ({interviewReviews.length})</h3>
            <div className="space-y-6">
              {interviewReviews.map((review, index) => (
                <div key={review.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      {review.interviewer_name || review.interviewer_email}
                      <span className="ml-2 text-sm text-gray-500">
                        ({review.interviewer_type === 'primary' ? 'Primary' : 'Backup'} Interviewer)
                      </span>
                    </h4>
                    <span className="text-xs text-gray-500">
                      {review.review_submitted_at ? new Date(review.review_submitted_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <InterviewReviewCard 
                    review={review}
                    application={application}
                    hideHeader={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fallback: Single Review Data Section (for backward compatibility) */}
      {reviewData && interviewReviews.length === 0 && (
        <div className="mt-6">
          <InterviewReviewCard 
            review={reviewData}
            application={application}
          />
        </div>
      )}
    </div>
  );
};

// Schedule Interview Modal Component
const ScheduleInterviewModal = ({ application, onClose, onSchedule, updating }) => {
  const [formData, setFormData] = useState({
    primary_interviewer_name: '',
    primary_interviewer_email: '',
    backup_interviewer_name: '',
    backup_interviewer_email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Schedule Interview</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Interviewer Name *
            </label>
            <input
              type="text"
              required
              value={formData.primary_interviewer_name}
              onChange={(e) => handleChange('primary_interviewer_name', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Interviewer Email *
            </label>
            <input
              type="email"
              required
              value={formData.primary_interviewer_email}
              onChange={(e) => handleChange('primary_interviewer_email', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="john.smith@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Backup Interviewer Name *
            </label>
            <input
              type="text"
              required
              value={formData.backup_interviewer_name}
              onChange={(e) => handleChange('backup_interviewer_name', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Backup Interviewer Email *
            </label>
            <input
              type="email"
              required
              value={formData.backup_interviewer_email}
              onChange={(e) => handleChange('backup_interviewer_email', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="jane.doe@company.com"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={updating}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="flex-1 btn-primary"
            >
              {updating ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Interview Details Card Component
const InterviewDetailsCard = ({ details, application }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Interview Details</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Date & Time</label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
              <p className="text-sm font-medium text-gray-900">
                {details.selected_slot_date ? new Date(details.selected_slot_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Not selected'}
              </p>
              <span className="hidden sm:inline text-gray-400">•</span>
              <p className="text-sm text-gray-700">
                {details.selected_slot_time ? new Date(`2000-01-01T${details.selected_slot_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'Not selected'}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Duration</label>
            <p className="text-sm text-gray-900">{details.interview_duration || 60} minutes</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Primary Interviewer</label>
            <p className="text-sm font-medium text-gray-900 truncate" title={details.primary_interviewer_name}>
              {details.primary_interviewer_name || 'Not assigned'}
            </p>
            <p className="text-xs text-gray-600 truncate" title={details.primary_interviewer_email}>
              {details.primary_interviewer_email}
            </p>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Backup Interviewer</label>
            <p className="text-sm font-medium text-gray-900 truncate" title={details.backup_interviewer_name}>
              {details.backup_interviewer_name || 'Not assigned'}
            </p>
            <p className="text-xs text-gray-600 truncate" title={details.backup_interviewer_email}>
              {details.backup_interviewer_email}
            </p>
          </div>
        </div>
      </div>
      
      {details.google_meet_link && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-green-800">Video Call Ready</p>
                </div>
              </div>
              <a 
                href={details.google_meet_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Join Meeting
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Interview Review Card Component
const InterviewReviewCard = ({ review, application, hideHeader = false }) => {
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'hire': return 'bg-green-100 text-green-800';
      case 'maybe': return 'bg-yellow-100 text-yellow-800';
      case 'reject': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={hideHeader ? "" : "card"}>
      {!hideHeader && <h3 className="text-lg font-semibold mb-4">Interview Review</h3>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Scores (1-10 scale)</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Technical Skills:</span>
              <span className={`font-medium ${getScoreColor(review.technical_score)}`}>
                {review.technical_score}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span>Communication:</span>
              <span className={`font-medium ${getScoreColor(review.communication_score)}`}>
                {review.communication_score}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span>Problem Solving:</span>
              <span className={`font-medium ${getScoreColor(review.problem_solving_score)}`}>
                {review.problem_solving_score}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cultural Fit:</span>
              <span className={`font-medium ${getScoreColor(review.cultural_fit_score)}`}>
                {review.cultural_fit_score}/10
              </span>
            </div>
            {review.leadership_potential && (
              <div className="flex justify-between">
                <span>Leadership Potential:</span>
                <span className={`font-medium ${getScoreColor(review.leadership_potential)}`}>
                  {review.leadership_potential}/10
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3">Overall Assessment</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Recommendation</label>
              <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getRecommendationColor(review.overall_recommendation)}`}>
                {review.overall_recommendation?.toUpperCase()}
              </span>
            </div>
            
            {review.overall_rating && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Overall Rating</label>
                <p className={`text-lg font-semibold ${getScoreColor(review.overall_rating)}`}>
                  {review.overall_rating}/10
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {review.strengths && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Strengths</h4>
          <p className="text-gray-700 whitespace-pre-line">{review.strengths}</p>
        </div>
      )}
      
      {review.areas_for_improvement && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Areas for Improvement</h4>
          <p className="text-gray-700 whitespace-pre-line">{review.areas_for_improvement}</p>
        </div>
      )}
      
      {review.additional_comments && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Additional Comments</h4>
          <p className="text-gray-700 whitespace-pre-line">{review.additional_comments}</p>
        </div>
      )}
      
      {!hideHeader && (
        <div className="mt-4 pt-4 border-t text-sm text-gray-500">
          <p>Review submitted: {review.review_submitted_at ? new Date(review.review_submitted_at).toLocaleString() : 'N/A'}</p>
          <p>Interviewer: {review.interviewer_name || review.interviewer_email}</p>
          {review.interviewer_type && <p>Role: {review.interviewer_type === 'primary' ? 'Primary' : 'Backup'} Interviewer</p>}
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;