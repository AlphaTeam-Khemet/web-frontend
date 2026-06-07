import { Heart, MessageCircle, ScanLine } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ActivityStats({
  favoritesCount = 0,
  chatsCount = 0,
  scansCount = 0,
}) {
  const { t } = useTranslation();
  const stats = [
    {
      icon: Heart,
      label: t('settings.favoriteArtifacts'),
      value: favoritesCount,
    },
    {
      icon: MessageCircle,
      label: t('settings.aiChats'),
      value: chatsCount,
    },
    {
      icon: ScanLine,
      label: t('settings.uploadedScans'),
      value: scansCount,
    },
  ];

  return (
    <section className="settings-activity-card">
      <div className="settings-section-head">
        <span>{t('settings.myActivity')}</span>
        <h3>{t('settings.museumJourney')}</h3>
      </div>

      <div className="settings-stats-grid">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div className="settings-stat-box" key={item.label}>
              <Icon size={22} />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
