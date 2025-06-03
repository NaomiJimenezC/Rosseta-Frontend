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
  <main class="settings-page">
    <header class="settings-header">
      <h1>Ajustes</h1>
      <hr />
    </header>

    <nav aria-label="Menú de ajustes">
      <ul class="settings-list">
        <li>
          <router-link
            :to="{ name: 'user settings' }"
            class="settings-link"
          >
            <AccountCircleIcon class="icon" />
            <span>Cuenta</span>
          </router-link>
        </li>

        <li>
          <router-link
            :to="{ name: 'contact' }"
            class="settings-link"
          >
            <AccountBoxIcon class="icon" />
            <span>Contacto</span>
          </router-link>
        </li>

        <li>
          <router-link
            :to="{ name: 'appearance' }"
            class="settings-link"
          >
            <PaletteIcon class="icon" />
            <span>Apariencia</span>
          </router-link>
        </li>

        <li>
          <router-link
            :to="{ name: 'about' }"
            class="settings-link"
          >
            <InformationIcon class="icon" />
            <span>Sobre nosotros</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <section class="settings-content">
      <router-view />
    </section>
  </main>
</template>


<style scoped>
.settings-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.settings-header {
  margin-bottom: 1rem;
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

nav[aria-label="Menú de ajustes"] {
  margin-bottom: 2rem;
}

.settings-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.settings-list li + li {
  margin-top: 0.75rem;
}

.settings-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.settings-link:hover,
.settings-link:focus {
  background-color: rgba(0, 0, 0, 0.05);
  outline: none;
}

.settings-link .icon {
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
  color: #555;
}

.settings-list span {
  font-size: 1rem;
}

.settings-content {
  padding: 1rem 0;
  border-top: 1px solid #e0e0e0;
}
</style>
