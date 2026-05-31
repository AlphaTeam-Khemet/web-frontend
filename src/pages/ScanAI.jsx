import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Footer from '../components/home/Footer';
import UploadBox from '../components/scan/UploadBox';
import ScanResult from '../components/scan/ScanResult';
import { mockScanResult } from '../data/mockScanResult';

import '../styles/scan-ai.css';

export default function ScanAI() {
  const { t } = useTranslation();

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setResult(null);
    setSaveMessage('');

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
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResult(null);
    setSaveMessage('');

    /*
      Backend later:
      const formData = new FormData();
      formData.append('image', selectedFile);
      const response = await api.post('/scan/analyze', formData);
      setResult(response.data);
    */

    setTimeout(() => {
      setResult(mockScanResult);
      setIsLoading(false);
    }, 1600);
  };

  const handleRetry = () => {
    setResult(null);
    setSaveMessage('');
  };

  const handleSave = () => {
    /*
      Backend later:
      await api.post('/collections/suggest', {
        ...result,
        image: selectedFile
      });
    */

    setSaveMessage(t('scan.savedMessage'));
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
          />

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