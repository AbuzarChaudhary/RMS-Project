import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/routes';
import { AuthProvider } from '@/context/AuthContext';
import { ReturnFlowProvider } from '@/context/ReturnFlowContext';
import '@/assets/styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Global providers wrap the router so every route can read auth + flow state */}
    <AuthProvider>
      <ReturnFlowProvider>
        <RouterProvider router={router} />
      </ReturnFlowProvider>
    </AuthProvider>
  </React.StrictMode>
);
