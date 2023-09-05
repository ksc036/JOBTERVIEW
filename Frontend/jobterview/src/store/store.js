import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import messageStore from './messageStore';
import loginStore from './loginStore';
import roomStore from './roomStore';
import homeStore from './homeStore';
import aiStore from './aiStore';

const store = createStore({
    modules: {
        homeStore,
        roomStore,
        messageStore,
        loginStore,
        aiStore,
    },
    plugins: [
        createPersistedState()
    ],
    getters: {
        isLogin: state => {
          return state.loginStore.isLogin; // loginStore 모듈의 isLogin 상태 반환
        }
    },
    state: {
        bannerText: '공지사항입니다.', 
    },
});

export default store;