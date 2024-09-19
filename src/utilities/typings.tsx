export type UserDetails = {
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

  export type User = {
    accessToken: string;
    displayName: string;
    id: string;
    emails: string[];
    photos: string [];
    profileUrl: string;
    provider: string;
    username: string;
    _json: any;
  }

  type RepoDetails = {

  }