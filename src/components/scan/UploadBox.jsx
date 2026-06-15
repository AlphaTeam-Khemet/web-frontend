import { useEffect, useRef, useState } from 'react';
import { Camera, ImageUp, X, Check, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UploadBox({
  preview,
  onFileSelect,
  onRemoveImage,
  onAnalyze,
  isLoading,
  analyzeLabel,
}) {
  const { t } = useTranslation();

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    stopCamera();
    onFileSelect(file);

    event.target.value = '';
  };

  const openCamera = async () => {
    setCameraError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
        audio: false,
      });

      streamRef.current = stream;

      setIsCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 0);
    } catch {
      setCameraError(t('scan.cameraError'));
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());

    streamRef.current = null;

    setIsCameraOpen(false);
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const canvas = document.createElement('canvas');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], 'camera-scan.png', {
        type: 'image/png',
      });

      onFileSelect(file);

      stopCamera();
    }, 'image/png');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <section className="scan-upload-card">
      <div className="scan-upload-heading">
        <span>{t('scan.badge')}</span>

        <h1>{t('scan.title')}</h1>

        <p>{t('scan.description')}</p>
      </div>

      <div
        className={
          preview || isCameraOpen
            ? 'scan-preview-box active animated'
            : 'scan-preview-box animated'
        }
      >
        {isCameraOpen ? (
          <div className="scan-camera-view">
            <video ref={videoRef} autoPlay playsInline muted />

            <div className="scan-camera-frame" />

            <div className="scan-camera-actions">
              <button type="button" onClick={captureImage}>
                <Check size={17} />
                {t('scan.capture')}
              </button>

              <button type="button" onClick={stopCamera}>
                <X size={17} />
                {t('scan.close')}
              </button>
            </div>
          </div>
        ) : preview ? (
          <>
            <img src={preview} alt="Selected artifact preview" />

            <button
              type="button"
              className="scan-remove-image"
              onClick={onRemoveImage}
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <div className="scan-empty-preview">
            <ImageUp size={42} />

            <h3>{t('scan.emptyTitle')}</h3>

            <p>{t('scan.emptyDescription')}</p>
          </div>
        )}
      </div>

      {cameraError && (
        <p className="scan-camera-error">
          {cameraError}
        </p>
      )}

      <div className="scan-upload-actions">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageUp size={17} />
          {t('scan.uploadImage')}
        </button>

        <button type="button" onClick={openCamera}>
          <Camera size={17} />
          {t('scan.openCamera')}
        </button>
      </div>

      <button
        type="button"
        className="scan-analyze-btn"
        disabled={!preview || isLoading || isCameraOpen}
        onClick={onAnalyze}
      >
        {isLoading ? (
          <>
            <RotateCcw size={17} className="scan-spin" />
            {t('scan.analyzing')}
          </>
        ) : (
          analyzeLabel || t('scan.analyze')
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </section>
  );
}