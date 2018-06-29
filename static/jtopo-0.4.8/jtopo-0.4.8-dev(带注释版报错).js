/*
 * JTopo 0.48.1 感谢原作者
 *
 * 此插件本人对其 进行相关 解释、调整、扩展
 * email: magic_devil.@163.com
 * Date: 2015-07-20
 *
 * 修改部分请搜索 “调整”关键字
 * Version 1.0
 * 对可见元素的定义中getSize方法 变量名称书写错误
 * 对原来的自动树形布局进行了调整，避免在环形数据结构下出现无线递归
 * 扩展针对Node、TextNode、LinkNode、CircleNode的多位置、换行文本支持
 */
/**
 * Jtopo的定义
 */
!function (window) {
    /**
     * 基础元素对象定义
     */
    function Element() {
        //初始化
        this.initialize = function () {
            this.elementType = "element",
                this.serializedProperties = ["elementType"],
                this.propertiesStack = [],
                this._id = "" + Math.ceil(Math.random() * (new Date).getTime())
            /*调整这里的 getTime 不足以随机支持 元素的唯一标识 在1毫秒下很有可能创建多元素 而导致ID一致*/
        },
            //销毁
            this.distroy = function () {
            },
            //删除句柄方法
            this.removeHandler = function () {
            },
            //增加属性
            this.attr = function (a, b) {
                if (null != a && null != b)
                    this[a] = b;
                else if (null != a)
                    return this[a];
                return this
            },
            //保存元素
            this.save = function () {
                var a = this,
                    b = {};
                this.serializedProperties.forEach(function (c) {
                    b[c] = a[c]
                }),
                    this.propertiesStack.push(b)
            },
            //重建仓库 将所有元素属性都重置为最后一个元素的属性
            this.restore = function () {
                if (null != this.propertiesStack && 0 != this.propertiesStack.length) {
                    var a = this,
                        b = this.propertiesStack.pop();
                    this.serializedProperties.forEach(function (c) {
                        a[c] = b[c]
                    })
                }
            },
            //元素对象序列化
            this.toJson = function () {
                var a = this,
                    b = "{",
                    c = this.serializedProperties.length;
                return this.serializedProperties.forEach(function (d, e) {
                    var f = a[d];
                    "string" == typeof f && (f = '"' + f + '"'),
                        b += '"' + d + '":' + f,
                    c > e + 1 && (b += ",")
                }),
                    b += "}"
            }
    }

    /**
     * 针对Html5 Canvas2D绘制方法扩展
     * 画圆角矩形
     */
    CanvasRenderingContext2D.prototype.JTopoRoundRect = function (a, b, c, d, e) {
        "undefined" == typeof e && (e = 5),
            this.beginPath(),
            this.moveTo(a + e, b),
            this.lineTo(a + c - e, b),
            this.quadraticCurveTo(a + c, b, a + c, b + e),
            this.lineTo(a + c, b + d - e),
            this.quadraticCurveTo(a + c, b + d, a + c - e, b + d),
            this.lineTo(a + e, b + d),
            this.quadraticCurveTo(a, b + d, a, b + d - e),
            this.lineTo(a, b + e),
            this.quadraticCurveTo(a, b, a + e, b),
            this.closePath()
    },
        /**
         * 针对Html5 Canvas2D绘制方法扩展
         * 画虚线
         */
        CanvasRenderingContext2D.prototype.JTopoDashedLineTo = function (a, b, c, d, e) {
            "undefined" == typeof e && (e = 5);
            var f = c - a,
                g = d - b,
                h = Math.floor(Math.sqrt(f * f + g * g)),
                i = 0 >= e ? h : h / e,
                j = g / h * e,
                k = f / h * e;
            this.beginPath();
            for (var l = 0; i > l; l++)
                l % 2 ? this.lineTo(a + l * k, b + l * j) : this.moveTo(a + l * k, b + l * j);
            this.stroke()
        },
        /**
         * Jtopo对象定义
         */
        JTopo = {
            version: "0.4.8",               //版本
            stage: {},                       //调整 加入stage缓存容器属性，原定义是在stage构造时赋值stage对象但是这么做有缺陷（具体可以看stage构造时的注释）
            zIndex_Container: 1,            //容器层级 默认1
            zIndex_Link: 2,                 //连线层级 默认2
            zIndex_Node: 3,                 //节点层级 默认3
            SceneMode: {                    //场景子对象定义
                normal: "normal",           //场景类型（这个属性名字起的比较奇怪） 默认：normal
                drag: "drag",               //场景是否支持拖拽 默认：drag（支持）
                edit: "edit",               //场景是否支持编辑 默认：edit（支持）
                select: "select"            //场景是否支持选择 默认：select（支持）
            },
            MouseCursor: {                  //鼠标指针对象
                normal: "default",          //指针类型  默认：normal
                pointer: "pointer",         //指针游标样式  默认：pointer
                top_left: "nw-resize",      //围绕鼠标指针左上角的样式 默认 nw-resize
                top_center: "n-resize",     //围绕鼠标指针顶上正中的样式 默认 n-resize
                top_right: "ne-resize",     //围绕鼠标指针右上角的样式 默认 ne-resize
                middle_left: "e-resize",    //围绕鼠标指针中部左边的样式 默认 e-resize
                middle_right: "e-resize",   //围绕鼠标指针中部右边的样式 默认 e-resize
                bottom_left: "ne-resize",   //围绕鼠标指针左下角的样式 默认 ne-resize
                bottom_center: "n-resize",  //围绕鼠标指针底部中间的样式 默认 n-resize
                bottom_right: "nw-resize",  //围绕鼠标指针右下角的样式 默认 nw-resize
                move: "move",               //是否能够移动 默认 move
                open_hand: "url(../../common/images/jtopo/cur/openhand.cur) 8 8, default",     //鼠标 手掌张开样式
                closed_hand: "url(../../common/images/jtopo/cur/closedhand.cur) 8 8, default"   //鼠标 手掌蜷起样式
            },
            /**
             * Jtopo基础方法 根据json创建 舞台对象（场景容器）
             */
            createStageFromJson: function (jsonStr, canvas) {
                var jsonObj = eval(jsonStr);                    //使用eval解析json 并且定义赋值给变量jsonObj（这种解析方式不安全，不建议使用）
                var stage = new JTopo.Stage(canvas);
                for (var k in jsonObj)
                    "childs" != k && (stage[k] = jsonObj[k]);   //若不是 childs属性下元素 则在舞台对象中设置属性
                var scenes = jsonObj.childs;                    //伪场景对象赋值
                return scenes.forEach(function (a) {            //循环伪场景元素
                    var b = new JTopo.Scene(stage);             //新建场景 真实对象
                    for (var c in a)
                        "childs" != c && (b[c] = a[c]), "background" == c && (b.background = a[c]); //将伪对象属性赋值给真实场景对象
                    var d = a.childs;                           //将伪对象中子元素（节点信息）赋值给 伪对象d
                    d.forEach(function (a) {
                        var c = null,
                            d = a.elementType;
                        "node" == d ? c = new JTopo.Node : "CircleNode" == d && (c = new JTopo.CircleNode); //分类创建真实子对象（节点信息）
                        for (var e in a)
                            c[e] = a[e];
                        b.add(c)                                //真实子对象（节点信息）加入真实场景中
                    })
                }), stage
            }
        },
        JTopo.Element = Element,    //Jtopo对象属性赋值
        window.JTopo = JTopo        //Jtopo对象赋值绑定到当前窗口对象中
}(window),
    /**
     * JTopo 扩展util基础方法
     */
    function (JTopo) {
        /**
         * 方法存储管理 （键值对，键是string、值是数组）
         */
        function MessageBus(a) {
            var b = this;
            this.name = a,
                this.messageMap = {},
                this.messageCount = 0,
                this.subscribe = function (a, c) {              //信息注册 a是键 c是信息内容（方法）
                    var d = b.messageMap[a];
                    null == d && (b.messageMap[a] = []),
                        b.messageMap[a].push(c),
                        b.messageCount++
                },
                this.unsubscribe = function (a) {               //信息注销 a是键
                    var c = b.messageMap[a];
                    null != c && (b.messageMap[a] = null, delete b.messageMap[a], b.messageCount--)
                },
                this.publish = function (a, c, d) {             //调用某指定公开方法
                    var e = b.messageMap[a];
                    if (null != e)
                        for (var f = 0; f < e.length; f++)      //遍历信息内容
                            d ? !function (a, b) {              //若参数d为真（true或者1）异步10毫秒秒执行方法调用（多线程异步处理）否则直接执行调用
                                setTimeout(function () {
                                    a(b)
                                }, 10)
                            }(e[f], c) : e[f](c)
                }
        }

        /**
         * 获得距离
         * 当存在c d参数时  a为第一个位置x坐标 b为第一个位置y坐标  c为第二个位置x坐标 d为第二个位置y坐标
         * 当不存在c d参数时  a为第一个位置对象 b为第二个位置对象
         * 永远用的是 第二个位置 减 第一个位置  Math.sqrt 开方算出斜边长（直线距离）
         */
        function getDistance(a, b, c, d) {
            var e, f;
            return null == c && null == d ? (e = b.x - a.x, f = b.y - a.y) : (e = c - a, f = d - b),
                Math.sqrt(e * e + f * f)
        }

        /**
         * 获得最后一个非Link元素的范围
         * @param a 元素集合
         */
        function getElementsBound(a) {
            for (var b = {
                left: Number.MAX_VALUE,
                right: Number.MIN_VALUE,
                top: Number.MAX_VALUE,
                bottom: Number.MIN_VALUE
            }, c = 0; c < a.length; c++) {
                var d = a[c];
                d instanceof JTopo.Link ||
                (b.left > d.x && (b.left = d.x, b.leftNode = d),
                b.right < d.x + d.width && (b.right = d.x + d.width, b.rightNode = d),
                b.top > d.y && (b.top = d.y, b.topNode = d),
                b.bottom < d.y + d.height && (b.bottom = d.y + d.height, b.bottomNode = d))
            }
            return b.width = b.right - b.left, b.height = b.bottom - b.top, b
        }

        /**
         * 获得鼠标位置
         */
        function mouseCoords(a) {
            return a = cloneEvent(a),
            a.pageX ||
            (a.pageX = a.clientX + document.body.scrollLeft - document.body.clientLeft,
                a.pageY = a.clientY + document.body.scrollTop - document.body.clientTop), a
        }

        /**
         * 获得事件触发时的位置对象
         */
        function getEventPosition(a) {
            return a = mouseCoords(a)
        }

        /**
         * 指针旋转
         */
        function rotatePoint(a, b, c, d, e) {
            var f = c - a,
                g = d - b,
                h = Math.sqrt(f * f + g * g),
                i = Math.atan2(g, f) + e;
            return {
                x: a + Math.cos(i) * h,
                y: b + Math.sin(i) * h
            }
        }

        /**
         * 批量指针旋转
         */
        function rotatePoints(a, b, c) {
            for (var d = [], e = 0; e < b.length; e++) {
                var f = rotatePoint(a.x, a.y, b[e].x, b[e].y, c);
                d.push(f)
            }
            return d
        }

        /**
         * 递归循环遍历（全遍历）
         * a数组
         * b单次loop方法内容
         * c是异步时间
         */
        function $foreach(a, b, c) {
            function d(e) {
                e != a.length && (b(a[e]), setTimeout(function () {
                    d(++e)
                }, c))
            }

            if (0 != a.length) {
                var e = 0;
                d(e)
            }
        }

        /**
         * 递归循环遍历（指定遍历）
         * a数组
         * b单次loop方法参数
         * c单次loop方法内容
         * d是异步时间
         */
        function $for(a, b, c, d) {
            function e(a) {
                a != b && (c(b), setTimeout(function () {
                    e(++a)
                }, d))
            }

            if (!(a > b)) {
                var f = 0;
                e(f)
            }
        }

        /**
         * 克隆事件对象
         * a原事件对象
         * 剔除原对象中的 returnValue、keyLocation属性
         * 属性为基础类型（string number）时真正克隆
         * 属性为对象、数组、方法时只是指针指向
         */
        function cloneEvent(a) {
            var b = {};
            for (var c in a)
                "returnValue" != c && "keyLocation" != c && (b[c] = a[c]);
            return b
        }

        /**
         * 克隆对象
         * a原对象
         * 属性为基础类型（string number）时真正克隆
         * 属性为对象、数组、方法时只是指针指向
         */
        function clone(a) {
            var b = {};
            for (var c in a)
                b[c] = a[c];
            return b
        }

        /**
         * 鼠标指针是否在矩形区域内
         */
        function isPointInRect(a, b) {
            var c = b.x,
                d = b.y,
                e = b.width,
                f = b.height;
            return a.x > c && a.x < c + e && a.y > d && a.y < d + f
        }

        /**
         * 鼠标指针是否在连线上
         */
        function isPointInLine(a, b, c) {
            var d = JTopo.util.getDistance(b, c),
                e = JTopo.util.getDistance(b, a),
                f = JTopo.util.getDistance(c, a),
                g = Math.abs(e + f - d) <= .5;
            return g
        }

        /**
         * 从数组a中将第一个b移除
         */
        function removeFromArray(a, b) {
            for (var c = 0; c < a.length; c++) {
                var d = a[c];
                if (d === b) {
                    a = a.del(c);
                    break
                }
            }
            return a
        }

        /**
         * 随机颜色
         */
        function randomColor() {
            return Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random())
        }

        function isIntsect() {
        }

        /**
         * 获得a对象中属性b的值
         */
        function getProperties(a, b) {
            for (var c = "", d = 0; d < b.length; d++) {
                d > 0 && (c += ",");
                var e = a[b[d]];
                "string" == typeof e ? e = '"' + e + '"' : void 0 == e && (e = null),
                    c += b[d] + ":" + e
            }
            return c
        }

        /**
         * 根据 json数据、canvas对象
         * 反序列化 舞台、场景、节点元素
         */
        function loadStageFromJson(json, canvas) {
            var obj = eval(json),
                stage = new JTopo.Stage(canvas);
            for (var k in obj)
                if ("scenes" != k)
                    stage[k] = obj[k];
                else
                    for (var scenes = obj.scenes, i = 0; i < scenes.length; i++) {
                        var sceneObj = scenes[i],
                            scene = new JTopo.Scene(stage);
                        for (var p in sceneObj)
                            if ("elements" != p)
                                scene[p] = sceneObj[p];
                            else
                                for (var nodeMap = {}, elements = sceneObj.elements, m = 0; m < elements.length; m++) {
                                    var elementObj = elements[m],
                                        type = elementObj.elementType,
                                        element;
                                    "Node" == type && (element = new JTopo.Node);
                                    for (var mk in elementObj)
                                        element[mk] = elementObj[mk];
                                    nodeMap[element.text] = element,
                                        scene.add(element)
                                }
                    }
            return stage;
        }

        /**
         * 根据 舞台对象
         * 序列化 舞台、场景、节点元素
         */
        function toJson(a) {
            var b = "backgroundColor,visible,mode,rotate,alpha,scaleX,scaleY,shadow,translateX,translateY,areaSelect,paintAll".split(","),
                c = "text,elementType,x,y,width,height,visible,alpha,rotate,scaleX,scaleY,fillColor,shadow,transformAble,zIndex,dragable,selected,showSelected,font,fontColor,textPosition,textOffsetX,textOffsetY".split(","),
                d = "{";
            d += "frames:" + a.frames,
                d += ", scenes:[";
            for (var e = 0; e < a.childs.length; e++) {
                var f = a.childs[e];
                d += "{",
                    d += getProperties(f, b),
                    d += ", elements:[";
                for (var g = 0; g < f.childs.length; g++) {
                    var h = f.childs[g];
                    g > 0 && (d += ","),
                        d += "{",
                        d += getProperties(h, c),
                        d += "}"
                }
                d += "]}"
            }
            return d += "]", d += "}"
        }

        /**
         * 改变颜色
         * a是临时画布对象canvas只为了获取canvas.getContext("2d")以方便调用HTML5图形处理方法
         * b是目标元素
         * c是第一位颜色rgb数字
         * d是第二位颜色rgb数字
         * e是第三位颜色rgb数字
         */
        function changeColor(a, b, c, d, e) {
            var f = canvas.width = b.width,
                g = canvas.height = b.height;
            a.clearRect(0, 0, canvas.width, canvas.height);     //清除矩形
            a.drawImage(b, 0, 0);                               //将图片b画在 0,0位置
            //以下语句是在根据b元素形状遍历像素进行颜色改变（实际上这个方法下面的genImageAlarm已经告诉我们b是告警图形）
            for (var h = a.getImageData(0, 0, b.width, b.height), i = h.data, j = 0; f > j; j++)
                for (var k = 0; g > k; k++) {
                    var l = 4 * (j + k * f);
                    0 != i[l + 3] && (null != c && (i[l + 0] += c), null != d && (i[l + 1] += d), null != e && (i[l + 2] += e))
                }
            a.putImageData(h, 0, 0, 0, 0, b.width, b.height);   //设置图片数据
            var m = canvas.toDataURL();                         //生成图片url
            return alarmImageCache[b.src] = m, m                //将图片url存储于图片缓存中 并返回图片url
        }

        /**
         * 图片告警
         * a是图片信息对象
         * b是第一位颜色rgb数字
         */
        function genImageAlarm(a, b) {
            null == b && (b = 255);
            try {
                if (alarmImageCache[a.src])
                    return alarmImageCache[a.src];
                var c = new Image;
                c.src = changeColor(graphics, a, b);
                alarmImageCache[a.src] = c;
                return c;
            } catch (d) {
            }

            return null
        }

        /**
         * 相对当前窗口的 位置
         * a为document元素
         */
        function getOffsetPosition(a) {
            if (!a)
                return {
                    left: 0,
                    top: 0
                };
            var b = 0,
                c = 0;
            if ("getBoundingClientRect" in document.documentElement)    //若是一个html5元素（存在getBoundingClientRect）
                var d = a.getBoundingClientRect(),
                    e = a.ownerDocument,
                    f = e.body,
                    g = e.documentElement,
                    h = g.clientTop || f.clientTop || 0,
                    i = g.clientLeft || f.clientLeft || 0,
                    b = d.top + (window.self.pageYOffset || g && g.scrollTop || f.scrollTop) - h,
                    c = d.left + (window.self.pageXOffset || g && g.scrollLeft || f.scrollLeft) - i;
            else
                do
                    b += a.offsetTop || 0,
                        c += a.offsetLeft || 0,
                        a = a.offsetParent;
                while (a);
            return {
                left: c,
                top: b
            }
        }

        /**
         * 将坐标数据转换为连线函数y=b+kx;（k是斜率 x是横坐标 y是纵坐标 b是初始纵坐标）对象
         * a为第一个位置的横坐标
         * b为第一个位置的纵坐标
         * c为第二个位置的横坐标
         * d为第二个位置的纵坐标
         */
        function lineF(a, b, c, d) {
            function e(a) {
                return a * f + g
            }

            var f = (d - b) / (c - a),
                g = b - a * f;
            return e.k = f,
                e.b = g,
                e.x1 = a,
                e.x2 = c,
                e.y1 = b,
                e.y2 = d,
                e
        }

        /**
         * 点a是否是在bc直线线上
         * 若是返回真否则返回假
         */
        function inRange(a, b, c) {
            var d = Math.abs(b - c),
                e = Math.abs(b - a),
                f = Math.abs(c - a),
                g = Math.abs(d - (e + f));
            return 1e-6 > g ? !0 : !1               //1e-6 是表示 1*10的-6次方就是0.000001
        }

        /**
         * 点是否在线上（可以是斜线）
         * a是横坐标
         * b是纵坐标
         * c是线对象
         */
        function isPointInLineSeg(a, b, c) {
            return inRange(a, c.x1, c.x2) && inRange(b, c.y1, c.y2)
        }

        /**
         * 线交叉点计算
         * 若存在交叉计算出交叉坐标并返回否则返回null
         * a是线对象1
         * b是线对象2
         */
        function intersection(a, b) {
            var c, d;
            return a.k == b.k ? null : (1 / 0 == a.k || a.k == -1 / 0 ? (c = a.x1, d = b(a.x1)) : 1 / 0 == b.k || b.k == -1 / 0 ? (c = b.x1, d = a(b.x1)) : (c = (b.b - a.b) / (a.k - b.k), d = a(c)), 0 == isPointInLineSeg(c, d, a) ? null : 0 == isPointInLineSeg(c, d, b) ? null : {
                x: c,
                y: d
            })
        }

        /**
         * 交叉线的绑定
         * a是线对象
         * b是图形元素对象
         * 验证线a与图形b的哪一个位置相交
         * 验证优先级依次是左边线 上边线 右边线 下边线
         * 存在相交点时 返回相交点坐标否则返回null
         */
        function intersectionLineBound(a, b) {
            var c = JTopo.util.lineF(b.left, b.top, b.left, b.bottom),
                d = JTopo.util.intersection(a, c);
            return null == d && (c = JTopo.util.lineF(b.left, b.top, b.right, b.top), d = JTopo.util.intersection(a, c), null == d && (c = JTopo.util.lineF(b.right, b.top, b.right, b.bottom), d = JTopo.util.intersection(a, c), null == d && (c = JTopo.util.lineF(b.left, b.bottom, b.right, b.bottom), d = JTopo.util.intersection(a, c)))),
                d
        }

        /**
         * 响应式动画框架
         * a是执行方法
         * 更新频率时间是 每秒24次（24帧）
         */
        requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (a) {
            setTimeout(a, 1e3 / 24)
        },

            /**
             * 扩展组数对象 del删除方法
             * a是数组元素下标
             */
            Array.prototype.del = function (a) {
                if ("number" != typeof a) {
                    for (var b = 0; b < this.length; b++)
                        if (this[b] === a)
                            return this.slice(0, b).concat(this.slice(b + 1, this.length));
                    return this
                }
                return 0 > a ? this : this.slice(0, a).concat(this.slice(a + 1, this.length))
            },

            /**
             * 扩展组数对象（不存在才扩展，处理兼容性） indexOf获得指定元素数组下标
             * a是数组元素
             * 存在返回下标 否则返回-1
             */
        [].indexOf || (Array.prototype.indexOf = function (a) {
            for (var b = 0; b < this.length; b++)
                if (this[b] === a)
                    return b;
            return -1
        }),

            /**
             * window对象下控制台属性定义（不存在才定义，处理兼容性）
             */
        window.console || (window.console = {
            log: function () {
            },
            info: function () {
            },
            debug: function () {
            },
            warn: function () {
            },
            error: function () {
            }

        });
        var canvas = document.createElement("canvas"),  //临时canvas
            graphics = canvas.getContext("2d"),         //临时canvas的2D上下文信息，便于调用HTML5图形处理方法
            alarmImageCache = {};                       //图片缓存
        //扩展JTopo对象的util属性方法
        JTopo.util = {
            rotatePoint: rotatePoint,
            rotatePoints: rotatePoints,
            getDistance: getDistance,
            getEventPosition: getEventPosition,
            mouseCoords: mouseCoords,
            MessageBus: MessageBus,
            isFirefox: navigator.userAgent.indexOf("Firefox") > 0,
            isIE: !(!window.attachEvent || -1 !== navigator.userAgent.indexOf("Opera")),
            isChrome: null != navigator.userAgent.toLowerCase().match(/chrome/),
            clone: clone,
            isPointInRect: isPointInRect,
            isPointInLine: isPointInLine,
            removeFromArray: removeFromArray,
            cloneEvent: cloneEvent,
            randomColor: randomColor,
            isIntsect: isIntsect,
            toJson: toJson,
            loadStageFromJson: loadStageFromJson,
            getElementsBound: getElementsBound,
            genImageAlarm: genImageAlarm,
            getOffsetPosition: getOffsetPosition,
            lineF: lineF,
            intersection: intersection,
            intersectionLineBound: intersectionLineBound
        },
            //将递归遍历方法保存在window上
            window.$for = $for,
            window.$foreach = $foreach
    }(JTopo),
    /**
     * JTopo 对stage、鹰眼进行定义扩展
     */
    function (a) {
        //方法b是定义eagleEye鹰眼对象 参数a是Jtopo对象
        function b(a) {
            return {
                hgap: 16,
                visible: !1,                                                //可见性 默认 false
                exportCanvas: document.createElement("canvas"),             //导出时使用的临时canvas对象
                getImage: function (b, c) {                                 //将当前显示的信息使用exportCanvas将其转换成图片然后导出 返回值是url
                    var d = a.getBound(),
                        e = 1,
                        f = 1;
                    this.exportCanvas.width = a.canvas.width,
                        this.exportCanvas.height = a.canvas.height,
                        null != b && null != c ? (this.exportCanvas.width = b, this.exportCanvas.height = c, e = b / d.width, f = c / d.height) : (d.width > a.canvas.width && (this.exportCanvas.width = d.width), d.height > a.canvas.height && (this.exportCanvas.height = d.height));
                    var g = this.exportCanvas.getContext("2d");
                    return a.childs.length > 0 && (g.save(), g.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height), a.childs.forEach(function (a) {
                        1 == a.visible && (a.save(), a.translateX = 0, a.translateY = 0, a.scaleX = 1, a.scaleY = 1, g.scale(e, f), d.left < 0 && (a.translateX = Math.abs(d.left)), d.top < 0 && (a.translateY = Math.abs(d.top)), a.paintAll = !0, a.repaint(g), a.paintAll = !1, a.restore())
                    }), g.restore()), this.exportCanvas.toDataURL("image/png")
                },
                canvas: document.createElement("canvas"),                   //鹰眼canvas对象
                update: function () {                                       //更新鹰眼数据
                    this.eagleImageDatas = this.getData(a)
                },
                setSize: function (a, b) {                                  //设置临时canvas对象的宽高
                    this.width = this.canvas.width = a,
                        this.height = this.canvas.height = b
                },
                getData: function (b, c) {                                  //获得指定大小（b是宽度c是高度）图片数据 通过鹰眼canvas对象缩放返回图片
                    function d(a) {                                         //获得图形的偏移量（修正后） a是Jtopo的实例对象
                        var b = a.stage.canvas.width,
                            c = a.stage.canvas.height,
                            d = b / a.scaleX / 2,
                            e = c / a.scaleY / 2;
                        return {
                            translateX: a.translateX + d - d * a.scaleX,
                            translateY: a.translateY + e - e * a.scaleY
                        }
                    }

                    //以下代码是指定大小
                    null != j && null != k ? this.setSize(b, c) : this.setSize(200, 160);
                    //重绘鹰眼图片
                    var e = this.canvas.getContext("2d");
                    if (a.childs.length > 0) {
                        e.save(),
                            e.clearRect(0, 0, this.canvas.width, this.canvas.height),
                            a.childs.forEach(function (a) {
                                1 == a.visible && (a.save(), a.centerAndZoom(null, null, e), a.repaint(e), a.restore())
                            });
                        var f = d(a.childs[0]),
                            g = f.translateX * (this.canvas.width / a.canvas.width) * a.childs[0].scaleX,
                            h = f.translateY * (this.canvas.height / a.canvas.height) * a.childs[0].scaleY,
                            i = a.getBound(),
                            j = a.canvas.width / a.childs[0].scaleX / i.width,
                            k = a.canvas.height / a.childs[0].scaleY / i.height;
                        j > 1 && (j = 1),
                        k > 1 && (j = 1),
                            g *= j,
                            h *= k,
                        i.left < 0 && (g -= Math.abs(i.left) * (this.width / i.width)),
                        i.top < 0 && (h -= Math.abs(i.top) * (this.height / i.height)),
                            e.save(),
                            e.lineWidth = 1,
                            e.strokeStyle = "rgba(255,0,0,1)",
                            e.strokeRect(-g, -h, e.canvas.width * j, e.canvas.height * k),
                            e.restore();
                        var l = null;
                        try {
                            l = e.getImageData(0, 0, e.canvas.width, e.canvas.height)
                        } catch (m) {
                        }

                        return l
                    }
                    return null
                },
                paint: function () {                                        //绘制鹰眼图片
                    if (null != this.eagleImageDatas) {
                        var b = a.graphics;
                        b.save(),
                            b.fillStyle = "rgba(211,211,211,0.3)",
                            b.fillRect(a.canvas.width - this.canvas.width - 2 * this.hgap, a.canvas.height - this.canvas.height - 1, a.canvas.width - this.canvas.width, this.canvas.height + 1),
                            b.fill(),
                            b.save(),
                            b.lineWidth = 1,
                            b.strokeStyle = "rgba(0,0,0,1)",
                            b.rect(a.canvas.width - this.canvas.width - 2 * this.hgap, a.canvas.height - this.canvas.height - 1, a.canvas.width - this.canvas.width, this.canvas.height + 1),
                            b.stroke(),
                            b.restore(),
                            b.putImageData(this.eagleImageDatas, a.canvas.width - this.canvas.width - this.hgap, a.canvas.height - this.canvas.height),
                            b.restore()
                    } else
                        this.eagleImageDatas = this.getData(a)
                },
                eventHandler: function (a, b, c) {                          //事件动态绑定句柄 a是事件名称,b是位置对象,c是Jtopo实例对象
                    var d = b.x,
                        e = b.y;
                    if (d > c.canvas.width - this.canvas.width && e > c.canvas.height - this.canvas.height) {
                        if (d = b.x - this.canvas.width, e = b.y - this.canvas.height, "mousedown" == a && (this.lastTranslateX = c.childs[0].translateX, this.lastTranslateY = c.childs[0].translateY), "mousedrag" == a && c.childs.length > 0) {
                            var f = b.dx,
                                g = b.dy,
                                h = c.getBound(),
                                i = this.canvas.width / c.childs[0].scaleX / h.width,
                                j = this.canvas.height / c.childs[0].scaleY / h.height;
                            c.childs[0].translateX = this.lastTranslateX - f / i, c.childs[0].translateY = this.lastTranslateY - g / j
                        }
                    } else ;
                }
            }
        }

        //方法c是定义Jtopo的Stage舞台对象 参数c是Jtopo对象
        function c(c) {
            /**
             * Stage的相对坐标
             * b是Stage的实例
             */
            function d(b) {
                var c = a.util.getEventPosition(b),
                    d = a.util.getOffsetPosition(n.canvas);
                return c.offsetLeft = c.pageX - d.left,
                    c.offsetTop = c.pageY - d.top,
                    c.x = c.offsetLeft,
                    c.y = c.offsetTop,
                    c.target = null, c
            }

            /**
             * 为Stage a添加mouseover事件处理
             */
            function e(a) {
                document.onselectstart = function () {
                    return !1
                },
                    this.mouseOver = !0;
                var b = d(a);
                n.dispatchEventToScenes("mouseover", b),
                    n.dispatchEvent("mouseover", b)
            }

            /**
             * 为Stage a添加mouseout事件处理
             */
            function f(a) {
                p = setTimeout(function () {
                    o = !0
                }, 500),
                    document.onselectstart = function () {
                        return !0
                    };
                var b = d(a);
                n.dispatchEventToScenes("mouseout", b),
                    n.dispatchEvent("mouseout", b),
                    n.needRepaint = 0 == n.animate ? !1 : !0
            }

            /**
             * 为Stage a添加mousedown事件处理
             */
            function g(a) {
                var b = d(a);
                n.mouseDown = !0,
                    n.mouseDownX = b.x,
                    n.mouseDownY = b.y,
                    n.dispatchEventToScenes("mousedown", b),
                    n.dispatchEvent("mousedown", b)
            }

            /**
             * 为Stage a添加mouseup事件处理
             */
            function h(a) {
                var b = d(a);
                n.dispatchEventToScenes("mouseup", b),
                    n.dispatchEvent("mouseup", b),
                    n.mouseDown = !1,
                    n.needRepaint = 0 == n.animate ? !1 : !0
            }

            /**
             * 为Stage a添加mousedrag事件处理
             */
            function i(a) {
                p && (window.clearTimeout(p), p = null),
                    o = !1;
                var b = d(a);
                n.mouseDown ? 0 == a.button && (b.dx = b.x - n.mouseDownX, b.dy = b.y - n.mouseDownY, n.dispatchEventToScenes("mousedrag", b), n.dispatchEvent("mousedrag", b), 1 == n.eagleEye.visible && n.eagleEye.update()) : (n.dispatchEventToScenes("mousemove", b), n.dispatchEvent("mousemove", b))
            }

            /**
             * 为Stage a添加click事件处理
             */
            function j(a) {
                var b = d(a);
                n.dispatchEventToScenes("click", b),
                    n.dispatchEvent("click", b)
            }

            /**
             * 为Stage a添加dbclick事件处理
             */
            function k(a) {
                var b = d(a);
                n.dispatchEventToScenes("dbclick", b),
                    n.dispatchEvent("dbclick", b)
            }

            /**
             * 为Stage a添加mousewheel事件处理
             */
            function l(a) {
                var b = d(a);
                n.dispatchEventToScenes("mousewheel", b),
                    n.dispatchEvent("mousewheel", b),
                null != n.wheelZoom && (a.preventDefault ? a.preventDefault() : (a = a || window.event, a.returnValue = !1), 1 == n.eagleEye.visible && n.eagleEye.update())
            }

            /**
             * 当浏览器为IE或者不存在addEventListener属性在window上时
             * 重新赋值Stage b的事件处理
             * 当浏览器为IE且addEventListener存在时添加键盘按键事件（大键盘的↑、↓、←、→按键）处理
             */
            function m(b) {
                a.util.isIE || !window.addEventListener ? (b.onmouseout = f, b.onmouseover = e, b.onmousedown = g, b.onmouseup = h, b.onmousemove = i, b.onclick = j, b.ondblclick = k, b.onmousewheel = l, b.touchstart = g, b.touchmove = i, b.touchend = h) : (b.addEventListener("mouseout", f), b.addEventListener("mouseover", e), b.addEventListener("mousedown", g), b.addEventListener("mouseup", h), b.addEventListener("mousemove", i), b.addEventListener("click", j), b.addEventListener("dblclick", k), a.util.isFirefox ? b.addEventListener("DOMMouseScroll", l) : b.addEventListener("mousewheel", l)),
                window.addEventListener && (window.addEventListener("keydown", function (b) {
                    n.dispatchEventToScenes("keydown", a.util.cloneEvent(b));
                    var c = b.keyCode;
                    (37 == c || 38 == c || 39 == c || 40 == c) && (b.preventDefault ? b.preventDefault() : (b = b || window.event, b.returnValue = !1))
                }, !0),
                    window.addEventListener("keyup", function (b) {
                        n.dispatchEventToScenes("keyup", a.util.cloneEvent(b));
                        var c = b.keyCode;
                        (37 == c || 38 == c || 39 == c || 40 == c) && (b.preventDefault ? b.preventDefault() : (b = b || window.event, b.returnValue = !1))
                    }, !0))
            }

            /*
             调整 这里必须注释了，否则他将会给window对象中的JTopo全局变量，赋值不一定总是正确的stage
             多个canvas在同一页面情况下页面中最后一个stage将覆盖掉前面的stage
             因此a.stage应该是一个数组或者对象 识别中的stage应该使用id或者根据绑定的canvas进行筛选
             */
            //a.stage = this; //原码
            var n = this;
            /**
             * Stage 初始化
             */
            this.initialize = function (c) {
                m(c),
                    this.canvas = c,
                    this.graphics = c.getContext("2d"),
                    this.childs = [],
                    this.frames = 24,
                    this.messageBus = new a.util.MessageBus,
                    this.eagleEye = b(this),
                    this.wheelZoom = null,
                    this.mouseDownX = 0,
                    this.mouseDownY = 0,
                    this.mouseDown = !1,
                    this.mouseOver = !1,
                    this.needRepaint = !0,
                    this.serializedProperties = ["frames", "wheelZoom"]
            },
            null != c && this.initialize(c);
            /*调整 将stage加入全局缓存中,摒弃原来上面所使用的a.stage = this*/
            this.canvas.id = (this.canvas.id && "" != this.canvas.id && null != this.canvas.id) ? this.canvas.id : "" + Math.ceil(Math.random() * (new Date).getTime());
            if (undefined == a.stage || null == a.stage) a.stage = {};
            a.stage[this.canvas.id] = this;

            var o = !0, p = null;
            document.oncontextmenu = function () {
                return o
            },
                /**
                 * 为场景对象 动态调用一个名称为a参数为b的事件
                 */
                this.dispatchEventToScenes = function (a, b) {
                    if (0 != this.frames && (this.needRepaint = !0), 1 == this.eagleEye.visible && -1 != a.indexOf("mouse")) {
                        var c = b.x,
                            d = b.y;
                        if (c > this.width - this.eagleEye.width && d > this.height - this.eagleEye.height)
                            return void this.eagleEye.eventHandler(a, b, this)
                    }
                    this.childs.forEach(function (c) {
                        if (1 == c.visible) {
                            var d = c[a + "Handler"];
                            if (null == d)
                                throw new Error("Function not found:" + a + "Handler");
                            d.call(c, b)
                        }
                    })
                },
                /**
                 *  添加对象（存在则不添加）
                 *  a为目标对象（场景）
                 */
                this.add = function (a) {
                    for (var b = 0; b < this.childs.length; b++)
                        if (this.childs[b] === a)
                            return;
                    a.addTo(this),
                        this.childs.push(a)
                },
                /**
                 *  移除指定对象
                 *  a为指定对象（场景）
                 */
                this.remove = function (a) {
                    if (null == a)
                        throw new Error("Stage.remove出错: 参数为null!");
                    for (var b = 0; b < this.childs.length; b++)
                        if (this.childs[b] === a)
                            return a.stage = null, this.childs = this.childs.del(b), this;
                    return this
                },
                /**
                 *  清除所有子对象（场景）
                 */
                this.clear = function () {
                    this.childs = []
                },
                /**
                 *  增加事件监听
                 *  向方法存储管理器注册一个键为a值为b的方法（b是方法）
                 */
                this.addEventListener = function (a, b) {
                    var c = this,
                        d = function (a) {
                            b.call(c, a)
                        };
                    return this.messageBus.subscribe(a, d),
                        this
                },
                /**
                 *  移除事件监听
                 *  向方法存储管理器移除一个键为a的方法
                 */
                this.removeEventListener = function (a) {
                    this.messageBus.unsubscribe(a)
                },
                /**
                 *  清除所有方法存储管理器中事件
                 */
                this.removeAllEventListener = function () {
                    this.messageBus = new a.util.MessageBus
                },
                /**
                 *  动态顺序调用键为a参数为b的公开方法
                 */
                this.dispatchEvent = function (a, b) {
                    return this.messageBus.publish(a, b), this
                };
            /**
             *  如果当前jtopo对象存在事件列表中的某个事件
             *  则注册到方法存储管理器中
             *  否则公共调方法直接调用
             */
            var q = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(","),
                r = this;
            q.forEach(function (a) {
                r[a] = function (b) {
                    null != b ? this.addEventListener(a, b) : this.dispatchEvent(a)
                }
            }),
                /**
                 *  保存一个图片
                 *  将图片放在新窗口的 document元素中
                 */
                this.saveImageInfo = function (a, b) {
                    var c = this.eagleEye.getImage(a, b),
                        d = window.open("about:blank");
                    return d.document.write("<img src='" + c + "' alt='from canvas'/>"),
                        this
                },
                /**
                 *  保存一个图片
                 *  并进行本地跳转
                 */
                this.saveAsLocalImage = function (a, b) {
                    var c = this.eagleEye.getImage(a, b);
                    return c.replace("image/png", "image/octet-stream"),
                        window.location.href = c,
                        this
                },
                /**
                 *  绘制图形
                 */
                this.paint = function () {
                    null != this.canvas && (this.graphics.save(), this.graphics.clearRect(0, 0, this.width, this.height), this.childs.forEach(function (a) {
                        1 == a.visible && a.repaint(n.graphics)
                    }), 1 == this.eagleEye.visible && this.eagleEye.paint(this), this.graphics.restore())
                },
                /**
                 *  重新绘制图形
                 */
                this.repaint = function () {
                    0 != this.frames && (this.frames < 0 && 0 == this.needRepaint || (this.paint(), this.frames < 0 && (this.needRepaint = !1)))
                },
                /**
                 *  鹰眼摄像头缩放
                 */
                this.zoom = function (a) {
                    this.childs.forEach(function (b) {
                        0 != b.visible && b.zoom(a)
                    })
                },
                /**
                 *  鹰眼摄像头放大
                 */
                this.zoomOut = function (a) {
                    this.childs.forEach(function (b) {
                        0 != b.visible && b.zoomOut(a)
                    })
                },
                /**
                 *  鹰眼摄像头缩小
                 */
                this.zoomIn = function (a) {
                    this.childs.forEach(function (b) {
                        0 != b.visible && b.zoomIn(a)
                    })
                },
                /**
                 *  鹰眼摄像头居中
                 */
                this.centerAndZoom = function () {
                    this.childs.forEach(function (a) {
                        0 != a.visible && a.centerAndZoom()
                    })
                },
                /**
                 *  鹰眼摄像头居中
                 */
                this.setCenter = function (a, b) {
                    var c = this;
                    this.childs.forEach(function (d) {
                        var e = a - c.canvas.width / 2,
                            f = b - c.canvas.height / 2;
                        d.translateX = -e, d.translateY = -f
                    })
                },
                /**
                 *  获得Stage舞台大小
                 */
                this.getBound = function () {
                    var a = {
                        left: Number.MAX_VALUE,
                        right: Number.MIN_VALUE,
                        top: Number.MAX_VALUE,
                        bottom: Number.MIN_VALUE
                    };
                    return this.childs.forEach(function (b) {
                        var c = b.getElementsBound();
                        c.left < a.left && (a.left = c.left, a.leftNode = c.leftNode),
                        c.top < a.top && (a.top = c.top, a.topNode = c.topNode),
                        c.right > a.right && (a.right = c.right, a.rightNode = c.rightNode),
                        c.bottom > a.bottom && (a.bottom = c.bottom, a.bottomNode = c.bottomNode)
                    }),
                        a.width = a.right - a.left,
                        a.height = a.bottom - a.top, a
                },
                /**
                 *  Stage舞台对象序列化
                 */
                this.toJson = function () {
                    {
                        var b = this,
                            c = '{"version":"' + a.version + '",';
                        this.serializedProperties.length
                    }
                    return this.serializedProperties.forEach(function (a) {
                        var d = b[a];
                        "string" == typeof d && (d = '"' + d + '"'),
                            c += '"' + a + '":' + d + ","
                    }),
                        c += '"childs":[',
                        this.childs.forEach(function (a) {
                            c += a.toJson()
                        }),
                        c += "]", c += "}"
                },
                /**
                 *  无线递归调用绘图 重绘频率为 每秒 n.frames帧
                 */
                function () {
                    0 == n.frames ? setTimeout(arguments.callee, 100) : n.frames < 0 ? (n.repaint(), setTimeout(arguments.callee, 1e3 / -n.frames)) : (n.repaint(), setTimeout(arguments.callee, 1e3 / n.frames))
                }(),
                /**
                 *  鼠标滚轮事件处理
                 *  异步延迟300毫秒执行
                 */
                setTimeout(function () {
                    n.mousewheel(function (a) {
                        var b = null == a.wheelDelta ? a.detail : a.wheelDelta;
                        null != this.wheelZoom && (b > 0 ? this.zoomIn(this.wheelZoom) : this.zoomOut(this.wheelZoom))
                    }), n.paint()
                }, 300),
                /**
                 *  首次执行绘制图形
                 *  异步延迟1秒执行
                 */
                setTimeout(function () {
                    n.paint()
                }, 1e3)
            /**
             *  执行绘制图形
             *  异步延迟3秒执行
             *  上面都已经初始执行一次了这里又延迟3秒在执行不知道有什么用途
             */
            setTimeout(function () {
                n.paint()
            }, 3e3)
        };

        /**
         *  舞台对象属性扩展
         */
        c.prototype = {
            get width() {
                return this.canvas.width
            },
            get height() {
                return this.canvas.height
            },
            set cursor(a) {
                this.canvas.style.cursor = a
            },
            get cursor() {
                return this.canvas.style.cursor
            },
            set mode(a) {
                this.childs.forEach(function (b) {
                    b.mode = a
                })
            }
        },
            a.Stage = c
    }(JTopo),
    /**
     * JTopo 对scene进行定义扩展
     */
    function (a) {
        //针对JTopo对象中的scene的定义 参数c是stage对象
        function b(c) {
            function d(a, b, c, d) {
                return function (e) {
                    e.beginPath(),
                        e.strokeStyle = "rgba(0,0,236,0.5)",
                        e.fillStyle = "rgba(0,0,236,0.1)",
                        e.rect(a, b, c, d),
                        e.fill(),
                        e.stroke(),
                        e.closePath()
                }
            }

            var e = this;
            /**
             * JTopo对象中的scene的初始化
             */
            this.initialize = function () {
                b.prototype.initialize.apply(this, arguments),
                    this.messageBus = new a.util.MessageBus,
                    this.elementType = "scene",
                    this.childs = [],
                    this.zIndexMap = {},
                    this.zIndexArray = [],
                    this.backgroundColor = "255,255,255",
                    this.visible = !0,
                    this.alpha = 0,
                    this.scaleX = 1,
                    this.scaleY = 1,
                    this.mode = a.SceneMode.normal,
                    this.translate = !0,
                    this.translateX = 0,
                    this.translateY = 0,
                    this.lastTranslateX = 0,
                    this.lastTranslateY = 0,
                    this.mouseDown = !1,
                    this.mouseDownX = null,
                    this.mouseDownY = null,
                    this.mouseDownEvent = null,
                    this.areaSelect = !0,
                    this.operations = [],
                    this.selectedElements = [],
                    this.paintAll = !1;
                var c = "background,backgroundColor,mode,paintAll,areaSelect,translate,translateX,translateY,lastTranslatedX,lastTranslatedY,alpha,visible,scaleX,scaleY".split(",");
                this.serializedProperties = this.serializedProperties.concat(c)
            },
                this.initialize(),
                /**
                 * scene的实例背景颜色设置
                 */
                this.setBackground = function (a) {
                    this.background = a
                },
                /**
                 * scene的实例加入到新的舞台对象中
                 */
                this.addTo = function (a) {
                    this.stage !== a && null != a && (this.stage = a)
                },
                //若舞台参数存在 则将实例场景关联到 场景c上
            null != c && (c.add(this), this.addTo(c)),
                /**
                 * scene场景显示可见
                 */
                this.show = function () {
                    this.visible = !0
                },
                /**
                 * scene场景影藏不可见
                 */
                this.hide = function () {
                    this.visible = !1
                },
                /**
                 * 绘制scene场景
                 * a是Html5画布2d上下文基础对象
                 */
                this.paint = function (a) {
                    if (0 != this.visible && null != this.stage) {
                        if (a.save(), this.paintBackgroud(a), a.restore(), a.save(), a.scale(this.scaleX, this.scaleY), 1 == this.translate) {
                            var b = this.getOffsetTranslate(a);
                            a.translate(b.translateX, b.translateY)
                        }
                        this.paintChilds(a),
                            a.restore(),
                            a.save(),
                            this.paintOperations(a, this.operations),
                            a.restore()
                    }
                },
                /**
                 * 重新绘制scene场景
                 * a是Html5画布2d上下文基础对象
                 */
                this.repaint = function (a) {
                    0 != this.visible && this.paint(a)
                },
                /**
                 * scene场景的背景绘制
                 * a是Html5画布2d上下文基础对象
                 */
                this.paintBackgroud = function (a) {
                    null != this.background ? a.drawImage(this.background, 0, 0, a.canvas.width, a.canvas.height) : (a.beginPath(), a.fillStyle = "rgba(" + this.backgroundColor + "," + this.alpha + ")", a.fillRect(0, 0, a.canvas.width, a.canvas.height), a.closePath())
                },
                /**
                 * 获取scene场景中可见并绘制出来的元素
                 */
                this.getDisplayedElements = function () {
                    for (var a = [], b = 0; b < this.zIndexArray.length; b++)
                        for (var c = this.zIndexArray[b], d = this.zIndexMap[c], e = 0; e < d.length; e++) {
                            var f = d[e];
                            this.isVisiable(f) && a.push(f)
                        }
                    return a
                },
                /**
                 * 获取scene场景中可见并绘制出来的元素
                 */
                this.getDisplayedNodes = function () {
                    for (var b = [], c = 0; c < this.childs.length; c++) {
                        var d = this.childs[c];
                        d instanceof a.Node && this.isVisiable(d) && b.push(d)
                    }
                    return b
                },
                /**
                 * 绘制scene场景中子元素
                 * b是Html5画布2d上下文基础对象
                 */
                this.paintChilds = function (b) {
                    for (var c = 0; c < this.zIndexArray.length; c++)
                        for (var d = this.zIndexArray[c], e = this.zIndexMap[d], f = 0; f < e.length; f++) {
                            var g = e[f];
                            if (1 == this.paintAll || this.isVisiable(g)) {
                                if (b.save(), 1 == g.transformAble) {
                                    var h = g.getCenterLocation();
                                    b.translate(h.x, h.y),
                                    g.rotate && b.rotate(g.rotate),
                                        g.scaleX && g.scaleY ? b.scale(g.scaleX, g.scaleY) : g.scaleX ? b.scale(g.scaleX, 1) : g.scaleY && b.scale(1, g.scaleY)
                                }
                                1 == g.shadow && (b.shadowBlur = g.shadowBlur, b.shadowColor = g.shadowColor, b.shadowOffsetX = g.shadowOffsetX, b.shadowOffsetY = g.shadowOffsetY),
                                g instanceof a.InteractiveElement && (g.selected && 1 == g.showSelected && g.paintSelected(b), 1 == g.isMouseOver && g.paintMouseover(b)),
                                    g.paint(b),
                                    b.restore()
                            }
                        }
                },
                /**
                 * 获得scene场景偏移量
                 * a是Html5画布2d上下文基础对象
                 */
                this.getOffsetTranslate = function (a) {
                    var b = this.stage.canvas.width,
                        c = this.stage.canvas.height;
                    null != a && "move" != a && (b = a.canvas.width, c = a.canvas.height);
                    var d = b / this.scaleX / 2,
                        e = c / this.scaleY / 2,
                        f = {
                            translateX: this.translateX + (d - d * this.scaleX),
                            translateY: this.translateY + (e - e * this.scaleY)
                        };
                    return f
                },
                /**
                 * 获得scene场景下某元素是否可见
                 * b是scene场景下某元素
                 */
                this.isVisiable = function (b) {
                    if (1 != b.visible)
                        return !1;
                    if (b instanceof a.Link)
                        return !0;
                    var c = this.getOffsetTranslate(),
                        d = b.x + c.translateX,
                        e = b.y + c.translateY;
                    d *= this.scaleX,
                        e *= this.scaleY;
                    var f = d + b.width * this.scaleX,
                        g = e + b.height * this.scaleY;
                    return d > this.stage.canvas.width || e > this.stage.canvas.height || 0 > f || 0 > g ? !1 : !0
                },
                /**
                 * scene场景下元素绘制
                 * b是scene场景下元素的绘制方法集合
                 */
                this.paintOperations = function (a, b) {
                    for (var c = 0; c < b.length; c++)
                        b[c](a)
                },
                /**
                 * scene场景找到符合条件的子元素
                 * a是loop每次执行的判断方法
                 */
                this.findElements = function (a) {
                    for (var b = [], c = 0; c < this.childs.length; c++)
                        1 == a(this.childs[c]) && b.push(this.childs[c]);
                    return b
                },
                /**
                 * scene场景找到符合类型的元素
                 * a是元素类型
                 */
                this.getElementsByClass = function (a) {
                    return this.findElements(function (b) {
                        return b instanceof a
                    })
                },
                /**
                 * scene场景加入一个操作
                 * a是操作方法
                 */
                this.addOperation = function (a) {
                    return this.operations.push(a),
                        this
                },
                /**
                 * scene场景重置操作方法集合
                 */
                this.clearOperations = function () {
                    return this.operations = [],
                        this
                },
                /**
                 * 根据坐标获得scene场景内的可见元素（最高层级的）
                 */
                this.getElementByXY = function (b, c) {
                    for (var d = null, e = this.zIndexArray.length - 1; e >= 0; e--)
                        for (var f = this.zIndexArray[e], g = this.zIndexMap[f], h = g.length - 1; h >= 0; h--) {
                            var i = g[h];
                            if (i instanceof a.InteractiveElement && this.isVisiable(i) && i.isInBound(b, c))
                                return d = i
                        }
                    return d
                },
                /**
                 * 向scene场景内添加一个子元素
                 */
                this.add = function (a) {
                    this.childs.push(a),
                    null == this.zIndexMap[a.zIndex] && (this.zIndexMap[a.zIndex] = [], this.zIndexArray.push(a.zIndex), this.zIndexArray.sort(function (a, b) {
                        return a - b
                    })),
                        this.zIndexMap["" + a.zIndex].push(a)
                },
                /**
                 * 在scene场景内移除一个子元素
                 */
                this.remove = function (b) {
                    this.childs = a.util.removeFromArray(this.childs, b);
                    var c = this.zIndexMap[b.zIndex];
                    c && (this.zIndexMap[b.zIndex] = a.util.removeFromArray(c, b)),
                        b.removeHandler(this)
                },
                /**
                 * 清除scene场景内的所有元素
                 */
                this.clear = function () {
                    var a = this;
                    this.childs.forEach(function (b) {
                        b.removeHandler(a)
                    }),
                        this.childs = [],
                        this.operations = [],
                        this.zIndexArray = [],
                        this.zIndexMap = {}

                },
                /**
                 * scene场景内元素a加入选中元素数组（缓存）
                 */
                this.addToSelected = function (a) {
                    this.selectedElements.push(a)
                },
                /**
                 * scene场景内取消选择元素a 并重置选中元素数组（缓存）
                 */
                this.cancleAllSelected = function (a) {
                    for (var b = 0; b < this.selectedElements.length; b++)
                        this.selectedElements[b].unselectedHandler(a);
                    this.selectedElements = []
                },
                /**
                 * scene场景内验证元素a是否被选中
                 */
                this.notInSelectedNodes = function (a) {
                    for (var b = 0; b < this.selectedElements.length; b++)
                        if (a === this.selectedElements[b])
                            return !1;
                    return !0
                },
                /**
                 * scene场景内选中元素数组（缓存）移除元素a
                 */
                this.removeFromSelected = function (a) {
                    for (var b = 0; b < this.selectedElements.length; b++) {
                        var c = this.selectedElements[b];
                        a === c && (this.selectedElements = this.selectedElements.del(b))
                    }
                },
                /**
                 * scene场景在事件调用时获得触发对象（封装坐标修正、目标替换）
                 */
                this.toSceneEvent = function (b) {
                    var c = a.util.clone(b);
                    if (c.x /= this.scaleX, c.y /= this.scaleY, 1 == this.translate) {
                        var d = this.getOffsetTranslate();
                        c.x -= d.translateX,
                            c.y -= d.translateY
                    }
                    return null != c.dx && (c.dx /= this.scaleX, c.dy /= this.scaleY),
                    null != this.currentElement && (c.target = this.currentElement),
                        c.scene = this, c
                },
                /**
                 * scene场景内选择一个元素a
                 */
                this.selectElement = function (a) {
                    var b = e.getElementByXY(a.x, a.y);
                    if (null != b)
                        if (a.target = b, b.mousedownHander(a), b.selectedHandler(a), e.notInSelectedNodes(b))
                            a.ctrlKey || e.cancleAllSelected(), e.addToSelected(b);
                        else {
                            1 == a.ctrlKey && (b.unselectedHandler(), this.removeFromSelected(b));
                            for (var c = 0; c < this.selectedElements.length; c++) {
                                var d = this.selectedElements[c];
                                d.selectedHandler(a)
                            }
                        }
                    else
                        a.ctrlKey || e.cancleAllSelected();
                    this.currentElement = b
                },
                /**
                 * scene场景鼠标按下处理句柄
                 * 参数b为子元素
                 */
                this.mousedownHandler = function (b) {
                    var c = this.toSceneEvent(b);
                    //触发属性重新赋值，若SceneMode（场景类型）值为normal
                    if (this.mouseDown = !0, this.mouseDownX = c.x, this.mouseDownY = c.y, this.mouseDownEvent = c, this.mode == a.SceneMode.normal)
                        this.selectElement(c), (null == this.currentElement || this.currentElement instanceof a.Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY);
                    else {
                        //若SceneMode（场景类型）值为drag 并且允许移动 赋值偏移量
                        if (this.mode == a.SceneMode.drag && 1 == this.translate) {
                            return this.lastTranslateX = this.translateX, void(this.lastTranslateY = this.translateY);
                        }
                        //若SceneMode（场景类型）值为select 只进行选择元素行为，值为edit进行同normal的处理
                        this.mode == a.SceneMode.select ? this.selectElement(c) : this.mode == a.SceneMode.edit && (this.selectElement(c), (null == this.currentElement || this.currentElement instanceof a.Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY))
                    }
                    e.dispatchEvent("mousedown", c)
                },
                /**
                 * scene场景鼠标松开处理句柄
                 * 参数b为子元素
                 */
                this.mouseupHandler = function (b) {
                    //取消鼠标按下样式 使用默认样式
                    this.stage.cursor != a.MouseCursor.normal && (this.stage.cursor = a.MouseCursor.normal),
                        //清空所有操作
                        e.clearOperations();
                    var c = this.toSceneEvent(b);
                    //递归逐层冒泡调用
                    null != this.currentElement && (c.target = e.currentElement, this.currentElement.mouseupHandler(c)),
                        //使用公共方法调用mouseup
                        this.dispatchEvent("mouseup", c),
                        //设置按下状态为 假
                        this.mouseDown = !1
                },
                /**
                 * scene场景拖拽元素（会将所有被选中的元素进行同样拖拽处理）
                 * 参数b为子元素
                 */
                this.dragElements = function (b) {
                    if (null != this.currentElement && 1 == this.currentElement.dragable)
                        for (var c = 0; c < this.selectedElements.length; c++) {
                            var d = this.selectedElements[c];
                            if (0 != d.dragable) {
                                var e = a.util.clone(b);
                                e.target = d, d.mousedragHandler(e)
                            }
                        }
                },
                /**
                 * scene场景拖拽元素（会将所有被选中的元素进行同样拖拽处理）
                 * 参数b为子元素
                 */
                this.mousedragHandler = function (b) {
                    var c = this.toSceneEvent(b);
                    this.mode == a.SceneMode.normal ?
                        null == this.currentElement || this.currentElement instanceof a.Link ? 1 == this.translate && (this.stage.cursor = a.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.dragElements(c) : this.mode == a.SceneMode.drag ? 1 == this.translate && (this.stage.cursor = a.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.mode == a.SceneMode.select ? null != this.currentElement ? 1 == this.currentElement.dragable && this.dragElements(c) : 1 == this.areaSelect && this.areaSelectHandle(c) : this.mode == a.SceneMode.edit && (null == this.currentElement || this.currentElement instanceof a.Link ? 1 == this.translate && (this.stage.cursor = a.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.dragElements(c)),
                        this.dispatchEvent("mousedrag", c)
                },
                /**
                 * scene场景拖拽区域框选元素
                 */
                this.areaSelectHandle = function (a) {
                    var b = a.offsetLeft,
                        c = a.offsetTop,
                        f = this.mouseDownEvent.offsetLeft,
                        g = this.mouseDownEvent.offsetTop,
                        h = b >= f ? f : b,
                        i = c >= g ? g : c,
                        j = Math.abs(a.dx) * this.scaleX,
                        k = Math.abs(a.dy) * this.scaleY,
                        l = new d(h, i, j, k);
                    e.clearOperations().addOperation(l),
                        b = a.x,
                        c = a.y,
                        f = this.mouseDownEvent.x,
                        g = this.mouseDownEvent.y,
                        h = b >= f ? f : b,
                        i = c >= g ? g : c,
                        j = Math.abs(a.dx),
                        k = Math.abs(a.dy);
                    for (var m = h + j, n = i + k, o = 0; o < e.childs.length; o++) {
                        var p = e.childs[o];
                        p.x > h && p.x + p.width < m && p.y > i && p.y + p.height < n && e.notInSelectedNodes(p) && (p.selectedHandler(a), e.addToSelected(p))
                    }
                },
                this.mousemoveHandler = function (b) {
                    this.mousecoord = {
                        x: b.x,
                        y: b.y
                    };
                    var c = this.toSceneEvent(b);
                    if (this.mode == a.SceneMode.drag)
                        return void(this.stage.cursor = a.MouseCursor.open_hand);
                    this.mode == a.SceneMode.normal ? this.stage.cursor = a.MouseCursor.normal : this.mode == a.SceneMode.select && (this.stage.cursor = a.MouseCursor.normal);
                    var d = e.getElementByXY(c.x, c.y);
                    null != d ? (e.mouseOverelement && e.mouseOverelement !== d && (c.target = d, e.mouseOverelement.mouseoutHandler(c)), e.mouseOverelement = d, 0 == d.isMouseOver ? (c.target = d, d.mouseoverHandler(c), e.dispatchEvent("mouseover", c)) : (c.target = d, d.mousemoveHandler(c), e.dispatchEvent("mousemove", c))) : e.mouseOverelement ? (c.target = d, e.mouseOverelement.mouseoutHandler(c), e.mouseOverelement = null, e.dispatchEvent("mouseout", c)) : (c.target = null, e.dispatchEvent("mousemove", c))
                },
                this.mouseoverHandler = function (a) {
                    var b = this.toSceneEvent(a);
                    this.dispatchEvent("mouseover", b)
                },
                this.mouseoutHandler = function (a) {
                    var b = this.toSceneEvent(a);
                    this.dispatchEvent("mouseout", b)
                },
                this.clickHandler = function (a) {
                    var b = this.toSceneEvent(a);
                    this.currentElement && (b.target = this.currentElement, this.currentElement.clickHandler(b)),
                        this.dispatchEvent("click", b)
                },
                this.dbclickHandler = function (a) {
                    var b = this.toSceneEvent(a);
                    this.currentElement ? (b.target = this.currentElement, this.currentElement.dbclickHandler(b)) : e.cancleAllSelected(),
                        this.dispatchEvent("dbclick", b)
                },
                this.mousewheelHandler = function (a) {
                    var b = this.toSceneEvent(a);
                    this.dispatchEvent("mousewheel", b)
                },
                this.touchstart = this.mousedownHander,
                this.touchmove = this.mousedragHandler,
                this.touchend = this.mousedownHander,
                this.keydownHandler = function (a) {
                    this.dispatchEvent("keydown", a)
                },
                this.keyupHandler = function (a) {
                    this.dispatchEvent("keyup", a)
                },
                this.addEventListener = function (a, b) {
                    var c = this,
                        d = function (a) {
                            b.call(c, a)
                        };
                    return this.messageBus.subscribe(a, d),
                        this
                },
                this.removeEventListener = function (a) {
                    this.messageBus.unsubscribe(a)
                },
                this.removeAllEventListener = function () {
                    this.messageBus = new a.util.MessageBus
                },
                this.dispatchEvent = function (a, b) {
                    return this.messageBus.publish(a, b),
                        this
                };
            var f = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(","),
                g = this;
            return f.forEach(function (a) {
                g[a] = function (b) {
                    null != b ? this.addEventListener(a, b) : this.dispatchEvent(a)
                }
            }),
                this.zoom = function (a, b) {
                    null != a && 0 != a && (this.scaleX = a),
                    null != b && 0 != b && (this.scaleY = b)
                },
                this.zoomOut = function (a) {
                    0 != a && (null == a && (a = .8), this.scaleX /= a, this.scaleY /= a)
                },
                this.zoomIn = function (a) {
                    0 != a && (null == a && (a = .8), this.scaleX *= a, this.scaleY *= a)
                },
                this.getBound = function () {
                    return {
                        left: 0,
                        top: 0,
                        right: this.stage.canvas.width,
                        bottom: this.stage.canvas.height,
                        width: this.stage.canvas.width,
                        height: this.stage.canvas.height
                    }
                },
                this.getElementsBound = function () {
                    return a.util.getElementsBound(this.childs)
                },
                this.translateToCenter = function (a) {
                    var b = this.getElementsBound(),
                        c = this.stage.canvas.width / 2 - (b.left + b.right) / 2,
                        d = this.stage.canvas.height / 2 - (b.top + b.bottom) / 2;
                    a && (c = a.canvas.width / 2 - (b.left + b.right) / 2, d = a.canvas.height / 2 - (b.top + b.bottom) / 2),
                        this.translateX = c,
                        this.translateY = d
                },
                this.setCenter = function (a, b) {
                    var c = a - this.stage.canvas.width / 2,
                        d = b - this.stage.canvas.height / 2;
                    this.translateX = -c,
                        this.translateY = -d
                },
                this.centerAndZoom = function (a, b, c) {
                    if (this.translateToCenter(c), null == a || null == b) {
                        var d = this.getElementsBound(),
                            e = d.right - d.left,
                            f = d.bottom - d.top,
                            g = this.stage.canvas.width / e,
                            h = this.stage.canvas.height / f;
                        c && (g = c.canvas.width / e, h = c.canvas.height / f);
                        var i = Math.min(g, h);
                        if (i > 1)
                            return;
                        this.zoom(i, i)
                    }
                    this.zoom(a, b)
                },
                this.getCenterLocation = function () {
                    return {
                        x: e.stage.canvas.width / 2,
                        y: e.stage.canvas.height / 2
                    }
                },
                this.doLayout = function (a) {
                    a && a(this, this.childs)
                },
                this.toJson = function () {
                    {
                        var a = this,
                            b = "{";
                        this.serializedProperties.length
                    }
                    this.serializedProperties.forEach(function (c) {
                        var d = a[c];
                        "background" == c && (d = a._background.src),
                        "string" == typeof d && (d = '"' + d + '"'),
                            b += '"' + c + '":' + d + ","
                    }),
                        b += '"childs":[';
                    var c = this.childs.length;
                    return this.childs.forEach(function (a, d) {
                        b += a.toJson(),
                        c > d + 1 && (b += ",")
                    }),
                        b += "]",
                        b += "}"
                },
                e
        }

        b.prototype = new a.Element;
        var c = {};
        Object.defineProperties(b.prototype, {
            background: {
                get: function () {
                    return this._background
                },
                set: function (a) {
                    if ("string" == typeof a) {
                        var b = c[a];
                        null == b && (b = new Image, b.src = a, b.onload = function () {
                            c[a] = b
                        }),
                            this._background = b
                    } else
                        this._background = a
                }
            }
        }),
            a.Scene = b
    }(JTopo),
    /**
     * Jtopo 对可见元素 可交互元素 可编辑元素进行定义扩展
     */
    function (a) {
        //对可见元素的定义
        function b() {
            this.initialize = function () {
                b.prototype.initialize.apply(this, arguments),
                    this.elementType = "displayElement",
                    this.x = 0,
                    this.y = 0,
                    this.width = 32,
                    this.height = 32,
                    this.visible = !0,
                    this.alpha = 1,
                    this.rotate = 0,
                    this.scaleX = 1,
                    this.scaleY = 1,
                    this.strokeColor = "22,124,255",
                    this.borderColor = "22,124,255",
                    this.fillColor = "22,124,255",
                    this.shadow = !1,
                    this.shadowBlur = 5,
                    this.shadowColor = "rgba(0,0,0,0.5)",
                    this.shadowOffsetX = 3,
                    this.shadowOffsetY = 6,
                    this.transformAble = !1,
                    this.zIndex = 0;
                var a = "x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex".split(",");
                this.serializedProperties = this.serializedProperties.concat(a)
            },
                this.initialize(),
                this.paint = function (a) {
                    a.beginPath(),
                        a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")",
                        a.rect(-this.width / 2, -this.height / 2, this.width, this.height),
                        a.fill(),
                        a.stroke(),
                        a.closePath()
                },
                this.getLocation = function () {
                    return {
                        x: this.x,
                        y: this.y
                    }
                },
                this.setLocation = function (a, b) {
                    return this.x = a,
                        this.y = b,
                        this
                },
                this.getCenterLocation = function () {
                    return {
                        x: this.x + this.width / 2,
                        y: this.y + this.height / 2
                    }
                },
                this.setCenterLocation = function (a, b) {
                    return this.x = a - this.width / 2,
                        this.y = b - this.height / 2,
                        this
                },
                this.getSize = function () {
                    /*调整 this.height 拼写错误*/
                    return {
                        width: this.width,
                        height: this.height
                    }
                },
                this.setSize = function (a, b) {
                    return this.width = a,
                        this.height = b,
                        this
                },
                this.getBound = function () {
                    return {
                        left: this.x,
                        top: this.y,
                        right: this.x + this.width,
                        bottom: this.y + this.height,
                        width: this.width,
                        height: this.height
                    }
                },
                this.setBound = function (a, b, c, d) {
                    return this.setLocation(a, b),
                        this.setSize(c, d),
                        this
                },
                this.getDisplayBound = function () {
                    return {
                        left: this.x,
                        top: this.y,
                        right: this.x + this.width * this.scaleX,
                        bottom: this.y + this.height * this.scaleY
                    }
                },
                this.getDisplaySize = function () {
                    return {
                        width: this.width * this.scaleX,
                        height: this.height * this.scaleY
                    }
                },
                this.getPosition = function (a) {
                    var b,
                        c = this.getBound();
                    return "Top_Left" == a ? b = {
                            x: c.left,
                            y: c.top
                        }
                        : "Top_Center" == a ? b = {
                                x: this.cx,
                                y: c.top
                            }
                            : "Top_Right" == a ? b = {
                                    x: c.right,
                                    y: c.top
                                }
                                : "Middle_Left" == a ? b = {
                                        x: c.left,
                                        y: this.cy
                                    }
                                    : "Middle_Center" == a ? b = {
                                            x: this.cx,
                                            y: this.cy
                                        }
                                        : "Middle_Right" == a ? b = {
                                                x: c.right,
                                                y: this.cy
                                            }
                                            : "Bottom_Left" == a ? b = {
                                                    x: c.left,
                                                    y: c.bottom
                                                }
                                                : "Bottom_Center" == a ? b = {
                                                        x: this.cx,
                                                        y: c.bottom
                                                    }
                                                    : "Bottom_Right" == a && (b = {
                                                    x: c.right,
                                                    y: c.bottom
                                                }),
                        b
                }
        }

        //对能交互的元素的定义
        function c() {
            this.initialize = function () {
                c.prototype.initialize.apply(this, arguments),
                    this.elementType = "interactiveElement",
                    this.dragable = !1,
                    this.selected = !1,
                    this.showSelected = !0,
                    this.selectedLocation = null,
                    this.isMouseOver = !1;
                var a = "dragable,selected,showSelected,isMouseOver".split(",");
                this.serializedProperties = this.serializedProperties.concat(a)
            },
                this.initialize(),
                this.paintSelected = function (a) {
                    0 != this.showSelected && (a.save(), a.beginPath(), a.strokeStyle = "rgba(168,202,255, 0.9)", a.fillStyle = "rgba(168,202,236,0.7)", a.rect(-this.width / 2 - 3, -this.height / 2 - 3, this.width + 6, this.height + 6), a.fill(), a.stroke(), a.closePath(), a.restore())
                },
                this.paintMouseover = function (a) {
                    0 != this.showSelected && this.paintSelected(a)
                },
                this.isInBound = function (a, b) {
                    return a > this.x && a < this.x + this.width * Math.abs(this.scaleX) && b > this.y && b < this.y + this.height * Math.abs(this.scaleY)
                },
                this.selectedHandler = function () {
                    this.selected = !0,
                        this.selectedLocation = {
                            x: this.x,
                            y: this.y
                        }
                },
                this.unselectedHandler = function () {
                    this.selected = !1,
                        this.selectedLocation = null
                },
                this.dbclickHandler = function (a) {
                    this.dispatchEvent("dbclick", a)
                },
                this.clickHandler = function (a) {
                    this.dispatchEvent("click", a)
                },
                this.mousedownHander = function (a) {
                    this.dispatchEvent("mousedown", a)
                },
                this.mouseupHandler = function (a) {
                    this.dispatchEvent("mouseup", a)
                },
                this.mouseoverHandler = function (a) {
                    this.isMouseOver = !0,
                        this.dispatchEvent("mouseover", a)
                },
                this.mousemoveHandler = function (a) {
                    this.dispatchEvent("mousemove", a)
                },
                this.mouseoutHandler = function (a) {
                    this.isMouseOver = !1,
                        this.dispatchEvent("mouseout", a)
                },
                this.mousedragHandler = function (a) {
                    var b = this.selectedLocation.x + a.dx,
                        c = this.selectedLocation.y + a.dy;
                    this.setLocation(b, c),
                        this.dispatchEvent("mousedrag", a)
                },
                this.addEventListener = function (b, c) {
                    var d = this,
                        e = function (a) {
                            c.call(d, a)
                        };
                    return this.messageBus || (this.messageBus = new a.util.MessageBus),
                        this.messageBus.subscribe(b, e),
                        this
                },
                this.dispatchEvent = function (a, b) {
                    return this.messageBus ? (this.messageBus.publish(a, b), this) : null
                },
                this.removeEventListener = function (a) {
                    this.messageBus.unsubscribe(a)
                },
                this.removeAllEventListener = function () {
                    this.messageBus = new a.util.MessageBus
                };
            var b = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,touchstart,touchmove,touchend".split(","),
                d = this;
            b.forEach(function (a) {
                d[a] = function (b) {
                    null != b ? this.addEventListener(a, b) : this.dispatchEvent(a)
                }
            })
        }

        //对可编辑元素的定义
        function d() {
            this.initialize = function () {
                d.prototype.initialize.apply(this, arguments),
                    this.editAble = !1,
                    this.selectedPoint = null
            },
                this.getCtrlPosition = function (a) {
                    var b = 5,
                        c = 5,
                        d = this.getPosition(a);
                    return {
                        left: d.x - b,
                        top: d.y - c,
                        right: d.x + b,
                        bottom: d.y + c
                    }
                },
                this.selectedHandler = function (b) {
                    d.prototype.selectedHandler.apply(this, arguments),
                        this.selectedSize = {
                            width: this.width,
                            height: this.height
                        },
                    b.scene.mode == a.SceneMode.edit && (this.editAble = !0)
                },
                this.unselectedHandler = function () {
                    d.prototype.unselectedHandler.apply(this, arguments),
                        this.selectedSize = null,
                        this.editAble = !1
                };
            var b = ["Top_Left", "Top_Center", "Top_Right", "Middle_Left", "Middle_Right", "Bottom_Left", "Bottom_Center", "Bottom_Right"];
            this.paintCtrl = function (a) {
                if (0 != this.editAble) {
                    a.save();
                    //节点大小编辑区域绘制
                    for (var c = 0; c < b.length; c++) {
                        //位置效果修正
                        var d = this.getCtrlPosition(b[c]);
                        d.left -= this.cx,
                            d.right -= this.cx,
                            d.top -= this.cy,
                            d.bottom -= this.cy;
                        var e = d.right - d.left,//宽
                            f = d.bottom - d.top;//高
                        //画一个矩形
                        a.beginPath(),
                            a.strokeStyle = "rgba(0,0,0,0.8)",
                            a.rect(d.left, d.top, e, f),
                            a.stroke(),
                            a.closePath(),
                            a.beginPath(),
                            a.strokeStyle = "rgba(255,255,255,0.3)",
                            a.rect(d.left + 1, d.top + 1, e - 2, f - 2),
                            a.stroke(),
                            a.closePath()
                    }
                    a.restore()
                }
            },
                this.isInBound = function (a, c) {
                    if (this.selectedPoint = null, 1 == this.editAble)
                        for (var e = 0; e < b.length; e++) {
                            var f = this.getCtrlPosition(b[e]);
                            if (a > f.left && a < f.right && c > f.top && c < f.bottom)
                                return this.selectedPoint = b[e], !0
                        }
                    return d.prototype.isInBound.apply(this, arguments)
                },
                this.mousedragHandler = function (a) {
                    if (null == this.selectedPoint) {
                        var b = this.selectedLocation.x + a.dx,
                            c = this.selectedLocation.y + a.dy;
                        this.setLocation(b, c),
                            this.dispatchEvent("mousedrag", a)
                    } else {
                        //节点大小编辑拖拽处理
                        if ("Top_Left" == this.selectedPoint) {
                            var d = this.selectedSize.width - a.dx,
                                e = this.selectedSize.height - a.dy,
                                b = this.selectedLocation.x + a.dx,
                                c = this.selectedLocation.y + a.dy;
                            b < this.x + this.width && (this.x = b, this.width = d),
                            c < this.y + this.height && (this.y = c, this.height = e)
                        } else if ("Top_Center" == this.selectedPoint) {
                            var e = this.selectedSize.height - a.dy,
                                c = this.selectedLocation.y + a.dy;
                            c < this.y + this.height && (this.y = c, this.height = e)
                        } else if ("Top_Right" == this.selectedPoint) {
                            var d = this.selectedSize.width + a.dx,
                                c = this.selectedLocation.y + a.dy;
                            c < this.y + this.height && (this.y = c, this.height = this.selectedSize.height - a.dy),
                            d > 1 && (this.width = d)
                        } else if ("Middle_Left" == this.selectedPoint) {
                            var d = this.selectedSize.width - a.dx,
                                b = this.selectedLocation.x + a.dx;
                            b < this.x + this.width && (this.x = b),
                            d > 1 && (this.width = d)
                        } else if ("Middle_Right" == this.selectedPoint) {
                            var d = this.selectedSize.width + a.dx;
                            d > 1 && (this.width = d)
                        } else if ("Bottom_Left" == this.selectedPoint) {
                            var d = this.selectedSize.width - a.dx,
                                b = this.selectedLocation.x + a.dx;
                            d > 1 && (this.x = b, this.width = d);
                            var e = this.selectedSize.height + a.dy;
                            e > 1 && (this.height = e)
                        } else if ("Bottom_Center" == this.selectedPoint) {
                            var e = this.selectedSize.height + a.dy;
                            e > 1 && (this.height = e)
                        } else if ("Bottom_Right" == this.selectedPoint) {
                            var d = this.selectedSize.width + a.dx;
                            d > 1 && (this.width = d);
                            var e = this.selectedSize.height + a.dy;
                            e > 1 && (this.height = e)
                        }
                        this.dispatchEvent("resize", a)
                    }
                }
        }

        b.prototype = new a.Element,
            Object.defineProperties(b.prototype, {
                cx: {
                    get: function () {
                        return this.x + this.width / 2
                    },
                    set: function (a) {
                        this.x = a - this.width / 2
                    }
                },
                cy: {
                    get: function () {
                        return this.y + this.height / 2
                    },
                    set: function (a) {
                        this.y = a - this.height / 2
                    }
                }
            }),
            c.prototype = new b,
            d.prototype = new c,
            a.DisplayElement = b,
            a.InteractiveElement = c,
            a.EditableElement = d
    }(JTopo),
    /**
     * Jtopo 对节点Node进行定义扩展
     */
    function (a) {
        //对node的定义
        function b(c) {
            //初始化方法
            this.initialize = function (c) {
                b.prototype.initialize.apply(this, arguments),
                    this.elementType = "node",
                    this.zIndex = a.zIndex_Node,
                    this.text = c,
                    this.font = "12px Consolas",
                    this.fontColor = "255,255,255",
                    this.borderWidth = 0,
                    this.borderColor = "255,255,255",
                    this.borderRadius = null,
                    this.dragable = !0,
                    this.textPosition = "Bottom_Center",
                    this.textOffsetX = 0,
                    this.textOffsetY = 0,
                    this.transformAble = !0,
                    this.inLinks = null,
                    this.outLinks = null,
                    this.isAlarmCover = true,
                    this.imagesrc = null;//调整 增加图片路径属性
                var d = "text,font,fontColor,textPosition,textOffsetX,textOffsetY,borderRadius,isAlarmCover,imagesrc".split(",");
                this.serializedProperties = this.serializedProperties.concat(d)
            },
                //初始化行为
                this.initialize(c),
                //节点绘制
                this.paint = function (a) {
                    if (this.image) {
                        var b = a.globalAlpha;
                        a.globalAlpha = this.alpha,
                            null != this.image.alarm && null != this.alarm ? a.drawImage(this.image.alarm, -this.width / 2, -this.height / 2, this.width, this.height) : a.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height),
                            a.globalAlpha = b
                    } else
                        a.beginPath(),
                            a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")",
                            null == this.borderRadius || 0 == this.borderRadius ? a.rect(-this.width / 2, -this.height / 2, this.width, this.height) : a.JTopoRoundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius),
                            a.fill(),
                            a.closePath();
                    this.paintText(a),
                        this.paintBorder(a),
                        this.paintCtrl(a),
                        this.paintAlarmText(a)
                },
                //绘制节点告警
                this.paintAlarmText = function (a) {
                    if (null != this.alarm && "" != this.alarm) {
                        var b = this.alarmColor || "255,0,0",
                            c = this.alarmAlpha || .5;
                        a.beginPath(),
                            a.font = this.alarmFont || "10px 微软雅黑";
                        var d = a.measureText(this.alarm).width + 6,
                            e = a.measureText("田").width + 6,
                            f = this.width / 2 - d / 2,
                            g = -this.height / 2 - e - 8;
                        a.strokeStyle = "rgba(" + b + ", " + c + ")",
                            a.fillStyle = "rgba(" + b + ", " + c + ")",
                            a.lineCap = "round",
                            a.lineWidth = 1,
                            a.moveTo(f, g),
                            a.lineTo(f + d, g),
                            a.lineTo(f + d, g + e),
                            a.lineTo(f + d / 2 + 6, g + e),
                            a.lineTo(f + d / 2, g + e + 8),
                            a.lineTo(f + d / 2 - 6, g + e),
                            a.lineTo(f, g + e),
                            a.lineTo(f, g),
                            a.fill(),
                            a.stroke(),
                            a.closePath(),
                            a.beginPath(),
                            a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
                            a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
                            a.fillText(this.alarm, f + 2, g + e - 4),
                            a.closePath()
                    }
                },
                //绘制节点文本信息
                this.paintText = function (a) {
                    var b = this.text;
                    if (null != b && "" != b) {
                        a.beginPath(),
                            a.font = this.font;
                        var c = a.measureText(b).width,
                            d = a.measureText("田").width;
                        a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
                        var e = this.getTextPostion(this.textPosition, c, d);
                        a.fillText(b, e.x, e.y),
                            a.closePath()
                    }
                },
                //绘制节点边缘
                this.paintBorder = function (a) {
                    if (0 != this.borderWidth) {
                        a.beginPath(),
                            a.lineWidth = this.borderWidth,
                            a.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")";
                        var b = this.borderWidth / 2;
                        null == this.borderRadius || 0 == this.borderRadius ? a.rect(-this.width / 2 - b, -this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth) : a.JTopoRoundRect(-this.width / 2 - b, -this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius),
                            a.stroke(),
                            a.closePath()
                    }
                },
                //计算并获得节点文本的位置
                this.getTextPostion = function (a, b, c) {
                    var d = null;
                    return null == a || "Bottom_Center" == a ? d = {
                            x: -this.width / 2 + (this.width - b) / 2,
                            y: this.height / 2 + c
                        }
                        : "Top_Center" == a ? d = {
                                x: -this.width / 2 + (this.width - b) / 2,
                                y: -this.height / 2 - c / 2
                            }
                            : "Top_Right" == a ? d = {
                                    x: this.width / 2,
                                    y: -this.height / 2 - c / 2
                                }
                                : "Top_Left" == a ? d = {
                                        x: -this.width / 2 - b,
                                        y: -this.height / 2 - c / 2
                                    }
                                    : "Bottom_Right" == a ? d = {
                                            x: this.width / 2,
                                            y: this.height / 2 + c
                                        }
                                        : "Bottom_Left" == a ? d = {
                                                x: -this.width / 2 - b,
                                                y: this.height / 2 + c
                                            }
                                            : "Middle_Center" == a ? d = {
                                                    x: -this.width / 2 + (this.width - b) / 2,
                                                    y: c / 2
                                                }
                                                : "Middle_Right" == a ? d = {
                                                        x: this.width / 2,
                                                        y: c / 2
                                                    }
                                                    : "Middle_Left" == a && (d = {
                                                    x: -this.width / 2 - b,
                                                    y: c / 2
                                                }),
                    null != this.textOffsetX && (d.x += this.textOffsetX),
                    null != this.textOffsetY && (d.y += this.textOffsetY),
                        d
                },
                //设置节点的图片背景
                this.setImage = function (b, c) {
                    if (null == b)
                        throw new Error("Node.setImage(): 参数Image对象为空!");
                    var d = this;
                    if ("string" == typeof b) {
                        var e = j[b];
                        null == e ? (e = new Image, e.src = b, this.imagesrc = b, e.onload = function () {
                            j[b] = e;
                            1 == c && d.setSize(e.width, e.height);
                            if (d['isAlarmCover'] == undefined || d['isAlarmCover'] == null || d['isAlarmCover'] != false) {
                                var f = a.util.genImageAlarm(e);
                                f && (e.alarm = f);
                            }
                            d.image = e;
                        }) : (c && this.setSize(e.width, e.height), this.image = e)
                    } else
                        this.image = b, 1 == c && this.setSize(b.width, b.height)
                },
                //节点移除处理（删除节点时将与之相关的线也删除）
                this.removeHandler = function (a) {
                    var b = this;
                    this.outLinks && (this.outLinks.forEach(function (c) {
                        c.nodeA === b && a.remove(c)
                    }), this.outLinks = null),
                    this.inLinks && (this.inLinks.forEach(function (c) {
                        c.nodeZ === b && a.remove(c)
                    }), this.inLinks = null)
                }
        }

        //对普通node的定义
        function c() {
            c.prototype.initialize.apply(this, arguments)
        }

        //对TextNode进行定义
        function d(a) {
            this.initialize(),
                this.text = a,
                this.elementType = "TextNode",
                this.paint = function (a) {
                    a.beginPath(),
                        a.font = this.font,
                        this.width = a.measureText(this.text).width,
                        this.height = a.measureText("田").width,
                        a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
                        a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
                        a.fillText(this.text, -this.width / 2, this.height / 2),
                        a.closePath(),
                        this.paintBorder(a),
                        this.paintCtrl(a),
                        this.paintAlarmText(a)
                }
        }

        //对超链接节点LinkNode进行定义
        function e(a, b, c) {
            this.initialize(),
                this.text = a,
                this.href = b,
                this.target = c,
                this.elementType = "LinkNode",
                this.isVisited = !1,
                this.visitedColor = null,
                this.paint = function (a) {
                    a.beginPath(),
                        a.font = this.font,
                        this.width = a.measureText(this.text).width,
                        this.height = a.measureText("田").width,
                        this.isVisited && null != this.visitedColor ? (a.strokeStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")", a.fillStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")") : (a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")"),
                        a.fillText(this.text, -this.width / 2, this.height / 2),
                    this.isMouseOver && (a.moveTo(-this.width / 2, this.height), a.lineTo(this.width / 2, this.height), a.stroke()),
                        a.closePath(),
                        this.paintBorder(a),
                        this.paintCtrl(a),
                        this.paintAlarmText(a)
                },
                this.mousemove(function () {
                    var a = document.getElementsByTagName("canvas");
                    if (a && a.length > 0)
                        for (var b = 0; b < a.length; b++)
                            a[b].style.cursor = "pointer"
                }),
                this.mouseout(function () {
                    var a = document.getElementsByTagName("canvas");
                    if (a && a.length > 0)
                        for (var b = 0; b < a.length; b++)
                            a[b].style.cursor = "default"
                }),
                this.click(function () {
                    "_blank" == this.target ? window.open(this.href) : location = this.href,
                        this.isVisited = !0
                })
        }

        //对圆形节点CircleNode进行定义
        function f(a) {
            this.initialize(arguments),
                this._radius = 20,
                this.beginDegree = 0,
                this.endDegree = 2 * Math.PI,
                this.text = a,
                this.paint = function (a) {
                    a.save(),
                        a.beginPath(),
                        a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")",
                        a.arc(0, 0, this.radius, this.beginDegree, this.endDegree, !0),
                        a.fill(),
                        a.closePath(),
                        a.restore(),
                        this.paintText(a),
                        this.paintBorder(a),
                        this.paintCtrl(a),
                        this.paintAlarmText(a)
                },
                this.paintSelected = function (a) {
                    a.save(),
                        a.beginPath(),
                        a.strokeStyle = "rgba(168,202,255, 0.9)",
                        a.fillStyle = "rgba(168,202,236,0.7)",
                        a.arc(0, 0, this.radius + 3, this.beginDegree, this.endDegree, !0),
                        a.fill(),
                        a.stroke(),
                        a.closePath(),
                        a.restore()
                }
        }

        //对动画节点AnimateNode 的动画化
        function g(a, b, c) {
            this.initialize(),
                this.frameImages = a || [],
                this.frameIndex = 0,
                this.isStop = !0;
            var d = b || 1e3;
            this.repeatPlay = !1;
            var e = this;
            this.nextFrame = function () {
                if (!this.isStop && null != this.frameImages.length) {
                    if (this.frameIndex++, this.frameIndex >= this.frameImages.length) {
                        if (!this.repeatPlay)
                            return;
                        this.frameIndex = 0
                    }
                    this.setImage(this.frameImages[this.frameIndex], c),
                        setTimeout(function () {
                            e.nextFrame()
                        }, d / a.length)
                }
            }
        }

        //对动画节点AnimateNode 的每一帧图片渲染
        function h(a, b, c, d, e) {
            this.initialize();
            var f = this;
            this.setImage(a),
                this.frameIndex = 0,
                this.isPause = !0,
                this.repeatPlay = !1;
            var g = d || 1e3;
            e = e || 0,
                this.paint = function (a) {
                    if (this.image) {
                        var b = this.width,
                            d = this.height;
                        a.save(),
                            a.beginPath(),
                            a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
                        var f = (Math.floor(this.frameIndex / c) + e) * d,
                            g = Math.floor(this.frameIndex % c) * b;
                        a.drawImage(this.image, g, f, b, d, -b / 2, -d / 2, b, d),
                            a.fill(),
                            a.closePath(),
                            a.restore(),
                            this.paintText(a),
                            this.paintBorder(a),
                            this.paintCtrl(a),
                            this.paintAlarmText(a)
                    }
                },
                this.nextFrame = function () {
                    if (!this.isStop) {
                        if (this.frameIndex++, this.frameIndex >= b * c) {
                            if (!this.repeatPlay)
                                return;
                            this.frameIndex = 0
                        }
                        setTimeout(function () {
                            f.isStop || f.nextFrame()
                        }, g / (b * c))
                    }
                }
        }

        //对动画节点AnimateNode进行定义 （使用了上面 g h）
        function i() {
            var a = null;
            return a = arguments.length <= 3 ? new g(arguments[0], arguments[1], arguments[2]) : new h(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]),
                a.stop = function () {
                    a.isStop = !0
                },
                a.play = function () {
                    a.isStop = !1,
                        a.frameIndex = 0,
                        a.nextFrame()
                },
                a
        }

        var j = {};
        b.prototype = new a.EditableElement, //对b类 添加Jtopo中可编辑元素（EditableElement）中的属性、方法 实现类似java继承效果
            c.prototype = new b,                 //对c类 添加b中的属性、方法 实现类似java继承效果
            d.prototype = new c,                 //对d类 添加c中的属性、方法 实现类似java继承效果
            e.prototype = new d,                 //对e类 添加d中的属性、方法 实现类似java继承效果
            f.prototype = new c,                 //对f类 添加c中的属性、方法 实现类似java继承效果
            //针对圆形节点的 属性扩展
            Object.defineProperties(f.prototype, {
                radius: {
                    get: function () {
                        return this._radius
                    },
                    set: function (a) {
                        this._radius = a;
                        var b = 2 * this.radius,
                            c = 2 * this.radius;
                        this.width = b,
                            this.height = c
                    }
                },
                width: {
                    get: function () {
                        return this._width
                    },
                    set: function (a) {
                        this._radius = a / 2,
                            this._width = a
                    }
                },
                height: {
                    get: function () {
                        return this._height
                    },
                    set: function (a) {
                        this._radius = a / 2,
                            this._height = a
                    }
                }
            }),
            g.prototype = new c,    //对g类 添加c中的属性、方法 实现类似java继承效果
            h.prototype = new c,    //对h类 添加c中的属性、方法 实现类似java继承效果
            i.prototype = new c,    //对i类 添加c中的属性、方法 实现类似java继承效果
            a.Node = c,
            a.TextNode = d,
            a.LinkNode = e,
            a.CircleNode = f,
            a.AnimateNode = i
    }(JTopo),
    /**
     * Jtopo 对连线Link进行定义扩展
     */
    function (a) {
        //从nodeA到nodeB之间的所有线
        function b(a, b) {
            var c = [];
            if (null == a || null == b)
                return c;
            if (a && b && a.outLinks && b.inLinks)
                for (var d = 0; d < a.outLinks.length; d++)
                    for (var e = a.outLinks[d], f = 0; f < b.inLinks.length; f++) {
                        var g = b.inLinks[f];
                        e === g && c.push(g)
                    }
            return c
        }

        //nodeA与nodeB之间的所有线
        function c(a, c) {
            var d = b(a, c),
                e = b(c, a),
                f = d.concat(e);
            return f
        }

        //nodeA与nodeB之间除去a的所有线
        function d(a) {
            var b = c(a.nodeA, a.nodeZ);
            return b = b.filter(function (b) {
                return a !== b
            })
        }

        //nodeA与nodeB之间的所有线 条数
        function e(a, b) {
            return c(a, b).length
        }

        //直线
        function f(b, c, g) {
            function h(b, c) {
                var d = a.util.lineF(b.cx, b.cy, c.cx, c.cy),
                    e = b.getBound(),
                    f = a.util.intersectionLineBound(d, e);
                return f
            }

            //线初始化方法
            this.initialize = function (b, c, d) {
                if (f.prototype.initialize.apply(this, arguments), this.elementType = "link", this.zIndex = a.zIndex_Link, 0 != arguments.length) {
                    this.text = d,
                        this.nodeA = b,
                        this.nodeZ = c,
                    this.nodeA && null == this.nodeA.outLinks && (this.nodeA.outLinks = []),
                    this.nodeA && null == this.nodeA.inLinks && (this.nodeA.inLinks = []),
                    this.nodeZ && null == this.nodeZ.inLinks && (this.nodeZ.inLinks = []),
                    this.nodeZ && null == this.nodeZ.outLinks && (this.nodeZ.outLinks = []),
                    null != this.nodeA && this.nodeA.outLinks.push(this),
                    null != this.nodeZ && this.nodeZ.inLinks.push(this),
                        this.caculateIndex(),
                        this.font = "12px Consolas",
                        this.fontColor = "255,255,255",
                        this.lineWidth = 2,
                        this.lineJoin = "miter",
                        this.transformAble = !1,
                        this.bundleOffset = 20,
                        this.bundleGap = 12,
                        this.textOffsetX = 0,
                        this.textOffsetY = 0,
                        this.arrowsRadius = null,
                        this.arrowsOffset = 0,
                        this.dashedPattern = null,
                        this.path = [];
                    /*调整  这里很多属性都要序列化 不清楚为啥作者bundleGap后的属性没有加上*/
                    var e = "text,font,fontColor,lineWidth,lineJoin,transformAble,bundleOffset,bundleGap,textOffsetX,textOffsetY,arrowsRadius,arrowsOffset,dashedPattern,path".split(",");
                    this.serializedProperties = this.serializedProperties.concat(e)
                }
            },
                //获得点之间线的条数最大下标
                this.caculateIndex = function () {
                    var a = e(this.nodeA, this.nodeZ);
                    a > 0 && (this.nodeIndex = a - 1)
                },
                this.initialize(b, c, g),
                //删除线 句柄方法
                this.removeHandler = function () {
                    var a = this;
                    this.nodeA && this.nodeA.outLinks && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function (b) {
                        return b !== a
                    })),
                    this.nodeZ && this.nodeZ.inLinks && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function (b) {
                        return b !== a
                    }));
                    var b = d(this);
                    b.forEach(function (a, b) {
                        a.nodeIndex = b
                    })
                },
                //获得出发节点的坐标
                this.getStartPosition = function () {
                    var a = {
                        x: this.nodeA.cx,
                        y: this.nodeA.cy
                    };
                    return a
                },
                //获得终止节点的坐标
                this.getEndPosition = function () {
                    var a;
                    return null != this.arrowsRadius && (a = h(this.nodeZ, this.nodeA)),
                    null == a && (a = {
                        x: this.nodeZ.cx,
                        y: this.nodeZ.cy
                    }),
                        a
                },
                /*
                 如果存在点之间存在多条线 那么每条线应该相互之间有间距
                 TODO 调整 原代码 在2个点之间有连续的环形线（A_Z,Z_A...）会产生计算不正确的BUG
                 因为A_Z会进行一次paint紧接着Z_A也会进行一次，虽然正确的计算出了偏移量，但是角度确是计算相反了
                 所以当f为负数时 应该交换 b与c的坐标
                 */
                // 获得线的路线 返回 顶点按顺序排列的坐标数组
                this.getPath = function () {
                    var a = [],
                        b = this.getStartPosition(),
                        c = this.getEndPosition();
                    if (this.nodeA === this.nodeZ)
                        return [b, c];
                    var d = e(this.nodeA, this.nodeZ);//点之间的线的条数
                    if (1 >= d) return [b, c];
                    var f = Math.atan2(c.y - b.y, c.x - b.x);//计算线的角度系数
                    //发出点的拐点坐标
                    var g = {
                            x: b.x + this.bundleOffset * Math.cos(f),//半径（斜边）* Math.cos(f) = 偏移横坐标  + b.x = 发出点的拐点横坐标
                            y: b.y + this.bundleOffset * Math.sin(f)//半径（斜边）*Math.sin(f) = 偏移纵坐标   + b.y = 发出点的拐点横坐标
                        },
                        //终止点的拐点坐标
                        h = {
                            x: c.x + this.bundleOffset * Math.cos(f - Math.PI),//由于-PI 所以角度相反
                            y: c.y + this.bundleOffset * Math.sin(f - Math.PI)//由于-PI 所以角度相反
                        },
                        i = f - Math.PI / 2,
                        j = f - Math.PI / 2;
                    var k = (d - 1) * this.bundleGap / 2,
                        l = this.bundleGap * this.nodeIndex,
                        m = {
                            x: g.x + l * Math.cos(i),
                            y: g.y + l * Math.sin(i)
                        },
                        n = {
                            x: h.x + l * Math.cos(j),
                            y: h.y + l * Math.sin(j)
                        };
                    m = {
                        x: m.x + k * Math.cos(i - Math.PI),
                        y: m.y + k * Math.sin(i - Math.PI)
                    },
                        n = {
                            x: n.x + k * Math.cos(j - Math.PI),
                            y: n.y + k * Math.sin(j - Math.PI)
                        };

                    var ft = Math.atan2(b.y - c.y, b.x - c.x);
                    var it = ft - Math.PI / 2;
                    var jt = ft - Math.PI / 2;
                    var temp1x = c.x + this.bundleOffset * Math.cos(ft) + l * Math.cos(it) + k * Math.cos(it - Math.PI);
                    var temp1y = c.y + this.bundleOffset * Math.sin(ft) + l * Math.sin(it) + k * Math.sin(it - Math.PI);
                    var temp2x = b.x + this.bundleOffset * Math.cos(f) + l * Math.cos(jt) + k * Math.cos(jt - Math.PI);
                    var temp2y = b.y + this.bundleOffset * Math.sin(f) + l * Math.sin(jt) + k * Math.sin(jt - Math.PI);
                    a.push({x: b.x, y: b.y});
                    if ((i * f > 0) && i < 0) {
                        a.push({x: m.x, y: m.y});
                        a.push({x: n.x, y: n.y});
                    } else {
                        a.push({x: temp2x, y: temp2y});
                        a.push({x: temp1x, y: temp1y});
                    }
                    a.push({x: c.x, y: c.y});
                    return a
                },
                //画线 b是线路径
                this.paintPath = function (a, b) {
                    if (this.nodeA === this.nodeZ)
                        return void this.paintLoop(a);
                    a.beginPath(),
                        a.moveTo(b[0].x, b[0].y);
                    for (var c = 1; c < b.length; c++)
                        null == this.dashedPattern ? a.lineTo(b[c].x, b[c].y) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern);
                    //画箭头
                    if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
                        var d = b[b.length - 2],
                            e = b[b.length - 1];
                        this.paintArrow(a, d, e)
                    }
                },
                //画自身循环线
                this.paintLoop = function (a) {
                    a.beginPath();
                    {
                        var b = this.bundleGap * (this.nodeIndex + 1) / 2;
                        Math.PI + Math.PI / 2
                    }
                    a.arc(this.nodeA.x, this.nodeA.y, b, Math.PI / 2, 2 * Math.PI),
                        a.stroke(),
                        a.closePath()
                },
                //画箭头 b是2d画笔 c是倒数第二个坐标（没拐点时就是起点坐标） d是终点坐标
                this.paintArrow = function (b, c, d) {
                    var e = this.arrowsOffset,
                        f = this.arrowsRadius / 2,
                        g = c,
                        h = d,
                        i = Math.atan2(h.y - g.y, h.x - g.x),
                        j = a.util.getDistance(g, h) - this.arrowsRadius,
                        k = g.x + (j + e) * Math.cos(i),
                        l = g.y + (j + e) * Math.sin(i),
                        m = h.x + e * Math.cos(i),
                        n = h.y + e * Math.sin(i);
                    i -= Math.PI / 2;
                    var o = {
                            x: k + f * Math.cos(i),
                            y: l + f * Math.sin(i)
                        },
                        p = {
                            x: k + f * Math.cos(i - Math.PI),
                            y: l + f * Math.sin(i - Math.PI)
                        };
                    b.beginPath(),
                        b.fillStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")",
                        b.moveTo(o.x, o.y),
                        b.lineTo(m, n),
                        b.lineTo(p.x, p.y),
                        b.stroke(),
                        b.closePath()
                },
                //线绘制（包括文本）
                this.paint = function (a) {
                    if (null != this.nodeA && null != !this.nodeZ) {
                        var b = this.getPath(this.nodeIndex);
                        this.path = b,
                            a.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")",
                            a.lineWidth = this.lineWidth,
                            this.paintPath(a, b),
                        b && b.length > 0 && this.paintText(a, b)
                    }
                };
            var i = -(Math.PI / 2 + Math.PI / 4);
            //绘制文本
            this.paintText = function (a, b) {
                var c = b[0],
                    d = b[b.length - 1];
                if (4 == b.length && (c = b[1], d = b[2]), this.text && this.text.length > 0) {
                    var e = (d.x + c.x) / 2 + this.textOffsetX,
                        f = (d.y + c.y) / 2 + this.textOffsetY;
                    a.save(),
                        a.beginPath(),
                        a.font = this.font;
                    var g = a.measureText(this.text).width,
                        h = a.measureText("田").width;
                    if (a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", this.nodeA === this.nodeZ) {
                        var j = this.bundleGap * (this.nodeIndex + 1) / 2,
                            e = this.nodeA.x + j * Math.cos(i),
                            f = this.nodeA.y + j * Math.sin(i);
                        a.fillText(this.text, e, f)
                    } else
                        a.fillText(this.text, e - g / 2, f - h / 2);
                    a.stroke(),
                        a.closePath(),
                        a.restore()
                }
            },
                //被选择时样式绘制
                this.paintSelected = function (a) {
                    a.shadowBlur = 10,
                        a.shadowColor = "rgba(0,0,0,1)",
                        a.shadowOffsetX = 0,
                        a.shadowOffsetY = 0
                },
                //判断坐标b,c是否在线上
                this.isInBound = function (b, c) {
                    if (this.nodeA === this.nodeZ) {
                        var d = this.bundleGap * (this.nodeIndex + 1) / 2,
                            e = a.util.getDistance(this.nodeA, {
                                x: b,
                                y: c
                            }) - d;
                        return Math.abs(e) <= 3
                    }
                    for (var f = !1, g = 1; g < this.path.length; g++) {
                        var h = this.path[g - 1],
                            i = this.path[g];
                        if (1 == a.util.isPointInLine({
                                x: b,
                                y: c
                            }, h, i)) {
                            f = !0;
                            break
                        }
                    }
                    return f
                }
        }

        //一次折线
        function g(a, b, c) {
            this.initialize = function () {
                g.prototype.initialize.apply(this, arguments),
                    this.direction = "horizontal"
            },
                this.initialize(a, b, c),
                this.getStartPosition = function () {
                    var a = {
                        x: this.nodeA.cx,
                        y: this.nodeA.cy
                    };
                    return "horizontal" == this.direction ? this.nodeZ.cx > a.x ? a.x += this.nodeA.width / 2 : a.x -= this.nodeA.width / 2 : this.nodeZ.cy > a.y ? a.y += this.nodeA.height / 2 : a.y -= this.nodeA.height / 2,
                        a
                },
                this.getEndPosition = function () {
                    var a = {
                        x: this.nodeZ.cx,
                        y: this.nodeZ.cy
                    };
                    return "horizontal" == this.direction ? this.nodeA.cy < a.y ? a.y -= this.nodeZ.height / 2 : a.y += this.nodeZ.height / 2 : a.x = this.nodeA.cx < a.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width,
                        a
                },
                this.getPath = function (a) {
                    var b = [],
                        c = this.getStartPosition(),
                        d = this.getEndPosition();
                    if (this.nodeA === this.nodeZ)
                        return [c, d];
                    var f,
                        g,
                        h = e(this.nodeA, this.nodeZ),
                        i = (h - 1) * this.bundleGap,
                        j = this.bundleGap * a - i / 2;
                    return "horizontal" == this.direction ? (f = d.x + j, g = c.y - j, b.push({
                        x: c.x,
                        y: g
                    }), b.push({
                        x: f,
                        y: g
                    }), b.push({
                        x: f,
                        y: d.y
                    })) : (f = c.x + j, g = d.y - j, b.push({
                        x: f,
                        y: c.y
                    }), b.push({
                        x: f,
                        y: g
                    }), b.push({
                        x: d.x,
                        y: g
                    })),
                        b
                },
                this.paintText = function (a, b) {
                    if (this.text && this.text.length > 0) {
                        var c = b[1],
                            d = c.x + this.textOffsetX,
                            e = c.y + this.textOffsetY;
                        a.save(),
                            a.beginPath(),
                            a.font = this.font;
                        var f = a.measureText(this.text).width,
                            g = a.measureText("田").width;
                        a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
                            a.fillText(this.text, d - f / 2, e - g / 2),
                            a.stroke(),
                            a.closePath(),
                            a.restore()
                    }
                }
        }

        //二次折线
        function h(a, b, c) {
            this.initialize = function () {
                h.prototype.initialize.apply(this, arguments),
                    this.direction = "vertical",
                    this.offsetGap = 44
            },
                this.initialize(a, b, c),
                this.getStartPosition = function () {
                    var a = {
                        x: this.nodeA.cx,
                        y: this.nodeA.cy
                    };
                    return "horizontal" == this.direction ? a.x = this.nodeZ.cx < a.x ? this.nodeA.x : this.nodeA.x + this.nodeA.width : a.y = this.nodeZ.cy < a.y ? this.nodeA.y : this.nodeA.y + this.nodeA.height,
                        a
                },
                this.getEndPosition = function () {
                    var a = {
                        x: this.nodeZ.cx,
                        y: this.nodeZ.cy
                    };
                    return "horizontal" == this.direction ? a.x = this.nodeA.cx < a.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width : a.y = this.nodeA.cy < a.y ? this.nodeZ.y : this.nodeZ.y + this.nodeZ.height,
                        a
                },
                this.getPath = function (a) {
                    var b = this.getStartPosition(),
                        c = this.getEndPosition();
                    if (this.nodeA === this.nodeZ)
                        return [b, c];
                    var d = [],
                        f = e(this.nodeA, this.nodeZ),
                        g = (f - 1) * this.bundleGap,
                        h = this.bundleGap * a - g / 2,
                        i = this.offsetGap;
                    return "horizontal" == this.direction ? (this.nodeA.cx > this.nodeZ.cx && (i = -i), d.push({
                        x: b.x,
                        y: b.y + h
                    }), d.push({
                        x: b.x + i,
                        y: b.y + h
                    }), d.push({
                        x: c.x - i,
                        y: c.y + h
                    }), d.push({
                        x: c.x,
                        y: c.y + h
                    })) : (this.nodeA.cy > this.nodeZ.cy && (i = -i), d.push({
                        x: b.x + h,
                        y: b.y
                    }), d.push({
                        x: b.x + h,
                        y: b.y + i
                    }), d.push({
                        x: c.x + h,
                        y: c.y - i
                    }), d.push({
                        x: c.x + h,
                        y: c.y
                    })),
                        d
                }
        }

        //曲线
        function i(a, b, c) {
            this.initialize = function () {
                i.prototype.initialize.apply(this, arguments)
            },
                this.initialize(a, b, c),
                this.paintPath = function (a, b) {
                    if (this.nodeA === this.nodeZ)
                        return void this.paintLoop(a);
                    a.beginPath(),
                        a.moveTo(b[0].x, b[0].y);
                    for (var c = 1; c < b.length; c++) {
                        var d = b[c - 1],
                            e = b[c],
                            f = (d.x + e.x) / 2,
                            g = (d.y + e.y) / 2;
                        g += (e.y - d.y) / 2,
                            a.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")",
                            a.lineWidth = this.lineWidth,
                            a.moveTo(d.x, d.cy),
                            a.quadraticCurveTo(f, g, e.x, e.y),
                            a.stroke()
                    }
                    if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
                        var h = b[b.length - 2],
                            i = b[b.length - 1];
                        this.paintArrow(a, h, i)
                    }
                }
        }

        f.prototype = new a.InteractiveElement,
            g.prototype = new f,
            h.prototype = new f,
            i.prototype = new f,
            a.Link = f,
            a.FoldLink = g,
            a.FlexionalLink = h,
            a.CurveLink = i
    }(JTopo),
    /**
     * Jtopo 对容器container进行定义扩展
     */
    function (a) {
        function b(c) {
            this.initialize = function (c) {
                b.prototype.initialize.apply(this, null),
                    this.elementType = "container",
                    this.zIndex = a.zIndex_Container,
                    this.width = 100,
                    this.height = 100,
                    this.childs = [],
                    this.alpha = .5,
                    this.dragable = !0,
                    this.childDragble = !0,
                    this.visible = !0,
                    this.fillColor = "10,100,80",
                    this.borderWidth = 0,
                    this.borderColor = "255,255,255",
                    this.borderRadius = null,
                    this.font = "12px Consolas",
                    this.fontColor = "255,255,255",
                    this.text = c,
                    this.textPosition = "Bottom_Center",
                    this.textOffsetX = 0,
                    this.textOffsetY = 0,
                    this.layout = new a.layout.AutoBoundLayout
            },
                this.initialize(c),
                this.add = function (a) {
                    this.childs.push(a),
                        a.dragable = this.childDragble
                },
                this.remove = function (a) {
                    for (var b = 0; b < this.childs.length; b++)
                        if (this.childs[b] === a) {
                            a.parentContainer = null,
                                this.childs = this.childs.del(b),
                                a.lastParentContainer = this;
                            break
                        }
                },
                this.removeAll = function () {
                    this.childs = []
                },
                this.setLocation = function (a, b) {
                    var c = a - this.x,
                        d = b - this.y;
                    this.x = a,
                        this.y = b;
                    for (var e = 0; e < this.childs.length; e++) {
                        var f = this.childs[e];
                        f.setLocation(f.x + c, f.y + d)
                    }
                },
                this.doLayout = function (a) {
                    a && a(this, this.childs)
                },
                this.paint = function (a) {
                    this.visible && (this.layout && this.layout(this, this.childs), a.beginPath(), a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")", null == this.borderRadius || 0 == this.borderRadius ? a.rect(this.x, this.y, this.width, this.height) : a.JTopoRoundRect(this.x, this.y, this.width, this.height, this.borderRadius), a.fill(), a.closePath(), this.paintText(a), this.paintBorder(a))
                },
                this.paintBorder = function (a) {
                    if (0 != this.borderWidth) {
                        a.beginPath(),
                            a.lineWidth = this.borderWidth,
                            a.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")";
                        var b = this.borderWidth / 2;
                        null == this.borderRadius || 0 == this.borderRadius ? a.rect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth) : a.JTopoRoundRect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius),
                            a.stroke(),
                            a.closePath()
                    }
                },
                this.paintText = function (a) {
                    var b = this.text;
                    if (null != b && "" != b) {
                        a.beginPath(),
                            a.font = this.font;
                        var c = a.measureText(b).width,
                            d = a.measureText("田").width;
                        a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
                        var e = this.getTextPostion(this.textPosition, c, d);
                        a.fillText(b, e.x, e.y),
                            a.closePath()
                    }
                },
                this.getTextPostion = function (a, b, c) {
                    var d = null;
                    return null == a || "Bottom_Center" == a ? d = {
                            x: this.x + this.width / 2 - b / 2,
                            y: this.y + this.height + c
                        }
                        : "Top_Center" == a ? d = {
                                x: this.x + this.width / 2 - b / 2,
                                y: this.y - c / 2
                            }
                            : "Top_Right" == a ? d = {
                                    x: this.x + this.width - b,
                                    y: this.y - c / 2
                                }
                                : "Top_Left" == a ? d = {
                                        x: this.x,
                                        y: this.y - c / 2
                                    }
                                    : "Bottom_Right" == a ? d = {
                                            x: this.x + this.width - b,
                                            y: this.y + this.height + c
                                        }
                                        : "Bottom_Left" == a ? d = {
                                                x: this.x,
                                                y: this.y + this.height + c
                                            }
                                            : "Middle_Center" == a ? d = {
                                                    x: this.x + this.width / 2 - b / 2,
                                                    y: this.y + this.height / 2 + c / 2
                                                }
                                                : "Middle_Right" == a ? d = {
                                                        x: this.x + this.width - b,
                                                        y: this.y + this.height / 2 + c / 2
                                                    }
                                                    : "Middle_Left" == a && (d = {
                                                    x: this.x,
                                                    y: this.y + this.height / 2 + c / 2
                                                }),
                    null != this.textOffsetX && (d.x += this.textOffsetX),
                    null != this.textOffsetY && (d.y += this.textOffsetY),
                        d
                },
                this.paintMouseover = function () {
                },
                this.paintSelected = function (a) {
                    a.shadowBlur = 10,
                        a.shadowColor = "rgba(0,0,0,1)",
                        a.shadowOffsetX = 0,
                        a.shadowOffsetY = 0
                }
        }

        b.prototype = new a.InteractiveElement,
            a.Container = b
    }(JTopo),
    /**
     * Jtopo 自动布局扩展
     *
     * 使用Jtopo的自动布局是先画出节点 在对节点进行位置计算这是方式一
     */
    function (a) {
        function b(a) {
            var b = 0,
                c = 0;
            a.forEach(function (a) {
                b += a.cx,
                    c += a.cy
            });
            var d = {
                x: b / a.length,
                y: c / a.length
            };
            return d
        }

        function c(c, d) {
            null == d && (d = {});
            {
                var e = d.cx,
                    f = d.cy,
                    g = d.minRadius,
                    h = d.nodeDiameter,
                    i = d.hScale || 1,
                    j = d.vScale || 1;
                d.beginAngle || 0,
                d.endAngle || 2 * Math.PI
            }
            if (null == e || null == f) {
                var k = b(c);
                e = k.x,
                    f = k.y
            }
            var l = 0,
                m = [],
                n = [];
            c.forEach(function (a) {
                null == d.nodeDiameter ? (a.diameter && (h = a.diameter), h = a.radius ? 2 * a.radius : Math.sqrt(2 * a.width * a.height), n.push(h)) : n.push(h),
                    l += h
            }),
                c.forEach(function (a, b) {
                    var c = n[b] / l;
                    m.push(Math.PI * c)
                });
            var o = (c.length, m[0] + m[1]),
                p = n[0] / 2 + n[1] / 2,
                q = p / 2 / Math.sin(o / 2);
            null != g && g > q && (q = g);
            var r = q * i,
                s = q * j,
                t = d.animate;
            if (t) {
                var u = t.time || 1e3,
                    v = 0;
                c.forEach(function (b, c) {
                    v += 0 == c ? m[c] : m[c - 1] + m[c];
                    var d = e + Math.cos(v) * r,
                        g = f + Math.sin(v) * s;
                    a.Animate.stepByStep(b, {
                        x: d - b.width / 2,
                        y: g - b.height / 2
                    }, u).start()
                })
            } else {
                var v = 0;
                c.forEach(function (a, b) {
                    v += 0 == b ? m[b] : m[b - 1] + m[b];
                    var c = e + Math.cos(v) * r,
                        d = f + Math.sin(v) * s;
                    a.cx = c,
                        a.cy = d
                })
            }
            return {
                cx: e,
                cy: f,
                radius: r,
                radiusA: r,
                radiusB: s
            }
        }

        function d(a, b) {
            return function (c) {
                var d = c.childs;
                if (!(d.length <= 0))
                    for (var e = c.getBound(), f = d[0], g = (e.width - f.width) / b, h = (e.height - f.height) / a, i = (d.length, 0), j = 0; a > j; j++)
                        for (var k = 0; b > k; k++) {
                            var l = d[i++],
                                m = e.left + g / 2 + k * g,
                                n = e.top + h / 2 + j * h;
                            if (l.setLocation(m, n), i >= d.length)
                                return
                        }
            }
        }

        function e(a, b) {
            return null == a && (a = 0),
            null == b && (b = 0),
                function (c) {
                    var d = c.childs;
                    if (!(d.length <= 0))
                        for (var e = c.getBound(), f = e.left, g = e.top, h = 0; h < d.length; h++) {
                            var i = d[h];
                            f + i.width >= e.right && (f = e.left, g += b + i.height),
                                i.setLocation(f, g),
                                f += a + i.width
                        }
                }
        }

        function f() {
            return function (a, b) {
                if (b.length > 0) {
                    for (var c = 1e7, d = -1e7, e = 1e7, f = -1e7, g = d - c, h = f - e, i = 0; i < b.length; i++) {
                        var j = b[i];
                        j.x <= c && (c = j.x),
                        j.x >= d && (d = j.x),
                        j.y <= e && (e = j.y),
                        j.y >= f && (f = j.y),
                            g = d - c + j.width,
                            h = f - e + j.height
                    }
                    a.x = c,
                        a.y = e,
                        a.width = g,
                        a.height = h
                }
            }
        }

        function g(b) {
            var c = [],
                d = b.filter(function (b) {
                    return b instanceof a.Link ? !0 : (c.push(b), !1)
                });
            return b = c.filter(function (a) {
                for (var b = 0; b < d.length; b++)
                    if (d[b].nodeZ === a)
                        return !1;
                return !0
            }),
                b = b.filter(function (a) {
                    for (var b = 0; b < d.length; b++)
                        if (d[b].nodeA === a)
                            return !0;
                    return !1
                })
        }

        function h(a) {
            var b = 0,
                c = 0;
            return a.forEach(function (a) {
                b += a.width,
                    c += a.height
            }), {
                width: b / a.length,
                height: c / a.length
            }
        }

        function i(a, b, c, d) {
            b.x += c,
                b.y += d;
            for (var e = q(a, b), f = 0; f < e.length; f++)
                i(a, e[f], c, d)
        }

        function j(a, b) {
            function c(b, e) {
                var f = q(a, b);
                null == d[e] && (d[e] = {}, d[e].nodes = [], d[e].childs = []),
                    d[e].nodes.push(b),
                    d[e].childs.push(f);
                for (var g = 0; g < f.length; g++)
                    c(f[g], e + 1), f[g].parent = b
            }

            var d = [];
            return c(b, 0),
                d
        }

        function k(b, c, d) {
            return function (e) {
                function f(f, g) {
                    for (var h = a.layout.getTreeDeep(f, g), k = j(f, g), l = k["" + h].nodes, m = 0; m < l.length; m++) {
                        var n = l[m],
                            o = (m + 1) * (c + 10),
                            p = h * d;
                        "down" == b || ("up" == b ? p = -p : "left" == b ? (o = -h * d, p = (m + 1) * (c + 10)) : "right" == b && (o = h * d, p = (m + 1) * (c + 10))),
                            n.setLocation(o, p)
                    }
                    for (var q = h - 1; q >= 0; q--)
                        for (var r = k["" + q].nodes, s = k["" + q].childs, m = 0; m < r.length; m++) {
                            var t = r[m],
                                u = s[m];
                            if ("down" == b ? t.y = q * d : "up" == b ? t.y = -q * d : "left" == b ? t.x = -q * d : "right" == b && (t.x = q * d), u.length > 0 ? "down" == b || "up" == b ? t.x = (u[0].x + u[u.length - 1].x) / 2 : ("left" == b || "right" == b) && (t.y = (u[0].y + u[u.length - 1].y) / 2) : m > 0 && ("down" == b || "up" == b ? t.x = r[m - 1].x + r[m - 1].width + c : ("left" == b || "right" == b) && (t.y = r[m - 1].y + r[m - 1].height + c)), m > 0)
                                if ("down" == b || "up" == b) {
                                    if (t.x < r[m - 1].x + r[m - 1].width)
                                        for (var v = r[m - 1].x + r[m - 1].width + c, w = Math.abs(v - t.x), x = m; x < r.length; x++)
                                            i(e.childs, r[x], w, 0)
                                } else if (("left" == b || "right" == b) && t.y < r[m - 1].y + r[m - 1].height)
                                    for (var y = r[m - 1].y + r[m - 1].height + c, z = Math.abs(y - t.y), x = m; x < r.length; x++)
                                        i(e.childs, r[x], 0, z)
                        }
                }

                var g = null;
                null == c && (g = h(e.childs), c = g.width, ("left" == b || "right" == b) && (c = g.width + 10)),
                null == d && (null == g && (g = h(e.childs)), d = 2 * g.height),
                null == b && (b = "down");
                var k = a.layout.getRootNodes(e.childs);
                if (k.length > 0) {
                    f(e.childs, k[0]);
                    var l = a.util.getElementsBound(e.childs),
                        m = e.getCenterLocation(),
                        n = m.x - (l.left + l.right) / 2,
                        o = m.y - (l.top + l.bottom) / 2;
                    e.childs.forEach(function (b) {
                        b instanceof a.Node && (b.x += n, b.y += o)
                    })
                }
            }
        }

        function l(b) {
            return function (c) {
                function d(a, c, e) {
                    var f = q(a, c);
                    if (0 != f.length) {
                        null == e && (e = b);
                        var g = 2 * Math.PI / f.length;
                        f.forEach(function (b, f) {
                            var h = c.x + e * Math.cos(g * f),
                                i = c.y + e * Math.sin(g * f);
                            b.setLocation(h, i);
                            var j = e / 2;
                            d(a, b, j)
                        })
                    }
                }

                var e = a.layout.getRootNodes(c.childs);
                if (e.length > 0) {
                    d(c.childs, e[0]);
                    var f = a.util.getElementsBound(c.childs),
                        g = c.getCenterLocation(),
                        h = g.x - (f.left + f.right) / 2,
                        i = g.y - (f.top + f.bottom) / 2;
                    c.childs.forEach(function (b) {
                        b instanceof a.Node && (b.x += h, b.y += i)
                    })
                }
            }
        }

        function m(a, b, c, d, e, f) {
            for (var g = [], h = 0; c > h; h++)
                for (var i = 0; d > i; i++)
                    g.push({
                        x: a + i * e,
                        y: b + h * f
                    });
            return g
        }

        function n(a, b, c, d, e, f) {
            var g = e ? e : 0,
                h = f ? f : 2 * Math.PI,
                i = h - g,
                j = i / c,
                k = [];
            g += j / 2;
            for (var l = g; h >= l; l += j) {
                var m = a + Math.cos(l) * d,
                    n = b + Math.sin(l) * d;
                k.push({
                    x: m,
                    y: n
                })
            }
            return k
        }

        function o(a, b, c, d, e, f) {
            var g = f || "bottom",
                h = [];
            if ("bottom" == g)
                for (var i = a - c / 2 * d + d / 2, j = 0; c >= j; j++)
                    h.push({
                        x: i + j * d,
                        y: b + e
                    });
            else if ("top" == g)
                for (var i = a - c / 2 * d + d / 2, j = 0; c >= j; j++)
                    h.push({
                        x: i + j * d,
                        y: b - e
                    });
            else if ("right" == g)
                for (var i = b - c / 2 * d + d / 2, j = 0; c >= j; j++)
                    h.push({
                        x: a + e,
                        y: i + j * d
                    });
            else if ("left" == g)
                for (var i = b - c / 2 * d + d / 2, j = 0; c >= j; j++)
                    h.push({
                        x: a - e,
                        y: i + j * d
                    });
            return h
        }

        function m(a, b, c, d, e, f) {
            for (var g = [], h = 0; c > h; h++)
                for (var i = 0; d > i; i++)
                    g.push({
                        x: a + i * e,
                        y: b + h * f
                    });
            return g
        }

        function p(a, b) {
            if (a.layout) {
                var c = a.layout,
                    d = c.type,
                    e = null;
                //与原码逻辑一样更改了写法
                switch (d) {
                    case "circle" :
                        var f = c.radius || Math.max(a.width, a.height);
                        e = n(a.cx, a.cy, b.length, f, a.layout.beginAngle, a.layout.endAngle)
                        break;
                    case "tree" :
                        var g = c.width || 50,
                            h = c.height || 50,
                            i = c.direction;
                        e = o(a.cx, a.cy, b.length, g, h, i)
                        break;
                    case "grid" :
                        e = m(a.x, a.y, c.rows, c.cols, c.horizontal || 0, c.vertical || 0)
                        break;
                    default :
                        break;
                }
                if (!e && null == e) return;
                for (var j = 0; j < b.length; j++) {
                    b[j].setCenterLocation(e[j].x, e[j].y)
                }
            }
        }

        function q(b, c, visited) {
            /*调整 增加递归限制让访问过的节点不在访问（防止数据环导致死递归）*/
            for (var d = [], e = 0; e < b.length; e++)
                if (b[e] instanceof a.Link && b[e].nodeA === c) {
                    var nodeZ = b[e].nodeZ, _id = nodeZ._id;//这里用节点唯一ID作为键
                    if (!_id || _id == null || _id == "" || !visited) {
                        d.push(b[e].nodeZ);
                    } else {
                        if (visited.val.indexOf(_id) > -1) continue;
                        d.push(b[e].nodeZ);
                        visited.val += (!visited.val || visited.val == null || visited.val == "") ? _id : "," + _id;
                    }
                }
            return d
        }

        function r(a, b, c, visited) {
            /*调整 增加递归限制让访问过的节点不在访问（防止数据环导致死递归）*/
            if (!visited || visited == null) visited = {val: ""};//虽然使用数组存储也可以,但是比对时indexOf比循环块
            var d = q(a.childs, b, visited);
            if (0 == d.length)
                return null;
            if (p(b, d), 1 == c)
                for (var e = 0; e < d.length; e++)
                    r(a, d[e], c, visited);
            return null
        }

        function s(b, c) {
            function d(a, b) {
                var c = a.x - b.x,
                    d = a.y - b.y;
                i += c * f,
                    j += d * f,
                    i *= g,
                    j *= g,
                    j += h,
                    b.x += i,
                    b.y += j
            }

            function e() {
                if (!(++k > 150)) {
                    for (var a = 0; a < l.length; a++)
                        l[a] != b && d(b, l[a], l);
                    setTimeout(e, 1e3 / 24)
                }
            }

            var f = .01,
                g = .95,
                h = -5,
                i = 0,
                j = 0,
                k = 0,
                l = c.getElementsByClass(a.Node);
            e()
        }

        function t(a, b) {
            function c(a, b, e) {
                var f = q(a, b);
                e > d && (d = e);
                for (var g = 0; g < f.length; g++)
                    c(a, f[g], e + 1)
            }

            var d = 0;
            return c(a, b, 0),
                d
        }

        a.layout = a.Layout = {
            layoutNode: r,
            getNodeChilds: q,
            adjustPosition: p,
            springLayout: s,
            getTreeDeep: t,
            getRootNodes: g,
            GridLayout: d,
            FlowLayout: e,
            AutoBoundLayout: f,
            CircleLayout: l,
            TreeLayout: k,
            getNodesCenter: b,
            circleLayoutNodes: c
        }
    }(JTopo),
    /**
     * Jtopo 图表扩展
     */
    function (a) {
        function b() {
            var b = new a.CircleNode;
            return b.radius = 150,
                b.colors = ["#3666B0", "#2CA8E0", "#77D1F6"],
                b.datas = [.3, .3, .4],
                b.titles = ["A", "B", "C"],
                b.paint = function (a) {
                    var c = 2 * b.radius,
                        d = 2 * b.radius;
                    b.width = c,
                        b.height = d;
                    for (var e = 0, f = 0; f < this.datas.length; f++) {
                        var g = this.datas[f] * Math.PI * 2;
                        a.save(),
                            a.beginPath(),
                            a.fillStyle = b.colors[f],
                            a.moveTo(0, 0),
                            a.arc(0, 0, this.radius, e, e + g, !1),
                            a.fill(),
                            a.closePath(),
                            a.restore(),
                            a.beginPath(),
                            a.font = this.font;
                        var h = this.titles[f] + ": " + (100 * this.datas[f]).toFixed(2) + "%",
                            i = a.measureText(h).width,
                            j = (a.measureText("田").width, (e + e + g) / 2),
                            k = this.radius * Math.cos(j),
                            l = this.radius * Math.sin(j);
                        j > Math.PI / 2 && j <= Math.PI ? k -= i : j > Math.PI && j < 2 * Math.PI * 3 / 4 ? k -= i : j > 2 * Math.PI * .75,
                            a.fillStyle = "#FFFFFF",
                            a.fillText(h, k, l),
                            a.moveTo(this.radius * Math.cos(j), this.radius * Math.sin(j)),
                        j > Math.PI / 2 && j < 2 * Math.PI * 3 / 4 && (k -= i),
                        j > Math.PI,
                            a.fill(),
                            a.stroke(),
                            a.closePath(),
                            e += g
                    }
                },
                b
        }

        function c() {
            var b = new a.Node;
            return b.showSelected = !1,
                b.width = 250,
                b.height = 180,
                b.colors = ["#3666B0", "#2CA8E0", "#77D1F6"],
                b.datas = [.3, .3, .4],
                b.titles = ["A", "B", "C"],
                b.paint = function (a) {
                    var c = 3,
                        d = (this.width - c) / this.datas.length;
                    a.save(),
                        a.beginPath(),
                        a.fillStyle = "#FFFFFF",
                        a.strokeStyle = "#FFFFFF",
                        a.moveTo(-this.width / 2 - 1, -this.height / 2),
                        a.lineTo(-this.width / 2 - 1, this.height / 2 + 3),
                        a.lineTo(this.width / 2 + c + 1, this.height / 2 + 3),
                        a.stroke(),
                        a.closePath(),
                        a.restore();
                    for (var e = 0; e < this.datas.length; e++) {
                        a.save(),
                            a.beginPath(),
                            a.fillStyle = b.colors[e];
                        var f = this.datas[e],
                            g = e * (d + c) - this.width / 2,
                            h = this.height - f - this.height / 2;
                        a.fillRect(g, h, d, f);
                        var i = "" + parseInt(this.datas[e]),
                            j = a.measureText(i).width,
                            k = a.measureText("田").width;
                        a.fillStyle = "#FFFFFF",
                            a.fillText(i, g + (d - j) / 2, h - k),
                            a.fillText(this.titles[e], g + (d - j) / 2, this.height / 2 + k),
                            a.fill(),
                            a.closePath(),
                            a.restore()
                    }
                },
                b
        }

        a.BarChartNode = c,
            a.PieChartNode = b
    }(JTopo),
    /**
     * Jtopo 动画处理扩展
     */
    function (a) {
        function b(b, c) {
            var d,
                e = null;
            return {
                stop: function () {
                    return d ? (window.clearInterval(d), e && e.publish("stop"), this) : this
                },
                start: function () {
                    var a = this;
                    return d = setInterval(function () {
                        b.call(a)
                    }, c),
                        this
                },
                onStop: function (b) {
                    return null == e && (e = new a.util.MessageBus),
                        e.subscribe("stop", b),
                        this
                }
            }
        }

        function c(a, c) {
            c = c || {};
            var d = c.gravity || .1,
                e = c.dx || 0,
                f = c.dy || 5,
                g = c.stop,
                h = c.interval || 30,
                i = new b(function () {
                    g && g() ? (f = .5, this.stop()) : (f += d, a.setLocation(a.x + e, a.y + f))
                }, h);
            return i
        }

        function d(a, c, d, e, f) {
            var g = 1e3 / 24,
                h = {};
            for (var i in c) {
                var j = c[i],
                    k = j - a[i];
                h[i] = {
                    oldValue: a[i],
                    targetValue: j,
                    step: k / d * g,
                    isDone: function (b) {
                        var c = this.step > 0 && a[b] >= this.targetValue || this.step < 0 && a[b] <= this.targetValue;
                        return c
                    }
                }
            }
            var l = new b(function () {
                var b = !0;
                for (var d in c)
                    h[d].isDone(d) || (a[d] += h[d].step, b = !1);
                if (b) {
                    if (!e)
                        return this.stop();
                    for (var d in c)
                        if (f) {
                            var g = h[d].targetValue;
                            h[d].targetValue = h[d].oldValue,
                                h[d].oldValue = g,
                                h[d].step = -h[d].step
                        } else
                            a[d] = h[d].oldValue
                }
                return this
            }, g);
            return l
        }

        function e(a) {
            null == a && (a = {});
            var b = a.spring || .1,
                c = a.friction || .8,
                d = a.grivity || 0,
                e = (a.wind || 0, a.minLength || 0);
            return {
                items: [],
                timer: null,
                isPause: !1,
                addNode: function (a, b) {
                    var c = {
                        node: a,
                        target: b,
                        vx: 0,
                        vy: 0
                    };
                    return this.items.push(c),
                        this
                },
                play: function (a) {
                    this.stop(),
                        a = null == a ? 1e3 / 24 : a;
                    var b = this;
                    this.timer = setInterval(function () {
                        b.nextFrame()
                    }, a)
                },
                stop: function () {
                    null != this.timer && window.clearInterval(this.timer)
                },
                nextFrame: function () {
                    for (var a = 0; a < this.items.length; a++) {
                        var f = this.items[a],
                            g = f.node,
                            h = f.target,
                            i = f.vx,
                            j = f.vy,
                            k = h.x - g.x,
                            l = h.y - g.y,
                            m = Math.atan2(l, k);
                        if (0 != e) {
                            var n = h.x - Math.cos(m) * e,
                                o = h.y - Math.sin(m) * e;
                            i += (n - g.x) * b,
                                j += (o - g.y) * b
                        } else
                            i += k * b, j += l * b;
                        i *= c,
                            j *= c,
                            j += d,
                            g.x += i,
                            g.y += j,
                            f.vx = i,
                            f.vy = j
                    }
                }
            }
        }

        function f(a, b) {
            function c() {
                return e = setInterval(function () {
                    return o ? void f.stop() : (a.rotate += g || .2, void(a.rotate > 2 * Math.PI && (a.rotate = 0)))
                }, 100),
                    f
            }

            function d() {
                return window.clearInterval(e),
                f.onStop && f.onStop(a),
                    f
            }

            var e = (b.context, null),
                f = {},
                g = b.v;
            return f.run = c,
                f.stop = d,
                f.onStop = function (a) {
                    return f.onStop = a,
                        f
                },
                f
        }

        function g(a, b) {
            function c() {
                return window.clearInterval(g),
                h.onStop && h.onStop(a),
                    h
            }

            function d() {
                var d = b.dx || 0,
                    i = b.dy || 2;
                return g = setInterval(function () {
                    return o ? void h.stop() : (i += f, void(a.y + a.height < e.stage.canvas.height ? a.setLocation(a.x + d, a.y + i) : (i = 0, c())))
                }, 20),
                    h
            }

            var e = b.context,
                f = b.gravity || .1,
                g = null,
                h = {};
            return h.run = d,
                h.stop = c,
                h.onStop = function (a) {
                    return h.onStop = a,
                        h
                },
                h
        }

        function h(b, c) {
            function d(c, d, e, f, g) {
                var h = new a.Node;
                return h.setImage(b.image),
                    h.setSize(b.width, b.height),
                    h.setLocation(c, d),
                    h.showSelected = !1,
                    h.dragable = !1,
                    h.paint = function (a) {
                        a.save(),
                            a.arc(0, 0, e, f, g),
                            a.clip(),
                            a.beginPath(),
                            null != this.image ? a.drawImage(this.image, -this.width / 2, -this.height / 2) : (a.fillStyle = "rgba(" + this.style.fillStyle + "," + this.alpha + ")", a.rect(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2), a.fill()),
                            a.closePath(),
                            a.restore()
                    },
                    h
            }

            function e(c, e) {
                var f = c,
                    g = c + Math.PI,
                    h = d(b.x, b.y, b.width, f, g),
                    j = d(b.x - 2 + 4 * Math.random(), b.y, b.width, f + Math.PI, f);
                b.visible = !1,
                    e.add(h),
                    e.add(j),
                    a.Animate.gravity(h, {
                        context: e,
                        dx: .3
                    }).run().onStop(function () {
                        e.remove(h),
                            e.remove(j),
                            i.stop()
                    }),
                    a.Animate.gravity(j, {
                        context: e,
                        dx: -.2
                    }).run()
            }

            function f() {
                return e(c.angle, h),
                    i
            }

            function g() {
                return i.onStop && i.onStop(b),
                    i
            }

            var h = c.context,
                i = (b.style, {});
            return i.onStop = function (a) {
                return i.onStop = a,
                    i
            },
                i.run = f,
                i.stop = g,
                i
        }

        function i(a, b) {
            function c(a) {
                a.visible = !0,
                    a.rotate = Math.random();
                var b = g.stage.canvas.width / 2;
                a.x = b + Math.random() * (b - 100) - Math.random() * (b - 100),
                    a.y = g.stage.canvas.height,
                    a.vx = 5 * Math.random() - 5 * Math.random(),
                    a.vy = -25
            }

            function d() {
                return c(a),
                    h = setInterval(function () {
                        return o ? void i.stop() : (a.vy += f, a.x += a.vx, a.y += a.vy, void((a.x < 0 || a.x > g.stage.canvas.width || a.y > g.stage.canvas.height) && (i.onStop && i.onStop(a), c(a))))
                    }, 50),
                    i
            }

            function e() {
                window.clearInterval(h)
            }

            var f = .8,
                g = b.context,
                h = null,
                i = {};
            return i.onStop = function (a) {
                return i.onStop = a,
                    i
            },
                i.run = d,
                i.stop = e,
                i
        }

        function j() {
            o = !0
        }

        function k() {
            o = !1
        }

        function l(b, c) {
            function d() {
                return n = setInterval(function () {
                    if (o)
                        return void m.stop();
                    var a = f.y + h + Math.sin(k) * j;
                    b.setLocation(b.x, a),
                        k += l
                }, 100),
                    m
            }

            function e() {
                window.clearInterval(n)
            }

            var f = c.p1,
                g = c.p2,
                h = (c.context, f.x + (g.x - f.x) / 2),
                i = f.y + (g.y - f.y) / 2,
                j = a.util.getDistance(f, g) / 2,
                k = Math.atan2(i, h),
                l = c.speed || .2,
                m = {},
                n = null;
            return m.run = d,
                m.stop = e,
                m
        }

        function m(a, b) {
            function c() {
                return h = setInterval(function () {
                    if (o)
                        return void g.stop();
                    var b = e.x - a.x,
                        c = e.y - a.y,
                        h = b * f,
                        i = c * f;
                    a.x += h,
                        a.y += i,
                    .01 > h && .1 > i && d()
                }, 100),
                    g
            }

            function d() {
                window.clearInterval(h)
            }

            var e = b.position,
                f = (b.context, b.easing || .2),
                g = {},
                h = null;
            return g.onStop = function (a) {
                return g.onStop = a,
                    g
            },
                g.run = c,
                g.stop = d,
                g
        }

        function n(a, b) {
            function c() {
                return j = setInterval(function () {
                    a.scaleX += f,
                        a.scaleY += f,
                    a.scaleX >= e && d()
                }, 100),
                    i
            }

            function d() {
                i.onStop && i.onStop(a),
                    a.scaleX = g,
                    a.scaleY = h,
                    window.clearInterval(j)
            }

            var e = (b.position, b.context, b.scale || 1),
                f = .06,
                g = a.scaleX,
                h = a.scaleY,
                i = {},
                j = null;
            return i.onStop = function (a) {
                return i.onStop = a,
                    i
            },
                i.run = c,
                i.stop = d,
                i
        }

        a.Animate = {},
            a.Effect = {};
        var o = !1;
        a.Effect.spring = e,
            a.Effect.gravity = c,
            a.Animate.stepByStep = d,
            a.Animate.rotate = f,
            a.Animate.scale = n,
            a.Animate.move = m,
            a.Animate.cycle = l,
            a.Animate.repeatThrow = i,
            a.Animate.dividedTwoPiece = h,
            a.Animate.gravity = g,
            a.Animate.startAll = k,
            a.Animate.stopAll = j
    }(JTopo),
    /**
     * Jtopo 针对Stage.find、Scene.find方法扩展
     * 这里的表达式识别 是用正则写的 等式逻辑暂时只支持  = > < <= >= != 几种逻辑关系
     * 可扩展 * ^ $ 的支持 完成前、后搜索 模糊匹配
     */
    function (a) {
        function b(a, b) {
            var c = [];
            if (0 == a.length)
                return c;
            var d = b.match(/^\s*(\w+)\s*$/);
            if (null != d) {
                var e = a.filter(function (a) {
                    return a.elementType == d[1]
                });
                null != e && e.length > 0 && (c = c.concat(e))
            } else {
                var f = !1;
                if (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*['"](\S+)['"]\s*\]\s*/), (null == d || d.length < 5) && (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*(\d+(\.\d+)?)\s*\]\s*/), f = !0), null != d && d.length >= 5) {
                    var g = d[1],
                        h = d[2],
                        i = d[3],
                        j = d[4];
                    e = a.filter(function (a) {
                        if (a.elementType != g)
                            return !1;
                        var b = a[h];
                        return 1 == f && (b = parseInt(b)),
                            "=" == i ? b == j : ">" == i ? b > j : "<" == i ? j > b : "<=" == i ? j >= b : ">=" == i ? b >= j : "!=" == i ? b != j : !1
                    }),
                    null != e && e.length > 0 && (c = c.concat(e))
                }
            }
            return c
        }

        function c(a) {
            if (a.find = function (a) {
                    return d.call(this, a)
                }, e.forEach(function (b) {
                    a[b] = function (a) {
                        for (var c = 0; c < this.length; c++)
                            this[c][b](a);
                        return this
                    }
                }), a.length > 0) {
                var b = a[0];
                for (var c in b) {
                    var f = b[c];
                    "function" == typeof f && !function (b) {
                        a[c] = function () {
                            for (var c = [], d = 0; d < a.length; d++)
                                c.push(b.apply(a[d], arguments));
                            return c
                        }
                    }
                    (f)
                }
            }
            return a.attr = function (a, b) {
                if (null != a && null != b)
                    for (var c = 0; c < this.length; c++)
                        this[c][a] = b;
                else {
                    if (null != a && "string" == typeof a) {
                        for (var d = [], c = 0; c < this.length; c++)
                            d.push(this[c][a]);
                        return d
                    }
                    if (null != a)
                        for (var c = 0; c < this.length; c++)
                            for (var e in a)
                                this[c][e] = a[e]
                }
                return this
            },
                a
        }

        function d(d) {
            var e = [],
                f = [];
            this instanceof a.Stage ? (e = this.childs, f = f.concat(e)) : this instanceof a.Scene ? e = [this] : f = this,
                e.forEach(function (a) {
                    f = f.concat(a.childs)
                });
            var g = null;
            return g = "function" == typeof d ? f.filter(d) : b(f, d),
                g = c(g)
        }

        var e = "click,mousedown,mouseup,mouseover,mouseout,mousedrag,keydown,keyup".split(",");
        a.Stage.prototype.find = d,
            a.Scene.prototype.find = d
    }(JTopo),
    /**
     * 针对图形对象控制扩展
     * 绑定到window.Logo（中不知道作者为啥要这么做）
     * 游戏相关、动态图相关可能用到里面的方法
     */
    function (a) {
        function b(a, b) {
            this.x = a,
                this.y = b
        }

        function c(a) {
            this.p = new b(0, 0),
                this.w = new b(1, 0),
                this.paint = a
        }

        function d(a, b, c) {
            return function (d) {
                for (var e = 0; b > e; e++)
                    a(), c && d.turn(c), d.move(3)
            }
        }

        function e(a, b) {
            var c = 2 * Math.PI;
            return function (d) {
                for (var e = 0; b > e; e++)
                    a(), d.turn(c / b)
            }
        }

        function f(a, b, c) {
            return function (d) {
                for (var e = 0; b > e; e++)
                    a(), d.resize(c)
            }
        }

        function g(a) {
            var b = 2 * Math.PI;
            return function (c) {
                for (var d = 0; a > d; d++)
                    c.forward(1), c.turn(b / a)
            }
        }

        function h(a) {
            var b = 4 * Math.PI;
            return function (c) {
                for (var d = 0; a > d; d++)
                    c.forward(1), c.turn(b / a)
            }
        }

        function i(a, b, c, d) {
            return function (e) {
                for (var f = 0; b > f; f++)
                    a(), e.forward(1), e.turn(c), e.resize(d)
            }
        }

        var j = {};
        c.prototype.forward = function (a) {
            var b = this.p,
                c = this.w;
            return b.x = b.x + a * c.x,
                b.y = b.y + a * c.y,
            this.paint && this.paint(b.x, b.y),
                this
        },
            c.prototype.move = function (a) {
                var b = this.p,
                    c = this.w;
                return b.x = b.x + a * c.x,
                    b.y = b.y + a * c.y,
                    this
            },
            c.prototype.moveTo = function (a, b) {
                return this.p.x = a,
                    this.p.y = b,
                    this
            },
            c.prototype.turn = function (a) {
                var b = (this.p, this.w),
                    c = Math.cos(a) * b.x - Math.sin(a) * b.y,
                    d = Math.sin(a) * b.x + Math.cos(a) * b.y;
                return b.x = c,
                    b.y = d,
                    this
            },
            c.prototype.resize = function (a) {
                var b = this.w;
                return b.x = b.x * a,
                    b.y = b.y * a,
                    this
            },
            c.prototype.save = function () {
                return null == this._stack && (this._stack = []),
                    this._stack.push([this.p, this.w]),
                    this
            },
            c.prototype.restore = function () {
                if (null != this._stack && this._stack.length > 0) {
                    var a = this._stack.pop();
                    this.p = a[0],
                        this.w = a[1]
                }
                return this
            },
            j.Tortoise = c, //乌龟图
            j.shift = d,
            j.spin = e,
            j.polygon = g,
            j.spiral = i,
            j.star = h,
            j.scale = f,
            a.Logo = j
    }(window);
/*************************************************************JTopo原码结束。下面是个人扩展*************************************************************/
/**
 * Jtopo 针对节点多位置文本、文本换行处理支持 S_Autumn扩展
 * 支持Node、TextNode、LinkNode、CircleNode类型的节点;
 * var node = new JTopo.Node(key);
 * 原来的key只能是文本
 * 现在可以是一个对象 {
 *                      top_center:{text: aaa, font:xxx, fontColor:xxx, alpha:xxx, textOffsetX: xxx, textOffsetY: xxx, lineSpace:xxx},
 *                      bottom_right:{text: aaa, font:xxx, fontColor:xxx, alpha:xxx, textOffsetX: xxx, textOffsetY: xxx, lineSpace:xxx},
 *                      middle_left:{text: aaa, font:xxx, fontColor:xxx, alpha:xxx, textOffsetX: xxx, textOffsetY: xxx, lineSpace:xxx},
 *                      ...
 *                  }
 *
 */
!function (a) {
    /**
     * 针对Html5 Canvas2D绘制方法扩展
     * 换行文字
     */
    CanvasRenderingContext2D.prototype.wrapText = function (a, b, c) {
        if (undefined == a || null == a) return;
        //重载支持
        var textArray = null, x = null, x = null, position = null, lineSpace = null, textWidth = null,
            textHeight = null;
        if (a instanceof Array) {
            textArray = a;
            x = b;
            y = c;
            position = "center";
            lineSpace = 1;
        } else {
            textArray = a.textArray;
            textWidth = a.width;
            textHeight = a.height;
            x = a.x;
            y = a.y;
            position = a.position;
            lineSpace = a.lineSpace;
        }
        if (textArray == undefined || textArray == null) return false;
        if (position == undefined || position == null || position == "") position = "center";
        if (lineSpace == undefined || lineSpace == null || lineSpace == "" || lineSpace <= 0) lineSpace = 1;
        var fontHeight = this.measureText("田").width;
        if (undefined == textWidth || null == textWidth || undefined == textHeight || null == textHeight) {
            var _height = 0, maxLength = 0, maxText = textArray[0];
            for (var i = textArray.length; i >= 0; i--) {
                var text = textArray[i]
                if (!text) continue;
                var textLength = text.length;
                if (textLength >= maxLength) {
                    maxLength = textLength;
                    maxText = text;
                }
                _height = (_height == 0) ? _height + fontHeight : _height + fontHeight + lineSpace;
            }
            textWidth = this.measureText(maxText).width;
            textHeight = _height;
        }
        var rowHeight = 0;
        for (var j = 0; j < textArray.length; j++) {
            var words = textArray[j], thisW = this.measureText(words).width, siteX = 0;
            switch (position) {
                case "center":
                    siteX = x + ((textWidth - thisW) / 2);
                    break;
                case "left":
                    siteX = x;
                    break;
                case "right":
                    siteX = x + (textWidth - thisW);
                    break;
            }
            rowHeight = rowHeight == 0 ? y : rowHeight + fontHeight + lineSpace;
            this.fillText(words, siteX, rowHeight);
        }
    }

    function p(a) {
        var b = this.text;
        if (!b || null == b) return;
        var nodeWidth = this.width, nodeHeight = this.height;

        function z(a, type, data, split) {
            if (!type || null == type || "" == type) type = "bottom_center";
            if (!split || null == split || "" == split) split = /\n/;
            var d = a.measureText("田").width;
            var textArray = data.text.split(split), height = 0;
            var maxLength = 0, maxText = textArray[0];
            var lineSpace = (!data || !data.lineSpace || null == data.lineSpace || typeof(data.lineSpace) !== "number" || data.lineSpace <= 0) ? 1 : data.lineSpace;
            for (var i = textArray.length; i >= 0; i--) {
                var text = textArray[i]
                if (!text) continue;
                var textLength = text.length;
                if (textLength >= maxLength) {
                    maxLength = textLength;
                    maxText = text;
                }
                height = (height == 0) ? height + d : height + d + lineSpace;
            }
            var textWidth = a.measureText(maxText).width,
                textHeight = height,
                site = {textArray: textArray, width: textWidth, height: textHeight, lineSpace: lineSpace, x: 0, y: 0};
            switch (type.toLowerCase()) {
                case "top_center":
                    site.x = -nodeWidth / 2 + (nodeWidth - textWidth) / 2;
                    site.y = -nodeHeight / 2 - textHeight / 2;
                    break;
                case "top_right":
                    site.x = nodeWidth / 2;
                    site.y = -nodeHeight / 2 - textHeight / 2;
                    break;
                case "top_left":
                    site.x = -nodeWidth / 2 - textWidth;
                    site.y = -nodeHeight / 2 - textHeight / 2;
                    break;
                case "bottom_center":
                    site.x = -nodeWidth / 2 + (nodeWidth - textWidth) / 2;
                    site.y = nodeHeight / 2 + d;
                    break;
                case "bottom_right":
                    site.x = nodeWidth / 2;
                    site.y = nodeHeight / 2 + d;
                    break;
                case "bottom_left":
                    site.x = -nodeWidth / 2 - textWidth;
                    site.y = nodeHeight / 2 + d;
                    break;
                case "middle_center":
                    site.x = -nodeWidth / 2 + (nodeWidth - textWidth) / 2;
                    site.y = -textHeight / 2 + d;
                    break;
                case "middle_right":
                    site.x = nodeWidth / 2;
                    site.y = -textHeight / 2 + d;
                    break;
                case "middle_left":
                    site.x = -nodeWidth / 2 - textWidth;
                    site.y = -textHeight / 2 + d;
                    break;
            }
            site.x += (!data || !data.textOffsetX || null == data.textOffsetX || typeof(data.textOffsetX) !== "number") ? 0 : data.textOffsetX;
            site.y += (!data || !data.textOffsetY || null == data.textOffsetY || typeof(data.textOffsetY) !== "number") ? 0 : data.textOffsetY;
            return site;
        }

        if (typeof(b) === "string") {
            a.beginPath();
            a.font = this.font;
            a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
            var offsetx = this.textOffsetX, offsety = this.textOffsetY;
            var data = {
                text: b,
                font: this.font,
                fontColor: this.fontColor,
                alpha: this.alpha,
                textOffsetX: offsetx,
                textOffsetY: offsety,
                lineSpace: 1
            };
            var e = z(a, this.textPosition, data);
            a.wrapText(e);
            a.closePath();
        } else {
            for (var pop in b) {
                var data = b[pop];
                if (!data || null == data) continue;
                data.font = (data.font && null != data.font && "" != data.font) ? data.font : this.font;
                data.fontColor = (data.fontColor && null != data.fontColor && "" != data.fontColor) ? data.fontColor : this.fontColor;
                data.alpha = (data.alpha && null != data.alpha && "" != data.alpha) ? data.alpha : this.alpha;
                a.beginPath();
                a.font = data.font;
                a.fillStyle = "rgba(" + data.fontColor + ", " + data.alpha + ")";
                var e = z(a, pop, data);
                a.wrapText(e);
                a.closePath();
            }
        }
    }

    function b(a) {
        this.paintText = p,
            b.prototype.initialize.apply(this, arguments)
    }

    function c(a) {
        this.paintText = p,
            b.prototype.initialize.apply(this, arguments)
    }

    function d(a, b, c) {
        this.paintText = p,
            b.prototype.initialize.apply(this, arguments)
    }

    function e(a) {
        this.paintText = p,
            b.prototype.initialize.apply(this, arguments)
    }

    b.prototype = new a.Node,
        c.prototype = new a.TextNode,
        d.prototype = new a.LinkNode,
        e.prototype = new a.CircleNode,
        a.Node = b,
        a.TextNode = c,
        a.LinkNode = d,
        a.CircleNode = e;
}(JTopo),
    /**
     * Jtopo 针对节点图形关系的自动布局(基于springy的弹力模型) S_Autumn扩展
     * 用法: JTopo.Layout.layoutGraph(_scene, _node, 4, {width:100,height:100});
     * 在场景_scene内，以_node为根，在图形边界为  宽100 高100的范围下 自动布局 最大深度为 4 的图形
     *
     * TODO
     * 通过整合序列化、或者对自动布局进行扩展
     * 先递归原数据进行数据分析获得布局参数对象
     * 根据布局参数在循环创建节点同时设置位置完成布局（原 创建节点一次循环、分析一次循环（递归）、布局一次循环减少为分析一次循环、创建及布局一次循环）
     * 达到最大效率
     */
    function (a) {
        var elementType = a.Link;

        function autoLayout(scene, root, maxdeep, layout, start, end) {

            this.doLayout = function (startCallBak, endCallBak) {
                var scene = this.scene;
                var graph = new Springy.Graph();
                graph.loadJSON(this.graph);
                var boundX = this.layout.width;//宽度边界
                var boundY = this.layout.height;//高度边界
                //最后2参数 一个是频率（弹力模型），静态判断阈值（阈值越小图形越精细、越耗能）
                var layout = new Springy.Layout.ForceDirected(graph, boundX, boundY, 0.5, 0.02);
                var currentBB = layout.getBoundingBox();
                var targetBB = {bottomleft: new Springy.Vector(-2, -2), topright: new Springy.Vector(2, 2)};
                Springy.requestAnimationFrame(function adjust() {
                    targetBB = layout.getBoundingBox();
                    currentBB = {
                        bottomleft: currentBB.bottomleft.add(targetBB.bottomleft.subtract(currentBB.bottomleft).divide(10)),
                        topright: currentBB.topright.add(targetBB.topright.subtract(currentBB.topright).divide(10))
                    };
                    Springy.requestAnimationFrame(adjust);
                });
                var toScreen = function (p) {
                    var size = currentBB.topright.subtract(currentBB.bottomleft);
                    var sx = p.subtract(currentBB.bottomleft).divide(size.x).x * boundX;
                    var sy = p.subtract(currentBB.bottomleft).divide(size.y).y * boundY;
                    return new Springy.Vector(sx, sy);
                };
                var store = {};//节点容器
                var start = undefined, end = undefined;
                if (typeof (startCallBak) == "function") start = startCallBak;
                if (typeof (endCallBak) == "function") end = endCallBak;
                //这里本来可以使用模型静止时触发回调在布局，但是出来的效果不好
                var renderer = new Springy.Renderer(
                    layout,
                    function clear() {
                    },
                    function drawEdge(edge, p1, p2) {
                    },
                    function drawNode(point, position) {
                        var s = toScreen(position);
                        var jNode = store[point.id] ? store[point.id] : scene.findElements(function (e) {
                            return e._id == point.id
                        })[0];
                        jNode.setLocation(s.x, s.y);
                    }, end, start
                );
                renderer.start();
            },
                this.getChildren = function (a) {
                    var b = this.scene.childs, d = [], e = 0, f = 0;
                    var inlinks = a.inLinks, outlinks = a.outLinks;
                    if (inlinks instanceof Array) {
                        for (; e < inlinks.length; e++) {
                            var nodeChild = inlinks[e].nodeA;
                            if (this.visited.val.indexOf(nodeChild._id) == -1) {
                                d.push(nodeChild);
                                this.graph.edges.push([a._id, nodeChild._id]);
                            }
                        }
                    }
                    if (outlinks instanceof Array) {
                        for (; f < outlinks.length; f++) {
                            var nodeChild = outlinks[f].nodeZ;
                            if (this.visited.val.indexOf(nodeChild._id) == -1) {
                                d.push(nodeChild);
                                this.graph.edges.push([a._id, nodeChild._id]);
                            }
                        }
                    }
                    if (this.visited.val.indexOf(a._id) == -1) {
                        this.visited.val += (!this.visited.val || this.visited.val == null || this.visited.val == "") ? a._id : "," + a._id;
                        this.graph.nodes.push(a._id);
                    }
                    return d;
                },
                this.analysisNode = function (b, deep) {
                    if (!deep || null == deep || typeof(deep) !== "number") deep = 0;
                    //递归拜访过节点b时 终止本次继续递归（防止环形图关系发生死递归）
                    if (this.visited.val.indexOf(b._id) > -1) return;
                    //将以this.root为根的递归方式计算每个节点与root的深度（最小、无向） 并绑定在节点上
                    if (b.layout && b.layout.type == "graph" && typeof(b.layout.deep) === "number") {
                        b.layout.deep = b.layout.deep > deep ? deep : b.layout.deep;
                    } else {
                        b.layout = {
                            type: 'graph',
                            root: this.root,
                            deep: deep,
                            width: this.layout.width,
                            height: this.layout.height
                        };
                    }
                    //访问节点b 并获得与其最近的节点数组c
                    var c = this.getChildren(b);
                    //终止条件
                    if ((deep >= this.maxdeep && this.maxdeep != -1) || 0 == c.length) return null;
                    //this.setLocation(b, c); 原坐标布局方法（废弃）
                    deep++;
                    for (var d = 0; d < c.length; d++) {
                        this.analysisNode(c[d], deep);
                    }
                },
                this.removeUnVisited = function () {
                    var nodes = this.scene.getDisplayedNodes();
                    if (nodes && nodes instanceof Array) {
                        var links = this.graph.edges;
                        for (var i = 0; i < nodes.length; i++) {
                            var tarNode = nodes[i];
                            if (tarNode && this.visited.val.indexOf(tarNode._id) == -1) {
                                if (links && links instanceof Array) {
                                    for (var j = links.length - 1; j >= 0; j--) {
                                        if (links[j] && (links[j][0] == tarNode._id || links[j][1] == tarNode._id))
                                            links.splice(j, 1);
                                    }
                                }
                                this.scene.remove(nodes[i]);
                            }
                        }
                    }
                },
                this.initialize = function (a, b, c, d, e, f) {
                    this.scene = a,//场景
                        this.visited = {val: ""},//访问过的节点
                        this.root = b,//根节点
                        this.maxdeep = c,//为-1时是全递归
                        this.layout = d, //{}
                        this.graph = {"nodes": [], "edges": []};//布局图像对象
                    if (!this.maxdeep || null == this.maxdeep || typeof(this.maxdeep) !== "number") this.maxdeep = -1;
                    this.layout = {
                        type: 'graph',
                        width: a.stage.canvas.width * 0.7,
                        height: a.stage.canvas.height * 0.7
                    };
                    undefined != d && null != d && d.width && typeof(d.width) === "number" && (this.layout.width = d.width);
                    undefined != d && null != d && d.height && typeof(d.height) === "number" && (this.layout.height = d.height);
                    this.scene.hide();
                    this.analysisNode(this.root, 0);
                    this.removeUnVisited();
                    this.scene.show();
                    this.doLayout(e, f);
                },
                this.initialize(scene, root, maxdeep, layout, start, end);
        }

        a.layout.layoutgraph = a.Layout.layoutGraph = autoLayout;
    }(JTopo),

    /**
     * Jtopo 针对Json数据的序列化、反序列化完善 S_Autumn扩展
     */
    function (a) {

        //递归获得数据构造 每个成员都存在_id（描述自己） elementType（描述自己） structType（针对node、link描述自己） masterKey（描述父）属性
        function buildDataForSeriailze(stage, selfPopSave) {
            this.data = [],
                this.get = function (key) {
                    if (undefined == key || null == key || "" == key) return null;
                    var i = 0, imax = this.data.length;
                    for (; i < imax; i++) {
                        if (this.data[i]._id == key) {
                            return this.data[i];
                        }
                    }
                    return null;
                },
                this.add = function (obj) {
                    if (undefined == obj || null == obj) return null;
                    this.data.push(obj);
                },
                this.update = function (obj) {
                    if (undefined == obj || null == obj) return null;
                    var i = 0, imax = this.data.length;
                    for (; i < imax; i++) {
                        if (this.data[i]._id == obj._id) {
                            this.data[i] = obj;
                            break;
                        }
                    }
                    ;
                },
                this.loop = function (obj, masterKey, dataBuild) {
                    var _obj = new Object();
                    var containObj = this.get(obj._id);
                    if (null != containObj) {
                        //已经存在元素时(主要是处理容器中的节点与连线，已经是scene的子重复加入情况)此时仅需要更新 元素的masterKey属性
                        _obj = containObj
                        if (undefined != masterKey && null != masterKey) _obj["masterKey"].push(masterKey);
                        this.update(_obj);
                    } else {
                        var popArray = obj.serializedProperties;
                        if (undefined == popArray || null == popArray || !(popArray instanceof Array)) return null;
                        var i = 0, imax = popArray.length;
                        for (; i < imax; i++) {
                            var pop = popArray[i];
                            if (undefined == pop || null == pop || "" == pop) continue;
                            //由于background属性被 作者使用js Object原型更改了get set 所以单独处理
                            if (pop == "background" && undefined != obj.background && null != obj.background)
                                _obj["background"] = obj.background.src;
                            else
                                _obj[pop] = obj[pop];
                        }
                        //防止唯一识别键不存在
                        if (obj._id == undefined || obj._id == null || obj._id == "")
                            _obj._id = "" + Math.ceil(Math.random() * (new Date).getTime());
                        else
                            _obj._id = obj._id;
                        //设置masterKey 当前元素的父元素描述存储于masterKey 其是{elementType:"",id:""}的数组组成（可能多个父）
                        _obj["masterKey"] = [];
                        if (undefined != masterKey && null != masterKey) _obj["masterKey"].push(masterKey);
                        //stage 是没有elementType属性的 由此确定stage元素 并补全属性
                        if (undefined == _obj["elementType"])
                            _obj["elementType"] = "stage";
                        //目前elementType只能描述元素大类
                        //对于node 、link 详细元素种类没有确定所以要补全
                        if (obj instanceof a.Node) {
                            _obj["structType"] = "Node"
                        }
                        if (obj instanceof a.TextNode) {
                            _obj["structType"] = "TextNode"
                        }
                        if (obj instanceof a.LinkNode) {
                            _obj["structType"] = "LinkNode"
                        }
                        if (obj instanceof a.CircleNode) {
                            _obj["structType"] = "CircleNode"
                        }
                        if (obj instanceof a.AnimateNode) {
                            _obj["structType"] = "AnimateNode"
                        }
                        if (obj instanceof a.Link) {
                            _obj["structType"] = "Link";
                            _obj["from"] = obj.nodeA._id;
                            _obj["to"] = obj.nodeZ._id;
                        }
                        if (obj instanceof a.FoldLink) {
                            _obj["structType"] = "FoldLink";
                            _obj["from"] = obj.nodeA._id;
                            _obj["to"] = obj.nodeZ._id;
                        }
                        if (obj instanceof a.FlexionalLink) {
                            _obj["structType"] = "FlexionalLink";
                            _obj["from"] = obj.nodeA._id;
                            _obj["to"] = obj.nodeZ._id;
                        }
                        if (obj instanceof a.CurveLink) {
                            _obj["structType"] = "CurveLink";
                            _obj["from"] = obj.nodeA._id;
                            _obj["to"] = obj.nodeZ._id;
                        }
                        //通常节点上还有 业务逻辑数据对节点进行描述 所以我们必须补全
                        //这里定义 逻辑业务数据属性命名为 sData 他将以对象形式 把所有元素上附属的自定义属性存储于此
                        //如果你的筛选补充规则不符合定义  可以使用dataBuild参数进行回调处理
                        _obj["sData"] = obj["sData"];
                        if (typeof(dataBuild) === "function")
                            _obj["sData"] = dataBuild(obj);
                        this.add(_obj);
                        var childs = obj.childs;
                        if (undefined == childs || null == childs || !(childs instanceof Array) || childs.length <= 0) return null;
                        var j = 0, jmax = childs.length;
                        for (; j < jmax; j++)
                            this.loop(childs[j], {"elementType": _obj["elementType"], "id": _obj._id}, dataBuild);
                    }
                },
                this.initialize = function (stage, selfPopSave) {
                    this.loop(stage, null, selfPopSave);
                    return this.data;
                };
            return this.initialize(stage, selfPopSave);
        }

        function analyseDataForDeSeriailze(data, canvas) {
            this.find = function (callback) {
                if (typeof(callback) !== "function") return null;
                var i = 0, imax = this.data.length, _data = [];
                for (; i < imax; i++) {
                    var item = this.data[i];
                    if (true == callback.call(this, item))
                        _data.push(item);
                }
                return _data;
            },
                this.analyseData = function () {
                    var i = 0, imax = this.data.length;
                    for (; i < imax; i++) {
                        var e = this.data[i];
                        switch (e.elementType.toLowerCase()) {
                            case "stage":
                                this.stages.push(e);
                                break;
                            case "scene":
                                this.scenes.push(e);
                                break;
                            case "node":
                                this.nodes.push(e);
                                break;
                            case "link":
                                this.links.push(e);
                                break;
                            case "container":
                                this.containers.push(e);
                                break;
                            default:
                                break;
                        }
                    }
                },
                this.loadStage = function () {
                    var stage = new JTopo.Stage(this.canvas);
                    if (this.stages.length > 0) {
                        //因为stage只有一个并且从stage开始递归的数据
                        var _stages = this.stages[0]
                        $.extend(stage, _stages);
                        //移除自定义构造属性
                        delete stage.masterKey;
                        delete stage.elementType;
                    }
                    ;
                    return stage;
                },
                this.loadScenes = function (stage) {
                    var scenes = [];
                    if (this.scenes.length > 0) {
                        var i = 0, imax = this.scenes.length;
                        for (; i < imax; i++) {
                            var scene = new JTopo.Scene(stage);
                            $.extend(scene, this.scenes[i]);
                            //移除自定义构造属性
                            delete scene.masterKey;
                            scenes.push(scene);
                        }
                    } else {
                        scenes.push(new JTopo.Scene(stage));
                    }
                    return scenes;
                },
                this.loadContainers = function (scenes) {
                    var containers = [];
                    if (this.containers.length > 0) {
                        var i = 0, imax = this.containers.length;
                        for (; i < imax; i++) {
                            var _container = this.containers[i];
                            var container = new a.Container;
                            $.extend(container, _container);
                            //移除自定义构造属性
                            delete container.masterKey;
                            var isload = false;
                            if (scenes.length == 1) {
                                scenes[0].add(container);
                                isload = true;
                            } else {
                                var masters = _container.masterKey;
                                if (masters.length > 0) {
                                    for (var j = 0; j < scenes.length; j++) {
                                        var scene = scenes[j];
                                        for (var k = 0; k < masters.length; k++) {
                                            var master = masters[k];
                                            if ("scene" == master.elementType && master.id == scene._id) {
                                                scene.add(container);
                                                isload = true;
                                            }
                                        }
                                    }
                                }
                            }
                            if (isload == true) {
                                containers.push(container);
                            }
                        }
                    }
                    return containers;
                },
                this.loadNodes = function (scenes, containers) {
                    var nodes = [];
                    if (this.nodes.length > 0) {
                        var i = 0, imax = this.nodes.length;
                        for (; i < imax; i++) {
                            var _node = this.nodes[i];
                            var node = new a[_node.structType](_node.text);
                            $.extend(node, _node);
                            //移除自定义构造属性
                            delete node.masterKey;
                            delete node.structType;
                            if (node.imagesrc != undefined && node.imagesrc != null && node.imagesrc != null)
                                node.setImage(node.imagesrc, false);
                            var isload = false;
                            if (scenes.length == 1) {
                                scenes[0].add(node);
                                isload = true;
                            }
                            var masters = _node.masterKey;
                            if (masters.length > 0) {
                                for (var k = 0; k < masters.length; k++) {
                                    var master = masters[k];
                                    if (isload == false && "scene" == master.elementType) {
                                        for (var j = 0; j < scenes.length; j++) {
                                            var scene = scenes[j];
                                            if (master.id == scene._id) {
                                                scene.add(node);
                                                isload = true;
                                            }
                                        }
                                    }
                                    if ("container" == master.elementType) {
                                        for (var l = 0; l < containers.length; l++) {
                                            var container = containers[l];
                                            if (master.id == container._id) {
                                                container.add(node);
                                            }
                                        }
                                    }
                                }
                            }
                            if (isload == true) {
                                nodes.push(node);
                            }
                        }
                    }
                    return nodes;
                },
                this.loadLinks = function (scenes, nodes) {
                    var links = [];
                    if (this.links.length > 0) {
                        var i = 0, imax = this.links.length;
                        for (; i < imax; i++) {
                            var _link = this.links[i];
                            var isload = false;
                            var nodeA = null, nodeZ = null;
                            for (var z = 0; z < nodes.length; z++) {
                                var id = nodes[z]._id;
                                if (id == _link.from) {
                                    nodeA = nodes[z];
                                }
                                if (id == _link.to) {
                                    nodeZ = nodes[z];
                                }
                                if (null != nodeA && null != nodeZ) {
                                    break;
                                }
                            }
                            if (null != nodeA && null != nodeZ) {
                                var link = new a[_link.structType](nodeA, nodeZ, _link.text);
                                $.extend(link, _link);
                                //移除自定义构造属性
                                delete link.masterKey;
                                delete link.structType;
                                delete link.from;
                                delete link.to;
                                if (scenes.length == 1) {
                                    scenes[0].add(link);
                                    isload = true;
                                } else {
                                    var masters = _link.masterKey;
                                    if (masters.length > 0) {
                                        for (var j = 0; j < scenes.length; j++) {
                                            var scene = scenes[j];
                                            for (var k = 0; k < masters.length; k++) {
                                                var master = masters[k];
                                                if ("scene" == master.elementType && master.id == scene._id) {
                                                    scene.add(link);
                                                    isload = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                if (isload == true) {
                                    links.push(link);
                                }
                            }
                        }
                    }
                    return links;
                },
                this.loadForJTopo = function () {
                    var stage = this.loadStage();
                    var scenes = this.loadScenes(stage);
                    var containers = this.loadContainers(scenes);
                    var nodes = this.loadNodes(scenes, containers);
                    var links = this.loadLinks(scenes, nodes);
                    return {"stage": stage, "scenes": scenes, "containers": containers, "nodes": nodes, "links": links};
                },
                this.initialize = function (data, canvas) {
                    if (undefined == data || null == data || !(data instanceof Array) || data.length <= 0) return false;
                    if (undefined == canvas || null == canvas) return false;
                    this.canvas = canvas;
                    this.data = data;
                    this.stages = [];
                    this, scenes = [];
                    this, nodes = [];
                    this, links = [];
                    this, containers = [];
                    this.analyseData();
                    return this.loadForJTopo();
                };
            return this.initialize(data, canvas);
        }

        /*
         *序列化
         *  返回
         *    [{
         *    _id:xxx(唯一标识),
         *    elementType:xxx(元素类型),
         *    masterKey:xxx(父元素 元素id的数组),
         *    structType:xxx（针对node、link——详细类别）,
         *    form:xxx（针对link——连线关系描述 node的_id）,
         *    to:xxx（针对link——连线关系描述 node的_id）,
         *    ...},...]
         */
        function seriailzeToJSON(stage, selfPopSave) {
            //保证是Jtopo stage对象
            if (stage instanceof a.Stage)
                return JSON.stringify(buildDataForSeriailze(stage, selfPopSave));
            return null;
        }

        /*
         *反序列化
         *  返回
         *      {"stage":stage,
         *      "scenes":scenes,
         *      "containers":containers,
         *      "nodes":nodes,
         *      "links":links}
         */
        function deSeriailzeByJSON(data, canvas) {
            if (undefined == data || null == data) return null;
            if (typeof data == "string") {
                try {
                    data = JSON.parse(data);

                } catch (e) {
                    throw new Error("data数据不是一个json字符串!");
                }
            }
            return analyseDataForDeSeriailze(data, canvas);
        }

        a.deSeriailzeByJSON = deSeriailzeByJSON;

        a.seriailzeToJSON = seriailzeToJSON;
    }(JTopo);

/**
 * Springy v2.7.1 图形自动布局（弹力模型实现）
 *
 * Copyright (c) 2010-2013 Dennis Hotson
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function () {
            return (root.returnExportsGlobal = factory());
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals
        root.Springy = factory();
    }
}(this,
    function () {

        var Springy = {};

        /*Springy.Graph定义*/
        var Graph = Springy.Graph = function () {
            this.nodeSet = {};//节点id唯一标识set
            this.nodes = [];//节点数组容器
            this.edges = [];//连线数组容器
            this.adjacency = {};//有连线关系的 发出节点set  每个成员子对象是目标节点

            this.nextNodeId = 0;
            this.nextEdgeId = 0;
            this.eventListeners = [];
        };

        /*节点定义*/
        var Node = Springy.Node = function (id, data) {
            this.id = id;
            this.data = (data !== undefined) ? data : {};

            // Data fields used by layout algorithm in this file:
            // this.data.mass
            // Data used by default renderer in springyui.js
            // this.data.label
        };

        /*连线定义*/
        var Edge = Springy.Edge = function (id, source, target, data) {
            this.id = id;
            this.source = source;
            this.target = target;
            this.data = (data !== undefined) ? data : {};

            // Edge data field used by layout alorithm
            // this.data.length
            // this.data.type
        };

        /*添加一个节点*/
        Graph.prototype.addNode = function (node) {
            if (!(node.id in this.nodeSet)) {
                this.nodes.push(node);
            }

            this.nodeSet[node.id] = node;

            this.notify();
            return node;
        };

        /*添加多个节点 参数个数*/
        Graph.prototype.addNodes = function () {
            // accepts variable number of arguments, where each argument
            // is a string that becomes both node identifier and label
            for (var i = 0; i < arguments.length; i++) {
                var name = arguments[i];
                var node = new Node(name, {label: name});
                this.addNode(node);
            }
        };

        /*添加一个连线*/
        Graph.prototype.addEdge = function (edge) {
            var exists = false;
            this.edges.forEach(function (e) {
                if (edge.id === e.id) {
                    exists = true;
                }
            });

            //如果连线 在线set中不存在
            if (!exists) {
                this.edges.push(edge);
            }

            //如果连线 发出节点 线set中不存在
            if (!(edge.source.id in this.adjacency)) {
                this.adjacency[edge.source.id] = {};
            }
            //如果连线 接收节点 指定发出节点的线set中不存在
            if (!(edge.target.id in this.adjacency[edge.source.id])) {
                this.adjacency[edge.source.id][edge.target.id] = [];
            }

            exists = false;
            this.adjacency[edge.source.id][edge.target.id].forEach(function (e) {
                if (edge.id === e.id) {
                    exists = true;
                }
            });

            //指定发出节点的线set中 对应的接收节点不存在
            if (!exists) {
                this.adjacency[edge.source.id][edge.target.id].push(edge);
            }

            this.notify();
            return edge;
        };

        /*添加多个连线*/
        Graph.prototype.addEdges = function () {
            // accepts variable number of arguments, where each argument
            // is a triple [nodeid1, nodeid2, attributes]
            for (var i = 0; i < arguments.length; i++) {
                var e = arguments[i];
                var node1 = this.nodeSet[e[0]];
                if (node1 == undefined) {
                    throw new TypeError("invalid node name: " + e[0]);
                }
                var node2 = this.nodeSet[e[1]];
                if (node2 == undefined) {
                    throw new TypeError("invalid node name: " + e[1]);
                }
                var attr = e[2];

                this.newEdge(node1, node2, attr);
            }
        };

        /*创建一个节点*/
        Graph.prototype.newNode = function (data) {
            var node = new Node(this.nextNodeId++, data);
            this.addNode(node);
            return node;
        };

        /*新建一个节点*/
        Graph.prototype.newEdge = function (source, target, data) {
            var edge = new Edge(this.nextEdgeId++, source, target, data);
            this.addEdge(edge);
            return edge;
        };


        /**
         Springy's simple JSON format for graphs.
         historically, Springy uses separate lists
         of nodes and edges:

         {
             "nodes": [
                 "center",
                 "left",
                 "right",
                 "up",
                 "satellite"
             ],
             "edges": [
                 ["center", "left"],
                 ["center", "right"],
                 ["center", "up"]
             ]
         }

         **/
        Graph.prototype.loadJSON = function (json) {
            // parse if a string is passed (EC5+ browsers)
            if (typeof json == 'string' || json instanceof String) {
                json = JSON.parse(json);
            }

            if ('nodes' in json || 'edges' in json) {
                this.addNodes.apply(this, json['nodes']);
                this.addEdges.apply(this, json['edges']);
            }
        }


        // find the edges from node1 to node2
        /*获得node1与node2的连线组*/
        Graph.prototype.getEdges = function (node1, node2) {
            if (node1.id in this.adjacency
                && node2.id in this.adjacency[node1.id]) {
                return this.adjacency[node1.id][node2.id];
            }

            return [];
        };

        /*移除一个节点*/
        Graph.prototype.removeNode = function (node) {
            if (node.id in this.nodeSet) {
                delete this.nodeSet[node.id];
            }

            for (var i = this.nodes.length - 1; i >= 0; i--) {
                if (this.nodes[i].id === node.id) {
                    this.nodes.splice(i, 1);
                }
            }

            this.detachNode(node);
        };

        // removes edges associated with a given node
        /*注销一个节点*/
        Graph.prototype.detachNode = function (node) {
            var tmpEdges = this.edges.slice();
            tmpEdges.forEach(function (e) {
                if (e.source.id === node.id || e.target.id === node.id) {
                    this.removeEdge(e);
                }
            }, this);

            this.notify();
        };

        // remove a node and it's associated edges from the graph
        /*移除一个连线*/
        Graph.prototype.removeEdge = function (edge) {
            for (var i = this.edges.length - 1; i >= 0; i--) {
                if (this.edges[i].id === edge.id) {
                    this.edges.splice(i, 1);
                }
            }

            for (var x in this.adjacency) {
                for (var y in this.adjacency[x]) {
                    var edges = this.adjacency[x][y];

                    for (var j = edges.length - 1; j >= 0; j--) {
                        if (this.adjacency[x][y][j].id === edge.id) {
                            this.adjacency[x][y].splice(j, 1);
                        }
                    }

                    // Clean up empty edge arrays
                    if (this.adjacency[x][y].length == 0) {
                        delete this.adjacency[x][y];
                    }
                }

                // Clean up empty objects
                if (isEmpty(this.adjacency[x])) {
                    delete this.adjacency[x];
                }
            }

            this.notify();
        };

        /* Merge a list of nodes and edges into the current graph. eg. 将数据信息 合并为 顶点与连线对象
         var o = {
         nodes: [
         {id: 123, data: {type: 'user', userid: 123, displayname: 'aaa'}},
         {id: 234, data: {type: 'user', userid: 234, displayname: 'bbb'}}
         ],
         edges: [
         {from: 0, to: 1, type: 'submitted_design', directed: true, data: {weight: }}
         ]
         }
         */
        Graph.prototype.merge = function (data) {
            var nodes = [];
            data.nodes.forEach(function (n) {
                nodes.push(this.addNode(new Node(n.id, n.data)));
            }, this);

            data.edges.forEach(function (e) {
                var from = nodes[e.from];
                var to = nodes[e.to];

                var id = (e.directed)
                    ? (id = e.type + "-" + from.id + "-" + to.id)
                    : (from.id < to.id) // normalise id for non-directed edges
                        ? e.type + "-" + from.id + "-" + to.id
                        : e.type + "-" + to.id + "-" + from.id;

                var edge = this.addEdge(new Edge(id, from, to, e.data));
                edge.data.type = e.type;
            }, this);
        };

        //筛选节点
        Graph.prototype.filterNodes = function (fn) {
            var tmpNodes = this.nodes.slice();
            tmpNodes.forEach(function (n) {
                if (!fn(n)) {
                    this.removeNode(n);
                }
            }, this);
        };

        //筛选连线
        Graph.prototype.filterEdges = function (fn) {
            var tmpEdges = this.edges.slice();
            tmpEdges.forEach(function (e) {
                if (!fn(e)) {
                    this.removeEdge(e);
                }
            }, this);
        };

        // 图片行为监听
        Graph.prototype.addGraphListener = function (obj) {
            this.eventListeners.push(obj);
        };

        // 通知进行更新行为
        Graph.prototype.notify = function () {
            this.eventListeners.forEach(function (obj) {
                obj.graphChanged();
            });
        };

        // 动态计算 图形布局
        var Layout = Springy.Layout = {};

        //物理力学模型定义
        Layout.ForceDirected = function (graph, stiffness, repulsion, damping, minEnergyThreshold) {
            this.graph = graph;
            this.stiffness = stiffness; // spring stiffness constant 吸引度(力矩 对应画布x轴大小)
            this.repulsion = repulsion; // repulsion constant 排斥度(力矩  对应画布y轴大小)
            this.damping = damping; // velocity damping factor 幅度（影响调整速度）
            this.minEnergyThreshold = minEnergyThreshold || 0.01; //threshold used to determine render stop 极限阈值

            this.nodePoints = {}; // keep track of points associated with nodes
            this.edgeSprings = {}; // keep track of springs associated with edges
        };

        //节点数据 转换为 顶点
        Layout.ForceDirected.prototype.point = function (node) {
            if (!(node.id in this.nodePoints)) {
                var mass = (node.data.mass !== undefined) ? node.data.mass : 1.0;
                this.nodePoints[node.id] = new Layout.ForceDirected.Point(Vector.random(), mass);
            }

            return this.nodePoints[node.id];
        };

        //连线数据 转换为 弹簧
        Layout.ForceDirected.prototype.spring = function (edge) {
            if (!(edge.id in this.edgeSprings)) {
                var length = (edge.data.length !== undefined) ? edge.data.length : 1.0;

                var existingSpring = false;

                var from = this.graph.getEdges(edge.source, edge.target);
                from.forEach(function (e) {
                    if (existingSpring === false && e.id in this.edgeSprings) {
                        existingSpring = this.edgeSprings[e.id];
                    }
                }, this);

                if (existingSpring !== false) {
                    return new Layout.ForceDirected.Spring(existingSpring.point1, existingSpring.point2, 0.0, 0.0);
                }

                var to = this.graph.getEdges(edge.target, edge.source);
                from.forEach(function (e) {
                    if (existingSpring === false && e.id in this.edgeSprings) {
                        existingSpring = this.edgeSprings[e.id];
                    }
                }, this);

                if (existingSpring !== false) {
                    return new Layout.ForceDirected.Spring(existingSpring.point2, existingSpring.point1, 0.0, 0.0);
                }

                this.edgeSprings[edge.id] = new Layout.ForceDirected.Spring(
                    this.point(edge.source), this.point(edge.target), length, this.stiffness
                );
            }

            return this.edgeSprings[edge.id];
        };

        // callback should accept two arguments: Node, Point 点遍历
        Layout.ForceDirected.prototype.eachNode = function (callback) {
            var t = this;
            this.graph.nodes.forEach(function (n) {
                callback.call(t, n, t.point(n));
            });
        };

        // callback should accept two arguments: Edge, Spring 线遍历
        Layout.ForceDirected.prototype.eachEdge = function (callback) {
            var t = this;
            this.graph.edges.forEach(function (e) {
                callback.call(t, e, t.spring(e));
            });
        };

        // callback should accept one argument: Spring 弹簧遍历
        Layout.ForceDirected.prototype.eachSpring = function (callback) {
            var t = this;
            this.graph.edges.forEach(function (e) {
                callback.call(t, t.spring(e));
            });
        };


        // Physics stuff 物理模型算法

        //库伦定律
        Layout.ForceDirected.prototype.applyCoulombsLaw = function () {
            this.eachNode(function (n1, point1) {
                this.eachNode(function (n2, point2) {
                    if (point1 !== point2) {
                        var d = point1.p.subtract(point2.p);
                        var distance = d.magnitude() + 0.1; // avoid massive forces at small distances (and divide by zero)
                        var direction = d.normalise();

                        // apply force to each end point
                        point1.applyForce(direction.multiply(this.repulsion).divide(distance * distance * 0.5));
                        point2.applyForce(direction.multiply(this.repulsion).divide(distance * distance * -0.5));
                    }
                });
            });
        };

        //弹力  胡克定律
        Layout.ForceDirected.prototype.applyHookesLaw = function () {
            this.eachSpring(function (spring) {
                var d = spring.point2.p.subtract(spring.point1.p); // the direction of the spring
                var displacement = spring.length - d.magnitude();
                var direction = d.normalise();

                // apply force to each end point
                spring.point1.applyForce(direction.multiply(spring.k * displacement * -0.5));
                spring.point2.applyForce(direction.multiply(spring.k * displacement * 0.5));
            });
        };

        //吸引力
        Layout.ForceDirected.prototype.attractToCentre = function () {
            this.eachNode(function (node, point) {
                var direction = point.p.multiply(-1.0);
                point.applyForce(direction.multiply(this.repulsion / 50.0));
            });
        };

        //修改节点点的位置
        Layout.ForceDirected.prototype.updateVelocity = function (timestep) {
            this.eachNode(function (node, point) {
                // Is this, along with updatePosition below, the only places that your
                // integration code exist?
                point.v = point.v.add(point.a.multiply(timestep)).multiply(this.damping);
                point.a = new Vector(0, 0);
            });
        };

        //修改节点点的位置
        Layout.ForceDirected.prototype.updatePosition = function (timestep) {
            this.eachNode(function (node, point) {
                // Same question as above; along with updateVelocity, is this all of
                // your integration code?
                point.p = point.p.add(point.v.multiply(timestep));
            });
        };

        // Calculate the total kinetic energy of the system 系统中的总热量
        Layout.ForceDirected.prototype.totalEnergy = function (timestep) {
            var energy = 0.0;
            this.eachNode(function (node, point) {
                var speed = point.v.magnitude();
                energy += 0.5 * point.m * speed * speed;
            });

            return energy;
        };

        /**异步延迟执行 requestAnimationFrame 并且把 参数me 替换到fn this中*/
        var __bind = function (fn, me) {
            return function () {
                return fn.apply(me, arguments);
            };
        }; // stolen from coffeescript, thanks jashkenas! ;-)
        Springy.requestAnimationFrame = __bind(this.requestAnimationFrame ||
            this.webkitRequestAnimationFrame ||
            this.mozRequestAnimationFrame ||
            this.oRequestAnimationFrame ||
            this.msRequestAnimationFrame ||
            (function (callback, element) {
                this.setTimeout(callback, 10);
            }), this);


        /**
         * 力学模型作用开始
         * Start simulation if it's not running already.
         * In case it's running then the call is ignored,
         * and none of the callbacks passed is ever executed.
         */
        Layout.ForceDirected.prototype.start = function (render, onRenderStop, onRenderStart) {
            var t = this;

            if (this._started) return;
            this._started = true;
            this._stop = false;

            if (onRenderStart !== undefined) {
                onRenderStart();
            }

            Springy.requestAnimationFrame(function step() {
                t.tick(0.03);//执行力学定律模型 布局算法

                if (render !== undefined) {
                    render();
                }

                // stop simulation when energy of the system goes below a threshold  终止条件
                if (t._stop || t.totalEnergy() < t.minEnergyThreshold) {
                    t._started = false;
                    if (onRenderStop !== undefined) {
                        onRenderStop();
                    }
                } else {
                    Springy.requestAnimationFrame(step);//递归
                }
            });
        };

        //力学作用标识
        Layout.ForceDirected.prototype.stop = function () {
            this._stop = true;
        }

        // 单次运行 内容
        Layout.ForceDirected.prototype.tick = function (timestep) {
            this.applyCoulombsLaw();
            this.applyHookesLaw();
            this.attractToCentre();
            this.updateVelocity(timestep);
            this.updatePosition(timestep);
        };

        // Find the nearest point to a particular position 找到与当前节点最近的另一个节点信息
        Layout.ForceDirected.prototype.nearest = function (pos) {
            var min = {node: null, point: null, distance: null};
            var t = this;
            this.graph.nodes.forEach(function (n) {
                var point = t.point(n);
                var distance = point.p.subtract(pos).magnitude();

                if (min.distance === null || distance < min.distance) {
                    min = {node: n, point: point, distance: distance};
                }
            });

            return min;
        };

        // returns [bottomleft, topright] 获得边界范围
        Layout.ForceDirected.prototype.getBoundingBox = function () {
            var bottomleft = new Vector(-2, -2);
            var topright = new Vector(2, 2);

            this.eachNode(function (n, point) {
                if (point.p.x < bottomleft.x) {
                    bottomleft.x = point.p.x;
                }
                if (point.p.y < bottomleft.y) {
                    bottomleft.y = point.p.y;
                }
                if (point.p.x > topright.x) {
                    topright.x = point.p.x;
                }
                if (point.p.y > topright.y) {
                    topright.y = point.p.y;
                }
            });

            var padding = topright.subtract(bottomleft).multiply(0.07); // ~5% padding

            return {bottomleft: bottomleft.subtract(padding), topright: topright.add(padding)};
        };


        // Vector 矢量定义
        var Vector = Springy.Vector = function (x, y) {
            this.x = x;
            this.y = y;
        };

        //矢量方向随机
        Vector.random = function () {
            return new Vector(10.0 * (Math.random() - 0.5), 10.0 * (Math.random() - 0.5));
        };

        //矢量力 增加 y2矢量的力
        Vector.prototype.add = function (v2) {
            return new Vector(this.x + v2.x, this.y + v2.y);
        };

        //矢量力 减少 y2矢量的力
        Vector.prototype.subtract = function (v2) {
            return new Vector(this.x - v2.x, this.y - v2.y);
        };

        //矢量力 沿原方向放大 n倍
        Vector.prototype.multiply = function (n) {
            return new Vector(this.x * n, this.y * n);
        };

        ///矢量力 沿原方向缩小 n倍
        Vector.prototype.divide = function (n) {
            return new Vector((this.x / n) || 0, (this.y / n) || 0); // Avoid divide by zero errors..
        };

        //求矢量的 力度
        Vector.prototype.magnitude = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };

        //求矢量的 反作用力
        Vector.prototype.normal = function () {
            return new Vector(-this.y, this.x);
        };

        //矢量的 余弦和正弦
        Vector.prototype.normalise = function () {
            return this.divide(this.magnitude());
        };

        // 顶点描述
        Layout.ForceDirected.Point = function (position, mass) {
            this.p = position; // position 位置
            this.m = mass; // mass 质量（顶点的边数）
            this.v = new Vector(0, 0); // velocity     速度（匀速力）
            this.a = new Vector(0, 0); // acceleration 加速度
        };

        // 顶点 接受一个力影响
        Layout.ForceDirected.Point.prototype.applyForce = function (force) {
            this.a = this.a.add(force.divide(this.m));
        };

        // 弹簧描述定义
        Layout.ForceDirected.Spring = function (point1, point2, length, k) {
            this.point1 = point1; //出发顶点
            this.point2 = point2; //终止顶点
            this.length = length; // spring length at rest 之间长度
            this.k = k; // spring constant (See Hooke's law) .. how stiff the spring is  胡克常数
        };

        /**
         * 渲染器
         * Renderer handles the layout rendering loop
         * @param onRenderStop optional callback function that gets executed whenever rendering stops.
         * @param onRenderStart optional callback function that gets executed whenever rendering starts.
         */
        var Renderer = Springy.Renderer = function (layout, clear, drawEdge, drawNode, onRenderStop, onRenderStart) {
            this.layout = layout;
            this.clear = clear;
            this.drawEdge = drawEdge;//画线方法
            this.drawNode = drawNode;//画点方法
            this.onRenderStop = onRenderStop; //终止条件方法
            this.onRenderStart = onRenderStart; //开始条件方法

            this.layout.graph.addGraphListener(this);
        }

        Renderer.prototype.graphChanged = function (e) {
            this.start();
        };

        /**
         * Starts the simulation of the layout in use.
         *
         * Note that in case the algorithm is still or already running then the layout that's in use
         * might silently ignore the call, and your optional <code>done</code> callback is never executed.
         * At least the built-in ForceDirected layout behaves in this way.
         *
         * @param done An optional callback function that gets executed when the springy algorithm stops,
         * either because it ended or because stop() was called.
         */
        Renderer.prototype.start = function (done) {
            var t = this;
            this.layout.start(function render() {
                t.clear();

                t.layout.eachEdge(function (edge, spring) {
                    t.drawEdge(edge, spring.point1.p, spring.point2.p);
                });

                t.layout.eachNode(function (node, point) {
                    t.drawNode(node, point.p);
                });
            }, this.onRenderStop, this.onRenderStart);
        };

        Renderer.prototype.stop = function () {
            this.layout.stop();
        };

        // Array.forEach implementation for IE support..
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
        // 基础方法定义
        if (!Array.prototype.forEach) {
            Array.prototype.forEach = function (callback, thisArg) {
                var T, k;
                if (this == null) {
                    throw new TypeError(" this is null or not defined");
                }
                var O = Object(this);
                var len = O.length >>> 0; // Hack to convert O.length to a UInt32
                if ({}.toString.call(callback) != "[object Function]") {
                    throw new TypeError(callback + " is not a function");
                }
                if (thisArg) {
                    T = thisArg;
                }
                k = 0;
                while (k < len) {
                    var kValue;
                    if (k in O) {
                        kValue = O[k];
                        callback.call(T, kValue, k, O);
                    }
                    k++;
                }
            };
        }

        var isEmpty = function (obj) {
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        };

        return Springy;
    }));