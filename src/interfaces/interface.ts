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

    artwork_url: string,
    commentable: boolean,

    comment_count: string,
    download_count: string,
    playback_count: string,
    favoritings_count: string,

    created_at: string,
    description: string,
    downloadable: boolean,
    download_url: null,
    duration: number,
    full_duration: number,
    embeddable_by: string,
    genre: string,
    has_downloads_left: boolean,
    id: number,
    kind: string,
    label_name: string,
    last_modified: string,
    license: string,
    likes_count: number,
    permalink: string,
    permalink_url: string,
    public: boolean,
    publisher_metadata: {
        id: number,
        urn: string,
        artist: string,
        contains_music: boolean,
        publisher: string,
        upc_or_ean: string,
        isrc: string,
        writer_composer: string,
        release_title: string
    },
    purchase_title: null,
    purchase_url: string,
    release_date: string,
    reposts_count: number,
    secret_token: null,
    sharing: string,
    state: string,
    streamable: boolean,
    tag_list: string,
    title: string,
    uri: string,
    urn: string,
    user_id: number,
    visuals: null,
    waveform_url: string,
    display_date: string,
    monetization_model: string,
    policy: string,
    user: {
        avatar_url: string,
        first_name: string,
        full_name: string,
        id: number,
        kind: string,
        last_modified: string,
        last_name: string,
        permalink: string,
        permalink_url: string,
        uri: string,
        urn: string,
        username: string,
        verified: boolean,
        city: string,
        country_code: null
    },
    stream_url: string
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



export interface IStream {
    created_at: string,
    type: string,
    user: {
        avatar_url: string,
        first_name: string,
        full_name: string,
        id: number,
        kind: string,
        last_modified: string,
        last_name: string,
        permalink: string,
        permalink_url: string,
        uri: string,
        urn: string,
        username: string,
        verified: boolean,
        city: string,
        country_code: null
    },
    uuid: string,
    track: ITrack,
    playlist: IPlaylist
}