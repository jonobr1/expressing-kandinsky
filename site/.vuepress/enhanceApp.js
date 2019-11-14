// In your VueJS component.
import { VueperSlides, VueperSlide } from 'vueperslides'

// Since v. 1.6.0, you need to include Vueper Slides CSS file for default styles.
import 'vueperslides/dist/vueperslides.css'

export default ({ Vue }) => {
  Vue.component('VueperSlides', VueperSlides);
  Vue.component('VueperSlide', VueperSlide);
};
