import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import DynamicPage from './pages/DynamicPage'
import { AuthProvider } from './plugins/auth/context/AuthContext'
import { fetchConfig } from './services/config.service'
// import AuthPage from './plugins/auth/pages/AuthPage'
import DeleteAccount from './plugins/auth/pages/DeleteAccount'
import AuthPage from './plugins/auth/pages/AuthPage'
import Layout from './layout/Layout'

export interface IAppConfig {
  enableLogin: boolean;
}

const App: React.FC = () => {
  const [config, setConfig] = useState<IAppConfig | null>(null);

  useEffect(() => {
    fetchConfig().then(setConfig).catch(console.error);
  }, []);

  if (!config) return null;

  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DynamicPage />} />
          <Route path="/:slug" element={<DynamicPage />} />

          {config.enableLogin &&
            <>
              <Route path="/login" element={<AuthPage />} />
              <Route path='/delete-account' element={<DeleteAccount />} />
            </>
          }
        </Route>
      </Routes>
    </AuthProvider>
  )
}
export default App