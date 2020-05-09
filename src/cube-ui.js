import Vue from 'vue'

// By default we import all the components.
// Only reserve the components on demand and remove the rest.
// Style is always required.
import {
  /* eslint-disable no-unused-vars */
  Style,
  // basic
  TabBar,
  TabPanels,
  Slide,
  Button,
  Toast,
  Checkbox
} from 'cube-ui'

Vue.use(TabBar)
Vue.use(TabPanels)
Vue.use(Slide)
Vue.use(Button)
Vue.use(Toast)
Vue.use(Checkbox)
