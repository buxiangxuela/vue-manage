import Vue from 'vue'
import { Button,Form,FormItem,Input,Message,Container,Header,Aside,Main,Menu,MenuItem,MenuItemGroup,Submenu,Breadcrumb,BreadcrumbItem
<<<<<<< HEAD
,Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,Select,Option} from 'element-ui'
=======
,Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,Select,Option,Cascader} from 'element-ui'
>>>>>>> cat

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem )
Vue.use(Input)
//message不太一样 需要全局挂载
Vue.prototype.$message = (Message)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
//messagebox不太一样 需要全局挂载
Vue.prototype.$confirm = (MessageBox.confirm)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
<<<<<<< HEAD
=======
Vue.use(Cascader)
>>>>>>> cat
