
Vue.component('button-counter', {
  data: function () {
    return {
      count: 1
    }
  },
  template: '<button v-on:click="count= count*2">You clicked me {{ count }} times.</button>'
})

Vue.component('kf-input', {
    props: ['item'],

    template: '<div class="flex-row" >'+
    '<h3     class="title-col" >{{ item.title }}:</h3>'+
    '<input :type="item.type" class="value-col inp" v-model="item.value"></input>'+
    '</div>'
  })