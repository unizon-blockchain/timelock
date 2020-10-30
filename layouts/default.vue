<template>
  <div class="l-layout">
    <div class="l-default">
      <div class="app-intro">{{ 'Unizon Timelock Admin' }}</div>
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class Default extends Vue {
  created() {
    this.$useEthereumProvider(() => {
      this.$router.push('/')
    })
  }
}
</script>
<style lang="scss" scoped>
.l-layout {
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;

  .l-default {
    box-sizing: border-box;
    padding: 12px 0;
    margin: 0 auto;
    width: 1080px;
  }
}

.app-intro {
  box-sizing: border-box;
  padding: 12px 0 24px;
  font-weight: 700;
  font-size: 20px;
  text-align: center;
}
</style>
<style lang="scss">
.zon-card__header {
  box-sizing: border-box;
  padding: 12px !important;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-size: 16px;
    font-weight: 600;
    color: #000000;
  }
}
.back-btn__body {
  color: #565656;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 60px;

  .back-btn__entry {
    width: 7px;
    height: 7px;
    border-bottom: 2px solid #888888;
    border-left: 2px solid #888888;
    transform: rotate(45deg);

    &:hover {
      border-bottom: 2px solid #000000;
      border-left: 2px solid #000000;
    }
    &:active {
      border-bottom: 2px solid #000000;
      border-left: 2px solid #000000;
    }
  }
  .back-btn__text {
    margin-left: 6px;
  }

  &:hover {
    color: #000000;
  }
  &:active {
    color: #000000;
  }
}
</style>
