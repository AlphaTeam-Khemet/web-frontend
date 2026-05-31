import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Footer from '../components/home/Footer';
import UploadBox from '../components/scan/UploadBox';
import ScanResult from '../components/scan/ScanResult';
import { scanApi } from '../api/scanApi';
import { galleryApi } from '../api/galleryApi';
import { getApiErrorMessage, normalizeScanResult } from '../utils/apiData';

import '../styles/scan-ai.css';

export default function ScanAI() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setResult(null);
    setSaveMessage('');
    setErrorMessage('');

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const handleRemoveImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(null);
    setPreview('');
    setResult(null);
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResult(null);
    setSaveMessage('');
    setErrorMessage('');

    try {
      const { data } = await scanApi.scanArtifact(selectedFile);
      setResult(normalizeScanResult(data));
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, 'Artifact scan failed. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleSave = async () => {
    if (!result?.raw?.session?.id) {
      setSaveMessage(t('scan.savedMessage'));
      return;
    }

    try {
      await galleryApi.add({
        monument_id: result.raw.monument?.id || null,
        session_id: result.raw.session.id,
        image_url: result.raw.session.scanned_image,
      });

      setSaveMessage(t('scan.savedMessage'));
    } catch (error) {
      setSaveMessage(
        getApiErrorMessage(error, 'Unable to save this artifact.')
      );
    }
  };

  const handleAskAi = () => {
    if (!result?.name) return;

    navigate(`/chat-ai?artifact=${encodeURIComponent(result.name)}`);
  };

  return (
    <main className="scan-page">
      <section className="scan-container">
        <UploadBox
          preview={preview}
          onFileSelect={handleFileSelect}
          onRemoveImage={handleRemoveImage}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        <div>
          <ScanResult
            result={result}
            isLoading={isLoading}
            onRetry={handleRetry}
            onSave={handleSave}
            onAskAi={handleAskAi}
          />

          {errorMessage && (
            <div className="scan-save-message">
              {errorMessage}
            </div>
          )}

          {saveMessage && (
            <div className="scan-save-message">
              {saveMessage}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
