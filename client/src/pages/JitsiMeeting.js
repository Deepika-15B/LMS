import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft, FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import axios from 'axios';
import './JitsiMeeting.css';

const JitsiMeeting = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const meetingId = searchParams.get('meetingId');
  const navigate = useNavigate();
  const { user } = useAuth();
  const jitsiContainerRef = useRef(null);
  const [jitsiApi, setJitsiApi] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  useEffect(() => {
    if (meetingId) {
      fetchMeetingInfo();
    } else {
      setLoading(false);
    }
  }, [meetingId]);

  useEffect(() => {
    if (roomId && jitsiContainerRef.current && !jitsiApi) {
      initializeJitsi();
    }

    return () => {
      if (jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [roomId, jitsiApi]);

  const fetchMeetingInfo = async () => {
    try {
      const res = await axios.get(`/api/meetings/${meetingId}`);
      setMeetingInfo(res.data);
    } catch (err) {
      console.error('Error fetching meeting info:', err);
      setError('Failed to load meeting information');
    } finally {
      setLoading(false);
    }
  };

  const initializeJitsi = () => {
    // Check if Jitsi Meet External API script is loaded
    if (!window.JitsiMeetExternalAPI) {
      // Load Jitsi Meet External API script
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => {
        createJitsiInstance();
      };
      script.onerror = () => {
        setError('Failed to load Jitsi Meet. Please check your internet connection.');
        setLoading(false);
      };
      document.head.appendChild(script);
    } else {
      createJitsiInstance();
    }
  };

  const createJitsiInstance = () => {
    if (!jitsiContainerRef.current) {
      console.error('Jitsi container ref is not available');
      return;
    }

    const domain = 'meet.jit.si';
    const options = {
      roomName: roomId,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        enableClosePage: false,
        disableDeepLinking: true,
        defaultLanguage: 'en',
        prejoinPageEnabled: false,
        enableFeaturesBasedOnToken: true,
        toolbarButtons: [
          'microphone',
          'camera',
          'closedcaptions',
          'desktop',
          'fullscreen',
          'fodeviceselection',
          'hangup',
          'chat',
          'settings',
          'videoquality',
          'filmstrip',
          'feedback',
          'stats',
          'shortcuts',
          'tileview',
          'download',
          'help',
          'mute-everyone',
          'security'
        ]
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone',
          'camera',
          'closedcaptions',
          'desktop',
          'fullscreen',
          'fodeviceselection',
          'hangup',
          'chat',
          'settings',
          'videoquality',
          'filmstrip',
          'feedback',
          'stats',
          'shortcuts',
          'tileview',
          'download',
          'help',
          'mute-everyone',
          'security'
        ],
        SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: '',
        SHOW_POWERED_BY: false,
        DISPLAY_WELCOME_PAGE_CONTENT: false,
        DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
        APP_NAME: 'LMS Live Classes',
        NATIVE_APP_NAME: 'LMS Live Classes',
        PROVIDER_NAME: 'LMS',
        DEFAULT_BACKGROUND: '#474747',
        DEFAULT_WELCOME_PAGE_LOGO_URL: '',
        DEFAULT_LOGO_URL: ''
      },
      userInfo: {
        displayName: user?.fullName || user?.username || 'Student',
        email: user?.email || ''
      }
    };

    console.log('Initializing Jitsi with options:', options);

    try {
      const api = new window.JitsiMeetExternalAPI(domain, options);
      setJitsiApi(api);

      // Event listeners
      api.addEventListener('videoConferenceJoined', () => {
        console.log('Successfully joined video conference');
        setLoading(false);
      });

      api.addEventListener('participantJoined', (participant) => {
        console.log('Participant joined:', participant);
      });

      api.addEventListener('participantLeft', (participant) => {
        console.log('Participant left:', participant);
      });

      api.addEventListener('audioMuteStatusChanged', (data) => {
        setIsAudioMuted(data.muted);
      });

      api.addEventListener('videoMuteStatusChanged', (data) => {
        setIsVideoMuted(data.muted);
      });

      api.addEventListener('readyToClose', () => {
        console.log('Meeting is ready to close');
        api.dispose();
        navigate('/student/dashboard');
      });

      api.addEventListener('errorOccurred', (error) => {
        console.error('Jitsi error occurred:', error);
        setError(`Meeting error: ${error.name || 'Unknown error'}. Please try refreshing the page.`);
      });

      api.addEventListener('connectionEstablished', () => {
        console.log('Jitsi connection established');
      });

      api.addEventListener('connectionFailed', (error) => {
        console.error('Jitsi connection failed:', error);
        setError('Failed to connect to meeting. Please check your internet connection and try again.');
        setLoading(false);
      });

    } catch (err) {
      console.error('Error initializing Jitsi:', err);
      setError(`Failed to initialize video conference: ${err.message || 'Unknown error'}. Please try refreshing the page.`);
      setLoading(false);
    }
  };

  const handleLeaveMeeting = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('hangup');
      jitsiApi.dispose();
    }
    navigate('/student/dashboard');
  };

  if (loading && !jitsiApi) {
    return (
      <div className="jitsi-loading-container">
        <div className="loading-spinner"></div>
        <p>Loading video conference...</p>
        <p className="text-sm text-secondary">Room: {roomId}</p>
        <p className="text-sm text-secondary">User: {user?.fullName || user?.username || 'Student'}</p>
      </div>
    );
  }

  if (error && !jitsiApi) {
    return (
      <div className="jitsi-error-container">
        <div className="error-content">
          <h2>Error Loading Meeting</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => window.location.reload()} className="btn btn-outline mr-1">
              Refresh Page
            </button>
            <button onClick={() => navigate('/student/dashboard')} className="btn btn-primary">
              <FaArrowLeft /> Go Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jitsi-meeting-container">
      <div className="jitsi-header">
        <div className="meeting-info">
          {meetingInfo && (
            <>
              <h3>{meetingInfo.title}</h3>
              <p className="meeting-course">{meetingInfo.courseName}</p>
            </>
          )}
        </div>
        <button onClick={handleLeaveMeeting} className="btn btn-danger leave-btn">
          <FaArrowLeft /> Leave Meeting
        </button>
      </div>
      <div className="jitsi-wrapper">
        <div ref={jitsiContainerRef} className="jitsi-container"></div>
      </div>
    </div>
  );
};

export default JitsiMeeting;

