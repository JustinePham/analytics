import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext';

const Home = () => {
  const { email, password } = useAuth();  // Access email and password from context
  const navigate = useNavigate()
  const handleLogout = () => {
    navigate('/');  // Redirect to login page on logout
  };
  return (
    <>
      <div className="text-blue-900">
        <h1 className='text-3xl font-bold underline'>Welcome, {email}!</h1>
        <p>Your password is: {password}</p> {/* Not recommended to show the password */}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  )
}

export default Home
