import { createAPI } from 'cube-ui'
import Vue from 'vue'
import SingerInformation from 'components/singer-detail/singer-information'
import PlayListCover from 'components/play-list/play-list-cover'

createAPI(Vue, SingerInformation)
createAPI(Vue, PlayListCover)
