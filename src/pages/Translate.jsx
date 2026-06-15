import { Navigate, useLocation } from 'react-router-dom';

/**
 * Translate.jsx
 * =============
 * Redirects to the ScanAI page with the translate tab pre-selected.
 * The full hieroglyph translation UI lives in ScanAI (/scan?tab=translate).
 */
export default function Translate() {
  const location = useLocation();
  // Preserve any extra query params the caller may have appended
  const params = new URLSearchParams(location.search);
  params.set('tab', 'translate');
  return <Navigate to={`/scan?${params.toString()}`} replace />;
}
