/**
* Created by lyuwei
* User: lvwei@seemmo.com
* Date: 2018/12/13
* Describe:
* Log:
*  ---- 2018/12/13 10:34 [lyuwei] 初次添加
*/
<template>
  <el-card class="box-card">
  <div>
      <el-row>
        <el-col :span="6">名称:</el-col>
        <el-col :span="14">{{popData.nodeName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">经度:</el-col>
        <el-col :span="14">{{popData.lng}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">纬度:</el-col>
        <el-col :span="14">{{popData.lat}}</el-col>
      </el-row>
  </div>
</el-card>

</template>

<script>
export default {
  props: ['popData']
}
</script>
