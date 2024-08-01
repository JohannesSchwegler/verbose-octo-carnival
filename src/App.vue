<template>
  <div class="layout">
    <aside class="layout-sidebar">
      <div class="layout-sidebar-item"></div>
      <div class="layout-sidebar-item">REPORTING</div>
    </aside>
    <main class="layout-main">
      <section class="layout-stats">
        <Searchbar
          :min-width="400"
          class="layout-searchbar"
          v-model="searchedText"
          placeholder="Search for a check name or type"
          is-focusable-by-keys
        />
        <h1>Reporting</h1>
        <p>
          Analyze long term performance of your checks and export aggregated metrics for external
          reporting duties.
        </p>
        <ChecksTable :searched-text="searchedText ?? undefined" />
      </section>
    </main>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Searchbar from './components/library/searchbar/Searchbar.vue'
import ChecksTable from './components/CheckTable.vue'

const searchedText = ref<string | null>(null)
</script>

<style lang="scss">
.layout {
  min-height: 100dvh;
  width: 100%;
  padding: 24px;
  display: flex;
  &-searchbar {
    margin-bottom: 12px;
  }
  &-sidebar {
    width: 260px;
    background-color: #e8e8e8;
    padding: 16px;
    &-item {
      background-color: #c4c4c4;
      padding: 8px;
      margin-bottom: 8px;
    }
  }

  &-main {
    flex: 1;
  }

  &-stats {
    margin-left: 40px;
  }
}
</style>
