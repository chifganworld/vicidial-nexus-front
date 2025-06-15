
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupGlobalErrorHandling } from './lib/errorLogger.ts'

setupGlobalErrorHandling()

createRoot(document.getElementById("root")!).render(<App />);
