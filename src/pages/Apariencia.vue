<template>
  <main class="appearance-page">
    <header class="appearance-header">
      <h1>Accesibilidad</h1>
      <hr />
    </header>
    <section class="color-mode-section">
      <label class="section-label">Modo de colores</label>
      <div class="toggle-group" role="radiogroup" aria-label="Modo de colores">
        <button
          type="button"
          class="toggle-button"
          :class="{ active: colorMode === 'light' }"
          role="radio"
          :aria-checked="colorMode === 'light'"
          @click="setMode('light')"
        >
          <WeatherSunnyIcon class="icon" />
          <span>Modo claro</span>
        </button>
        <button
          type="button"
          class="toggle-button"
          :class="{ active: colorMode === 'dark' }"
          role="radio"
          :aria-checked="colorMode === 'dark'"
          @click="setMode('dark')"
        >
          <WeatherNightIcon class="icon" />
          <span>Modo oscuro</span>
        </button>
      </div>
    </section>
  </main>
</template>

<script>
import { defineComponent } from 'vue'
import WeatherSunnyIcon from 'vue-material-design-icons/WeatherSunny.vue'
import WeatherNightIcon from 'vue-material-design-icons/WeatherNight.vue'

export default defineComponent({
  name: "Apariencia",
  components: {
    WeatherSunnyIcon,
    WeatherNightIcon
  },
  data() {
    return {
      colorMode: 'light'
    }
  },
  created() {
    const saved = localStorage.getItem('colorMode')
    if (saved === 'dark') {
      this.colorMode = 'dark'
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  },
  methods: {
    setMode(mode) {
      this.colorMode = mode
      document.documentElement.setAttribute('data-theme', mode)
      localStorage.setItem('colorMode', mode)
    }
  }
})
</script>

<style scoped>
.appearance-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.appearance-header h1 {
  font-size: 1.8rem;
  margin: 0;
}

.appearance-header hr {
  border: none;
  border-top: 2px solid #ccc;
  margin: 0.5rem 0 1rem;
}

.color-mode-section {
  margin-top: 1rem;
}

.section-label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.toggle-group {
  display: flex;
  border: 1px solid #ff80ab;
  border-radius: 4px;
  overflow: hidden;
}

.toggle-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #ffe6f0;
  color: #333;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.toggle-button:first-of-type {
  border-right: 1px solid #ff80ab;
}

.toggle-button:hover {
  background-color: #ffd1e6;
}

.toggle-button.active {
  background-color: #ff80ab;
  color: white;
}

.toggle-button:focus {
  outline: 2px solid #ff80ab;
  outline-offset: 2px;
}

.icon {
  width: 24px;
  height: 24px;
}
</style>
