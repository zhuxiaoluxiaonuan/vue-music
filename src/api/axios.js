import {get} from './common'
const baseURL = 'http://192.168.0.107:3000'
const extendURL = 'http://120.79.162.149:3000'
const getRecommendBanner = get(baseURL + '/banner?type=1')
const getRecommendPersonalized = get(baseURL + '/personalized?limit=10')
const getRecommendNewSong = get(baseURL + '/personalized/newsong')
const getRecommendSongSheet = get(baseURL + '/top/playlist')
const getRecommendSongRank = get(baseURL + '/top/list')
const getSingerList = get(baseURL + '/top/artists?limit=100')
const getSingerCategory = get(baseURL + '/artist/list')
const getSingerDetail = get(baseURL + '/artists')
const getSingerRank = get(baseURL + '/toplist/artist')
const getSingerAlbum = get(baseURL + '/artist/album')
const getSingerBaseData = get(baseURL + '/artist/desc')
const getSimilarSinger = get(baseURL + '/simi/artist')
const getSongUrl = get(extendURL + '/music/url')
const getSongLyric = get(baseURL + '/lyric')
export {
  getRecommendBanner,
  getRecommendPersonalized,
  getRecommendNewSong,
  getRecommendSongSheet,
  getRecommendSongRank,
  getSingerList,
  getSingerCategory,
  getSingerDetail,
  getSingerRank,
  getSingerAlbum,
  getSingerBaseData,
  getSimilarSinger,
  getSongUrl,
  getSongLyric
}
