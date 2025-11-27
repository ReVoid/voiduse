<script setup lang="ts">
import { ref } from 'vue';

import { useStack } from '../../composables';

const {
  stack,
  top,
  isOnTop,
  push,
  pop,
} = useStack([1, 2, 3]);

const payload = ref<number>(1);
</script>

<template>
  <article>
    <div>
      <input v-model.number="payload" type="number" />
      <button @click="push(payload)">
        Push
      </button>
      <button @click="pop">
        Pop
      </button>
      <p>
        IsOnTop: {{ isOnTop(payload) || 'empty' }}
      </p>
    </div>
    <p>
      Stack: {{ stack.join(', ') }}
    </p>
    <p>
      Top: {{ top ?? 'nothing' }}
    </p>
  </article>
</template>
