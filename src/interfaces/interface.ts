/**
 * Created by hyc on 17-3-16.
 */

export interface ISession {
    dialog_id: string
    error: any
    error_description: string
    oauth_token: string
}
export interface IUser {
    id: number;
    permalink: string
    username: string
    uri: string
    permalink_url: string
    avatar_url: string
    country: string
    full_name: string
    city: string
    description: string
    discogs_name: string
    comments_count: number
    myspace_name: string
    website: string
    website_title: string
    online: boolean
    track_count: number
    playlist_count: number
    followers_count: number
    followings_count: number
    public_favorites_count: number
    plan: string
    private_tracks_count: number
    private_playlists_count: number
    primary_email_confirmed: number
}

export interface IMePeopels {
    collection: IUser[]
    next_href: string;
}


export interface ITrack {
    type: "comment",
    created_at: "2011/07/21 09:55:19 +0000",
    tags: "own, affiliated",
    origin: {
        id: 13158665,
        created_at: "2011/04/06 15:37:43 +0000",
        user_id: 3699101,
        duration: 18109,
        commentable: true,
        state: "finished",
        sharing: "public",
        tag_list: "soundcloud:source=iphone-record",
        permalink: "munching-at-tiannas-house",
        description: string,
        streamable: true,
        downloadable: true,
        genre: string,
        release: string,
        purchase_url: string,
        label_id: string,
        label_name: string,
        isrc: string,
        video_url: string,
        track_type: "recording",
        key_signature: string,
        bpm: string,
        title: "Munching at Tiannas house",
        release_year: string,
        release_month: string,
        release_day: string,
        original_format: "m4a",
        original_content_size: 10211857,
        license: "all-rights-reserved",
        uri: string,
        permalink_url: string
        artwork_url: string,
        waveform_url: string
        user: {
            id: 3699101,
            permalink: string
            username: "user2835985",
            uri: "http://api.soundcloud.com/users/3699101",
            permalink_url: "http://soundcloud.com/user2835985",
            avatar_url: "http://a1.sndcdn.com/images/default_avatar_large.png?142a848",
        }
        stream_url: string
        download_url: "http://api.soundcloud.com/tracks/13158665/download",
        playback_count: 0,
        download_count: 0,
        favoritings_count: 0,
        comment_count: 0,
        attachments_uri: "http://api.soundcloud.com/tracks/13158665/attachments"
    }
}
