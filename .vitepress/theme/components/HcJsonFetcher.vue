<template>
  <div>
    <slot v-if="data" :data="data"></slot>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import jsonpath from 'jsonpath';

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  jsonpathQuery: {
    type: [Object, String],
    required: true,
  },
});

const data = ref(null);

onMounted(async () => {
  try {
    const response = await fetch(props.url);
    const jsonData = await response.json();

    if (typeof props.jsonpathQuery === 'string') {
      data.value = jsonpath.query(jsonData, props.jsonpathQuery)[0] || 'Not found';
    } else if (typeof props.jsonpathQuery === 'object') {
      const queryResults = {};
      for (const [key, query] of Object.entries(props.jsonpathQuery)) {
        queryResults[key] = jsonpath.query(jsonData, query)[0] || 'Not found';
      }
      data.value = queryResults;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    data.value = 'Error fetching data';
  }
});
</script>
