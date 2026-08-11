import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import App from './App.tsx'
import './index.css'
import { protectWork } from '@/lib/protectWork'

createRoot(document.getElementById("root")!).render(<App />);

// Console notice and clipboard attribution. See the file for what this
// deliberately does not do.
protectWork()
