
import { useEffect, useState } from 'react';
import { useDetails } from '../SearchUserContext';
import { UserDetails } from '../utilities/typings';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; 

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
            
            setRepos(data.slice(0, 2));
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
    const [toggleDetails, setToggleDetails] = useState(false);
    const getLanguages = async (repo: any) => {
        const url: string = repo.languages_url;
        try {
             const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            setLanguages(data)
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
      <div className='bg-teal-100 rounded-md bg-slate-50 p-4 flex flex-row flex-wrap justify-between items-center gap-y-2' onClick={()=>setToggleDetails(!toggleDetails)}>
       <h2 className='flex-1'><a className="font-bold text-cyan-950" href={repo.html_url}>{repo.name}</a></h2>
       <div className="text-xs font-bold text-right "> <label>Id: </label>{repo.id}</div>
       <BarGraph data={languages} ></BarGraph>
      </div>
    );
}
export default ReposWidget;


const BarGraph: React.FC<{data: { [key: string]: number }}> = ( {data} ) => {  
    if (!Object.keys(data).length) return; 
    const sum = Object.values(data).reduce((accumulator, current) => accumulator + current)
    return (
        <div className='w-full'>
            {Object.keys(data).map(key => (
                <div className='w-full flex flex-col pt-1 pb-1' key={key}>
                    <label className='text-xs font-bold'>{key}</label>
                    <span className="h-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-md pl-2 pr-2"  style={{ "width": ((data[key] / sum) * 100) + "%" }}></span>
                </div>
            ))}
        </div>
    );
}
