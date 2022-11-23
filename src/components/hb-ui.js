import Crumb from './Crumb/Crumb';
import Dialog from './Dialog/Dialog';
import Echarts from './Echarts/Echarts';
import HbChat from './HbChat/HbChat';
import HbForm from './HbForm/HbForm';
import HbTable from './HbTable/HbTable';
import HbTree from './HbTree/HbTree';
import LockScreen from './LockScreen/LockScreen';
import SideMenu from './SideMenu/SideMenu';
import SliderVerify from './SliderVerify/SliderVerify';
import Watermark from './Watermark/Watermark';

const componentArr = [Crumb, Dialog, Echarts, HbChat, HbForm, HbTable, HbTree, LockScreen, SideMenu, SliderVerify, Watermark]

const HbUI = {
  install(Vue) {
    componentArr.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}

export default HbUI;