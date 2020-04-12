import { createAPI } from 'cube-ui'
import Vue from 'vue'
import SingerInformation from 'components/singer-detail/singer-information'
import PlayListCover from 'components/play-list/play-list-cover'
import PlayListCopy from 'components/play-list/play-list-copy'

createAPI(Vue, SingerInformation)
createAPI(Vue, PlayListCover)
createAPI(Vue, PlayListCopy)
