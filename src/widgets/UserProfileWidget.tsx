import { useEffect, useState } from "react";
import { useDetails } from "../SearchUserContext";
import { UserDetails } from "../utilities/typings";

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
                    <img src={details.avatar_url} className="rounded-full h-32 w-32"></img>
                    <div className="flex flex-wrap flex-row items-center gap-4 flex-1">
                        <h1 className="font-semibold">{details.login}</h1>
                        <span className="font-semibold"><label></label>{details.bio}</span>
                        <div className="text-bold flex flex-wrap flex-row gap-4 w-full">
                            <div className="flex flex-wrap flex-col">
                                <label className="text-xs font-bold">company</label>
                                <span className=" text-sm">{details.company || '-'}</span>
                            </div>
                            <div className="flex flex-wrap flex-col">
                                <label className="text-xs font-bold">Github link</label>
                                <a className=" text-sm cursor-pointer">{details.html_url || '-'}</a>
                            </div>
                        </div>
                        
                    </div>

                </div>

                <img src={"https://github-readme-stats.vercel.app/api/top-langs/?username=" + details.login +"&theme=blue-green"}
                    alt="GitHub Top Languages"
                    style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
                />
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
            <div  className="rounded-md bg-slate-50 p-4 bg-teal-100 font-semibold text-sm">
                <h2 className="text-lg font-semibold pb-2">Followers</h2>
                <FollowerListWidget></FollowerListWidget>
            </div>
            
        </>
        : <></>
    );
}


const FollowerListWidget = () => {
    const { user } = useDetails()
    const [ loading , setLoading ] = useState(false);
    const [ followers , setFollowers ] = useState<any[]>([] );
    let initial = 5;
    const getFollowers = async (user: UserDetails) => {
        const url: string = user.followers_url;
        try {
            setLoading(true);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const data = await response.json();
            setFollowers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (user) {
            getFollowers(user)
        }
    }, [user]);
    return (
        <div className=" flex flex-row gap-4">
            {
                followers.map(follower => (
                    <img className="w-14 rounded-full" src={follower.avatar_url}></img>
                ))
            }
        </div>
    );
}

export default UserProfileWidget;
