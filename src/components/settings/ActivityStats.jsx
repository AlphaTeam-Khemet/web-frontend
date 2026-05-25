import { Heart, MessageCircle, ScanLine } from 'lucide-react';

export default function ActivityStats({
  favoritesCount = 0,
  chatsCount = 0,
  scansCount = 0,
}) {
  const stats = [
    {
      icon: Heart,
      label: 'Favorite Artifacts',
      value: favoritesCount,
    },
    {
      icon: MessageCircle,
      label: 'AI Chats',
      value: chatsCount,
    },
    {
      icon: ScanLine,
      label: 'Uploaded Scans',
      value: scansCount,
    },
  ];

  return (
    <section className="settings-activity-card">
      <div className="settings-section-head">
        <span>My Activity</span>
        <h3>Your Museum Journey</h3>
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