<!--
 * @Descripttion: 
 * @Date: 2019-09-05 13:18:32
 * @LastEditors: tande
 * @LastEditTime: 2019-09-05 13:19:42
 -->

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
