<!--
 * @Descripttion:
 * @Date: 2019-11-20 10:33:20
 * @LastEditors: tande
 * @LastEditTime: 2019-11-21 14:42:31
 -->
<template>
	<el-container>
		<el-header>Example</el-header>
		<el-main>
			<el-row>
				<!-- <router-link to="/mapXYZ">
          <el-button>xyz离线底图</el-button>
        </router-link> -->
				<!-- <router-link to="/mapXYZStyle">
          <el-button>切换xyz离线底图</el-button>
        </router-link> -->
				<!-- <router-link to="/mapStyle">
					<el-button>底图样式</el-button>
				</router-link> -->
				<router-link to="/changelayer">
					<el-button>底图切换</el-button>
				</router-link>
				<router-link to="/gate">
					<el-button>卡口</el-button>
				</router-link>
				<router-link to="/map">
					<el-button>地图</el-button>
				</router-link>
				<router-link to="/seeLayer">
					<el-button>要素</el-button>
				</router-link>
				<router-link to="/draw">
					<el-button>交互</el-button>
				</router-link>
				<router-link to="/pop">
					<el-button>弹出框</el-button>
				</router-link>
				<router-link to="/marker">
					<el-button>图标</el-button>
				</router-link>
				<router-link to="/short">
					<el-button>多点成线</el-button>
				</router-link>
			</el-row>
		</el-main>
	</el-container>
</template>
