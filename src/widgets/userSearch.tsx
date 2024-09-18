import { useState } from 'react';
import axios from 'axios';
import _ from 'lodash'; // lodash for debounce

type UserDetails = {
  avatar_url: string;
  events_url: string;
  followers_url: string;
  following_url: string;
  gists_url:string;
  id: number;
  html_url: string;
  login: string;
  node_id: string;
  organizations_url: string;
  received_events_url: string;
  repos_url: string;
  score: number;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  type: string;
  url: string;

}

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async (searchValue: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`https://api.github.com/search/users?q=${searchValue}`);

      setUsers(response.data.items);
      console.log(response.data.items);
    } catch (error) {
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedFetchUsers = _.debounce(fetchUsers, 300);

  const handleSearch = (event: any) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    if (searchValue.length > 0) {
      debouncedFetchUsers(searchValue); // Only fetch after user stops typing for 300ms
    } else {
      setUsers([]); // Clear users when the input is empty
    }
  };


  const handleEmpty = () => {
    return ( searchTerm === '' ? null : <p>No users found</p>) ;
  }

  return (
    <div>
      <h3>User Search</h3>
      <input
        type="text"
        placeholder="Search GitHub users..."
        value={searchTerm}
        onChange={handleSearch}
        className='bg-gray-50 border outline-slate-100 text-gray-300 text-sm rounded-lg focus:outline-slate-200 ring-blue-300 focus:border-blue-300 block w-full p-2.5 '
      />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul className='bg-emerald-100	rounded-lg'>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id} className='p-2 hover:bg-emerald-50'>
              <a className="text-slate-400 uppercase" href={user.html_url} target="_blank" rel="noopener noreferrer">
                {user.login}
              </a>
            </li>
          ))
        ) : (
          handleEmpty()
        )}
      </ul>
    </div>
  );
};

export default UserSearch;