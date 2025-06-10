<template>
  <h1>Configuración de usuario</h1>
    <section v-if="loading" class="message">Cargando datos…</section>
    <section v-else-if="error" class="message error">{{ error }}</section>
    <form v-else @submit.prevent="submit" class="form" enctype="multipart/form-data">
        <fieldset class="form__fieldset">
          <legend class="form__legend">Información de perfil</legend>
        <div class="form__group">
          <label class="form__label" for="username">Nombre de usuario</label>
          <input
            class="form__input"
            id="username"
            type="text"
            v-model="form.username"
            required
          />
        </div>
        <div class="form__group">
          <label class="form__label" for="email">Correo electrónico</label>
          <input
            class="form__input"
            id="email"
            type="email"
            v-model="form.email"
            required
          />
        </div>
        <div class="form__group">
          <label class="form__label" for="profile_picture">Foto de perfil</label>
          <input
            class="form__input"
            id="profile_picture"
            type="file"
            @change="onFileChange"
            accept="image/png, image/jpg, image/jpeg, image/webp"
          />
        </div>
        </fieldset>
      <fieldset class="form__fieldset">
        <legend class="form__legend">Contraseña</legend>
        <div class="form__group">
          <label class="form__label" for="password">Nueva contraseña</label>
          <input
            class="form__input"
            id="password"
            type="password"
            v-model="form.password"
            minlength="6"
          />
        </div>
        <div class="form__group">
          <label class="form__label" for="password_confirmation">Confirmar contraseña</label>
          <input
            class="form__input"
            id="password_confirmation"
            type="password"
            v-model="form.password_confirmation"
            minlength="6"
          />
        </div>
      </fieldset>
      <button class="form__button" type="submit" :disabled="submitting">
          {{ submitting ? 'Guardando…' : 'Guardar cambios' }}
      </button>

    </form>
    <p v-if="submitError" class="message error">{{ submitError }}</p>
    <p v-if="submitSuccess" class="message success">Datos actualizados correctamente.</p>
</template>

<script>
import { getCalling, postCalling } from '@/Helpers/CallToAPI.js'

export default {
  name: 'UserSettings',
  data() {
    return {
      loading: true,
      error: null,
      submitting: false,
      submitError: null,
      submitSuccess: false,
      form: {
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        profile_picture: null
      }
    }
  },
  computed: {
    userId() {
      return Number(localStorage.getItem('userId'))
    }
  },
  methods: {
    async fetchUser() {
      try {
        const res = await getCalling(`/users/${this.userId}`, true)
        this.form.username = res.username
        this.form.email = res.email
      } catch (e) {
        this.error = 'No se pudo cargar la información del usuario.'
      } finally {
        this.loading = false
      }
    },
    onFileChange(e) {
      this.form.profile_picture = e.target.files[0] || null
    },
    async submit() {
      this.submitting = true
      this.submitError = null
      this.submitSuccess = false
      const data = new FormData()
      data.append('username', this.form.username)
      data.append('email', this.form.email)
      if (this.form.password) {
        data.append('password', this.form.password)
        data.append('password_confirmation', this.form.password_confirmation)
      }
      if (this.form.profile_picture) {
        data.append('profile_picture', this.form.profile_picture)
      }
      try {
        await postCalling(`/users/${this.userId}`, data, true)
        this.submitSuccess = true
      } catch (e) {
        this.submitError = 'Error al guardar los cambios.'
      } finally {
        this.submitting = false
      }
    }
  },
  mounted() {
    this.fetchUser()
  }
}
</script>

<style lang="sass" scoped>
@use '@/SASS/components/forms'
</style>
