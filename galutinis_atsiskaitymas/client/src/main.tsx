import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { UsersProvider } from './contexts/UsersContext.tsx';
import { QuestionsProvider } from './contexts/QuestionsContext.tsx';
import { AnswersProvider } from './contexts/AnswersContext.tsx';

createRoot(document.getElementById('root') as HTMLDivElement).render(
    <BrowserRouter>
        <UsersProvider>
            <QuestionsProvider>
                <AnswersProvider>
                    <App />
                </AnswersProvider>
            </QuestionsProvider>
        </UsersProvider>
    </BrowserRouter>
);
