import { HTTP, HTTPResponse } from 'ionic-native';

import { parse, serialize } from 'cookie';

import { PGLRegion, PGLSite } from './login-api';

const API_BASE_URL = 'https://3ds.pokemon-gl.com/frontendApi/'

export interface PGLCookie {
  __ulfpc?: string;
  region?: PGLRegion;
  language_id?: string;
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

export function postAPI(apiName: string, data: any, cookie: PGLCookie): Promise<HTTPResponse> {
  let headers = {
    'pragma': 'no-cache',
    'origin': 'https://3ds.pokemon-gl.com',
    'accept-encoding': 'gzip, deflate, br',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'referer': 'https://3ds.pokemon-gl.com/',
    'x-requested-with': 'XMLHttpRequest',
    'cookie': serialize(cookie)
  }
  return HTTP.post(API_BASE_URL + apiName, data, headers);
}
