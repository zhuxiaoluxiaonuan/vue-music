import {get} from './common'
const baseURL = 'http://192.168.0.107:3000'
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
const getSimilarSinger = get(baseURL + '/simi/artist')
const getSongUrl = get(extendURL + '/music/url')
const getSongLyric = get(baseURL + '/lyric')
const getPlayListDetail = get(baseURL + '/playlist/detail')
const getSimilarPlayList = get(baseURL + '/top/playlist?limit=6')

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
  getSimilarSinger,
  getSongUrl,
  getSongLyric,
  getPlayListDetail,
  getSimilarPlayList
}
