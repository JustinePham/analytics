import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'
import "./styles/App.scss"
import "./styles/index.scss"
import axios from 'axios';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  displayName: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch the user data from the backend if authenticated
    axios
      .get('http://localhost:4000/auth/user', { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch(() => setUser(null)); // Not authenticated
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:4000/auth/logout', { withCredentials: true }).then(() => setUser(null));
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {user ? (
              <>
                <li>Welcome, {user.displayName}</li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li>
                <a href="http://localhost:4000/auth/github">Login with GitHub</a>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to GitHub OAuth App</h1>
      <p>Please log in to access the home page.</p>
    </div>
  );
};

const Home: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome, {user.displayName}!</p>
    </div>
  );
};

export default App;
