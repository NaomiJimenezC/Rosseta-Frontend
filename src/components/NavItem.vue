<template>
  <section>
    <component :is="iconName"/>
    <h2>{{ text }}</h2>
  </section>
</template>

<script>
export default {
  name: 'NavItem',
  props: {
    iconName: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>
