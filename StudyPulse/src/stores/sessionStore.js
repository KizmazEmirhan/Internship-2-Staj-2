import { reactive } from 'vue'
export const sessionStore = reactive({
  session: null,
})

export function setSession(s) {
  sessionStore.session = s
}

export function clearSession() {
  userStore.session = null
}
