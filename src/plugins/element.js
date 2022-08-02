import Vue from 'vue'
import { Button,Form,FormItem,Input,Message,Container,Header,Aside,Main,Menu,MenuItem,MenuItemGroup,Submenu,Breadcrumb,BreadcrumbItem
,Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox} from 'element-ui'

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
