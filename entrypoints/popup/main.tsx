import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { initReactI18next } from 'react-i18next';

import '@/styles/popup.scss';
import Home from './App';
import { About } from './About';
import i18n from '@/components/i18n';

// Connect i18next to React. Content scripts use plain i18next, so react-i18next stays out of their bundle
initReactI18next.init(i18n);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

function App() {
    const [pageToShow, setPageToShow] = useState<Page>('main');

    return (
        <>
            {pageToShow === 'main' && <Home setPageToShow={setPageToShow} />}
            {pageToShow === 'about' && <About setPageToShow={setPageToShow} />}
        </>
    );
}

export type Page = 'main' | 'about';
