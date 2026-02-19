import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CameraKitWrapper } from './components/CameraKitWrapper'
import PrivacyPolicy from './pages/PrivacyPolicy'

function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-full">
        <Routes>
          <Route path="/" element={<CameraKitWrapper />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
