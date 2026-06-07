import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import { useTranslation } from 'react-i18next';

export default function ResetPassword() {
  const { t } = useTranslation();

  return (
    <AuthLayout>
      <section className="flex min-h-screen items-center justify-center bg-khemet-paper p-6">
        <AuthCard
          title={t('auth.resetPassword')}
          subtitle={t('auth.resetPasswordSubtitle')}
        >
          <form className="space-y-5">
            <Input
              label={t('auth.verificationCode')}
              type="text"
              placeholder={t('auth.enterCode')}
              required
            />
            <Input
              label={t('auth.newPassword')}
              type="password"
              placeholder={t('auth.newPassword')}
              required
            />
            <Input
              label={t('auth.confirmPassword')}
              type="password"
              placeholder={t('auth.confirmPasswordPlaceholder')}
              required
            />
            <Button className="w-full" type="submit">
              {t('auth.resetPassword')}
            </Button>
          </form>
        </AuthCard>
      </section>
    </AuthLayout>
  );
}
