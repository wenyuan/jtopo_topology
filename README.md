# jTopo Topology
> 基于jtopo二次封装，修复了一些bug。
> 便于直接使用，也可以稍作修改后应用到各前端框架中。 </br>
> 纯前端项目，所有ajax接口保留，采用模拟数据，实际开发过程中稍作修改即可对接后端。

## 预览
预览方式： </br>
下载该项目代码，用webstorm打开即可预览（或用其他内置http服务器的IDE打开） </br>
![image](https://github.com/xwenyuan/jtopo_topology/blob/master/screenshots/topology.png)

## 实现功能
* 拓扑图的加载
* 工具栏、鼠标右键菜单
* 多种类型节点、连线的添加/删除
* 节点的图片的缩放与调整
* 鼠标经过节点显示tooltip信息

## 项目依赖
* [jQuery](https://jquery.com/)
* [jTopo.js](http://www.jtopo.cn/)
* [layui](http://www.layui.com/)
其中layui用于本项目的页面布局和组件，非必须。

## 项目结构
```
.
├── json                    // 模拟数据,实际使用中用ajax代替
├── screenshots             // 项目截图(无用)
├── static
|   ├── font-awesome-4.7.0
|   ├── jquery-3.3.1
|   ├── jtopo-0.4.8
|       ├── jtopo-0.4.8-dev.js                 // jtopo源码,已经过修改
|       └── jtopo-0.4.8-dev(带注释版报错).js    // 本项目优化了一部分源码,故不要使用这个包,仅辅助解读源码用
|   ├── layui-2.3.0
|   └── public             // 本项目的静态文件
|       ├── css                                // 样式文件,根据实际项目修改
|       ├── img                                // 拓扑图引用图片,根据实际项目修改
|       └── js                                 // jtopo-editor.js为二次封装代码,如需在vue等框架中使用,可适当进行修改
|
├── network_topology.html // demo页面
├── 其它
|
```


## 提交记录
* 2018.08.23
  * 拓扑图连线(Link)属性编辑
  * 修改源码, 做反序列化保护,防undefined(之前需要在调用方做保护)
  * 修改源码, 新增以图片形式导出拓扑图
* 2018.08.02
  * 修改源码, 使序列化的时候支持节点属性值为json对象 
* 2018.07.04
  * 拓扑图节点(Node)属性编辑
  * 节点tooltip的触发与显示
  * 编辑和非编辑模式切换
  * 代码部分重构
* 2018.06.29
  * 节点和连线的添加删除
  * 拓扑图序列化
  * 右键菜单和功能
  * 前端页面部分组件化整理


## Vue版本拓扑图
> 等有时间了从项目中剥离出来，将在本项目基础上另起一个分支

## vue版本预览
![image](https://github.com/xwenyuan/jtopo_topology/blob/master/screenshots/topology.gif)


## 官方API文档补充
* 参见 [官方API文档补充.txt](https://github.com/xwenyuan/jtopo_topology/blob/master/官方API文档补充.txt)
