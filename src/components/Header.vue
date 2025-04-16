<script>
import NavItem from "@/components/NavItem.vue";
import HomeIcon from 'vue-material-design-icons/Home.vue';
import SearchWebIcon from 'vue-material-design-icons/SearchWeb.vue';
import PlusCircleIcon from 'vue-material-design-icons/PlusCircle.vue';
import AccountCircleIcon from 'vue-material-design-icons/AccountCircle.vue';
import MessageIcon from 'vue-material-design-icons/Message.vue';
import CogIcon from 'vue-material-design-icons/Cog.vue';

export default {
  name: "Header",
  components: {
    NavItem,
    HomeIcon,
    SearchWebIcon,
    PlusCircleIcon,
    AccountCircleIcon,
    MessageIcon,
    CogIcon
  }
}

</script>

<template>
  <img src="" alt="Logo">
  <NavItem/>
  <nav>
    <section>
      <home-icon/>
      <h2>Inicio</h2>
    </section>
    <section>
      <search-web-icon/>
      <h2>Explorar</h2>
    </section>
    <section>
      <plus-circle-icon/>
      <h2>Publicar</h2>
    </section>
    <section>
      <account-circle-icon/>
      <h2>Perfil</h2>
    </section>
    <section>
      <message-icon/>
      <h2>Mensajes</h2>
    </section>
    <section>
      <cog-icon/>
      <h2>Ajustes</h2>
    </section>
  </nav>

  <button>Publicar</button> 
</template>

<style scoped>

</style>
