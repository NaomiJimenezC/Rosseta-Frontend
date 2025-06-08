<script>
import WeatherSunnyIcon from 'vue-material-design-icons/WeatherSunny.vue'
import WeatherNightIcon from 'vue-material-design-icons/WeatherNight.vue'

export default {
  name: 'Apariencia',
  components: { WeatherSunnyIcon, WeatherNightIcon },
  data() {
    return {
      colorMode: 'light'
    }
  },
  mounted() {
    const saved = localStorage.getItem('colorMode')
    if (saved === 'light' || saved === 'dark') {
      this.colorMode = saved
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.colorMode = 'dark'
    }
    document.documentElement.setAttribute('data-theme', this.colorMode)

    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        if (!localStorage.getItem('colorMode')) {
          this.colorMode = e.matches ? 'dark' : 'light'
        }
      })
  },
  watch: {
    colorMode(newMode) {
      document.documentElement.setAttribute('data-theme', newMode)
      localStorage.setItem('colorMode', newMode)
      this.$refs.lightBtn.setAttribute('tabindex', newMode === 'light' ? '0' : '-1')
      this.$refs.darkBtn.setAttribute('tabindex', newMode === 'dark' ? '0' : '-1')
      this.$refs[`${newMode}Btn`].focus()
    }
  },
  methods: {
    setMode(mode) {
      this.colorMode = mode
    },
    onKeydown(mode, event) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        this.setMode(mode === 'light' ? 'dark' : 'light')
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.setMode(mode)
      }
    }
  }
}
</script>

<template>
  <main class="appearance-page">
    <header class="appearance-header">
      <h1 id="appearance-title">Accesibilidad</h1>
      <hr />
    </header>

    <section class="color-mode-section">
      <label class="section-label" id="color-mode-label">Modo de colores</label>
      <div
        class="toggle-group"
        role="radiogroup"
        aria-labelledby="color-mode-label"
      >
        <button
          ref="lightBtn"
          type="button"
          class="toggle-button"
          :class="{ active: colorMode === 'light' }"
          role="radio"
          :aria-checked="colorMode === 'light'"
          tabindex="0"
          @click="setMode('light')"
          @keydown="onKeydown('light', $event)"
        >
          <WeatherSunnyIcon class="icon" />
          <span>Modo claro</span>
        </button>

        <button
          ref="darkBtn"
          type="button"
          class="toggle-button"
          :class="{ active: colorMode === 'dark' }"
          role="radio"
          :aria-checked="colorMode === 'dark'"
          tabindex="-1"
          @click="setMode('dark')"
          @keydown="onKeydown('dark', $event)"
        >
          <WeatherNightIcon class="icon" />
          <span>Modo oscuro</span>
        </button>
      </div>
    </section>
  </main>
</template>


<style scoped>
:root[data-theme='light'] {
  --bg: var(--color-primario-100);
  --fg: var(--color-grises-800);
}

:root[data-theme='dark'] {
  --bg: var(--color-grises-200);
  --fg: var(--color-primario-100);
}

.appearance-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
  background-color: var(--bg);
  color: var(--fg);
  transition: background-color 0.3s ease, color 0.3s ease;
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
