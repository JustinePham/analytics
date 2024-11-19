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
        details ? 
        <>
            <div className=" gap-4 flex flex-wrap flex-row justify-between">
                <div className="rounded-md bg-slate-50 p-4 bg-teal-100 text-bold flex flex-wrap flex-row items-center gap-4 flex-1 justify-center">
                    <img src={details.avatar_url} className="rounded-full h-28 w-28"></img>
                    <div className="flex flex-wrap flex-row items-center  flex-1">
                        <h1 className="font-semibold">{details.login}</h1>
                        <span className="font-semibold"><label></label>{details.bio}</span>
                    </div>
                </div>
                <div className="rounded-md bg-slate-50 p-4 bg-teal-100 text-bold flex flex-wrap flex-col gap-4 flex-1 ">
                    <span className="font-bold"><label></label>{details.company}</span>
                    <span className="font-bold"><label></label>{details.html_url}</span>            
                </div>
            </div>
            <div className="flex flex-wrap flex-row gap-4">
            <span className="rounded-md bg-slate-50 p-4 bg-teal-100 font-semibold text-sm">
                <span><label># of public repos: </label>{details.public_repos}</span>
            </span>
            <span className="rounded-md bg-slate-50 p-4 bg-teal-100 font-semibold text-sm">
                <label># of public gists: </label>{details.public_gists}
            </span>
            <span className="rounded-md bg-slate-50 p-4 bg-teal-100 font-semibold text-sm">
                <label># of followers: </label>{details.followers}
            </span>    
            <span className="rounded-md bg-slate-50 p-4 bg-teal-100 font-semibold text-sm">
                <label>following: </label>{details.following}
            </span>
            </div>
        </>
        : <></>
    );
}


const FollowerListWidget = () => {
    const { user } = useDetails()
    console.log(user);
    return (
        <div className="rounded-md bg-slate-50 p-4 bg-teal-100 text-bold">
             
        </div>
    );
}

export default UserProfileWidget;
   