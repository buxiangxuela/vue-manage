<template>
    <el-row :gutter="20">
        <el-col :span="8">
            <el-card class="user-card graph" shadow="hover">
                <div slot="header" class="clearfix user-header">
                    <div class="user-img">
                        <img class="user-img" src="../../assets/logo.png" />
                    </div>
                    <div class="user-info">
                        <span class="user-name">userInfo.name </span>
                        <span class="user-rank">userInfo.rank</span>
                    </div>
                </div>
                <div class="text item login-info">
                    <span>上次登录时间：</span>
                    <span>2021.12.9</span>
                </div>
                <div class="text item login-info">
                    <span>上次登录地点：</span>
                    <span>上海</span>
                </div>
            </el-card>
            <el-card style="margin-top:30px;height: 400px;" shadow="none">
                <el-table :data="tableData">
                    <el-table-column prop="name" label="课程" width="80">
                    </el-table-column>
                    <el-table-column prop="todayBuy" label="今日购买" width="80">
                    </el-table-column>
                    <el-table-column prop="monthBuy" label="本月购买" width="80">
                    </el-table-column>
                    <el-table-column prop="totalBuy" label="总购买">
                    </el-table-column>
                </el-table>
            </el-card>
        </el-col>
        <el-col :span="16">
            <div class="order graph">
                <el-card v-for="item in countData" :key="item.name" :body-style="{ padding: 0 }">
                    <i class="icon" :class="'el-icon-' + item.icon" :style="{ background: item.color }"></i>
                    <div class="details">
                        <p class="sum">￥{{ item.value }}</p>
                        <p class="txt">￥{{ item.name }}</p>
                    </div>

                </el-card>
            </div>
            <el-card style="margin-top:20px;height:280px;width:100%">
                <div ref="echarts" style="height:280px"></div>
                <!-- <echart :chartData="echartData.order" style="height:280px"/> -->
            </el-card>
            <div class="graph" style="display:flex">
                <el-card style="height:260px;width: 48%;">
                    <div style="height:260px" ></div>
                    <!--  <echart :chartData="echartData.user" style="height:260px"/> -->
                </el-card>
                <el-card style="height:260px;width: 48%">
                    <div style="height:260px" ></div>
                    <!-- <echart :chartData="echartData.video" :isAxisChart="false" style="height:260px"/> -->
                </el-card>
            </div>
        </el-col>
    </el-row>
</template>
<script>
/* import { getData } from '../../../api/data.js' */
import * as echarts from 'echarts'
/* import Echart from '../../components/ECharts.vue' p27-28 bug vchart 公共组件问题 */

export default {
    name: 'Home',
    data() {
        return {
            tableData: [],
            tableLab: {
                name: '课程',
                todayBuy: '今日购买',
                monthBuy: '本月购买',
                totalBuy: '总购买'
            },
            countData: [
                {
                    name: "今日订单",
                    value: 1234,
                    icon: "success",
                    color: "#2ec7c9"
                },
                {
                    name: "今日收藏订单",
                    value: 210,
                    icon: "star-on",
                    color: "#ffb980"
                },
                {
                    name: "今日未支付订单",
                    value: 1234,
                    icon: "s-goods",
                    color: "#5ab1ef"
                },
                {
                    name: "本月支付订单",
                    value: 1234,
                    icon: "success",
                    color: "#2ec7c9"
                },
                {
                    name: "本月收藏订单",
                    value: 210,
                    icon: "star-on",
                    color: "#ffb980"
                },
                {
                    name: "本月未支付订单",
                    value: 1234,
                    icon: "s-goods",
                    color: "#5ab1ef"
                },
            ],
            echartData: {
                order: {
                    xData: [],
                    series: []
                },
                user: {
                    xData: [],
                    series: []
                },
                video: {
                    series: []
                }
            }
        }
    },
  /*   mounted() {
        getData().then(res => {
            const { code, data } = res.data
            if (code === 20000) {
                this.tableData = data.tableData
                const order = data.orderData
                const xData = order.date
                const keyArray = Object.keys(order.data[0])
                const series = []
                keyArray.forEach(key => {
                    series.push({
                        name: key,
                        data: order.data.map(item => item[key]),
                        type: 'line'
                    })
                })
                const option = {
                    tooltip: {
                        trigger: "axis",
                    },
                    xAxis: {
                        data: xData
                    },
                    yAxis: {},
                    legend: {
                        data: keyArray
                    },
                    series
                }
                const E = echarts.init(this.$refs.echarts)
                E.setOption(option)
                  this.echartData.order.xData =  xData
                  this.echartData.order.series = series


                //用户图
                const userOption = {

                    legend: {
                        //图例文字
                        textStyle: {
                            color: '#333',
                        },
                    },
                    grid: {
                        left: "20%",
                    },
                    //提示框
                    tooltip: {
                        trigger: "axis",
                    },
                    xAxis: {
                        type: "category",//类目轴
                        data: data.userData.map(item => item.date),
                        axisLine: {
                            lineStyle: {
                                color: "#17b3a3",
                            },
                        },
                        axisLabel: {
                            interval: 0,
                            color: "#333",
                        },
                    },
                    yAxis: [
                        {
                            type: "value",
                            axisLine: {
                                lineStyle: {
                                    color: "#17b3a3",
                                },
                            },
                        },
                    ],
                    color: ["#2ec7c9", "#b6a2de"],
                    series: [{
                        name: '新增用户',
                        data: data.userData.map(item => item.new),
                        type: 'bar'
                    },
                    {
                        name: '活跃用户',
                        data: data.userData.map(item => item.active),
                        type: 'bar'
                    }
                    ]

                }
                const U = echarts.init(this.$refs.userEcharts)
                U.setOption(userOption)


                 this.echartData.user.xData = data.userData.map(item => item.date)
                 this.echartData.user.series = [{
                             name:'新增用户',
                             data:data.userData.map(item => item.new),
                             type:'bar'
                         },
                         {
                             name:'活跃用户',
                             data:data.userData.map(item => item.active),
                             type:'bar'
                         }
                         ]


                //饼图
                const videoOption = {
                    tooltip:{
                        trigger:"item",
                    },
                    color:[
                        "#0f78f4",
                        "#dd536b",
                        "#9462e5",
                        "#a6a6a6",
                        "#e1bb22",
                        "#39c362",
                        "#3ed1cf",
                    ],
                    series:[
                        {
                            data:data.videoData,
                            type:'pie'
                        }
                    ],
                }
                const V = echarts.init(this.$refs.videoEcharts)
                V.setOption(videoOption)
                /* this.echartData.video.series = [
                    {
                        data: data.videoData,
                        type: 'pie'
                    }
                ] */
          /*   }

            console.log(res)
        })
    } */ 
}
</script>

<style lang="less" scoped>
.item {
    margin: 18px 0;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both;
}

.user-header {
    height: 120px;
    display: flex;
    align-items: center;

    .user-img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    .user-info {
        display: flex;
        flex-direction: column;
        margin-left: 50px;

        .user-name {
            font-size: 20px;
            margin-bottom: 8px;
        }

        .user-rank {
            font-size: 14px;
            color: #aaa;
        }
    }
}

.login-info {
    font-size: 14px;
    color: #aaa;

    span {
        margin-right: 50px;
    }
}

.order {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 20px;
    row-gap: 10px;
    position: relative;

    .icon {
        font-size: 60px;
        padding: 10px;
        color: #fff;
        background-color: #fab;
    }

    .details {
        display: inline-block;
        height: 10px;
        margin-left: 20px;
        position: relative;
        bottom: 0px;

        .sum {
            font-size: 16px;
            margin-bottom: 10px;
            padding: 0;
        }

        .txt {
            font-size: 7px;
            color: #aaa;
            padding: 0;

        }
    }
}

.graph {
    margin-top: 20px;
    justify-content: space-between;
}
</style>