import { HTTP, HTTPResponse } from 'ionic-native';

import * as cookieUtil from 'cookie';

import { PGLRegion, PGLLanguage, PGLSite } from './login-api';

const API_BASE_URL = 'https://3ds.pokemon-gl.com/frontendApi/'

export interface PGLCookie {
  __ulfpc?: string;
  region?: PGLRegion;
  language_id?: PGLLanguage;
  site?: PGLSite;
  s_sq?: string;
  NO_MEMBER_DATA?: string;
  JSESSIONID?: string;
  PGLLOGINTIME?: string;
  AWSELB?: string;
  _gat?: string;
  s_cc?: string;
  s_fid?: string;
  _ga?: string;
}

function serializeCookies(cookie: PGLCookie): string {
  return Object.keys(cookie).map(key => cookieUtil.serialize(key, cookie[key])).join('; ');
}

export function postAPI(
  url: string, data: any, cookie: PGLCookie, setCookie = false
): Promise<HTTPResponse> {
  let headers = ({
    'origin': 'https://3ds.pokemon-gl.com',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'referer': 'https://3ds.pokemon-gl.com/',
    'user-agent': 'Mozilla/5.0 (X11; Fedora; Linux x86_64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
    'cookie': serializeCookies(cookie)
  });
  console.log(url);
  console.log(data);
  console.log(headers);
  return HTTP.post(url, data, headers).then(response => {
    console.log(response);
    if (setCookie && 'Set-Cookie' in response.headers) {
      let newcookies = response.headers['Set-Cookie'].split(',');
      newcookies.forEach(ck => {
        let nck = cookieUtil.parse(ck);
        Object.keys(nck).forEach(key => {
          let p = key.toUpperCase();
          if (p !== 'DOMAIN' && p !== 'PATH') {
            cookie[key] = nck[key];
            console.log(`setting cookie ${key} to ${cookie[key]}`);
          }
        });
      })
    }
    return response;
  });
}

export function postFrontendAPI(
  apiName: string, data: any, cookie: PGLCookie, setCookie = false
): Promise<HTTPResponse> {
  return postAPI(API_BASE_URL + apiName, data, cookie, setCookie);
}
