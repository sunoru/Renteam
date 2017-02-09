import { Globalization } from 'ionic-native';

import { postAPI, PGLCookie } from './api-helper';

export enum PGLLanguage {
  ja = 1,
  en = 2,
  fr = 3,
  it = 4,
  de = 5,
  es = 7,
  ko = 8,
  ch = 9,
  tw = 10
}

export enum PGLSite {
  pdc = 1,
  com = 2,
  pki = 3
}

export enum PGLRegion {
 JP = 0,
  US = 1,
  EU = 2,
  CN = 4,
  KR = 5,
  HK = 6
}

export enum PGLCountry {
  JP = 999,
  GB = 175,
  FR = 60,
  IT = 82,
  DE = 63,
  ES = 154,
  KR = 88,
  US = 176,
  CA = 31,
  MX = 106,
  CH = 75,
  HK = 75
}

export class PGLSaveData {
  trainerNameRuby: string;
  languageId: PGLLanguage;
  lastGameSyncDate: Date;
  memberSavedataIdCode: string;
  countryId: number;
  countryCooperationId: PGLCountry;
  timezone3DS: string;
  accountId: string;
  gameSyncIdCode: string;
  romId: string;
  trainerName: string;
  site: PGLSite;
  regionId: PGLRegion;
  countryCode: string;
  timezoneAccunt: string;
  savedataId: string;
}

export class PGLAccount {
  accountId: string;
  memberId: string;
  nickname: string;
  birthday: string;
  countryName: string;
  addressName: string;
  site: PGLSite;
  publicFlg: number;
  softCount: number;
  countryCooperationId: PGLCountry;
}

export class PGLLoginStatus {
  status_code: string;
  selectedSavedata?: PGLSaveData;
  loginStatus: string;
  account?: PGLAccount;
}

function getPreferredLanguage(): Promise<PGLLanguage> {
  return Globalization.getPreferredLanguage()
  .then(lang => PGLLanguage[lang.value.slice(0, lang.value.search('-'))]);
}

function getTimezoneFromRegion(region: PGLRegion): Promise<string> {
  return new Promise (resolve => {
    switch (region) {
      case PGLRegion.JP: resolve('Asia/Tokyo'); break;
      case PGLRegion.KR: resolve('Asia/Seoul'); break;
      case PGLRegion.US: resolve('America/New_York'); break;
      default:
        getPreferredLanguage().then(lang => {
          if (lang == PGLLanguage.en) {
            return 'Europe/London';
          } else {
            return 'Europe/Rome';
          }
        })
    };
  });
}

export function loginPGL(username: string, password: string): Promise<PGLLoginStatus> { 
  // TODO
  return getLoginStatus({});
}

export function getLoginStatus(cookie: PGLCookie): Promise<PGLLoginStatus> {
  return getTimezoneFromRegion(cookie['region']) // It's OK when undefined.
  .then(tz => postAPI("getLoginStatus", {
    languageId: 1,
    timezone: tz,
    timeStamp: new Date().valueOf()
  }, cookie))
  .then(response => JSON.parse(response.data) as PGLLoginStatus);
  // No need to catch now.
}
