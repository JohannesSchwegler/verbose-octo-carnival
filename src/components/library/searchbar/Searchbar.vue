<template>
  <div :class="{ 'sb-root': true, 'sb--active': isInputFocused }" :style="rootStyles">
    <div class="sb-slot-left">
      <slot name="iconLeft">
        <Icon name="search" :width="20" />
      </slot>
    </div>
    <label class="sb-hidden" id="sb-label" for="searchbar">Search</label>
    <input
      ref="searchbarRef"
      id="searchbar"
      class="sb-input"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="
        (event) => emit('update:modelValue', (event.target as HTMLInputElement).value ?? null)
      "
      @focus="handleFocus"
      @blur="handleBlur"
      aria-labelledby="sb-label"
      aria-describedby="search"
    />
    <div class="sb-slot-right">
      <button v-if="isClearable && isInputFocused" class="sb--clickable">
        <Icon name="x" :width="20" @click="emit('update:modelValue', null)" />
      </button>
      <button v-else-if="!isInputFocused && isFocusableByKeys" class="sb-icon">/</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type VNode, ref, computed, type CSSProperties } from 'vue'
import { onKeyUp } from '@vueuse/core'
import Icon from '../icon/Icon.vue'

defineSlots<{
  iconLeft(): VNode
}>()

const props = withDefaults(
  defineProps<{
    /**
     * The current text value.
     */
    modelValue: string | null

    /**
     * Placeholder of the input
     * @default "Search..."
     */
    placeholder?: string
    minWidth?: number
    expandedWidth?: number
    isFocusableByKeys?: boolean
  }>(),
  {
    placeholder: 'Search...',
    minWidth: 300,
    isFocusableByKeys: false
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
}>()

onKeyUp('/', () => {
  if (props.isFocusableByKeys) searchbarRef.value?.focus()
})

const searchbarRef = ref<HTMLInputElement>()
const isInputFocused = ref(false)

const isClearable = computed(() => props.modelValue && props.modelValue.length > 0)
const rootStyles = computed<CSSProperties>(() => ({
  width: isInputFocused.value
    ? `${props.expandedWidth ?? props.minWidth + 40}px`
    : `${props.minWidth}px`
}))

function handleFocus() {
  isInputFocused.value = true
}

function handleBlur() {
  setTimeout(() => {
    isInputFocused.value = false
  }, 150)
}
</script>

<style lang="scss">
$color-bg: #ededed;
$color-bg-icon: #d8d8d8;
$color-light: #ededed;
$color-active: #f8f8f8;

input,
label,
select,
button,
textarea {
  margin: 0;
  border: 0;
  padding: 0;
  display: inline-block;
  vertical-align: middle;
  white-space: normal;
  background: none;
  line-height: 1;
}

/* Remove the stupid outer glow in Webkit */
input:focus {
  outline: 0;
}

.sb {
  &-hidden {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
  &-root {
    display: inline-flex;
    align-items: center;
    background-color: $color-light;
    border: 1px solid $color-light;
    height: 48px;
    overflow: hidden;
    border-radius: 8px;
    padding: 0px 12px;
    will-change: width;
    transition: width 0.3s ease-out;
  }
  &-slot {
    &-right {
      cursor: pointer;
    }
  }
  &-input {
    margin: 0 16px;
    font-size: 18px;
    min-width: 0;
    flex: 1;
  }
  &--active {
    background-color: $color-active;
  }
  &-icon {
    background-color: $color-bg-icon;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    transition: all 2s;
  }
  &--clickable {
    cursor: pointer;
  }
}
</style>
