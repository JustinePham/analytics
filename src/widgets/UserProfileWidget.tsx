import { useEffect, useState } from "react";
import { useDetails } from "../SearchUserContext";
 
const UserProfileWidget: React.FC = (   ) => {
    const { user } = useDetails()
    const [ details , setDetails ] = useState<any|null>(null )

    const getUserDetails = async () => {
        if (user) {
            try {
                const response = await fetch(user?.url);
                const data = await response.json();
                setDetails(data)
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        getUserDetails()
    }, [user]);

    return (
        <>
        <div className="rounded-md bg-slate-50 p-4 bg-teal-200 text-bold gap-4 flex flex-wrap flex-row justify-between">
            <div className="flex flex-wrap flex-row items-center gap-4 ">
                <img src='https://avatars.githubusercontent.com/u/55029831?v=4' className="rounded-full h-28 w-28"></img>
                <div>
                    <h1 className="">{details.login}</h1>
                    
                    <span className="font-bold"><label></label>{details.bio}</span>
                </div>
                
            </div>
            <div className="flex flex-wrap flex-col items-end gap-4 ">
                <span className="font-bold"><label></label>{details.company}</span>
                <span className="font-bold"><label></label>{details.html_url}</span>            
            </div>
           
        </div>
        <div className="rounded-md bg-slate-50 p-4 bg-teal-200 text-bold flex flex-wrap flex-row gap-4">
        <span><label># of public repos: </label>{details.public_repos}</span>
            <span><label># of public gists: </label>{details.public_gists}</span>
            <span><label># of followers: </label>{details.followers}</span>
            <span><label>following: </label>{details.following}</span>
        </div>
        </>
    );
}


const FollowerListWidget = () => {
    const { user } = useDetails()

    return (
        <div className="rounded-md bg-slate-50 p-4 bg-teal-200 text-bold">
             
        </div>
    );
}

export default UserProfileWidget;
   