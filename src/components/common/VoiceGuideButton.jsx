import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Loader2, Mic } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { voiceApi } from '../../api/voiceApi';

const getAudioFilename = (audioUrl) => String(audioUrl || '').split('/').pop();

export default function VoiceGuideButton({ artifactId, artifactName, artifactDescription }) {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [script, setScript] = useState('');
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slowRequest, setSlowRequest] = useState(false);
  const audioRef = useRef(null);
  const slowTimerRef = useRef(null);

  useEffect(() => {
    setAudioUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return null;
    });
    setScript('');
    setIsPlaying(false);
    setError(null);
    setSlowRequest(false);
  }, [artifactId, language]);

  useEffect(() => () => {
    clearTimeout(slowTimerRef.current);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying((current) => !current);
  };

  const handleFetchNarration = async () => {
    if (audioUrl) {
      togglePlay();
      return;
    }

    setIsLoading(true);
    setError(null);
    setSlowRequest(false);
    slowTimerRef.current = setTimeout(() => setSlowRequest(true), 5000);

    try {
      const response = await voiceApi.narrate({
        monument_name: artifactName,
        description: artifactDescription,
        language,
      });

      setScript(response.data.script || '');

      if (response.data.audio_url) {
        const filename = getAudioFilename(response.data.audio_url);
        const audioResponse = await voiceApi.getAudio(filename);
        const objectUrl = URL.createObjectURL(audioResponse.data);
        setAudioUrl(objectUrl);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
          }
        }, 100);
      } else {
        setError('Audio is unavailable, but the narration script is ready below.');
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
        || requestError.response?.data?.detail
        || 'Failed to load voice guide.'
      );
    } finally {
      clearTimeout(slowTimerRef.current);
      setSlowRequest(false);
      setIsLoading(false);
    }
  };

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
          <div className="audio-waveform" aria-hidden="true">
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </div>
        ) : (
          <Mic size={20} />
        )}
        {isLoading
          ? (language === 'ar' ? 'جارٍ توليد الصوت...' : 'Generating audio...')
          : isPlaying
            ? (language === 'ar' ? 'جارٍ تشغيل القصة...' : 'Playing Story...')
            : (language === 'ar' ? 'استمع إلى القصة' : 'Hear the Story')}
      </button>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          style={{ display: 'none' }}
        />
      )}

      {isLoading && slowRequest && (
        <div style={{ color: '#795548', marginTop: '8px', fontSize: '0.82rem', fontStyle: 'italic' }}>
          {language === 'ar'
            ? 'قد يستغرق توليد الصوت لحظة في المرة الأولى...'
            : 'Generating audio, please wait a moment...'}
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

      {script && !audioUrl && (
        <p style={{ marginTop: '10px', lineHeight: 1.6 }}>
          {script}
        </p>
      )}
    </div>
  );
}
