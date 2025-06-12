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
  <main class="appearance">
    <header class="appearance__header">
      <h1 id="appearance-title" class="appearance__title">Accesibilidad</h1>
      <hr class="appearance__divider" />
    </header>

    <section class="appearance__color-mode">
      <label for="color-mode-group" class="appearance__label">Modo de colores</label>
      <div
        id="color-mode-group"
        class="appearance__toggle-group"
        role="radiogroup"
        aria-labelledby="color-mode-label"
      >
        <button
          ref="lightBtn"
          type="button"
          class="appearance__toggle appearance__toggle--light"
          :class="{ 'appearance__toggle--active': colorMode === 'light' }"
          role="radio"
          :aria-checked="colorMode === 'light'"
          tabindex="0"
          @click="setMode('light')"
          @keydown="onKeydown('light', $event)"
        >
          <WeatherSunnyIcon class="appearance__icon" />
          <span>Modo claro</span>
        </button>

        <button
          ref="darkBtn"
          type="button"
          class="appearance__toggle appearance__toggle--dark"
          :class="{ 'appearance__toggle--active': colorMode === 'dark' }"
          role="radio"
          :aria-checked="colorMode === 'dark'"
          tabindex="-1"
          @click="setMode('dark')"
          @keydown="onKeydown('dark', $event)"
        >
          <WeatherNightIcon class="appearance__icon" />
          <span>Modo oscuro</span>
        </button>
      </div>
    </section>
  </main>
</template>

<style lang="sass" scoped>
@use '@/SASS/pages/apparence'

</style>
