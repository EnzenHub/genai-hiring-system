import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { Upload, FileText, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const ResumeUpdate = () => {
  const { referenceNumber } = useParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [guidelines, setGuidelines] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatus();
    fetchGuidelines();
  }, [referenceNumber]);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/resume-update/status/${referenceNumber}`);
      setStatus(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching status:', error);
      setError(error.response?.data?.detail || 'Failed to load application status');
    } finally {
      setLoading(false);
    }
  };

  const fetchGuidelines = async () => {
    try {
      const response = await axios.get('/api/resume-update/guidelines');
      setGuidelines(response.data);
    } catch (error) {
      console.error('Error fetching guidelines:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a PDF, DOC, or DOCX file');
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setUploadResult(null);
      
      const formData = new FormData();
      formData.append('resume', selectedFile);
      
      const response = await axios.post(
        `/api/resume-update/upload/${referenceNumber}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setUploadResult(response.data);
      setSelectedFile(null);
      
      // Refresh status after successful upload
      await fetchStatus();
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.response?.data?.detail || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (statusType) => {
    switch (statusType) {
      case 'completed_success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'completed_failure':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'llm_rejected':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'email_sent':
      case 'llm_approved':
        return <Clock className="w-6 h-6 text-blue-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (statusType) => {
    switch (statusType) {
      case 'completed_success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completed_failure':
      case 'llm_rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'email_sent':
      case 'llm_approved':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application status...</p>
        </div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => navigate('/')} variant="outline">
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resume Update Portal</h1>
          <p className="mt-2 text-gray-600">Improve your application with an updated resume</p>
        </div>

        {/* Application Status */}
        {status && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(status.update_request?.status)}
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Reference Number</p>
                  <p className="font-semibold">{status.application.reference_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Candidate Name</p>
                  <p className="font-semibold">{status.application.candidate_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Position</p>
                  <p className="font-semibold">{status.application.job_title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Score</p>
                  <p className="font-semibold">
                    {status.application.current_score.toFixed(1)}/100
                    <span className="text-sm text-gray-500 ml-2">
                      (Target: {status.application.threshold_needed})
                    </span>
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress to Target</span>
                  <span>{((status.application.current_score / status.application.threshold_needed) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(status.application.current_score / status.application.threshold_needed) * 100} 
                  className="h-2"
                />
              </div>

              {/* Status Message */}
              <Alert className={`${getStatusColor(status.update_request?.status)}`}>
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>

              {/* Attempts Tracking */}
              {status.update_request && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Update Attempts</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Used: {status.update_request.attempts_used}/{status.update_request.max_attempts}</span>
                    <span>Remaining: {status.update_request.attempts_remaining}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upload Section */}
        {status?.eligible_for_update && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Updated Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select your updated resume
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={uploading}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Accepted formats: PDF, DOC, DOCX (Max size: 10MB)
                  </p>
                </div>

                {selectedFile && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800">{selectedFile.name}</span>
                    <span className="text-xs text-blue-600">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}

                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Resume...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload and Process Resume
                    </>
                  )}
                </Button>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {uploadResult.threshold_achieved ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
                Resume Processing Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className={uploadResult.threshold_achieved ? 
                  "border-green-200 bg-green-50" : 
                  uploadResult.final_rejection ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"
                }>
                  <AlertDescription className={
                    uploadResult.threshold_achieved ? "text-green-800" : 
                    uploadResult.final_rejection ? "text-red-800" : "text-yellow-800"
                  }>
                    {uploadResult.message}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Previous Score</p>
                    <p className="text-2xl font-bold text-gray-900">{uploadResult.old_score?.toFixed(1)}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">New Score</p>
                    <p className="text-2xl font-bold text-blue-600">{uploadResult.new_score?.toFixed(1)}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Improvement</p>
                    <p className={`text-2xl font-bold ${uploadResult.score_improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {uploadResult.score_improvement >= 0 ? '+' : ''}{uploadResult.score_improvement?.toFixed(1)}
                    </p>
                  </div>
                </div>

                {!uploadResult.threshold_achieved && !uploadResult.final_rejection && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      You have <strong>{uploadResult.attempts_remaining}</strong> more attempt(s) remaining.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Update History */}
        {status?.update_history && status.update_history.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Update History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {status.update_history.map((history, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Attempt {history.attempt_number}</p>
                      <p className="text-sm text-gray-600">
                        Email sent: {new Date(history.email_sent_at).toLocaleDateString()}
                      </p>
                      {history.resume_updated && (
                        <p className="text-sm text-gray-600">
                          Resume updated: {new Date(history.resume_updated_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {history.resume_updated ? (
                        <div>
                          <p className="text-sm text-gray-600">Score Change</p>
                          <p className="font-semibold">
                            {history.old_score?.toFixed(1)} → {history.new_score?.toFixed(1)}
                            <span className={`ml-2 text-sm ${history.score_improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ({history.score_improvement >= 0 ? '+' : ''}{history.score_improvement?.toFixed(1)})
                            </span>
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Pending update</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resume Improvement Guidelines */}
        {guidelines && status?.eligible_for_update && (
          <Card>
            <CardHeader>
              <CardTitle>Resume Improvement Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">Formatting Tips</h4>
                  <ul className="space-y-2 text-sm">
                    {guidelines.guidelines.formatting.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Content Tips</h4>
                  <ul className="space-y-2 text-sm">
                    {guidelines.guidelines.content.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-purple-600">Experience Section</h4>
                  <ul className="space-y-2 text-sm">
                    {guidelines.guidelines.experience.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-orange-600">Skills Section</h4>
                  <ul className="space-y-2 text-sm">
                    {guidelines.guidelines.skills.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-red-600">Common Mistakes to Avoid</h4>
                <ul className="space-y-1 text-sm">
                  {guidelines.guidelines.common_mistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResumeUpdate;
