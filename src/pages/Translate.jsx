import PageLayout from '../components/layout/PageLayout';
import { useTranslation } from 'react-i18next';

export default function Translate() {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="font-display text-5xl font-bold text-khemet-dark">
          {t('translate.title')}
        </h1>
        <p className="mt-4 text-khemet-gray">{t('translate.description')}</p>
      </section>
    </PageLayout>
  );
}
