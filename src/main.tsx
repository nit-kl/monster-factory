import { createRoot } from 'react-dom/client';
import { enableAutosave } from './state/store';
import { App } from './ui/App';
import './style.css';

enableAutosave();
createRoot(document.getElementById('root')!).render(<App />);
