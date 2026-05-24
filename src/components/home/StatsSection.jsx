import { useTranslation } from 'react-i18next';
import { stats } from '../../data/homeData';

const statLabelKeys = [
  'home.stats.artifacts',
  'home.stats.languages',
  'home.stats.powered',
  'home.stats.experience',
];

export default function StatsSection() {
  const { t } = useTranslation();

  return (
    <section className="home-stats">
      <div className="home-stats-inner">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div className="home-stat-item" key={item.label}>
              <Icon size={34} />

              <div>
                <h3>{item.value}</h3>
                <p>{t(statLabelKeys[index])}</p>
              </div>

              {index !== stats.length - 1 && <span className="stat-divider" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}