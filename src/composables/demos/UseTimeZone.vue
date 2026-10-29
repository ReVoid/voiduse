<script setup lang="ts">
import {
  useTimeZone,
} from '../../composables';

const {
  timeZone,
  timeZones,
  offset,
} = useTimeZone();

// 330 => "+05:30", -300 => "-05:00"
function toLabel(offset: number): string {
  const sign = offset < 0 ? '-' : '+';
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
  const minutes = String(Math.abs(offset) % 60).padStart(2, '0');

  return `${sign}${hours}:${minutes}`;
}
</script>
<template>
  <article>
    <h2>useTimeZone</h2>
    <select v-model="timeZone">
      <option
        v-for="timeZone in timeZones"
        :key="timeZone.name"
        :value="timeZone.name"
      >
        ({{ toLabel(timeZone.offset) }}) {{ timeZone.name }}
      </option>
    </select>
    <p>
      Selected time zone: {{ timeZone }}
    </p>
    <p>
      Offset: {{ toLabel(offset) }}
    </p>
  </article>
</template>
