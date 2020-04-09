export const singer = state => state.singer
export const tabIndex = state => state.tabIndex
export const hotSongs = state => state.hotSongs
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playList = state => state.playList
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex
export const currentSong = state => state.playList[state.currentIndex] || {}
export const disc = state => state.disc // 歌单信息
