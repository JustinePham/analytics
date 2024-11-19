import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import "./styles/App.scss"
import axios from 'axios';
import { useEffect, useState } from 'react';
import UserSearch from './widgets/userSearch';
import { AuthProvider, useAuth } from './AuthContext';
import { useDetails, UserDetailsProvider } from './SearchUserContext';
import ReposWidget from './widgets/reposWidget';
import UserProfileWidget from './widgets/UserProfileWidget';
import { User, UserDetails } from './utilities/typings';

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
    user ? ( 
    <nav className="flex flex-row top-0 fixed w-full justify-end p-4 items-center bg-teal-300">
      <ul className="flex flex-row gap-4 items-center">
        <li className="font-semibold text-white">Welcome, {user.displayName}</li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>): (<></>)
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
  const { user } = useAuth(); // user who is logged in
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null); // user selected from search

  if (!user) return null; // Ensure user exists before rendering

  let defaultUser: UserDetails = Object.assign({}, user._json); // defaults to showing logged in user as selected user
  if (!selectedUser) setSelectedUser(defaultUser); // sets default if no user is selected

  return (
    <div className="flex flex-col w-full h-full mt-[77px] p-4 gap-y-4 ">
      <UserDetailsProvider>
        <UserSearch onChange={setSelectedUser}></UserSearch>
        <Dashboard userDetails={selectedUser} />
      </UserDetailsProvider>
    </div>
  );
};

const Dashboard: React.FC<{userDetails: UserDetails | null}> = ( { userDetails  }) => {
 const { user, setUserDetails } = useDetails();
 
  useEffect(() => {
    if (!user && userDetails) {
      // sets the user default user if none from provider
      setUserDetails(userDetails)
    }
  }, [user]);

  return (
    <div className="flex flex-col w-full h-full flex-wrap gap-4">
      <h1 className="p-2 font-bold">Dashboard</h1>
      <UserProfileWidget></UserProfileWidget>
      <h2 className="p-2 font-bold">Repos from {user?.login}</h2>
      <div className="flex flex-row gap-4 flex-wrap">
        <ReposWidget></ReposWidget>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ component: React.FC<{ user: User }> }> = ({ component: Component }) => {
  const { user } = useAuth();
  return user ? <Component user={user} /> : <Navigate to="/" />;
};
export default App;
