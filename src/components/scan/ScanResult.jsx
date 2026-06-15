import { useState } from 'react';
import { Bookmark, RefreshCcw, Share2, Sparkle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import VoiceGuideButton from '../common/VoiceGuideButton';

export default function ScanResult({
  result,
  isLoading,
  onRetry,
  onSave,
  onAskAi,
}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <section className="scan-result-card">
        <h3>{t('scan.resultTitle')}</h3>

        <div className="scan-result-body">
          <p className="scan-loading-text">
            {t('scan.loadingText')}
          </p>
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="scan-result-card">
        <h3>{t('scan.resultTitle')}</h3>

        <div className="scan-empty-result">
          {t('scan.emptyResult')}
        </div>
      </section>
    );
  }

  const shouldShowReadMore = result.description.length > 260;

  return (
    <section className="scan-result-card">
      <h3>{t('scan.resultTitle')}</h3>

      <div className="scan-result-body">
        <div className="scan-result-heading">
          <span>{result.category}</span>
          <h2>{result.name}</h2>
          <p>
            {result.confidence}% {t('scan.confidence')}
          </p>
        </div>

        <p
          className={
            isExpanded
              ? 'scan-result-description expanded'
              : 'scan-result-description'
          }
        >
          {result.description}
        </p>

        <VoiceGuideButton 
          artifactId={result.id} 
          artifactName={result.name} 
          artifactDescription={result.description} 
        />

        {shouldShowReadMore && (
          <button
            type="button"
            className="scan-read-more"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded
              ? t('scan.showLess')
              : t('scan.readMore')}
          </button>
        )}

        <div className="scan-result-meta">
          <span>{t('scan.period')}</span>
          <strong>{result.period}</strong>
        </div>
      </div>

      <div className="scan-result-actions">
        <button type="button" onClick={onRetry}>
          <RefreshCcw size={15} />
          {t('scan.retry')}
        </button>

        <button type="button">
          <Share2 size={15} />
          {t('scan.share')}
        </button>

        <button type="button" className="primary" onClick={onSave}>
          <Bookmark size={15} />
          {t('scan.saveToFavorites', 'Save to Favorites')}
        </button>

        <button type="button" className="scan-ai-action" onClick={onAskAi}>
          <Sparkle size={17} fill="currentColor" />
          Khemet AI
        </button>
      </div>
    </section>
  );
}
