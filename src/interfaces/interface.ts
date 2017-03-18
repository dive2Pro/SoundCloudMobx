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
    "type": "comment",
    "created_at": "2011/07/21 09:55:19 +0000",
    "tags": "own, affiliated",
    "origin": {
        "id": 13158665,
        "created_at": "2011/04/06 15:37:43 +0000",
        "user_id": 3699101,
        "duration": 18109,
        "commentable": true,
        "state": "finished",
        "sharing": "public",
        "tag_list": "soundcloud:source=iphone-record",
        "permalink": "munching-at-tiannas-house",
        "description": null,
        "streamable": true,
        "downloadable": true,
        "genre": null,
        "release": null,
        "purchase_url": null,
        "label_id": null,
        "label_name": null,
        "isrc": null,
        "video_url": null,
        "track_type": "recording",
        "key_signature": null,
        "bpm": null,
        "title": "Munching at Tiannas house",
        "release_year": null,
        "release_month": null,
        "release_day": null,
        "original_format": "m4a",
        "original_content_size": 10211857,
        "license": "all-rights-reserved",
        "uri": "http://api.soundcloud.com/tracks/13158665",
        "permalink_url": "http://soundcloud.com/user2835985/munching-at-tiannas-house",
        "artwork_url": null,
        "waveform_url": "http://w1.sndcdn.com/fxguEjG4ax6B_m.png",
        "user": {
            "id": 3699101,
            "permalink": "user2835985",
            "username": "user2835985",
            "uri": "http://api.soundcloud.com/users/3699101",
            "permalink_url": "http://soundcloud.com/user2835985",
            "avatar_url": "http://a1.sndcdn.com/images/default_avatar_large.png?142a848"
        },
        "stream_url": "http://api.soundcloud.com/tracks/13158665/stream",
        "download_url": "http://api.soundcloud.com/tracks/13158665/download",
        "playback_count": 0,
        "download_count": 0,
        "favoritings_count": 0,
        "comment_count": 0,
        "attachments_uri": "http://api.soundcloud.com/tracks/13158665/attachments"
    }
}