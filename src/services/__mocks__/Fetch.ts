import {CLIENT_ID} from '../../constants/authentification'
const urls = {
  [`//api.soundcloud.com/tracks/236107824/comments?linked_partitioning=1&limit=50&offset=0&client_id=${CLIENT_ID}`]:
  {
    collection: [{ kind: "comment", id: 341814524, created_at: "2017/04/18 15:58:09 +0000", user_id: 258983306, track_id: 236107824, timestamp: 120133, body: "gets me at the heart.", uri: "https://api.soundcloud.com/comments/341814524", user: { id: 258983306, kind: "user", permalink: "user-619081109", username: "aquazombie", last_modified: "2017/01/13 16:20:10 +0000", uri: "https://api.soundcloud.com/users/258983306", permalink_url: "http://soundcloud.com/user-619081109", avatar_url: "https://i1.sndcdn.com/avatars-000281217282-bx67ho-large.jpg" } }], next_href: 'https://api.soundcloud.com/tracks/236107824/comments?limit=50&linked_partitioning=1&client_id=2t9loNQH90kzJcsFCODdigxfp325aq4z'
  },
  [`//api.soundcloud.com/me/activities?limit=50&client_id=${CLIENT_ID}`]: {
    next_href: 'hongmao',
    collection:[{name:2},{name:1},{name:3},{name:4}]
  }
}

export const RaceFetch = (p: string, method?: object, time?: number) => {
    
  return new Promise((res, rej) => {
    const timeoutPromise = new Promise((timeRes, timeRej) => {
      setTimeout(
        () => {
          timeRej({
            type: 'TimeOut',
            msg: '请求超时'
          })
        },
        time || 1000 * 20)
    })
 
    const requestFetch = new Promise((timeRes, timeRej) => {
      setTimeout(
        () => {
        timeRes(urls[p])
      },
        500)
    })

    Promise.race([requestFetch, timeoutPromise])
      .then(
      (data: any) => {
        res(data)
      },
      err => {
        rej(err)
      })
  })
}

