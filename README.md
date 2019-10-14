## SeeMap

>封装自mapbox，提供方便简洁接口供各业务系统使用，统一地图控件，迭代并提供更好的功能。

目前各项目陆续增加了GIS的展示或交互功能，此项目初衷是为了代价最小的情况下统一项目中使用的GIS部分代码，抽取公共部分，减少重复劳动力，并在GIS人手不够的情况下加快项目进度。

[mapbox](https://www.mapbox.com/) 是一个成熟的地图库，基于webGL性能和效果非常出色，本项目基于其强大的功能上，封装了，针对我们项目中的一些功能，简化使用成本，将多数的卡口展示，点线面渲染，等功能二次封装。

### ✨ 特性
 - 支持2.5D的地图效果，较平面地图显示效果更为出众
 - 支持矢量数据，在数据允许的情况下，显示样式不再受约束，可以灵活多变
 - 数据来源于开源项目，利： 没有任何版权冲突。 弊： 数据更新迭代不受商业支持，较缓慢。
 - 基于webGL重写，效果出众，在某些支持GPU加速的机器上，食用效果更佳
 - 底层理论支持canvas和webGL，与当前许多可视化效果可以直接融合


### 准备工作

由于该库发布再内网的NPM库中，所以下载、查看、更新都需要使用内网的[NPM仓库地址](http://192.168.2.4:4873)

 1. 检查本地NPM仓库地址
    ```
    npm get registry
    ```

 2. 设置npm仓库地址
    ```
    npm set registry http://192.168.2.4:4873
    ```

 - 后续使用过程中可以按照正常npm的使用方法使用，安装的库如果是互联网包，内网没有缓存会自动代理请求互联网的npm设置库
 - 更多内网NPM库的使用方法请兴趣的去查看verdaccio

### 开始使用

- 更多方法和类请查看[API文档](http://192.168.2.4:8181/docs/seemap)

#### 使用node形式

 1. 安装SeeMap库
    ```
    npm install @seemmo/map
    ```

 2. 使用相关类
    ```
    <template>
        <div :id="mapdivname"></div>
    </template>
    <script>
    import { Map } from '@seemmo/map';
    export default {
            name: 'mapBase',

            data() {
                return {
                    mapdivname: new Date().getTime() + '-map',
                    thismap: null
                };
            },

            mounted: function () {
                this.thismap = new Map(this.mapdivname, {
                  serviceUrl: 'http://localhost:4001',
              resourceUrl: process.env.BASE_URL + 'map_resource',
                  zoomSlide: true
                });
            },
    
        methods: {}
        };
    </script>
    ```
    
 3. **特别注意**

    * 使用node引入到项目中时，采用的是源码引入，代码中使用了 `es6` 的新语法和 `typescript`，需要相关转换才能被浏览器使用，webpack需要加上对ts的支持
    * 已知代码中使用了对象展开式(...a)，vuecli3的打包脚本默认不会对node_modules加载babel_loader，需要手动设置vue.config.js文件，加上 **transpileDependencies** 配置，对本库 @seemmo/map 做babel转换，实现低版本的不兼容问题，具体配置可参考[vueCli3配置](https://cli.vuejs.org/zh/config/#transpiledependencies)


#### 使用标准HTML引入库的形式

下载打包过后的 seemap.js 和 seemap.css ，引入到项目中，SeeMap为该库对外的命名空间，其余的使用方法同npm的形式基本一致

### 更多文档

更多文档请查看 [git仓库](http://192.168.2.3/dev/saas/gis/seemap) 中提供的详细文档，或相关改动日志。

### 发现bug

请提交相关 [issues](http://192.168.2.3/dev/saas/gis/seemap/issues) ，为方便更快速定位和修复bug，请尽可能的详细记录相关复现操作，最好附上相关截图等。

如果需要及时解决或立马响应，请联系相关GIS开发。

### 版本号 x.x.x

由于设计或项目需要，将会有更多更好的GIS需求提出，为更好的兼容，在小版本号的修复bug时将会修改最后一位版本号，如果出现大的bug修复或增加某些急需的接口，将会在第二位版本号上做更改，原则上也会兼容之前的接口。

而如果出现了不兼容之前的版本的接口，或新的功能，更换底层框架，将会修改第一位的版本号。

### 未来期望
 + [ ] 摄像头模型，直接动态映射播放视频流
