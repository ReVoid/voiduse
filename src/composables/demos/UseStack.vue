<script setup lang="ts">
import {
  ref,
} from 'vue';

import {
  useStack,
} from '../../composables';

const {
  items,
  top,
  isOnTop,
  push,
  pop,
  remove,
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
      <button @click="remove(payload)">
        Remove
      </button>
      <p>
        IsOnTop: {{ isOnTop(payload) || 'empty' }}
      </p>
    </div>
    <p>
      Stack: {{ items.length ? items : 'empty' }}
    </p>
    <p>
      Top: {{ top ?? 'empty' }}
    </p>
  </article>
</template>
