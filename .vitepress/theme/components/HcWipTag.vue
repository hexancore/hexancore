<template>
  <span class="wip-label" :style="{ backgroundColor: bgColor, color: textColor }">{{ label }}</span>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: 'WIP',
  },
  bgColor: {
    type: String,
    default: 'var(--vp-c-warning-1)',
  },
  textColor: {
    type: String,
    default: '#000',
  },
});
</script>
