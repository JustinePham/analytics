import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import "./styles/App.scss"
import axios from 'axios';
import { useEffect } from 'react';
import UserSearch from './widgets/userSearch';
import { AuthProvider, useAuth, User } from './AuthContext';
 


const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
            <Navbar/>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<ProtectedRoute component={Home}/>} />
            </Routes>
        </Router>
    </AuthProvider>
  );
};


const Navbar: React.FC = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

    // Fetch user data when Navbar is rendered (only once)
  
    useEffect(() => {
      if (!user) {
        axios
        .get('http://localhost:4000/auth/user', { withCredentials: true })
        .then((response) => {
          login(response.data); // Login user and set the data in AuthContext
          console.log(response.data)
          navigate('/home')
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          logout(); // If user is not authenticated, log them out
        });
      }
    }, [user, login, logout, navigate]);
  
    const handleLogout = () => {
      logout()
      navigate('/');
    };

  return (
    <nav className="flex flex-row top-0 fixed w-full justify-end p-4 items-center bg-teal-500">
    <ul className="flex flex-row gap-4 items-center">
      {user ? (
        <>
          <li className="font-semibold text-white">Welcome, {user.displayName}</li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </>
      ) : (<></>)}
    </ul>
  </nav>
  )
}

const LandingPage: React.FC = () => {
 
  return (
    <div className='flex flex-col w-full h-full m-auto justify-center'>
      <div className="card">
        <h1>Welcome to GitHub Analytics</h1>
        <p>Please log in to access the home page.</p>
        <button  >
          <a href="http://localhost:4000/auth/github">Login with GitHub</a>
        </button>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null; // Ensure user exists before rendering

  return (
    <div className="flex flex-col w-full h-full mt-[77px] p-4">
      <UserSearch></UserSearch>
      <h1>Home Page</h1>
      <p>Welcome, {user.displayName}!</p>
      
    </div>
  );
};

const ProtectedRoute: React.FC<{ component: React.FC<{ user: User }> }> = ({ component: Component }) => {
  const { user } = useAuth();

  return user ? <Component user={user} /> : <Navigate to="/" />;
};
export default App;
