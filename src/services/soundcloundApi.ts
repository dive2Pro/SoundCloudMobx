import { OAUTH_TOKEN, CLIENT_ID } from '../constants/authentification'
const Cookies = require("js-cookie")

export const unauthApiUrl = (url: string, symbol: string) => {
  return `//api.soundcloud.com/${url}${symbol}client_id=${CLIENT_ID}`;
}

export const apiUrl = (url: string, symbol: string) => {
  const accessToken = Cookies.get(OAUTH_TOKEN);
  if (!accessToken) {
    return unauthApiUrl(url, symbol);
  }
  return `//api.soundcloud.com/${url}${symbol}oauth_token=${accessToken}`;
}

export const addAccessToken = (url: string, symbol: string): string => {
  const accessToken = Cookies.get(OAUTH_TOKEN);
  if (accessToken) {
    return `${url}${symbol}oauth_token=${accessToken}`
  }
  return `${url}${symbol}client_id=${CLIENT_ID}`
}

