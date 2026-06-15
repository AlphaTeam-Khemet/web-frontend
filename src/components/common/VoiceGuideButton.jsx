import React, { useState, useRef, useEffect } from 'react';
import { Mic, Loader2, Pause, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api/axiosInstance';

const getAudioFilename = (audioUrl) => String(audioUrl || '').split('/').pop();

export default function VoiceGuideButton({ artifactId, artifactName, artifactDescription }) {
  const { language } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // BUG 11 FIX: show a hint when the request is taking longer than 5 s
  // (Coqui CPU fallback can take 30-60 s on first request)
  const [slowRequest, setSlowRequest] = useState(false);
  const audioRef = useRef(null);
  const slowTimerRef = useRef(null);

  // Reset audio state whenever the artifact or language changes so stale
  // audio from a previous artifact/language combo doesn't auto-play.
  useEffect(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setIsPlaying(false);
    setError(null);
    setSlowRequest(false);
  }, [artifactId, language]);

  const handleFetchNarration = async () => {
    // If we already have audio loaded, toggle play/pause instead of re-fetching
    if (audioUrl) {
      togglePlay();
      return;
    }

    setIsLoading(true);
    setError(null);
    setSlowRequest(false);
    // Show a hint after 5 s — ElevenLabs may take a moment on first request
    slowTimerRef.current = setTimeout(() => setSlowRequest(true), 5000);

    try {
      const response = await api.post(
        `/voice/artifacts/${artifactId}/narrate`,
        {
          language,
          artifact_name: artifactName,
          artifact_description: artifactDescription,
        },
        { timeout: 60000 }
      );

      if (response.data.data?.audio_url) {
        const filename = getAudioFilename(response.data.data.audio_url);
        const audioResponse = await api.get(`/voice/audio/${filename}`, {
          responseType: 'blob',
          timeout: 60000,
        });
        const objectUrl = URL.createObjectURL(audioResponse.data);
        setAudioUrl(objectUrl);
        // Give the <audio> element a tick to bind the new src before calling play()
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
          }
        }, 100);
      } else {
        // TTS unavailable — show a short excerpt of the narration text as feedback
        const excerpt = response.data.data?.narration_text?.substring(0, 120) ?? '';
        setError(`Audio unavailable. ${excerpt}${excerpt.length === 120 ? '\u2026' : ''}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.detail || 'Failed to load voice guide.');
    } finally {
      clearTimeout(slowTimerRef.current);
      setSlowRequest(false);
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying((prev) => !prev);
  };

  const onEnded = () => setIsPlaying(false);

  return (
    <div className="voice-guide-container" style={{ marginTop: '15px', marginBottom: '15px' }}>
      <button
        type="button"
        className="artifact-ai-btn voice-guide-btn"
        onClick={handleFetchNarration}
        disabled={isLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #c5a059 0%, #8b6d3a 100%)',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : isPlaying ? (
          <div className="audio-waveform">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        ) : (
          <Mic size={20} />
        )}
        {isLoading
          ? (language === 'ar' ? 'جارٍ التوليد...' : 'Generating audio...')
          : isPlaying
            ? (language === 'ar' ? 'يتم التشغيل...' : 'Playing Story...')
            : (language === 'ar' ? 'استمع للقصة' : 'Hear the Story')}
      </button>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={onEnded}
          style={{ display: 'none' }}
        />
      )}

      {/* BUG 11 FIX: slow-request hint — appears after 5 s while loading */}
      {isLoading && slowRequest && (
        <div
          style={{
            color: '#795548',
            marginTop: '8px',
            fontSize: '0.82rem',
            fontStyle: 'italic',
          }}
        >
          {language === 'ar'
            ? '⏳ قد يستغرق هذا لحظة في أول مرة...'
            : '⏳ Generating audio — please wait a moment...'}
        </div>
      )}

      {error && (
        <div
          style={{
            color: '#d32f2f',
            marginTop: '10px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '5px',
            padding: '10px',
            background: '#ffebee',
            borderRadius: '4px',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
