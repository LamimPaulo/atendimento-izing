import { RealizarLogin } from '../../service/login'
import { Notify } from 'quasar'

const pesquisaTicketsFiltroPadrao = {
  searchParam: '',
  pageNumber: 1,
  status: ['open', 'pending'],
  showAll: false,
  count: null,
  queuesIds: [],
  withUnreadMessages: false,
  isNotAssignedUser: false,
  includeNotQueueDefined: true
  // date: new Date(),
},

const user = {
  state: {
    token: null,
    isAdmin: false,
    isSuporte: false
  },
  mutations: {
    SET_IS_SUPORTE (state, payload) {
      const domains = ['@wchats.com.br']
      let authorized = false
      domains.forEach(domain => {
        if (payload?.email.toLocaleLowerCase().indexOf(domain.toLocaleLowerCase()) !== -1) {
          authorized = true
        }
      })
      state.isSuporte = authorized
    },
    SET_IS_ADMIN (state, payload) {
      state.isAdmin = !!((state.isSuporte || payload.profile === 'admin'))
    }
  },
  actions: {

    async UserLogin ({ commit, dispatch }, user) {
      user.email = user.email.trim()
      try {
        const { data } = await RealizarLogin(user)
        localStorage.setItem('token', JSON.stringify(data.token))
        localStorage.setItem('username', data.username)
        localStorage.setItem('profile', data.profile)
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('usuario', JSON.stringify(data))
        localStorage.setItem('queues', JSON.stringify(data.queues))
        localStorage.setItem('queues', JSON.stringify(data.queues))
        localStorage.setItem('filtrosAtendimento', JSON.stringify(pesquisaTicketsFiltroPadrao))

        commit('SET_IS_SUPORTE', data)
        commit('SET_IS_ADMIN', data)

        // chamada deve ser feita após inserir o token no localstorage
        // const { data: usuario } = await DadosUsuario(data.userId)
        Notify.create({
          type: 'positive',
          message: 'Login realizado com sucesso!',
          position: 'top',
          progress: true
        })
        if (data.profile === 'admin') {
          this.$router.push({
            name: 'contatos'
          })
        } else {
          this.$router.push({
            name: 'atendimento'
          })
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}

export default user
