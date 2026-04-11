
import { X, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
}

export const VideoModal = ({ isOpen, onClose, videoUrl }: VideoModalProps) => {
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Video progress tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setVideoProgress(progress);
    };

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadeddata', handleLoadedData);
    
    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!isVideoFullscreen) {
      videoContainerRef.current?.requestFullscreen?.();
      setIsVideoFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsVideoFullscreen(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickTime = (clickX / width) * videoRef.current.duration;
    videoRef.current.currentTime = clickTime;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        ref={videoContainerRef}
        className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
          isVideoFullscreen ? 'w-full h-full' : 'max-w-6xl w-full'
        }`}
      >
        {/* Video Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-lg font-semibold">GoHandyMate Demo</h3>
              <p className="text-sm text-gray-300">Real Jobs. Real Results.</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-red-400 transition-colors bg-black/20 hover:bg-red-500/20 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Video Element */}
        <div className={`relative ${isVideoFullscreen ? 'h-screen' : 'aspect-video'}`}>
          {videoUrl ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover cursor-pointer"
              controls={false}
              muted={isVideoMuted}
              playsInline
              poster="/lovable-uploads/3a9566aa-314d-45ec-9938-a6760464747a.png"
              onClick={togglePlayPause}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            // Fallback placeholder when no video is uploaded
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-600 via-emerald-500 to-green-400">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎬</div>
                <h2 className="text-3xl font-bold mb-2">GoHandyMate Demo Video</h2>
                <p className="text-xl opacity-90 mb-6">"Real Jobs. Real Results."</p>
                <div className="space-y-2 text-lg">
                  <p>• Skilled Professionals in Action</p>
                  <p>• 4.9★ Customer Satisfaction</p>
                  <p>• Instant Booking & Secure Payments</p>
                  <p>• 50,000+ Happy Users</p>
                </div>
                <p className="text-sm opacity-75 mt-6">Upload your demo video to replace this placeholder</p>
              </div>
            </div>
          )}
        </div>

        {/* Video Controls - Only show if video is loaded */}
        {(videoUrl && isVideoLoaded) && (
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div 
              className="w-full h-2 bg-white/20 rounded-full mb-4 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${videoProgress}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-green-400 transition-colors"
                >
                  {isVideoMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-green-400 transition-colors"
                >
                  {isVideoFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
