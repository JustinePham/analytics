import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext';

const Login = ( ) => {
  const [password, setInputPassword] = useState<string>('');
  const [email, setInputEmail] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { setEmail, setPassword } = useAuth(); 
  const navigate = useNavigate()

  const onButtonClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation (can enhance with better logic or API)
    if (email === 'admin@example.com' && password === 'password') {
      setError('');
      setEmail(email);
      setPassword(password);
      navigate('/home'); // Redirect to home page on successful login
    } else {
      setError('Invalid email or password');
    }
  }

  return (
    <div className='flex flex-col items-center p-2'>
      <h2>Login</h2>
      <form className="flex flex-col w-full p-1" onSubmit={onButtonClick}>
        <div className="flex gap-x-2.5 p-1">
          <label className='flex-1 text-right' >Email:</label>
          <input
            className='flex-1'
            type="email"
            value={email}
            onChange={(e) => setInputEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex  gap-x-2.5 p-1">
          <label className='flex-1 text-right'>Password:</label>
          <input
            className='flex-1'
            type="password"
            value={password}
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login