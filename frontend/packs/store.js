import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import GoogleMap from './components/GoogleMap.vue'
import Sign from './components/Sign.vue'
import SignUp from './components/SignUp.vue'
import SignIn from './components/SignIn.vue'
import defaultData from './modules/default_data.json'

Vue.use(Vuex)

const store =  new Vuex.Store({

  state: {

    map: null,
    room: defaultData, //コンソールエラー防止のため | リレーションしてるモデルデータも合わせて格納している
    allRooms: null,
    roomList: [],
    pageStack1: [GoogleMap],
    pageStack2: [Sign],
    directionTrigger: false,
    guideTrigger: false,
    showSearchBox: false,
    activeIndex: 0,
    currentUser: null

  },

  getters: {

    map(state) {
      return state.map;
    },
    room(state) {
      return state.room;
    },
    allRooms(state) {
      return state.allRooms;
    },
    roomList(state) {
      return state.roomList;
    },
    pageStack1(state){
      return state.pageStack1;
    },
    pageStack2(state){
      return state.pageStack2;
    },
    directionTrigger(state){
      return state.directionTrigger;
    },
    guideTrigger(state){
      return state.guideTrigger;
    },
    showSearchBox(state){
      return state.showSearchBox;
    },
    activeIndex(state){
      return state.activeIndex;
    },
    currentUser(state){
      return state.currentUser;
    }

  },

  mutations: {

    updateMap(state, payload) {
      state.map = payload
    },
    updateRoom(state, payload) {
      state.room = payload.room;
    },
    updateAllRooms(state, payload) {
      state.allRooms = payload.allRooms;
    },
    updateRoomList(state, payload) {
      state.roomList = payload.roomList;
    },
    resetRoomList(state) {
      state.roomList = [];
    },
    pushPage(state, payload) {
      if(state.activeIndex == 0){
        state.pageStack1.push(payload);
      }
      else if(state.activeIndex == 1){
        state.pageStack2.push(payload);
      }
    },
    popPage(state) {
      if(state.activeIndex == 0){
        state.pageStack1.pop();
      }
      else if(state.activeIndex == 1){
        state.pageStack2.pop();
      }
    },
    resetPageStack(state) {
      if(state.activeIndex == 0){
        state.pageStack1 = [GoogleMap];
      }
      else if(state.activeIndex == 1){
        debugger;
        state.pageStack2 = [Sign];
      }
    },
    directionTrigger(state) {
      state.directionTrigger = !state.directionTrigger
    },
    guideTrigger(state) {
      state.guideTrigger = !state.guideTrigger
    },
    showSearchBox(state) {
      state.showSearchBox = !state.showSearchBox
    },
    activeIndex(state, payload){
      state.activeIndex = payload
    },
    currentUser(state, payload){
      state.currentUser = payload.user
    }

  },

  actions: {

    //mapを生成または更新
    updateMap(context, map){
      context.commit('updateMap', map)
    },

    // 全てのpowder_roomデータの取り出し
    getAllRooms(context){
      axios.get("/api/powder_rooms")
      .then(function(response){
        context.commit('updateAllRooms', { allRooms: response.data })
      })
      .catch(function (error) {
        alert(error);
      })
    },

    // 特定の一つのpowder_room もしくは、その'子'の取り出し
    getRoom(context, url){
      axios.get('/api/powder_rooms/' + url)
      .then(function(response){
        if (response.data.length > 1){
          context.commit('updateRoomList', { roomList: response.data })
        } else {
          context.commit('updateRoom', { room: response.data })
        }
      })
      .catch(function (error) {
        alert(error);
      })
    },

    // Navigatorの挙動が変わるのでリセット
    resetRoomList(context){
      context.commit('resetRoomList');
    },

    pushPage(context, page){
      context.commit('pushPage', page);
    },

    popPage(context) {
      context.commit('popPage');
    },

    resetPageStack(context) {
      context.commit('resetPageStack');
    },

    directionTrigger(context) {
      context.commit('directionTrigger');
    },

    guideTrigger(context) {
      context.commit('guideTrigger');
    },

    showSearchBox(context){
      context.commit('showSearchBox');
    },

    activeIndex(context, newVal){
      context.commit('activeIndex', newVal);
    },

    signIn(context, userParams){
      axios.post('/api/auth/sign_in', userParams)
      .then(function(response){
        context.commit('currentUser', {user: response.data})
      })
      .catch(function (error) {
        alert(error);
        alert('ログインできませんでした。')
      })
    },

    signUp(context, userParams){
      debugger;
      axios.post('/api/auth', userParams)
      .then(function(response){
        context.commit('currentUser', {user: response.data})
      })
      .catch(function (error) {
        alert(error);
        alert('登録できませんでした。')
      })
    },

  },

})

export default store