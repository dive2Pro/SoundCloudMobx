/**
 * Created by hyc on 17-3-16.
 */

     export interface ISession{
        dialog_id:string
        error:any
        error_description:string
        oauth_token:string
    }
    export interface IUser{
        id:number;
        permalink:string
        username:string
        uri:string
        permalink_url:string
        avatar_url:string
        country:string
        full_name:string
        city:string
        description:string
        discogs_name:string
        comments_count:number
        myspace_name:string
        website:string
        website_title:string
        online:boolean
        track_count:number
        playlist_count:number
        followers_count:number
        followings_count:number
        public_favorites_count:number
        plan:string
        private_tracks_count:number
        private_playlists_count:number
        primary_email_confirmed:number
    }

    export interface IMePeopels{
        collection: IUser[]
        next_href: string;
    }