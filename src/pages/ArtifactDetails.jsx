import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Footer from '../components/home/Footer';
import { collectionsMockData } from '../data/collectionsMockData';
import { ROUTES } from '../constants/routes';

import '../styles/artifactDetails.css';

export default function ArtifactDetails() {
  const { id } = useParams();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('overview');

  const artifact = collectionsMockData.find(
    (item) => String(item.id) === String(id)
  );

  if (!artifact) {
    return (
      <main className="artifact-details-page">
        <section className="artifact-not-found">
          <h1>{t('artifact.notFound')}</h1>

          <Link to={ROUTES.COLLECTIONS}>
            {t('artifact.back')}
          </Link>
        </section>
      </main>
    );
  }

  const overviewText = t(artifact.descriptionKey);

  const historyText = artifact.historyKey
    ? t(artifact.historyKey)
    : t('artifact.defaultHistory');

  return (
    <main className="artifact-details-page">
      <section className="artifact-details-container">
        <Link to={ROUTES.COLLECTIONS} className="artifact-back-link">
          <ArrowLeft size={18} />
          {t('artifact.back')}
        </Link>

        <div className="artifact-main-layout">
          <div className="artifact-image-frame">
            <img
              src={artifact.image}
              alt={t(artifact.titleKey)}
            />
          </div>

          <div className="artifact-text-panel">
            <span className="artifact-category">
              {t(artifact.categoryKey)}
            </span>

            <h1>{t(artifact.titleKey)}</h1>

            <p className="artifact-meta">
              {t(artifact.periodKey)} ·{' '}
              {t(artifact.locationKey)}
            </p>

            <div className="artifact-tabs">
              <button
                type="button"
                className={activeTab === 'overview' ? 'active' : ''}
                onClick={() => setActiveTab('overview')}
              >
                {t('artifact.overview')}
              </button>

              <button
                type="button"
                className={activeTab === 'history' ? 'active' : ''}
                onClick={() => setActiveTab('history')}
              >
                {t('artifact.history')}
              </button>
            </div>

            <p className="artifact-description">
              {activeTab === 'overview'
                ? overviewText
                : historyText}
            </p>

            <div className="artifact-info-list">
              <div>
                <Clock size={17} />
                <span>{t(artifact.periodKey)}</span>
              </div>

              <div>
                <MapPin size={17} />
                <span>{t(artifact.locationKey)}</span>
              </div>

              <div>
                <Tag size={17} />
                <span>{t(artifact.categoryKey)}</span>
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