import { useState } from 'react';
import { Bookmark, RefreshCcw, Share2 } from 'lucide-react';

export default function ScanResult({
  result,
  isLoading,
  onRetry,
  onSave,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <section className="scan-result-card">
        <h3>AI Result</h3>
        <div className="scan-result-body">
          <p className="scan-loading-text">Analyzing artifact...</p>
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="scan-result-card">
        <h3>AI Result</h3>
        <div className="scan-empty-result">
          Upload or capture an artifact image to begin AI analysis.
        </div>
      </section>
    );
  }

  const shouldShowReadMore = result.description.length > 260;

  return (
    <section className="scan-result-card">
      <h3>AI Result</h3>

      <div className="scan-result-body">
        <div className="scan-result-heading">
          <span>{result.category}</span>
          <h2>{result.name}</h2>
          <p>{result.confidence}% confidence</p>
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

        {shouldShowReadMore && (
          <button
            type="button"
            className="scan-read-more"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}

        <div className="scan-result-meta">
          <span>Period</span>
          <strong>{result.period}</strong>
        </div>
      </div>

      <div className="scan-result-actions">
        <button type="button" onClick={onRetry}>
          <RefreshCcw size={15} />
          Retry
        </button>

        <button type="button">
          <Share2 size={15} />
          Share
        </button>

        <button type="button" className="primary" onClick={onSave}>
          <Bookmark size={15} />
          Save to Collection
        </button>
      </div>
    </section>
  );
}