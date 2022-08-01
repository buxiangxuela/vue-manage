import Vue from 'vue'
import { Button,Form,FormItem,Input,Message} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem )
Vue.use(Input)
//message不太一样 需要全局挂载
Vue.prototype.$message = (Message)
