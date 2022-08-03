//控制是否展开的属性
export default{
    state:{
        isCollapse:false
    },
    //在这里面定义方法
    mutations:{
        collapseMenu(state){
            //定义取反
            state.isCollapse = !state.isCollapse
        }
    }
}