import { reactive } from 'vue'

export const userStore = reactive({
  user: null,
})

export function setUser(u) {
  userStore.user = u
}

export function clearUser() {
  userStore.user = null
}
