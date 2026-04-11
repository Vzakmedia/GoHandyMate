import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const HandymanProfilePage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (profileId) {
      // Redirect to the customer-facing booking page which shows all services and pricing
      navigate(`/book/${profileId}`, { replace: true });
    }
  }, [profileId, navigate]);

  if (!profileId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">The requested profile could not be found.</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading professional profile...</p>
      </div>
    </div>
  );
};