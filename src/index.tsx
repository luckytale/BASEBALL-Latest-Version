import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { Auth0UserProvider } from './context/Auth0UserId';

const domain = process.env.REACT_APP_AUTH0_DOMAIN as string;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID as string;
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <Auth0UserProvider>
          <App />
        </Auth0UserProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
