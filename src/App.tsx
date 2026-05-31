import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './screens/Landing'
import Ideias from './screens/Ideias'
import Cargos from './screens/Cargos'
import Cola from './screens/Cola'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="max-w-md mx-auto min-h-[100dvh] relative overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/ideias" element={<Ideias />} />
          <Route path="/cargos" element={<Cargos />} />
          <Route path="/cola" element={<Cola />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
