import React from 'react'
import ReactDOM from 'react-dom/client'
import MainTree from './tree/MainTree'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode 로컬에서 실행 시 2번 render됨
  <React.StrictMode>
    <MainTree />
  </React.StrictMode>
)
