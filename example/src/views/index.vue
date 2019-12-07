<template>
	<div>
		<p>这是index页面</p>
		<router-link to="/main/map">
			<el-button>
				跳转地图页面
			</el-button>
		</router-link>
	</div>
</template>

<script>
export default {
  components: {},
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}
</script>

<style scoped>
a {
	text-decoration: none;
	color: #000;
}
</style>
