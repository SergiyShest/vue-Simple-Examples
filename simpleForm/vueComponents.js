
Vue.component('button-counter', {
  data: function () {
    return {
      count: 1
    }
  },
  template: '<button v-on:click="count= count*2">You clicked me {{ count }} times.</button>'
})

Vue.component('kf-input', {
    props: {
    'item': Object,
    'req': Boolean
  },
    data: function () {
      return {
        valid: true,
        reqText:'Значение должно быть заполнено!!!',
        tooltip:null
      }
    },
    methods:{}
    ,

    watch: { 
      item:{
        immediate: true,
        deep:true, 
      handler (newVal, oldVal) {
        console.log('Prop changed: ', newVal, ' | was: ', oldVal)
        if(this.req && !newVal.value){
          this.valid = false
          this.tooltip=this.reqText;
        }else{
          this.valid = true
          this.tooltip=null;          
        }
      }
    }
    },

    template: '<div class="flex-row" >'+
    '<h3 class="title-col" >{{ item.title }}:</h3>'+
    '  <input '+
    ':type="item.type" class="value-col inp " :class="{ invalid: !valid }" :title="tooltip" '+
    '   v-model="item.value"></input><img v-if="!valid" src="invalid.png"></img> '+
    '</div>'
  })