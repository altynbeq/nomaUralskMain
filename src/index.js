import React from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { ThemeProvider } from '@mui/material/styles';
import { ContextProvider } from './contexts/ContextProvider';
import App from './App';
import './index.css';
import theme from './theme.js';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <ThemeProvider theme={theme}>
                <ContextProvider>
                    <App />
                </ContextProvider>
            </ThemeProvider>
        </MantineProvider>
    </React.StrictMode>,
);
