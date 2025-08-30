<template>
	<div class="max-w-md w-full">
		<h2 class="text-xl font-semibold mb-4">Kayıt Ol</h2>
		<form @submit.prevent="register" class="space-y-3">
			<div>
				<label class="text-sm text-gray-600">Ad Soyad</label>
				<input v-model="form.name" required class="border p-2 w-full rounded mt-1" />
			</div>
			<div>
				<label class="text-sm text-gray-600">Email</label>
				<input v-model="form.email" type="email" required class="border p-2 w-full rounded mt-1" />
			</div>
			<div>
				<label class="text-sm text-gray-600">Şifre</label>
				<input v-model="form.password" type="password" required class="border p-2 w-full rounded mt-1" />
			</div>
			<div class="flex justify-end">
				<button type="submit" class="px-4 py-2 bg-[#8e1ccf] text-white rounded">Kayıt Ol</button>
			</div>
		</form>
	</div>
</template>

<script>
import { register } from '../../services/auth'

export default {
	name: 'RegisterComponent',
	data() {
		return {
			form: { name: '', email: '', password: '' },
			loading: false,
			error: null,
		}
	},
	methods: {
		async register() {
			try {
				this.loading = true
				const res = await register(this.form.name, this.form.email, this.form.password)
				this.$emit('registered', res)
			} catch (err) {
				console.error('Register error', err)
				this.error = err.response?.data?.message || err.message || 'Kayıt başarısız'
			} finally {
				this.loading = false
			}
		},
	},
}
</script>

<style scoped></style>
