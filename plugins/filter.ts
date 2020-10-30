import { Vue } from 'vue-property-decorator'

declare module 'vue/types/vue' {
  interface Vue {
    $filter: any
  }
}

export default ({ app, store }: any) => {
  Vue.filter('parseLocalDateTime', function (value: number) {
    const dt = new Date(value * 1000);
    return dt.toUTCString();
  })

  const addressFormat = (value: string, Digits: number = 4) => {
    let data =
      '0x' +
      value.toString().substring(2, Digits + 2) +
      '...' +
      value.substring(value.length, value.length - Digits)
    return data
  }
  Vue.filter('addressFormat', addressFormat)

  Vue.prototype.$filter = {
    addressFormat
  }
}