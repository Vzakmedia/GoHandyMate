
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdvertisingSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setStatus('error');
        setMessage('No session ID found');
        return;
      }

      try {
        console.log('Verifying payment with session ID:', sessionId);
        
        const { data, error } = await supabase.functions.invoke('verify-ad-payment', {
          body: { session_id: sessionId }
        });

        if (error) {
          console.error('Payment verification error:', error);
          setStatus('error');
          setMessage(error.message || 'Payment verification failed');
          return;
        }

        if (data?.success) {
          setStatus('success');
          setMessage('Your advertisement has been activated successfully!');
        } else {
          setStatus('error');
          setMessage(data?.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
        setMessage('An error occurred while verifying your payment');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-600" />
              <CardTitle className="text-2xl">Processing Payment...</CardTitle>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
            </>
          )}
          {status === 'error' && (
            <>
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
              <CardTitle className="text-2xl text-red-800">Payment Issue</CardTitle>
            </>
          )}
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/business-advertising')}
              className="w-full"
              variant={status === 'success' ? 'default' : 'outline'}
            >
              {status === 'success' ? 'Manage Advertisements' : 'Try Again'}
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              variant="ghost"
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertisingSuccess;
