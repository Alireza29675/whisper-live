import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'

import { ThemeProvider } from './contexts/themeContext'
import { ConfigProvider } from './contexts/configContext'

import './style.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ConfigProvider>
  </React.StrictMode>,
)
