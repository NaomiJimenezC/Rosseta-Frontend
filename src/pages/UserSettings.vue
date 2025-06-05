<template>
  <main class="settings-page">
    <header class="settings-header">
      <h1>Configuración de usuario</h1>
      <hr />
    </header>
    <section v-if="loading" class="message">Cargando datos…</section>
    <section v-else-if="error" class="message error">{{ error }}</section>
    <form v-else @submit.prevent="submit" class="settings-form" enctype="multipart/form-data">
      <fieldset>
        <legend>Información de perfil</legend>
        <div class="form-group">
          <label for="username">Nombre de usuario</label>
          <input
            id="username"
            type="text"
            v-model="form.username"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            required
          />
        </div>
        <div class="form-group">
          <label for="profile_picture">Foto de perfil</label>
          <input
            id="profile_picture"
            type="file"
            @change="onFileChange"
            accept="image/*"
          />
        </div>
      </fieldset>
      <fieldset>
        <legend>Seguridad</legend>
        <div class="form-group">
          <label for="password">Nueva contraseña</label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            minlength="6"
          />
        </div>
        <div class="form-group">
          <label for="password_confirmation">Confirmar contraseña</label>
          <input
            id="password_confirmation"
            type="password"
            v-model="form.password_confirmation"
            minlength="6"
          />
        </div>
      </fieldset>
      <div class="form-actions">
        <button type="submit" :disabled="submitting">
          {{ submitting ? 'Guardando…' : 'Guardar cambios' }}
        </button>
      </div>
    </form>
    <p v-if="submitError" class="message error">{{ submitError }}</p>
    <p v-if="submitSuccess" class="message success">Datos actualizados correctamente.</p>
  </main>
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

<style scoped>
.settings-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}
.settings-header h1 {
  font-size: 1.8rem;
  margin: 0;
}
.settings-header hr {
  border: none;
  border-top: 2px solid #ccc;
  margin: 0.5rem 0 1rem;
}
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
fieldset {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
}
legend {
  font-weight: bold;
  padding: 0 0.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
.form-group label {
  margin-bottom: 0.25rem;
  font-weight: 500;
}
.form-group input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
}
button[type="submit"] {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  background-color: #ff80ab;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button[type="submit"]:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
.message {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.95rem;
}
.error {
  color: #d32f2f;
}
.success {
  color: #388e3c;
}
</style>
