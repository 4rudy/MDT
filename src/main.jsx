import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MDTProvider } from './MDTContext';

const root = createRoot(document.getElementById('root'));

root.render(
    <MDTProvider>
        <App />
    </MDTProvider>
);
