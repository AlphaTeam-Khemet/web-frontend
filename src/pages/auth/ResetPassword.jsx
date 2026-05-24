import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
export default function ResetPassword() { return <AuthLayout><section className="flex min-h-screen items-center justify-center bg-khemet-paper p-6"><AuthCard title="Reset Password" subtitle="Create a new secure password."><form className="space-y-5"><Input label="Verification code" type="text" placeholder="Enter code" required /><Input label="New password" type="password" placeholder="New password" required /><Input label="Confirm password" type="password" placeholder="Confirm password" required /><Button className="w-full" type="submit">Reset Password</Button></form></AuthCard></section></AuthLayout>; }
