
import { useEffect, useState } from 'react';
import { useDetails } from '../SearchUserContext';
import { UserDetails } from './userSearch';
import { forEach } from 'lodash';


type RepoDetails = {

}
const ReposWidget = () => {
    const { user } = useDetails();    
    const [repos, setRepos] = useState<any[]>([]); // Use state for repos 
    const getRepos = async (user: UserDetails) => {
        const url: string = user.repos_url;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                  throw new Error(`Response status: ${response.status}`);
                 }
                const data = await response.json();
                setRepos(data);
                console.log(repos);
            } catch (error) {
                console.error(error);
        }
    };
    useEffect(() => {
        if (user) {
            getRepos(user)
        }
    }, [user]);
     
    return (
      repos.map(repo => ( 
            <RepoWidget key={repo.id} repo={repo}></RepoWidget>
        ))
    );
};
  
const RepoWidget: React.FC<{repo: any}>= ( {repo} ) => {

 return (
      <div className='bg-teal-200 rounded-md bg-slate-50 p-4 '>
        <label>ID: </label><span>{repo.id}</span>
      </div>
    );
}

export default ReposWidget;