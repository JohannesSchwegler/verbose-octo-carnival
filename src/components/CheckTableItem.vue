<template>
  <tr class="stat" tabindex="0" data-testid="check-table-item" @click="toggleExpand(!isExpanded)">
    <td style="display: flex">
      <div data-testid="check-table-item-icon">
        <Icon name="chevron-right" v-if="!isExpanded" />
        <Icon name="chevron-down" v-else />
      </div>
      <span>
        {{ check.type }}
      </span>
    </td>
    <td>{{ check.name }}</td>
    <td>{{ successPercentage }}</td>
    <td>{{ CheckHelpers.formatAvg(check) }}</td>
    <td>{{ CheckHelpers.formatP95(check) }}</td>
    <td>{{ CheckHelpers.formatAvg(check) }}</td>
  </tr>
  <tr v-if="isExpanded">
    <th colspan="5">
      <div v-if="isFetching">Loading...</div>
      <highcharts
        v-if="!isFetching && !hasError && checkStats && checkStats.length > 0"
        data-testid="check-table-item-chart"
        :options="chartOptions"
      />
      <div v-else>Error...</div>
    </th>
  </tr>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { API_URLS, type Check, type CheckStat } from '../api'
import Icon from './library/icon/Icon.vue'
import { useElementHover, useFetch } from '@vueuse/core'
import * as CheckHelpers from '@/domain/check'
import * as CheckStatHelpers from '@/domain/checkStat'
import type { ChartProps } from 'highcharts-vue'
import accessibility from 'highcharts/modules/accessibility'
import * as Highchart from 'highcharts'
accessibility(Highchart)

const props = defineProps<{
  check: Check
  /**
   * If set to true, the buckets for the check will be prefetched whenever
   * the user hovers the check.
   */
  eager?: boolean
}>()

const {
  isFetching,
  isFinished,
  error: hasError,
  data: checkStats,
  execute: fetchStat
} = useFetch(API_URLS.STATS_BY_ID(props.check.id), {
  immediate: false
}).json<CheckStat[]>()

const rootElement = ref<HTMLElement>()
const isExpanded = ref(false)

const successPercentage = computed(() => CheckHelpers.convertSuccessToPercentage(props.check))
const isHovered = useElementHover(rootElement, {
  delayEnter: 300
})

const chartOptions = computed<ChartProps['options']>(() => {
  const stats = checkStats.value
  if (!stats) return {}

  const seriesSuccess: [number, number][] = []
  const seriesP99: [number, number][] = []
  const seriesP95: [number, number][] = []
  const seriesAvg: [number, number][] = []

  const sorted = [...stats].sort((a, b) => a.timestamp - b.timestamp)
  sorted.forEach((stat) => {
    const { timestamp, success, p95, p99, avg } = CheckStatHelpers.convertToMillis(stat)
    seriesSuccess.push([timestamp, Math.round(success * 100)])
    seriesP95.push([timestamp, p95])
    seriesP99.push([timestamp, p99])
    seriesAvg.push([timestamp, avg])
  })

  return {
    title: undefined,
    chart: {
      type: 'area',
      height: 320
    },
    tooltip: {
      valueSuffix: 's'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%e. %b'
      }
    },
    yAxis: {
      title: undefined,
      labels: {
        format: `{value}s`
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },
    series: [
      {
        type: 'area',
        name: 'p99',
        data: seriesP99
      },
      {
        type: 'area',
        name: 'p95',
        data: seriesP95
      },
      {
        type: 'area',
        name: 'avg',
        data: seriesAvg
      }
    ]
  }
})

watch(isHovered, (isHovered) => {
  if (isHovered && props.eager && !isFinished.value) fetchStat()
})

function toggleExpand(expanded: boolean) {
  isExpanded.value = expanded
  if (expanded && !isFinished.value) fetchStat()
}
</script>

<style lang="scss" scoped>
.stat {
  border-bottom: 1px solid #d2d2d2;
  &:hover {
    cursor: pointer;
  }
}
</style>
