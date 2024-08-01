<template>
  <div v-html="getSvg()" style="display: inline" />
</template>

<script setup lang="ts">
import octicons from '@primer/octicons'

const props = defineProps({
  name: String,
  width: {
    type: Number,
    default: 16
  }
})

function getSvg() {
  const { name, width } = props
  try {
    return octicons[name].toSVG({ width })
  } catch (e) {
    throw new Error(`${name} is not an octicon icon`)
  }
}
</script>
