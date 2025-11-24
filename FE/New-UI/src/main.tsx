import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Home} from '../src/routes/Home.tsx'

import { UserProvider } from './contexts/UserContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <Home />
    </UserProvider>,
  </StrictMode>
)