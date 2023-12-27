// Свойства (Props)
// text - тип String, текст для отображения.
// req - тип Boolean, указывает, требуется ли заполнение поля.
// valudateonload - тип Boolean или String (возможные значения: true, false), указывает, должна ли производиться валидация при загрузке.
// requretext - тип String, текст сообщения об ошибке при отсутствии значения в обязательном поле.
// rules - список правил валидации.
// inputStyle - тип Object или String, стили для поля ввода.
// inputClass - тип String, класс для поля ввода по умолчанию.
var compBase = {
  props: {
    'text': String,
    'req': Boolean,
    'valudateonload': { type:[ Boolean,String], default: false },
    'requretext': { type: String, default: 'The value must be filled in!!!' },
    'rules': [],
    'inputStyle': { type:[Object,String]  },
    'inputClass': { type: String ,default:'def-inp' } 
  },
  data: function () {
    return {
      valueInt: null,
      valid: true,
      
      notValidText: null
    }
  },
    computed: {
        inputClasses() {
            return {
                'invalid': !this.valid,
                [this.inputClass]: this.inputClass // добавляем переданный класс
            };
        }
    },
  watch: {
    immediate: true,
    value(val) {
        this.valueInt = val;
        this.Validate(val)
    }
  },
  methods: {
    //virtual method 
    virtChange(val){
      this.valueInt = val
      this.$emit('input', val)//event to parent
    }
   ,
    valChanged(event) {
      this.virtChange( event.target.value)
     
    },

      Validate(val) {
          if (typeof val === "undefined") {
              val = this.value;
          }
          this.valid = true
          let errList = []
          this.notValidText = null;

      if (this.req && !val) {
        this.valid = false
        this.notValidText = this.requretext;
      } else {
          try {
              if (this.rules) {
                  this.rules.forEach(element => {

                      let valResult = element(val)
                      {
                          if (valResult !== true) {
                              errList.push(valResult)
                              this.valid = false
                          }
                      }
                  });
                  if (!this.valid) {
                      this.notValidText = errList.join('\n');
                  }
              }
             
          }
          catch (error)
          {
              console.error("Error while validation rules executing: "+error)
          }
        }

        console.log(this.text+' valid = '+this.valid)
      },

  },
  mounted: function () {
      this.valueInt = this.value
      if (this.valudateonload==true) { 
        this.Validate(this.value)
      }

  }
}
Vue.component('kf-field', {
    mixins: [compBase],
    props: {
        'value': { type: String },

    },
    methods: {
        valChanged(event) {
            this.$emit('input', event.target.value);
        }
    },

    template: `
        <input 
            :class="inputClasses" 
            :style="inputStyle"
            :title="notValidText" 
            v-bind:value="value"
            v-on:input="valChanged($event)"
        />
    `
})

Vue.component('kf-input', {
  mixins: [compBase],
  props: {
    'value': { type: String },
  },

  methods: {
  },
  template: `
   <div class="flex-row" >
   <div class="title-col"  >{{ text }}:</div>
   
   <input 
    :class="inputClasses" 
    :style="inputStyle"
    :title="notValidText" 
     v-bind:value="value"
     v-on:input="valChanged($event)"
   />

   </div>
 `
})

Vue.component('kf-date', {
  mixins: [compBase],
  props: {
    'value': { type: [String,Date] },
  },

  methods: {
  },
  template: `
   <div class="flex-row" >
   <h3 class="title-col" >{{ text }}:</h3>
 
   <input type='date'
   :class="inputClasses" 
    :style="inputStyle"
    :title="notValidText" 
     v-bind:value="value"
     v-on:input="valChanged($event)"
   />
   <img v-if="!valid" src="invalid.png"></img> 
   </div>
 `
})

Vue.component('kf-combo', {
  mixins: [compBase],
  props: {
    'value': { type: [String, Number] },
    "items": Array
  },
  methods: {
  },

  template: `
   <div class="flex-row" >
   <h3 class="title-col" >{{ text }}:</h3>

   <select 
   :class="inputClasses" 
    :title="notValidText" 
    :style="inputStyle"
    v-model="valueInt"
    v-on:input="valChanged($event)"
  >
  <option v-for="item in items" :key="item.id"   v-bind:value="item.id" >{{item.name}}  </option>
  </select>
   <img v-if="!valid" src="invalid.png"></img> 
   </div>
 `
})

Vue.component('kf-num', {
  mixins: [compBase],
  props: {
    'value': { type: [Number,String] },
  },
  methods: {
    virtChange(val){
      val = reFormatNum(val)
      this.$emit('input', val)//event to parent
    }
  },
  mounted: function () {
    this.valueInt = formatNum(this.value)
  },
  template: `
   <div class="flex-row" >
   <h3 class="title-col" >{{ text }}:</h3>
   
   <input 
    :class="inputClasses" 
    :style="inputStyle" 
    :title="notValidText" 
     v-bind:value="valueInt"
     v-on:input="valChanged($event)"
     onblur="onBlur(this)"
     onfocus="onFocus(this)"     
   />

   <img v-if="!valid" src="invalid.png"></img> 

   </div>
 `
})


// import { w2field, query } from
// General

//new w2field('float', { el: query('#eu-float')[0], groupSymbol: ' ', precision: 3 })

function onBlur(control) {
  control.type = "text";
  control.value = formatNum(control.value)

}

function onFocus(control) {
  control.value = reFormatNum(control.value)
  control.type = "number";

}

function formatNum(val) {
  return numeral(val).format('0,0.00').replaceAll(',', ' ');
}

function reFormatNum(val) {
  return val.replaceAll(' ', '');
}