import Vue from "vue";
import Axios from "axios";
import VueI18n from "vue-i18n";
import Vuelidate from "vuelidate";
import Store, { authTokenName } from "./store";
import App from "./components/App.vue";
import router from "./router";
import { i18n } from "./lang/i18n-setup";
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.min.css";

window.Vue = require("vue");

Vue.use(VueI18n);
Vue.use(Vuelidate);

Vue.prototype.$store = Store;
Vue.prototype.$http = Axios;

Vue.config.productionTip = false;

const app = new Vue({
  i18n,
  router,
  render: h => h(App),
  beforeMount() {
    // authorization
    const authToken = localStorage.getItem(authTokenName);

    if (authToken) {
      Vue.prototype.$http.defaults.headers.common.Authorization = `Bearer ${authToken}`;
    }

    // set BaseURL for axios
    Vue.prototype.$http.defaults.baseURL = process.env.VUE_APP_API_URL;
  },
  created() {
    this.$http.interceptors.response.use(
      undefined,
      err =>
        new Promise(() => {
          if (
            err.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            this.$store.dispatch("logout");
          }
          throw err;
        })
    );
  }
});

app.$mount("#app");
