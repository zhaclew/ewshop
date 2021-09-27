import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {
  AddressEdit ,
  AddressList ,
  Button ,
  Badge,
  Col,
  Card,
  Collapse,
  CollapseItem,
  Checkbox,
  CheckboxGroup,
  Cell, CellGroup,
  PullRefresh,
  Form,
  Field ,
  Grid,
  GridItem,
  Image as VanImage,
  Icon,
  Lazyload,
  List,
  Popup,
  Row,
  Tab,
  Tabs,
  Tag ,
  Toast ,
  Swipe,
  SwipeItem,
  Sidebar,
  SidebarItem,
  Stepper,
  SubmitBar,
  SwipeCell 
} from "vant";

createApp(App)
  .use(Swipe)
  .use(SwipeItem)
  .use(Sidebar)
  .use(SidebarItem)
  .use(Collapse)
  .use(CollapseItem)
  .use(Tab)
  .use(Tabs)
  .use(Tag)
  .use(Card)
  .use(Button)
  .use(VanImage)
  .use(Grid)
  .use(GridItem)
  .use(Toast)
  .use(Form)
  .use(Field)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Stepper)
  .use(SubmitBar)
  .use(SwipeCell)
  .use(Icon)
  .use(Cell)
  .use(CellGroup)
  .use(AddressList)
  .use(AddressEdit)
  .use(Popup)
  .use(Col)
  .use(Row)
  .use(List)
  .use(PullRefresh)
  .use(Lazyload, { loading: require("./assets/images/load.gif") })
  .use(Badge)
  .use(store)
  .use(router)
  .mount("#app");
