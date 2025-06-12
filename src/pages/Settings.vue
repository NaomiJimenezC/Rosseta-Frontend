<script>
import { defineComponent } from 'vue';

import AccountCircleIcon from 'vue-material-design-icons/AccountCircle.vue';
import AccountBoxIcon from 'vue-material-design-icons/AccountBox.vue';
import PaletteIcon from 'vue-material-design-icons/Palette.vue';
import InformationIcon from 'vue-material-design-icons/Information.vue';

export default defineComponent({
  name: 'Settings',
  components: {
    AccountCircleIcon,
    AccountBoxIcon,
    PaletteIcon,
    InformationIcon
  }
});
</script>

<template>
  <main class="settings">
    <header class="settings__header">
      <h1 class="settings__title">Ajustes</h1>
    </header>

    <nav class="settings__nav" aria-label="Menú de ajustes">
      <ul class="settings__list">
        <li class="settings__item">
          <router-link :to="{ name: 'user settings' }" class="settings__link">
            <AccountCircleIcon class="settings__icon" />
            <span class="settings__label">Cuenta</span>
          </router-link>
        </li>

        <li class="settings__item">
          <router-link :to="{ name: 'contact' }" class="settings__link">
            <AccountBoxIcon class="settings__icon" />
            <span class="settings__label">Contacto</span>
          </router-link>
        </li>

        <li class="settings__item">
          <router-link :to="{ name: 'appearance' }" class="settings__link">
            <PaletteIcon class="settings__icon" />
            <span class="settings__label">Apariencia</span>
          </router-link>
        </li>

        <li class="settings__item">
          <router-link :to="{ name: 'about' }" class="settings__link">
            <InformationIcon class="settings__icon" />
            <span class="settings__label">Sobre nosotros</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <section class="settings__content">
      <router-view />
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use "@/SASS/pages/settings";
</style>

