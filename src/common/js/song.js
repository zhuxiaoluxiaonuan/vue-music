import {getSongLyric} from 'api/axios'
export default class Song {
  constructor({id, singer, name, album, image, fee, privilege}) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.image = image
    this.fee = fee
    this.privilege = privilege
  }
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getSongLyric({
        id: this.id
      }).then((res) => {
        if (res.code === 200 && res.lrc) {
          this.lyric = res.lrc.lyric
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}
export function createSong(musicData) {
  return new Song({
    id: musicData.id,
    singer: getSinger(musicData.ar),
    name: musicData.name,
    album: musicData.al.name,
    image: musicData.al.picUrl,
    fee: musicData.fee,
    privilege: musicData.privilege
  })
}
function getSinger(singer) {
  let ret = []
  if (!singer) return ''
  singer.forEach(item => {
    ret.push(item.name)
  })
  return ret.join('/')
}
