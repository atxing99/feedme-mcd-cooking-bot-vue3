<script setup lang="ts">
defineProps({
  link: { type: String, required: true },
  title: { type: String, required: true }
});
</script>

<template>
  <li>
    <iframe :src="link" width="100%" height="100%"> </iframe>
    <p>{{ title }}</p>
  </li>
</template>
