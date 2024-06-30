<template>
  <div class="man-page">
    <div class="command-container" :class="{ 'no-split': isMobile }">
      <span>
        <span class="prompt">$</span>
        <span class="command">
          <span v-if="isMobile">{{ command }}</span>
          <template v-if="!isMobile" v-for="(line, index) in splitCommand" :key="index">
            <span :class="index > 0 ? 'commandline-part' : ''">{{ line }}</span>
            <span v-if="index < splitCommand.length - 1" class="continuation"> \</span>
            <br v-if="index < splitCommand.length - 1" />
          </template>
        </span>
      </span>
      <button @click="copyToClipboard" :class="copyButtonClass" />
    </div>
    <div v-if="descriptions">
      <div class="description-header">Arguments</div>
      <div class="description-container" v-for="(description, part) in descriptions" :key="part">
        <span :class="getClass(part)" class="command-part">{{ part }}</span>
        <span class="command-description" v-html="description"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineProps } from 'vue';

const props = defineProps({
  command: {
    type: String,
    required: true,
  },
  descriptions: {
    type: Object,
    required: false,
  },
});

const isMobile = computed(() => {
  return screen.width <= 760;
});

const buttonText = ref('Copy');

const splitCommand = computed(() => {
  if (props.command.length < 60) {
    return [props.command];
  }
  const parts = props.command.split(' ');
  const lines: string[] = [];
  let currentLine: string[] = [];

  parts.forEach((part) => {
    if (part.startsWith('--')) {
      if (currentLine.length) {
        lines.push(currentLine.join(' '));
        currentLine = [];
      }
    }
    currentLine.push(part);
  });
  if (currentLine.length) {
    lines.push(currentLine.join(' '));
  }

  return lines;
});

const formattedCommand = computed(() => props.command.split(' '));

const getClass = (part) => {
  if (isOption(part)) return 'option';
  return 'argument';
};

const isArgument = (part) => {
  return !isOption(part) && !isCommand(part);
};

const isOption = (part) => {
  return part.startsWith('--');
};

const copyButtonClass = ref('copy');
const copyToClipboard = () => {
  navigator.clipboard.writeText(props.command).then(() => {
    buttonText.value = 'Copied';
    copyButtonClass.value = 'copy copied';
    setTimeout(() => {
      copyButtonClass.value = 'copy';
    }, 1500);
  });
};
</script>

<style scoped>
.man-page {
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.command-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #222222;
}

.description-header {
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 1.1em;
  color: black;
}

.description-container {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 10px;
}

.prompt {
  color: #3cb371;
  margin-right: 0.7em;
  padding-right: 0;
  font-weight: bold;
  user-select: none;
}

.command {
  font-weight: bold;
  font-size: 1em;
  color: white;
}

.no-split {
  overflow-x: scroll;
  white-space: nowrap;
}

.commandline-part {
  padding-left: 2em;
}

.command-part {
  min-width: 16em;

  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #eef2f5;
  color: #444444;
}

.argument {
  color: #2f764f;
  background-color: #e9f7ef;
}

.option {
  color: var(--vp-c-danger-1);
  background-color: #fcebea;
}

.command-description {
  color: #333333;
  margin-left: 10px;
  font-style: italic;
}

@media (max-width: 600px) {
  .description-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .command-part,
  .command-description {
    width: 100%;
    margin-bottom: 5px;
  }
}

button.copy {
  margin-left: 0.5em;
  border: 1px solid black;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  background-color: white;
  cursor: pointer;
  background-image: var(--vp-icon-copy);
  background-position: 50%;
  background-size: 20px;
  background-repeat: no-repeat;
}

button.copy:hover {
  background-color: #eeeeee;
  border: 1px solid var(--vp-c-divider);
}

button.copied {
  background-image: var(--vp-icon-copied);
}
</style>
