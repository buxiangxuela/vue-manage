import Vue from 'vue'

import * as echarts from 'echarts/core';
import {
    BarChart
} from 'echarts/charts';
echarts.use(
    [ BarChart ]
);
  
Vue.prototype.$echarts = echarts
