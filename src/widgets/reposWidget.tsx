
import { useEffect, useState } from 'react';
import { useDetails } from '../SearchUserContext';
import { UserDetails } from '../utilities/typings';
import CssIcon from '@mui/icons-material/Delete';
import { forEach } from 'lodash';
 

const ReposWidget = () => {
    const { user } = useDetails();    
    const [repos, setRepos] = useState<any[]>([]); // Use state for repos 
    const [loading, setLoading] = useState(false);

    const getRepos = async (user: UserDetails) => {
        const url: string = user.repos_url;
        try {
            setLoading(true);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const data = await response.json();
            setRepos(data);
            console.log(repos);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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
    const [languages, setLanguages] = useState({})
    const getLanguages = async (repo: any) => {
        const url: string = repo.languages_url;
        try {
             const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const data = await response.json();
            setLanguages(data)
             console.log(languages);
        } catch (error) {
            console.error(error);
        }  
    };

    useEffect(() => {
        if (repo) {
            getLanguages(repo)
        }
    }, [repo]);

 return (
      <div className='bg-teal-100 rounded-md bg-slate-50 p-4 grid grid-rows-2 grid-cols-2 gap-x-4'>
       <h2><a className="font-bold text-cyan-950" href={repo.html_url}>{repo.name}</a></h2>
       <div className="text-sm font-semibold text-right"> <label>Id: </label>{repo.id}</div>
       <div className='text-sm font-semibold flex flex-row flex-wrap gap-2'> <label>language: </label>
            {Object.keys(languages).length > 0 ? (
                <div className="list-disc list-inside  flex flex-row flex-wrap gap-2">
                    {Object.keys(languages).map((language) => (
                        <span className="bg-blue-400 rounded-md pl-2 pr-2" key={language}>{language}</span>
                    ))}
                </div>
                ) : (
                    <span>Fetching...</span>
            )}
       </div>
       
      </div>
    );
}

export default ReposWidget;