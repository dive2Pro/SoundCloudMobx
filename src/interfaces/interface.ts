/**
 * Created by hyc on number-number-number.
 */

export interface ISession {
    dialog_id: string
    error: any
    error_description: string
    oauth_token: string
}



// User 的接口 不实现，做提示用
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

    // custom perpoty 
    isFollowing: boolean
}

export interface IMePeopels {
    collection: IUser[]
    next_href: string;
}

export interface IActivitiesItem {
    type: string,
    created_at: string,
    tags: string,
    origin: ITrack;
}
export interface ITrack {
    id: number,
    created_at: string,
    user_id: number,
    duration: number,
    commentable: true,
    state: string,
    sharing: string,
    tag_list: string,
    permalink: string,
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
    track_type: string,
    key_signature: string,
    bpm: string,
    title: string,
    release_year: string,
    release_month: string,
    release_day: string,
    original_format: string,
    original_content_size: number,
    license: string,
    uri: string,
    permalink_url: string
    artwork_url: string,
    waveform_url: string
    user: {
        id: number,
        permalink: string
        username: string,
        uri: string,
        permalink_url: string,
        avatar_url: string
    }
    stream_url: string
    download_url: string,
    playback_count: number | string,
    download_count: number | string,
    favoritings_count: number | string,
    comment_count: number | string,
    attachments_uri: string
}

export interface IPlaylist {
    kind: string,
    id: number
    created_at: string,
    user_id: number,
    duration: number,
    sharing: string,
    tag_list: string,
    permalink: string,
    track_count: number,
    streamable: boolean,
    downloadable: boolean,
    embeddable_by: string,
    purchase_url: string,
    label_id: number,
    type: string,
    playlist_type: string,
    ean: string,
    description: string,
    genre: string,
    release: string,
    purchase_title: string,
    label_name: string,
    title: string,
    release_year: string,
    release_month: string,
    release_day: string,
    license: string,
    uri: string
    permalink_url: string,
    artwork_url: string,
    user: {
        id: number
        kind: string,
        permalink: string,
        username: string,
        uri: string,
        permalink_url: string,
        avatar_url: string
    },
    tracks: ITrack[]
}