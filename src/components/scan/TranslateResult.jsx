import { RotateCcw, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TranslateResult({ result, isLoading, onRetry }) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <section className="scan-result-card">
        <h3>{t('translate.resultTitle', 'Hieroglyph Translation')}</h3>
        <div className="scan-result-body">
          <p className="scan-loading-text">
            {t('scan.loadingText', 'Analyzing image...')}
          </p>
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="scan-result-card">
        <h3>{t('translate.resultTitle', 'Hieroglyph Translation')}</h3>
        <div className="scan-empty-result">
          {t('scan.emptyResult', 'Upload or capture an artifact image to begin AI analysis.')}
        </div>
      </section>
    );
  }

  if (result.status === 'failed' || result.error) {
    return (
      <section className="scan-result-card scan-result-error">
        <h3>{t('translate.resultTitle', 'Hieroglyph Translation')}</h3>
        <div className="scan-result-body">
          <div className="scan-result-heading">
             <span>{t('translate.error', 'Error')}</span>
             <h2>{t('translate.errorTitle', 'Translation Failed')}</h2>
          </div>
          <p className="scan-result-description">
            {result.error || t('translate.errorMessage', 'The hieroglyph translation service could not process this image.')}
          </p>
        </div>
        <div className="scan-result-actions">
          <button type="button" onClick={onRetry}>
            <RotateCcw size={15} />
            {t('scan.tryAgain', 'Try Again')}
          </button>
        </div>
      </section>
    );
  }

  if (!result.detection || result.detection.total_symbols === 0) {
    return (
      <section className="scan-result-card">
        <h3>{t('translate.resultTitle', 'Hieroglyph Translation')}</h3>
        <div className="scan-result-body">
          <div className="scan-result-heading">
             <span>{t('translate.noSymbolsLabel', 'Detection')}</span>
             <h2>{t('translate.noSymbols', 'No Hieroglyphs Detected')}</h2>
          </div>
          <p className="scan-result-description">
            {t('translate.noSymbolsMessage', 'No hieroglyph symbols were detected in this image. Try uploading a clearer image with visible hieroglyphs.')}
          </p>
        </div>
        <div className="scan-result-actions">
          <button type="button" onClick={onRetry}>
            <RotateCcw size={15} />
            {t('scan.tryAgain', 'Try Again')}
          </button>
        </div>
      </section>
    );
  }

  const title = result.name || result.title || t('translate.resultTitle', 'Hieroglyph Translation');

  return (
    <section className="scan-result-card">
      <h3>{title}</h3>
      <div className="scan-result-body">
        
        {/* First block: Detected Symbols */}
        <div className="scan-result-heading">
          <span>{t('translate.detectedLabel', 'Detection')}</span>
          <h2>{t('translate.detectedSymbols', 'Detected Symbols')}</h2>
          {result.detection?.total_symbols !== undefined && (
            <p>
              {result.detection.total_symbols} {t('translate.symbolsCount', 'symbols')}
            </p>
          )}
        </div>
        <div className="scan-result-description">
          <div className="translate-symbol-sequence">
            {result.detection?.symbol_sequence?.map((code, i) => (
              <span key={i} className="translate-symbol-badge">
                {code}
              </span>
            ))}
          </div>
        </div>

        {/* Second block: Translation */}
        {result.translation ? (
          <>
            <div className="scan-result-heading" style={{ marginBottom: '16px' }}>
              <span>{result.translation.type ? result.translation.type.toUpperCase() : t('translate.translationLabel', 'RESULT')}</span>
              {result.translation.confidence_note && (
                <p style={{ display: 'inline-block', background: 'rgba(231, 197, 112, 0.1)', color: '#e7c570', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', marginTop: '8px', textTransform: 'uppercase' }}>
                  {result.translation.confidence_note} Confidence
                </p>
              )}
            </div>
            
            <div className="scan-result-description">
              <div style={{
                background: 'linear-gradient(135deg, rgba(231, 197, 112, 0.15) 0%, rgba(231, 197, 112, 0.05) 100%)',
                border: '1px solid rgba(231, 197, 112, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}>
                <h2 style={{ 
                  fontSize: '36px', 
                  color: '#000000', 
                  margin: '0', 
                  fontFamily: '"Cormorant Garamond", serif',
                  textTransform: 'capitalize',
                  letterSpacing: '0.02em',
                  textShadow: 'none'
                }}>
                  {result.translation.text}
                </h2>
              </div>
              
              {(result.translation.transliteration || result.translation.combined_phonetics) && (
                <div style={{ marginBottom: '16px', color: '#c7a765', fontSize: '16px' }}>
                  {result.translation.transliteration ? (
                    <p><strong>Transliteration:</strong> <span style={{fontStyle: 'italic'}}>{result.translation.transliteration}</span></p>
                  ) : (
                    <p><strong>Phonetics:</strong> <span style={{fontStyle: 'italic'}}>{result.translation.combined_phonetics}</span></p>
                  )}
                </div>
              )}

              {result.translation.cultural_context && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: '16px' }}>
                  <p style={{ color: '#fff8ef', opacity: 0.9, lineHeight: '1.6' }}>
                    {result.translation.cultural_context}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="scan-result-heading">
              <span>{t('translate.translationLabel', 'Result')}</span>
              <h2>{t('translate.translation', 'Translation')}</h2>
            </div>
            <p className="scan-result-description" style={{ fontStyle: 'italic', color: '#888' }}>
              {t('translate.translationUnavailable', 'The AI detected the symbols, but the translation service encountered an error. Please try again or check your API keys.')}
            </p>
          </>
        )}
      </div>

      <div className="scan-result-actions">
        <button type="button" onClick={onRetry}>
          <RotateCcw size={15} />
          {t('scan.tryAgain', 'Try Again')}
        </button>
      </div>
    </section>
  );
}
