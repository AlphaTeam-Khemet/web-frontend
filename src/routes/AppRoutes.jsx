import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

import MainLayout from '../components/layout/MainLayout';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';

import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerificationCode from '../pages/auth/VerificationCode';
import CreateNewPassword from '../pages/auth/CreateNewPassword';
import EmailVerificationChoice from '../pages/auth/EmailVerificationChoice';

import Home from '../pages/Home';
import Collections from '../pages/Collections';
import ArtifactDetails from '../pages/ArtifactDetails';
import Translate from '../pages/Translate';
import Favorites from '../pages/Favorites';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Splash from '../pages/Splash';
import Welcome from '../pages/Welcome';
import ScanAI from '../pages/ScanAI';
import ChatAI from '../pages/ChatAI';
import Tour from '../pages/Tour';
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path={ROUTES.WELCOME} element={<Welcome />} />
      <Route path={ROUTES.TOUR} element={<Tour />} />

      <Route element={<GuestRoute />}>
        <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.VERIFICATION_CODE} element={<VerificationCode />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.CREATE_NEW_PASSWORD} element={<CreateNewPassword />} />
        <Route
          path={ROUTES.EMAIL_VERIFICATION_CHOICE}
          element={<EmailVerificationChoice />}
        />
      </Route>

      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.COLLECTIONS} element={<Collections />} />
        <Route path={ROUTES.ARTIFACT_DETAILS} element={<ArtifactDetails />} />
        <Route path={ROUTES.TRANSLATE} element={<Translate />} />
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.SCAN_AI} element={<ScanAI />} />
          <Route path={ROUTES.CHAT_AI} element={<ChatAI />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.FAVORITES} element={<Favorites />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}
