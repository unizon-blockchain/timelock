<template>
  <div class="zon-card">
    <slot></slot>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'ZonCard'
})
export default class Index extends Vue {}
</script>

<style lang="scss" scoped>
.zon-card {
  background: radial-gradient(
    circle at center top,
    rgb(245, 245, 245),
    rgb(245, 245, 245),
  );
  border: 0px;
  border-radius: 8px;
  box-shadow: rgba(20, 1, 8, 0.15) -2px 2px 4px,
    rgb(255, 255, 255) 2px -2px 4px;
  overflow: hidden;
  box-sizing: border-box;
  padding: 1px;
}
</style>