<template>
  <el-menu :default-active="$route.path" router class="el-menu-demo" mode="horizontal" background-color="#545c64"
           text-color="#fff">
    <el-menu-item v-if="item.children.length===0" v-for="item in menuData" :key="item.id"
                  :index="'/main/'+item.attributes.menuPath.split('.')[0]"
                  :data-router="'/main/'+item.attributes.menuPath.split('.')[0]">
      <i :class="item.attributes.menuIcon" class="icons"></i>
      <span slot="title">{{item.text}}</span>
    </el-menu-item>
    <el-submenu v-if="item.children.length>0" v-for="item in menuData" :key="item.id"
                :index="'/main/'+item.children[0].attributes.menuPath.split('.')[0]"
                :data-router="'/main/'+item.children[0].attributes.menuPath.split('.')[0]">
      <template slot="title">{{item.text}}
        <!-- <i :class="item.attributes.menuIcon" class="icons"></i> -->
      </template>
      <el-menu-item :index="'/main/'+i.attributes.menuPath.split('.')[0]" v-for="i in item.children" :key="i.id"
                    :disabled="i.attributes.menuPath!==('faceLibQuery.html'||'channel.html')"
                    :data-router="'/main/'+i.attributes.menuPath.split('.')[0]">{{i.text}}
      </el-menu-item>

    </el-submenu>
    <el-menu-item :index=" '/main/managePlatform' ">
      <span slot="title">后台管理</span>
    </el-menu-item>

  </el-menu>

</template>

<script>
  export default {
    data () {
      return {
        isCollapse: true,
        menuData: []
      }
    },
    mounted () {
      this.getMenu()
    },
    methods: {
      getMenu () {}
    }
  }
</script>

<style>
  /* 左侧新菜单的背景图 */
  .icons {
    display: inline-block;
    width: 30px;
    height: 30px;
    background-repeat: no-repeat;
    background-size: 80%;
  }

  .left1 {
    background-image: url("../assets/white_left1.png");
  }

  .left2 {
    background-image: url("../assets/white_left2.png");
  }

  .left3 {
    background-image: url("../assets/white_left3.png");
  }

  .left4 {
    background-image: url("../assets/white_left4.png");
  }

  .left5 {
    background-image: url("../assets/white_left5.png");
  }

  .left6 {
    background-image: url("../assets/white_left6.png");
  }

  .left7 {
    background-image: url("../assets/white_left7.png");
  }

  .left8 {
    background-image: url("../assets/white_left8.png");
  }
</style>
