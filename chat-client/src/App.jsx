import { useState } from 'react'
import Account from '../pages/Account'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import './index.css';
import 'react-toastify/dist/ReactToastify.min.css';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' Component={Account} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
