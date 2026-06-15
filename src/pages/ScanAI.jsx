/**
 * ScanAI.jsx
 * ==========
 * Combined Scan + Translate page with tab switcher.
 *
 * Tab 1 — SCAN: Upload image → CV recognition → artifact details
 * Tab 2 — Translate: Upload image → YOLO detection → LLM translation
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Footer from '../components/home/Footer';
import UploadBox from '../components/scan/UploadBox';
import ScanResult from '../components/scan/ScanResult';
import TranslateResult from '../components/scan/TranslateResult';
import { scanApi } from '../api/scanApi';
import { artifactsApi } from '../api/artifactsApi';
import { galleryApi } from '../api/galleryApi';
import { useLanguage } from '../context/LanguageContext';
import { getApiErrorMessage, normalizeScanResult } from '../utils/apiData';

import '../styles/scan-ai.css';

// ── Tab definitions ────────────────────────────────────────────────────────
const TABS = {
  SCAN: 'scan',
  TRANSLATE: 'translate',
};

export default function ScanAI() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ── Tab state — initialised from ?tab=translate URL param ────────────────
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'translate' ? TABS.TRANSLATE : TABS.SCAN
  );

  // Sync tab if the URL param changes (e.g. browser back/forward)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    setActiveTab(tabParam === 'translate' ? TABS.TRANSLATE : TABS.SCAN);
  }, [searchParams]);

  // ── Shared upload state ──────────────────────────────────────────────────
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');

  // ── Scan tab state ───────────────────────────────────────────────────────
  const [scanResult, setScanResult] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  // ── Translate tab state ──────────────────────────────────────────────────
  const [translateResult, setTranslateResult] = useState(null);
  const [translateLoading, setTranslateLoading] = useState(false);
  const [translateError, setTranslateError] = useState('');

  // ── Shared handlers ──────────────────────────────────────────────────────

  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return;
    // Reset everything when switching tabs
    setActiveTab(tab);
    setSelectedFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview('');
    setScanResult(null);
    setScanError('');
    setSaveMessage('');
    setTranslateResult(null);
    setTranslateError('');
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setScanResult(null);
    setScanError('');
    setSaveMessage('');
    setTranslateResult(null);
    setTranslateError('');
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview('');
    setScanResult(null);
    setScanError('');
    setSaveMessage('');
    setTranslateResult(null);
    setTranslateError('');
  };

  // ── Scan tab handlers ────────────────────────────────────────────────────

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setScanLoading(true);
    setScanResult(null);
    setScanError('');
    setSaveMessage('');
    try {
      const { data } = await scanApi.scanArtifact(selectedFile, language);
      setScanResult(normalizeScanResult(data));
    } catch (error) {
      setScanError(
        getApiErrorMessage(error, 'Artifact scan failed. Please try again.')
      );
    } finally {
      setScanLoading(false);
    }
  };

  const handleScanRetry = () => {
    setScanResult(null);
    setScanError('');
    setSaveMessage('');
  };

  const handleSave = async () => {
    const monumentId = scanResult?.raw?.monument?.id;
    if (!monumentId) {
      setSaveMessage(t('scan.cannotSaveUnknown', 'Cannot save unknown artifact to favorites.'));
      return;
    }
    try {
      await artifactsApi.addFavorite(monumentId);
      setSaveMessage(t('scan.savedToFavorites', 'Saved to Favorites!'));
    } catch (error) {
      setSaveMessage(getApiErrorMessage(error, 'Unable to save to favorites.'));
    }
  };

  const handleAskAi = () => {
    if (!scanResult?.name) return;
    navigate(`/chat-ai?artifact=${encodeURIComponent(scanResult.name)}`);
  };

  // ── Translate tab handlers ───────────────────────────────────────────────

  const handleTranslate = async () => {
    if (!selectedFile) return;
    setTranslateLoading(true);
    setTranslateResult(null);
    setTranslateError('');
    try {
      const { data } = await scanApi.translateHieroglyph(selectedFile, language);
      setTranslateResult(data.data);
    } catch (error) {
      setTranslateError(
        getApiErrorMessage(error, 'Hieroglyph translation failed. Please try again.')
      );
    } finally {
      setTranslateLoading(false);
    }
  };

  const handleTranslateRetry = () => {
    setTranslateResult(null);
    setTranslateError('');
  };

  // ── Derived state ────────────────────────────────────────────────────────
  const isLoading = activeTab === TABS.SCAN ? scanLoading : translateLoading;

  const handleAnalyzeClick = activeTab === TABS.SCAN
    ? handleAnalyze
    : handleTranslate;

  return (
    <main className="scan-page">
      <section className="scan-container">

        {/* ── Tab Switcher ──────────────────────────────────────────── */}
        <div className="scan-tabs">
          <button
            className={`scan-tab ${activeTab === TABS.SCAN ? 'scan-tab-active' : ''}`}
            onClick={() => handleTabSwitch(TABS.SCAN)}
          >
            {t('scan.tabScan', 'SCAN')}
          </button>
          <button
            className={`scan-tab ${activeTab === TABS.TRANSLATE ? 'scan-tab-active' : ''}`}
            onClick={() => handleTabSwitch(TABS.TRANSLATE)}
          >
            {t('scan.tabTranslate', 'Translate')}
          </button>
        </div>

        {/* ── Upload Box (shared between both tabs) ─────────────────── */}
        <UploadBox
          preview={preview}
          onFileSelect={handleFileSelect}
          onRemoveImage={handleRemoveImage}
          onAnalyze={handleAnalyzeClick}
          isLoading={isLoading}
          analyzeLabel={
            activeTab === TABS.SCAN
              ? t('scan.analyzeButton', 'Analyze')
              : t('scan.translateButton', 'Translate')
          }
        />

        {/* ── Results Panel ─────────────────────────────────────────── */}
        <div>
          {/* Scan tab results */}
          {activeTab === TABS.SCAN && (
            <>
              <ScanResult
                result={scanResult}
                isLoading={scanLoading}
                onRetry={handleScanRetry}
                onSave={handleSave}
                onAskAi={handleAskAi}
              />
              {scanError && (
                <div className="scan-save-message">{scanError}</div>
              )}
              {saveMessage && (
                <div className="scan-save-message">{saveMessage}</div>
              )}
            </>
          )}

          {/* Translate tab results */}
          {activeTab === TABS.TRANSLATE && (
            <>
              <TranslateResult
                result={translateResult}
                isLoading={translateLoading}
                onRetry={handleTranslateRetry}
              />
              {translateError && (
                <div className="scan-save-message">{translateError}</div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
