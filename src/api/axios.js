import {get} from './common'
const baseURL = 'http://192.168.0.105:3000'
const extendURL = 'http://120.79.162.149:3000'
const getRecommendBanner = get(baseURL + '/banner?type=1')
const getRecommendPersonalized = get(baseURL + '/personalized?limit=9')
const getRecommendNewSong = get(baseURL + '/personalized/newsong')
const getRecommendSongSheet = get(baseURL + '/top/playlist')
const getRecommendSongRank = get(baseURL + '/top/list')
const getSingerCategory = get(baseURL + '/artist/list')
const getSingerDetail = get(baseURL + '/artists')
const getSingerRank = get(baseURL + '/toplist/artist')
const getSingerAlbum = get(baseURL + '/artist/album')
const getSingerBaseData = get(baseURL + '/artist/desc')
const followArtist = get(baseURL + '/artist/sub')
const getSimilarSinger = get(baseURL + '/simi/artist')
const getSongUrl = get(extendURL + '/music/url')
const getSongDetail = get(extendURL + '/song/detail')
const getSongLyric = get(baseURL + '/lyric')
const likeSong = get(baseURL + '/like')
const getPlayListDetail = get(baseURL + '/playlist/detail')
const getSimilarPlayList = get(baseURL + '/top/playlist?limit=6')
const subscribePlayList = get(baseURL + '/playlist/subscribe')
const getTopList = get(baseURL + '/toplist/detail')
const getCheckPhone = get(baseURL + '/cellphone/existence/check')
const loginCellPhone = get(baseURL + '/login/cellphone')
const sentCaptcha = get(baseURL + '/captcha/sent')
const verifyCaptcha = get(baseURL + '/captcha/verify')
const getDefaultSearch = get(baseURL + '/search/default')
const getHotSearch = get(baseURL + '/search/hot/detail')
const getSearchSuggest = get(baseURL + '/search/suggest')
const getSearchResult = get(baseURL + '/search')
const exitLogin = get(baseURL + '/logout')

export {
  getRecommendBanner,
  getRecommendPersonalized,
  getRecommendNewSong,
  getRecommendSongSheet,
  getRecommendSongRank,
  getSingerCategory,
  getSingerDetail,
  getSingerRank,
  getSingerAlbum,
  getSingerBaseData,
  followArtist,
  getSimilarSinger,
  subscribePlayList,
  getSongUrl,
  getSongDetail,
  getSongLyric,
  likeSong,
  getPlayListDetail,
  getSimilarPlayList,
  getTopList,
  getCheckPhone,
  loginCellPhone,
  sentCaptcha,
  verifyCaptcha,
  getDefaultSearch,
  getHotSearch,
  getSearchSuggest,
  getSearchResult,
  exitLogin
}
