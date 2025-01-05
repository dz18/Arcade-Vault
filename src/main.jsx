import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";

// Pages
import Index from './pages';
import HomePage from './pages/HomePage';
import '@fontsource/roboto/400.css';
import CardMemoryGame from './pages/CardMemoryGame';

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
        path: 'card-memory',
        element: <CardMemoryGame/>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
