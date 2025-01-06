import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";

// Pages
import Index from './pages/Index';
import HomePage from './pages/HomePage';
import '@fontsource/roboto/400.css';
import CardMemoryGame from './pages/games/CardMemoryGame';
import { AuthProvider } from './contexts/AuthContext';
import AccountDetailsPage from './pages/AccountPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />, // Parent route with Outlet
    children: [
      {
        index: true, // Default route
        element: <Navigate to="/home" replace />, // Redirect to /home
      },
      {
        path: 'home',
        element: <HomePage />
      },
      {
        path: 'account-details',
        element: <AccountDetailsPage/>
      },
      {
        path: 'card-memory',
        element: <CardMemoryGame/>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
