import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // 处理登录的业务
  async login({ commit }, userInfo) {
    //结构出用户名与密码
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password });
    //目前使用的是mock的数据,mock的code是20000
    if (result.code == 20000) {
      const { data } = result
      commit('SET_TOKEN', data.token);
      setToken(data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // 获取用户信息
  async getInfo({ commit, state }) {
    let result = await getInfo(state.token);
    if (result.code == 20000) {
      const { data } = result;
      if (!data) {
        return Promise.reject(new Error('验证失败，请重新登录。'));
      }
      const { name, avatar } = data;
      commit('SET_NAME', name);
      commit('SET_AVATAR', avatar);
    }else{
      return Promise.reject(new Error('faile'));
    }
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //     const { data } = response

    //     if (!data) {
    //       return reject('Verification failed, please Login again.')
    //     }

    //     const { name, avatar } = data

    //     commit('SET_NAME', name)
    //     commit('SET_AVATAR', avatar)
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // 退出登录
  async logout({ commit, state }) {
    let result = await logout(state.token);
    if(result.code == 20000){
      removeToken();
      resetRouter();
      commit('RESET_STATE')
    }else{
      return Promise.reject(new Error('faile'));
    }
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // 删除token
  async resetToken({ commit }) {
    let result = await removeToken();
    if(result.code == 20000){
      commit('RESET_STATE')
    }
    // return new Promise(resolve => {
    //   removeToken() // must remove  token  first
    //   commit('RESET_STATE')
    //   resolve()
    // })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

