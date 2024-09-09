import { AuthProvider } from './AuthContext';  // Import the AuthProvider
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import "./styles/App.scss"
import "./styles/index.scss"

function App() {
  
  return (
    <>
    <div className="card">
      <h1 className="text-4xl font-bold">Vite + React</h1>
      <AuthProvider>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home  />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
      
      </div>
    </>
  )
}

export default App
