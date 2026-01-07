import React, { JSX, useContext, Suspense, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { ContextProvider } from './context/ContextProvider';
import { useAppContext } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { getUserSession } from './api/GetBasicUserInfoApi';
import { showToast } from './alert/alertToast';

import LoadingScreen from './views/ui/components/LoadingScreen';
import SmallScreen from './pages/other/SmallScreen';

const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const HomePage = React.lazy(() => import('./pages/main/HomePage'));
const IntroducePage = React.lazy(() => import('./pages/main/IntroducePage'));
const NewsPage = React.lazy(() => import('./pages/main/NewsPage'));
const DiscoverUniPage = React.lazy(() => import('./pages/main/DiscoverUniPage'));
const InfoPage = React.lazy(() => import('./pages/base/InfoPage'));
const AskRegister = React.lazy(() => import('./pages/other/AskRegister'));
const ManagerUserPage = React.lazy(() => import('./pages/admin/ManagerUserPage'));
const ManagerCccdPage = React.lazy(() => import('./pages/admin/ManagerCccdPage'));
const ExamRegister = React.lazy(() => import('./pages/base/ExamRegister'));
const ManagerExamResultPage = React.lazy(() => import('./pages/admin/ManagerExamResultPage'));

interface Props {
  children: JSX.Element;
}

const AppContent = (): JSX.Element => {
  const { isTooSmall, isLoading, setIsLoading } = useAppContext();
  const { setToken, getToken, token, logout, user, setUser} = useAuth();
  const location = useLocation(); // Now inside Router context

  // Log user object on route change
useEffect(() => {
  const savedToken = getToken();
  if (token !== savedToken) {
    setToken(savedToken);
  }
  setIsLoading(false);
}, [location.pathname]);

  useEffect(() => {
    const fetchUser = async () => {
        if (token === "") return;
        try {
            const data = await getUserSession(token);
            setUser(data); // ở đây có thể là set global context
        } catch (err) {
            logout();
            showToast("error", "", "Hệ thống tạm thời đăng xuất! Xin thông cảm");
        }
    };

    fetchUser();
}, [token]);

  if (isTooSmall) {
    return <SmallScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      {isLoading && <LoadingScreen />}
      <Routes>
        <Route path="/" element={<NeutralRoute><HomePage /></NeutralRoute>} />
        <Route path="/dang-nhap" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/dang-ky" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/a1s2d3f4" element={<GuestRoute><AskRegister /></GuestRoute>} />
        <Route path="/info/:type" element={<ProtectedRoute><InfoPage /></ProtectedRoute>} />
        <Route path="/dang-ky-thi" element={<ProtectedRoute><ExamRegister /></ProtectedRoute>} />
        <Route path="/gioi-thieu" element={<IntroducePage />} />
        <Route path="/kham-pha/he/:type" element={<DiscoverUniPage />} />
        <Route path="/tin-tuc" element={<NewsPage />} />
        <Route path="/quan-ly/:type" element={<ProtectedRoute><ManagerUserPage /></ProtectedRoute>} />
        <Route path="/quan-ly-cccd" element={<ProtectedRoute><ManagerCccdPage/></ProtectedRoute>} />
        {/* <Route path="/cham-diem" element={<ProtectedRoute><ManagerExamResultPage/></ProtectedRoute>}/> */}
        <Route path="/cham-diem" element={<ManagerExamResultPage/>}/>
        <Route path="*" element={<Navigate to="/a1s2d3f4" replace />} />
        {/* <Route path='/test' element={<DateTimePicker/>}/> */}
      </Routes>
    </Suspense>
  );
};

const App = (): JSX.Element => {
  return (
    <HelmetProvider>
      <ContextProvider>
        <Router> {/* Move Router here */}
          <AppContent />
        </Router>
      </ContextProvider>
    </HelmetProvider>
  );
};

const GuestRoute = ({ children }: Props): JSX.Element => {
  const { token } = useAuth();

  // const { isLoading } = useAppContext();
  // if (isLoading) return <LoadingScreen />
  if (token !== "") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const ProtectedRoute = ({ children }: Props): JSX.Element => {
  const { token } = useAuth();
  const { isLoading } = useAppContext();
  const hasRendered = useRef(false);

  useEffect(() => {
    if (!hasRendered.current && !isLoading && token) {
      hasRendered.current = true;
    }
  }, [isLoading, token]);

  console.log(isLoading, token);

  if (isLoading) return <LoadingScreen />;

  if (!token || token === "") {
    return <Navigate to="/a1s2d3f4" replace />;
  }

  return children;
};

const NeutralRoute = ({ children }: Props): JSX.Element => {
  const { token } = useAuth();
  const { isLoading } = useAppContext();

  if (isLoading) return <LoadingScreen />;
  return children;
};

interface RoleCustomProps extends Props{
  cause: boolean
}

export default App;