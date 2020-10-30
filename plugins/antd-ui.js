import Vue from 'vue'

import {
  Button,
  Steps,
  Form,
  Input,
  Select,
  Progress,
  Avatar,
  Row,
  Col,
  Table,
  Menu,
  Dropdown,
  Icon,
  Modal,
  FormModel,
  Drawer,
  Slider,
  Switch,
  Spin,
  InputNumber,
  Skeleton,
  Tooltip,
  Popconfirm,
  Collapse,
  message,
  notification
} from 'ant-design-vue'

import 'ant-design-vue/lib/row/style'
import 'ant-design-vue/lib/col/style'
import 'ant-design-vue/lib/popconfirm/style'

Vue.use(Button)
Vue.use(Steps) // 步骤条
Vue.use(Form)
Vue.use(Form.Item)
Vue.use(Input)
Vue.use(Select)
Vue.use(Progress)
Vue.use(Avatar)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(Menu)
Vue.use(Dropdown)
Vue.use(Icon)
Vue.use(Modal)
Vue.use(FormModel)
Vue.use(FormModel.Item)
Vue.use(Drawer)
Vue.use(Slider)
Vue.use(Switch)
Vue.use(Skeleton)
Vue.use(Spin)
Vue.use(InputNumber)
Vue.use(Tooltip)
Vue.use(Popconfirm)
Vue.use(Collapse)

Vue.prototype.$message = message
Vue.prototype.$notification = notification