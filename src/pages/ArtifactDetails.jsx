import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Sparkle, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Footer from '../components/home/Footer';
import { collectionsMockData } from '../data/collectionsMockData';
import { ROUTES } from '../constants/routes';
import { artifactsApi } from '../api/artifactsApi';
import { getApiErrorMessage, normalizeMonument } from '../utils/apiData';

import '../styles/artifactDetails.css';

export default function ArtifactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [artifact, setArtifact] = useState(() =>
    collectionsMockData.find((item) => String(item.id) === String(id))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadArtifact() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const { data } = await artifactsApi.getById(id);
        if (active) setArtifact(normalizeMonument(data));
      } catch (error) {
        if (active) {
          setErrorMessage(getApiErrorMessage(error, 'Unable to load artifact details.'));
          setArtifact(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadArtifact();

    return () => {
      active = false;
    };
  }, [id]);

  if (!artifact) {
    return (
      <main className="artifact-details-page">
        <section className="artifact-not-found">
          <h1>{isLoading ? 'Loading artifact...' : t('artifact.notFound')}</h1>
          {errorMessage && <p>{errorMessage}</p>}

          <Link to={ROUTES.COLLECTIONS}>
            {t('artifact.back')}
          </Link>
        </section>
      </main>
    );
  }

  const title = artifact.displayName || t(artifact.titleKey || artifact.name || '');
  const category = artifact.category || t(artifact.categoryKey || '');
  const period = artifact.period || t(artifact.periodKey || '');
  const location = artifact.location || t(artifact.locationKey || '');
  const overviewText = artifact.description || t(artifact.descriptionKey || '');

  const handleAskAi = () => {
    navigate(
      `${ROUTES.CHAT_AI}?artifact=${encodeURIComponent(title)}`
    );
  };

  return (
    <main className="artifact-details-page">
      <section className="artifact-details-container">
        <Link to={ROUTES.COLLECTIONS} className="artifact-back-link">
          <ArrowLeft size={18} />
          {t('artifact.back')}
        </Link>

        <div className="artifact-main-layout">
          <div className="artifact-image-frame">
            <img src={artifact.image} alt={title} />
          </div>

          <div className="artifact-text-panel">
            <span className="artifact-category">{category}</span>

            <h1>{title}</h1>

            <p className="artifact-meta">
              {period} - {location}
            </p>

            <p className="artifact-description">
              {overviewText}
            </p>

            <button
              type="button"
              className="artifact-ai-btn"
              onClick={handleAskAi}
            >
              <Sparkle size={20} fill="currentColor" />
              Ask Khemet AI about {title}
            </button>

            <div className="artifact-info-list">
              <div>
                <Clock size={17} />
                <span>{period}</span>
              </div>

              <div>
                <MapPin size={17} />
                <span>{location}</span>
              </div>

              <div>
                <Tag size={17} />
                <span>{category}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="artifact-bottom-note">
          <p>{t('artifact.bottomNote')}</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
