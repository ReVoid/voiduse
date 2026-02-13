<script setup lang="ts">
import {
  ref,
} from 'vue';

import {
  useSize,
} from '../../composables';

type Size = {
  width: number | string;
  height: number | string;
};

const size = ref<Size>({ width: 200, height: '300' });

const { style } = useSize(size);
</script>

<template>
  <article>
    <h2>useStyle.js</h2>
    <div>
      <label>
        <span>width</span>
        <input v-model="size.width" type="text" />
      </label>
      <label>
        <span>height</span>
        <input v-model="size.height" type="text" />
      </label>
    </div>
    <div class="component" :style="style">
      I'm an ordinary component ;)
    </div>
  </article>
</template>

<style lang="scss">
.component {
  background: yellow;
  border: 1px solid black;
}
</style>
