import { OAUTH_TOKEN, CLIENT_ID } from '../constants/authentification'
const Cookies = require("js-cookie")

export const unauthApiUrl = (url: string, symbol: string) => {
  return `//api.soundcloud.com/${url}${symbol}client_id=${CLIENT_ID}`;
}
export const unauthApiUrlV2 = (url: string, plus: string) => {
  return `//api-v2.soundcloud.com/${url}?client_id=${CLIENT_ID}&${plus}`;

}
export const apiUrl = (url: string, symbol: string) => {
  const accessToken = Cookies.get(OAUTH_TOKEN);
  if (!accessToken) {
    return unauthApiUrl(url, symbol);
  }
  return `//api.soundcloud.com/${url}${symbol}oauth_token=${accessToken}`;
}

export const apiUrlV2 = (url: string, symbol: string) => {
  const accessToken = Cookies.get(OAUTH_TOKEN);
  if (!accessToken) {
    return unauthApiUrl(url, symbol);
  }
  return `//api-v2.soundcloud.com/${url}${symbol}client_id=${accessToken}`;
}

export const addAccessToken = (url: string, symbol: string): string => {
  const accessToken = Cookies.get(OAUTH_TOKEN);
  if (accessToken) {
    return `${url}${symbol}oauth_token=${accessToken}`
  }
  return `${url}${symbol}client_id=${CLIENT_ID}`
}

export enum PicSize {
  NORMAL, SMALL, BIG, CROP, MASTER, X67, BADGE, TINY, MINI
}




/**
 * t500x500: 500×500
 * crop: 400×400
 * t300x300: 300×300
 * large: 100×100 (default)
 * t67x67: 67×67 (only on artworks)
 * badge: 47×47
 * small: 32×32
 * tiny: 20×20 (on artworks)
 * tiny: 18×18 (on avatars)
 * mini: 16×16
 * @param url 
 * @param tag 
 */
export const getSpecPicPath = (url: string, tag: number = PicSize.NORMAL): string => {
  // if (!tag) return url;
  let afterPrev = ''
  switch (tag) {
    case PicSize.NORMAL:
      break
    case PicSize.SMALL: afterPrev = '32x32'
      break
    case PicSize.BIG:
      afterPrev = 't300x300'
      break
    case PicSize.MASTER:
      afterPrev = 't500x500'
      break
    case PicSize.X67:
      afterPrev = 'small'
      break
    case PicSize.TINY:
      afterPrev = 'tiny'
      break
    case PicSize.MINI:
      afterPrev = 'mini'
      break
    case PicSize.CROP:
      afterPrev = 'crop'
      break
  }
  const reg = /-{1}large\.{1}/
  return url.replace(reg, `-${afterPrev}\.`);
}
export const getSPecPicSize = (n: number) => {

}
