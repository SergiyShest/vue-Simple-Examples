var compBase = {
  props: {
    'text': String,
    'req': Boolean,
    'valudateonload': { type:[ Boolean,String], default: false },
    'requretext': { type: String, default: 'The value must be filled in!' },
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
//import Vue from 'vue';
//import compBase from '@/compBase.js';

const KfField = {
  mixins: [compBase],
  props: {
    value: { type: String },
  },
  methods: {
    valChanged(event) {
      this.$emit('input', event.target.value);
    },
  },
  template: `
    <input 
      :class="inputClasses" 
      :style="inputStyle"
      :title="notValidText" 
      v-bind:value="value"
      v-on:input="valChanged($event)"
    />
  `,
};

export default KfField;