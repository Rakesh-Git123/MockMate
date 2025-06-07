
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(

  <GoogleOAuthProvider clientId="208535384893-ju7hpca2qqtkgesbheikb2ii57g6idj4.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  
)
