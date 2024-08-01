<template>
  <table data-testid="check-table" class="check-table">
    <tr class="check-table-header">
      <th width="20%">TYPE</th>
      <th width="40%">NAME</th>
      <th>SUCCESS</th>
      <th>AVG</th>
      <th>P95</th>
      <th>P99</th>
    </tr>
    <div v-if="isFetching">Loading...</div>
    <template v-else-if="!isFetching && !hasError">
      <CheckTableItem v-for="check in filteredChecks" :key="check.id" :check="check" />
    </template>
    <div v-else>Error...</div>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CheckTableItem from './CheckTableItem.vue'
import { type Check, API_URLS } from '@/api'
import { useFetch } from '@vueuse/core'

const props = defineProps<{
  searchedText?: string
}>()

const { isFetching, error: hasError, data: checks } = useFetch(API_URLS.CHECKS).json<Check[]>()

const filteredChecks = computed(() => {
  const userText = props.searchedText
  if (!userText) return checks.value

  return (checks.value ?? []).filter(
    (ck) =>
      ck.name.toLowerCase().includes(userText.toLowerCase()) ||
      ck.type.toLowerCase().includes(userText.toLowerCase())
  )
})
</script>

<style lang="scss" scoped>
.check {
  &-table {
    overflow: hidden;
    font-size: 14px;
    margin: 16px 0;
    width: 100%;
    text-align: left;
    border-collapse: collapse;
    table-layout: fixed;

    &-header {
      border-bottom: 1px solid #000;
    }

    th,
    td {
      padding: 8px;
      display: table-cell;
    }
  }
}
</style>
