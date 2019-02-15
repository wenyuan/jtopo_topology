
/**
 * Decompilation with jsnice < https://www.npmjs.com/package/jsnice >
 * JTopo v0.4.8
 */
!function (window$jscomp$1) {
  /**
   * @return {undefined}
   */
  function Element$jscomp$1() {
    /**
     * @return {undefined}
     */
    this.initialize = function () {
      /** @type {string} */
      this.elementType = "element";
      /** @type {!Array} */
      this.serializedProperties = ["elementType"];
      /** @type {!Array} */
      this.propertiesStack = [];
      /** @type {string} */
      this._id = "" + (new Date).getTime();
    };
    /**
     * @return {undefined}
     */
    this.distroy = function () {
    };
    /**
     * @return {undefined}
     */
    this.removeHandler = function () {
    };
    /**
     * @param {?} m
     * @param {?} name
     * @return {?}
     */
    this.attr = function (m, name) {
      if (null != m && null != name) {
        this[m] = name;
      } else {
        if (null != m) {
          return this[m];
        }
      }
      return this;
    };
    /**
     * @return {undefined}
     */
    this.save = function () {
      var suggestionToBeAdded = this;
      var res = {};
      this.serializedProperties.forEach(function (k) {
        res[k] = suggestionToBeAdded[k];
      });
      this.propertiesStack.push(res);
    };
    /**
     * scene.restore();
     * @return {undefined}
     */
    this.restore = function () {
      if (null != this.propertiesStack && 0 != this.propertiesStack.length) {
        var ncfg = this;
        var cfg = this.propertiesStack.pop();
        this.serializedProperties.forEach(function (key) {
          ncfg[key] = cfg[key];
        });
      }
    };
    /**
     * @return {?}
     */
    this.toJson = function () {
      var eventTypes = this;
      /** @type {string} */
      var typeModule = "{";
      var datesCount = this.serializedProperties.length;
      return this.serializedProperties.forEach(function (event, dateIndex) {
        var type = eventTypes[event];
        if ("string" == typeof type) {
          /** @type {string} */
          type = '"' + type + '"';
        }
        typeModule = typeModule + ('"' + event + '":' + type);
        if (datesCount > dateIndex + 1) {
          /** @type {string} */
          typeModule = typeModule + ",";
        }
      }), typeModule = typeModule + "}";
    };
  }
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} radius
   * @return {undefined}
   */
  CanvasRenderingContext2D.prototype.JTopoRoundRect = function (x, y, width, height, radius) {
    if ("undefined" == typeof radius) {
      /** @type {number} */
      radius = 5;
    }
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
  };
  /**
   * @param {number} x
   * @param {number} y
   * @param {string} tx
   * @param {string} ty
   * @param {number} v
   * @return {undefined}
   */
  CanvasRenderingContext2D.prototype.JTopoDashedLineTo = function (x, y, tx, ty, v) {
    if ("undefined" == typeof v) {
      /** @type {number} */
      v = 5;
    }
    /** @type {number} */
    var dx = tx - x;
    /** @type {number} */
    var dy = ty - y;
    /** @type {number} */
    var s = Math.floor(Math.sqrt(dx * dx + dy * dy));
    /** @type {number} */
    var boundswidth = 0 >= v ? s : s / v;
    /** @type {number} */
    var k = dy / s * v;
    /** @type {number} */
    var t = dx / s * v;
    this.beginPath();
    /** @type {number} */
    var width = 0;
    for (; boundswidth > width; width++) {
      if (width % 2) {
        this.lineTo(x + width * t, y + width * k);
      } else {
        this.moveTo(x + width * t, y + width * k);
      }
    }
    this.stroke();
  };
  JTopo = {
    version: "0.4.8",
    zIndex_Container: 1,
    zIndex_Link: 2,
    zIndex_Node: 3,
    SceneMode: {
      normal: "normal",
      drag: "drag",
      edit: "edit",
      select: "select"
    },
    MouseCursor: {
      normal: "default",
      pointer: "pointer",
      top_left: "nw-resize",
      top_center: "n-resize",
      top_right: "ne-resize",
      middle_left: "e-resize",
      middle_right: "e-resize",
      bottom_left: "ne-resize",
      bottom_center: "n-resize",
      bottom_right: "nw-resize",
      move: "move",
      open_hand: "url(./img/cur/openhand.cur) 8 8, default",
      closed_hand: "url(./img/cur/closedhand.cur) 8 8, default"
    },
    createStageFromJson: function (jsonStr$jscomp$1, canvas$jscomp$0) {
      eval("var jsonObj = " + jsonStr$jscomp$1);
      var stage$jscomp$0 = new JTopo.Stage(canvas$jscomp$0);
      var k$jscomp$1;
      for (k$jscomp$1 in jsonObj) {
        if ("childs" != k$jscomp$1) {
          stage$jscomp$0[k$jscomp$1] = jsonObj[k$jscomp$1];
        }
      }
      var scenes$jscomp$0 = jsonObj.childs;
      return scenes$jscomp$0.forEach(function (data) {
        var view = new JTopo.Scene(stage$jscomp$0);
        var i;
        for (i in data) {
          if ("childs" != i) {
            view[i] = data[i];
          }
          if ("background" == i) {
            view.background = data[i];
          }
        }
        var body = data.childs;
        body.forEach(function (target) {
          /** @type {null} */
          var result = null;
          var parentNode = target.elementType;
          if ("node" == parentNode) {
            result = new JTopo.Node;
          } else {
            if ("CircleNode" == parentNode) {
              result = new JTopo.CircleNode;
            }
          }
          var propertyName;
          for (propertyName in target) {
            result[propertyName] = target[propertyName];
          }
          view.add(result);
        });
      }), stage$jscomp$0;
    }
  };
  /** @type {function(): undefined} */
  JTopo.Element = Element$jscomp$1;
  window$jscomp$1.JTopo = JTopo;
}(window), function (JTopo$jscomp$0) {
  /**
   * @param {string} addListeners
   * @return {undefined}
   */
  function MessageBus$jscomp$0(addListeners) {
    var input = this;
    /** @type {string} */
    this.name = addListeners;
    this.messageMap = {};
    /** @type {number} */
    this.messageCount = 0;
    /**
     * @param {string} p
     * @param {!Function} c
     * @return {undefined}
     */
    this.subscribe = function (p, c) {
      var pTagId = input.messageMap[p];
      if (null == pTagId) {
        /** @type {!Array} */
        input.messageMap[p] = [];
      }
      input.messageMap[p].push(c);
      input.messageCount++;
    };
    /**
     * @param {?} id
     * @return {undefined}
     */
    this.unsubscribe = function (id) {
      var itemm = input.messageMap[id];
      if (null != itemm) {
        /** @type {null} */
        input.messageMap[id] = null;
        delete input.messageMap[id];
        input.messageCount--;
      }
    };
    /**
     * @param {string} p
     * @param {!Object} c
     * @param {?} data
     * @return {undefined}
     */
    this.publish = function (p, c, data) {
      var a = input.messageMap[p];
      if (null != a) {
        /** @type {number} */
        var i = 0;
        for (; i < a.length; i++) {
          if (data) {
            !function (receiveFunc, connector) {
              setTimeout(function () {
                receiveFunc(connector);
              }, 10);
            }(a[i], c);
          } else {
            a[i](c);
          }
        }
      }
    };
  }
  /**
   * @param {!Object} a
   * @param {!Object} b
   * @param {!Object} x
   * @param {!Object} y
   * @return {?}
   */
  function getDistance$jscomp$0(a, b, x, y) {
    var i;
    var j;
    return null == x && null == y ? (i = b.x - a.x, j = b.y - a.y) : (i = x - a, j = y - b), Math.sqrt(i * i + j * j);
  }
  /**
   * @param {!NodeList} array
   * @return {?}
   */
  function getElementsBound$jscomp$0(array) {
    var bbox = {
      left: Number.MAX_VALUE,
      right: Number.MIN_VALUE,
      top: Number.MAX_VALUE,
      bottom: Number.MIN_VALUE
    };
    /** @type {number} */
    var i = 0;
    for (; i < array.length; i++) {
      var o = array[i];
      if (!(o instanceof JTopo$jscomp$0.Link)) {
        if (bbox.left > o.x) {
          bbox.left = o.x;
          bbox.leftNode = o;
        }
        if (bbox.right < o.x + o.width) {
          bbox.right = o.x + o.width;
          bbox.rightNode = o;
        }
        if (bbox.top > o.y) {
          bbox.top = o.y;
          bbox.topNode = o;
        }
        if (bbox.bottom < o.y + o.height) {
          bbox.bottom = o.y + o.height;
          bbox.bottomNode = o;
        }
      }
    }
    return bbox.width = bbox.right - bbox.left, bbox.height = bbox.bottom - bbox.top, bbox;
  }
  /**
   * @param {!Object} event
   * @return {?}
   */
  function mouseCoords$jscomp$0(event) {
    return event = cloneEvent$jscomp$0(event), event.pageX || (event.pageX = event.clientX + document.body.scrollLeft - document.body.clientLeft, event.pageY = event.clientY + document.body.scrollTop - document.body.clientTop), event;
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function getEventPosition$jscomp$0(e) {
    return e = mouseCoords$jscomp$0(e);
  }
  /**
   * @param {number} x
   * @param {number} y
   * @param {string} radius
   * @param {string} n
   * @param {number} theta
   * @return {?}
   */
  function rotatePoint$jscomp$0(x, y, radius, n, theta) {
    /** @type {number} */
    var r = radius - x;
    /** @type {number} */
    var g = n - y;
    /** @type {number} */
    var distance = Math.sqrt(r * r + g * g);
    var angle = Math.atan2(g, r) + theta;
    return {
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance
    };
  }
  /**
   * @param {!Object} crop
   * @param {!NodeList} data
   * @param {undefined} angle
   * @return {?}
   */
  function rotatePoints$jscomp$0(crop, data, angle) {
    /** @type {!Array} */
    var points = [];
    /** @type {number} */
    var i = 0;
    for (; i < data.length; i++) {
      var p = rotatePoint$jscomp$0(crop.x, crop.y, data[i].x, data[i].y, angle);
      points.push(p);
    }
    return points;
  }
  /**
   * @param {!NodeList} a
   * @param {?} b
   * @param {?} c
   * @return {undefined}
   */
  function $foreach$jscomp$0(a, b, c) {
    /**
     * @param {number} i
     * @return {undefined}
     */
    function c(i) {
      if (i != a.length) {
        b(a[i]);
        setTimeout(function () {
          c(++i);
        }, c);
      }
    }
    if (0 != a.length) {
      /** @type {number} */
      var header = 0;
      c(header);
    }
  }
  /**
   * @param {(Date|number)} iterable
   * @param {!Date} entries
   * @param {?} fn
   * @param {?} debounceDuration
   * @return {undefined}
   */
  function $for$jscomp$0(iterable, entries, fn, debounceDuration) {
    /**
     * @param {number} defaultName
     * @return {undefined}
     */
    function create(defaultName) {
      if (defaultName != entries) {
        fn(entries);
        setTimeout(function () {
          create(++defaultName);
        }, debounceDuration);
      }
    }
    if (!(iterable > entries)) {
      /** @type {number} */
      var parent = 0;
      create(parent);
    }
  }
  /**
   * @param {!Object} evt
   * @return {?}
   */
  function cloneEvent$jscomp$0(evt) {
    var result = {};
    var i;
    for (i in evt) {
      if ("returnValue" != i && "keyLocation" != i) {
        result[i] = evt[i];
      }
    }
    return result;
  }
  /**
   * @param {!Object} extension
   * @return {?}
   */
  function clone$jscomp$0(extension) {
    var obj = {};
    var prop;
    for (prop in extension) {
      obj[prop] = extension[prop];
    }
    return obj;
  }
  /**
   * @param {!Object} rect
   * @param {!Object} point
   * @return {?}
   */
  function isPointInRect$jscomp$0(rect, point) {
    var x = point.x;
    var y = point.y;
    var width = point.width;
    var height = point.height;
    return rect.x > x && rect.x < x + width && rect.y > y && rect.y < y + height;
  }
  /**
   * @param {!Object} b
   * @param {!Object} a
   * @param {!Object} p2
   * @return {?}
   */
  function isPointInLine$jscomp$0(b, a, p2) {
    var d = JTopo$jscomp$0.util.getDistance(a, p2);
    var offset = JTopo$jscomp$0.util.getDistance(a, b);
    var i = JTopo$jscomp$0.util.getDistance(p2, b);
    /** @type {boolean} */
    var g = Math.abs(offset + i - d) <= .5;
    return g;
  }
  /**
   * @param {!Object} item
   * @param {!Object} to
   * @return {?}
   */
  function removeFromArray$jscomp$0(item, to) {
    /** @type {number} */
    var k = 0;
    for (; k < item.length; k++) {
      var type = item[k];
      if (type === to) {
        item = item.del(k);
        break;
      }
    }
    return item;
  }
  /**
   * @return {?}
   */
  function randomColor$jscomp$0() {
    return Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random());
  }
  /**
   * @return {undefined}
   */
  function isIntsect$jscomp$0() {
  }
  /**
   * @param {?} data
   * @param {!NodeList} id
   * @return {?}
   */
  function getProperties$jscomp$0(data, id) {
    /** @type {string} */
    var result = "";
    /** @type {number} */
    var i = 0;
    for (; i < id.length; i++) {
      if (i > 0) {
        /** @type {string} */
        result = result + ",";
      }
      var val = data[id[i]];
      if ("string" == typeof val) {
        /** @type {string} */
        val = '"' + val + '"';
      } else {
        if (void 0 == val) {
          /** @type {null} */
          val = null;
        }
      }
      /** @type {string} */
      result = result + (id[i] + ":" + val);
    }
    return result;
  }
  /**
   * @param {?} json$jscomp$0
   * @param {?} canvas$jscomp$2
   * @return {?}
   */
  function loadStageFromJson$jscomp$0(json$jscomp$0, canvas$jscomp$2) {
    /** @type {*} */
    var obj$jscomp$25 = eval(json$jscomp$0);
    var stage$jscomp$1 = new JTopo$jscomp$0.Stage(canvas$jscomp$2);
    var k$jscomp$2;
    for (k$jscomp$2 in stageObj) {
      if ("scenes" != k$jscomp$2) {
        stage$jscomp$1[k$jscomp$2] = obj$jscomp$25[k$jscomp$2];
      } else {
        var scenes$jscomp$1 = obj$jscomp$25.scenes;
        /** @type {number} */
        var i$jscomp$5 = 0;
        for (; i$jscomp$5 < scenes$jscomp$1.length; i$jscomp$5++) {
          var sceneObj$jscomp$0 = scenes$jscomp$1[i$jscomp$5];
          var scene$jscomp$0 = new JTopo$jscomp$0.Scene(stage$jscomp$1);
          var p$jscomp$0;
          for (p$jscomp$0 in sceneObj$jscomp$0) {
            if ("elements" != p$jscomp$0) {
              scene$jscomp$0[p$jscomp$0] = sceneObj$jscomp$0[p$jscomp$0];
            } else {
              var nodeMap$jscomp$0 = {};
              var elements$jscomp$0 = sceneObj$jscomp$0.elements;
              /** @type {number} */
              var m$jscomp$0 = 0;
              for (; m$jscomp$0 < elements$jscomp$0.length; m$jscomp$0++) {
                var elementObj$jscomp$0 = elements$jscomp$0[m$jscomp$0];
                var type$jscomp$113 = elementObj$jscomp$0.elementType;
                var element$jscomp$7;
                if ("Node" == type$jscomp$113) {
                  element$jscomp$7 = new JTopo$jscomp$0.Node;
                }
                var mk$jscomp$0;
                for (mk$jscomp$0 in elementObj$jscomp$0) {
                  element$jscomp$7[mk$jscomp$0] = elementObj$jscomp$0[mk$jscomp$0];
                }
                nodeMap$jscomp$0[element$jscomp$7.text] = element$jscomp$7;
                scene$jscomp$0.add(element$jscomp$7);
              }
            }
          }
        }
      }
    }
    return console.log(stage$jscomp$1), stage$jscomp$1;
  }
  /**
   * @param {!Object} options
   * @return {?}
   */
  function toJson$jscomp$0(options) {
    /** @type {!Array<string>} */
    var start = "backgroundColor,visible,mode,rotate,alpha,scaleX,scaleY,shadow,translateX,translateY,areaSelect,paintAll".split(",");
    /** @type {!Array<string>} */
    var context = "text,elementType,x,y,width,height,visible,alpha,rotate,scaleX,scaleY,fillColor,shadow,transformAble,zIndex,dragable,selected,showSelected,font,fontColor,textPosition,textOffsetX,textOffsetY".split(",");
    /** @type {string} */
    var s = "{";
    /** @type {string} */
    s = s + ("frames:" + options.frames);
    /** @type {string} */
    s = s + ", scenes:[";
    /** @type {number} */
    var index = 0;
    for (; index < options.childs.length; index++) {
      var item = options.childs[index];
      /** @type {string} */
      s = s + "{";
      /** @type {string} */
      s = s + getProperties$jscomp$0(item, start);
      /** @type {string} */
      s = s + ", elements:[";
      /** @type {number} */
      var i = 0;
      for (; i < item.childs.length; i++) {
        var value = item.childs[i];
        if (i > 0) {
          /** @type {string} */
          s = s + ",";
        }
        /** @type {string} */
        s = s + "{";
        /** @type {string} */
        s = s + getProperties$jscomp$0(value, context);
        /** @type {string} */
        s = s + "}";
      }
      /** @type {string} */
      s = s + "]}";
    }
    return s = s + "]", s = s + "}";
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {!Object} imageData
   * @param {number} c
   * @param {?} delta
   * @param {?} e
   * @return {?}
   */
  function changeColor$jscomp$0(ctx, imageData, c, delta, e) {
    var f = canvas$jscomp$1.width = imageData.width;
    var x = canvas$jscomp$1.height = imageData.height;
    ctx.clearRect(0, 0, canvas$jscomp$1.width, canvas$jscomp$1.height);
    ctx.drawImage(imageData, 0, 0);
    var data = ctx.getImageData(0, 0, imageData.width, imageData.height);
    var buf = data.data;
    /** @type {number} */
    var n1 = 0;
    for (; f > n1; n1++) {
      /** @type {number} */
      var y = 0;
      for (; x > y; y++) {
        /** @type {number} */
        var palette_offset = 4 * (n1 + y * f);
        if (0 != buf[palette_offset + 3]) {
          if (null != c) {
            buf[palette_offset + 0] += c;
          }
          if (null != delta) {
            buf[palette_offset + 1] += delta;
          }
          if (null != e) {
            buf[palette_offset + 2] += e;
          }
        }
      }
    }
    ctx.putImageData(data, 0, 0, 0, 0, imageData.width, imageData.height);
    var m = canvas$jscomp$1.toDataURL();
    return alarmImageCache$jscomp$0[imageData.src] = m, m;
  }
  /**
   * @param {!Object} a
   * @param {number} id
   * @return {?}
   */
  function genImageAlarm$jscomp$0(a, id) {
    if (null == id) {
      /** @type {number} */
      id = 255;
    }
    try {
      if (alarmImageCache$jscomp$0[a.src]) {
        return alarmImageCache$jscomp$0[a.src];
      }
      /** @type {!Image} */
      var img = new Image;
      return img.src = changeColor$jscomp$0(graphics$jscomp$0, a, id), alarmImageCache$jscomp$0[a.src] = img, img;
    } catch (d) {
    }
    return null;
  }
  /**
   * @param {!Element} el
   * @return {?}
   */
  function getOffsetPosition$jscomp$0(el) {
    if (!el) {
      return {
        left: 0,
        top: 0
      };
    }
    /** @type {number} */
    var c = 0;
    /** @type {number} */
    var regExBonusMultiplier = 0;
    if ("getBoundingClientRect" in document.documentElement) {
      var anchorBoundingBoxViewport = el.getBoundingClientRect();
      var doc = el.ownerDocument;
      var body = doc.body;
      var docElem = doc.documentElement;
      var b = docElem.clientTop || body.clientTop || 0;
      var CommentMatchPenalty = docElem.clientLeft || body.clientLeft || 0;
      /** @type {number} */
      c = anchorBoundingBoxViewport.top + (self.pageYOffset || docElem && docElem.scrollTop || body.scrollTop) - b;
      /** @type {number} */
      regExBonusMultiplier = anchorBoundingBoxViewport.left + (self.pageXOffset || docElem && docElem.scrollLeft || body.scrollLeft) - CommentMatchPenalty;
    } else {
      do {
        c = c + (el.offsetTop || 0);
        regExBonusMultiplier = regExBonusMultiplier + (el.offsetLeft || 0);
        el = el.offsetParent;
      } while (el);
    }
    return {
      left: regExBonusMultiplier,
      top: c
    };
  }
  /**
   * @param {number} i
   * @param {number} d
   * @param {number} x
   * @param {number} y
   * @return {?}
   */
  function lineF$jscomp$0(i, d, x, y) {
    /**
     * @param {number} i
     * @return {?}
     */
    function v(i) {
      return i * k + t;
    }
    /** @type {number} */
    var k = (y - d) / (x - i);
    /** @type {number} */
    var t = d - i * k;
    return v.k = k, v.b = t, v.x1 = i, v.x2 = x, v.y1 = d, v.y2 = y, v;
  }
  /**
   * @param {!Object} t
   * @param {!Object} a
   * @param {!Object} b
   * @return {?}
   */
  function inRange$jscomp$0(t, a, b) {
    /** @type {number} */
    var y = Math.abs(a - b);
    /** @type {number} */
    var popup_height = Math.abs(a - t);
    /** @type {number} */
    var offset = Math.abs(b - t);
    /** @type {number} */
    var g = Math.abs(y - (popup_height + offset));
    return 1e-6 > g ? true : false;
  }
  /**
   * @param {!Object} x
   * @param {!Object} y
   * @param {!Object} rect
   * @return {?}
   */
  function isPointInLineSeg$jscomp$0(x, y, rect) {
    return inRange$jscomp$0(x, rect.x1, rect.x2) && inRange$jscomp$0(y, rect.y1, rect.y2);
  }
  /**
   * @param {!Object} a
   * @param {!Object} b
   * @return {?}
   */
  function intersection$jscomp$0(a, b) {
    var i;
    var d;
    return a.k == b.k ? null : (1 / 0 == a.k || a.k == -1 / 0 ? (i = a.x1, d = b(a.x1)) : 1 / 0 == b.k || b.k == -1 / 0 ? (i = b.x1, d = a(b.x1)) : (i = (b.b - a.b) / (a.k - b.k), d = a(i)), 0 == isPointInLineSeg$jscomp$0(i, d, a) ? null : 0 == isPointInLineSeg$jscomp$0(i, d, b) ? null : {
      x: i,
      y: d
    });
  }
  /**
   * @param {!Object} b
   * @param {!ClientRect} a
   * @return {?}
   */
  function intersectionLineBound$jscomp$0(b, a) {
    var i = JTopo$jscomp$0.util.lineF(a.left, a.top, a.left, a.bottom);
    var d = JTopo$jscomp$0.util.intersection(b, i);
    return null == d && (i = JTopo$jscomp$0.util.lineF(a.left, a.top, a.right, a.top), d = JTopo$jscomp$0.util.intersection(b, i), null == d && (i = JTopo$jscomp$0.util.lineF(a.right, a.top, a.right, a.bottom), d = JTopo$jscomp$0.util.intersection(b, i), null == d && (i = JTopo$jscomp$0.util.lineF(a.left, a.bottom, a.right, a.bottom), d = JTopo$jscomp$0.util.intersection(b, i)))), d;
  }
  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (_nextEventFunc) {
    setTimeout(_nextEventFunc, 1e3 / 24);
  };
  /**
   * @param {number} idx
   * @return {?}
   */
  Array.prototype.del = function (idx) {
    if ("number" != typeof idx) {
      /** @type {number} */
      var i = 0;
      for (; i < this.length; i++) {
        if (this[i] === idx) {
          return this.slice(0, i).concat(this.slice(i + 1, this.length));
        }
      }
      return this;
    }
    return 0 > idx ? this : this.slice(0, idx).concat(this.slice(idx + 1, this.length));
  };
  if (![].indexOf) {
    /**
     * @param {string} item
     * @param {number=} p1
     * @return {number}
     * @template T
     */
    Array.prototype.indexOf = function (item) {
      /** @type {number} */
      var i = 0;
      for (; i < this.length; i++) {
        if (this[i] === item) {
          return i;
        }
      }
      return -1;
    };
  }
  if (!window.console) {
    window.console = {
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
    };
  }
  /** @type {!Element} */
  var canvas$jscomp$1 = document.createElement("canvas");
  var graphics$jscomp$0 = canvas$jscomp$1.getContext("2d");
  var alarmImageCache$jscomp$0 = {};
  JTopo$jscomp$0.util = {
    rotatePoint: rotatePoint$jscomp$0,
    rotatePoints: rotatePoints$jscomp$0,
    getDistance: getDistance$jscomp$0,
    getEventPosition: getEventPosition$jscomp$0,
    mouseCoords: mouseCoords$jscomp$0,
    MessageBus: MessageBus$jscomp$0,
    isFirefox: navigator.userAgent.indexOf("Firefox") > 0,
    isIE: !(!window.attachEvent || -1 !== navigator.userAgent.indexOf("Opera")),
    isChrome: null != navigator.userAgent.toLowerCase().match(/chrome/),
    clone: clone$jscomp$0,
    isPointInRect: isPointInRect$jscomp$0,
    isPointInLine: isPointInLine$jscomp$0,
    removeFromArray: removeFromArray$jscomp$0,
    cloneEvent: cloneEvent$jscomp$0,
    randomColor: randomColor$jscomp$0,
    isIntsect: isIntsect$jscomp$0,
    toJson: toJson$jscomp$0,
    loadStageFromJson: loadStageFromJson$jscomp$0,
    getElementsBound: getElementsBound$jscomp$0,
    genImageAlarm: genImageAlarm$jscomp$0,
    getOffsetPosition: getOffsetPosition$jscomp$0,
    lineF: lineF$jscomp$0,
    intersection: intersection$jscomp$0,
    intersectionLineBound: intersectionLineBound$jscomp$0
  };
  /** @type {function((Date|number), !Date, ?, ?): undefined} */
  window.$for = $for$jscomp$0;
  /** @type {function(!NodeList, ?, ?): undefined} */
  window.$foreach = $foreach$jscomp$0;
}(JTopo), function (r) {
  /**
   * eagleEye
   * @param {!Object} data
   * @return {?}
   */
  function exports(data) {
    return {
      hgap: 16,
      visible: false,
      exportCanvas: document.createElement("canvas"),
      getImage: function (width, height) {
        var rect = data.getBound();
        /** @type {number} */
        var x = 1;
        /** @type {number} */
        var scale = 1;
        this.exportCanvas.width = data.canvas.width;
        this.exportCanvas.height = data.canvas.height;
        if (null != width && null != height) {
          /** @type {number} */
          this.exportCanvas.width = width;
          /** @type {number} */
          this.exportCanvas.height = height;
          /** @type {number} */
          x = width / rect.width;
          /** @type {number} */
          scale = height / rect.height;
        } else {
          if (rect.width > data.canvas.width) {
            this.exportCanvas.width = rect.width;
          }
          if (rect.height > data.canvas.height) {
            this.exportCanvas.height = rect.height;
          }
        }
        var g = this.exportCanvas.getContext("2d");
        return data.childs.length > 0 && (g.save(), g.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height), data.childs.forEach(function (t) {
          if (1 == t.visible) {
            t.save();
            /** @type {number} */
            t.translateX = 0;
            /** @type {number} */
            t.translateY = 0;
            /** @type {number} */
            t.scaleX = 1;
            /** @type {number} */
            t.scaleY = 1;
            g.scale(x, scale);
            if (rect.left < 0) {
              /** @type {number} */
              t.translateX = Math.abs(rect.left);
            }
            if (rect.top < 0) {
              /** @type {number} */
              t.translateY = Math.abs(rect.top);
            }
            /** @type {boolean} */
            t.paintAll = true;
            t.repaint(g);
            /** @type {boolean} */
            t.paintAll = false;
            t.restore();
          }
        }), g.restore()), this.exportCanvas.toDataURL("image/png");
      },
      canvas: document.createElement("canvas"),
      update: function () {
        this.eagleImageDatas = this.getData(data);
      },
      setSize: function (width, height) {
        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;
      },
      getData: function (width, height) {
        /**
         * 获取场景中的图像信息
         * @param {!Object} options
         * @return {?}
         */
        function getTransform(options) {
          var x = options.stage.canvas.width;
          var y = options.stage.canvas.height;
          /** @type {number} */
          var p = x / options.scaleX / 2;
          /** @type {number} */
          var indentation = y / options.scaleY / 2;
          return {
            translateX: options.translateX + p - p * options.scaleX,
            translateY: options.translateY + indentation - indentation * options.scaleY
          };
        }
        if (null != width && null != height) {
          this.setSize(width, height);
        } else {
          this.setSize(200, 160);
          // this.setSize(400, 160);
        }
        var ctx = this.canvas.getContext("2d");
        // data -> stage
        if (data.childs.length > 0) {
          ctx.save();
          ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          data.childs.forEach(function (mask) {
            if (1 == mask.visible) {
              mask.save();
              mask.centerAndZoom(null, null, ctx);
              mask.repaint(ctx);
              mask.restore();
            }
          });
          var transform = getTransform(data.childs[0]);
          /** @type {number} */
          var size = transform.translateX * (this.canvas.width / data.canvas.width) * data.childs[0].scaleX;
          /** @type {number} */
          var y = transform.translateY * (this.canvas.height / data.canvas.height) * data.childs[0].scaleY;
          var bbox = data.getBound();
          /** @type {number} */
          var width = data.canvas.width / data.childs[0].scaleX / bbox.width;
          /** @type {number} */
          var height = data.canvas.height / data.childs[0].scaleY / bbox.height;
          if (width > 1) {
            /** @type {number} */
            width = 1;
          }
          if (height > 1) {
            /** @type {number} */
            width = 1;
          }
          /** @type {number} */
          size = size * width;
          /** @type {number} */
          y = y * height;
          if (bbox.left < 0) {
            /** @type {number} */
            size = size - Math.abs(bbox.left) * (this.width / bbox.width);
          }
          if (bbox.top < 0) {
            /** @type {number} */
            y = y - Math.abs(bbox.top) * (this.height / bbox.height);
          }
          ctx.save();
          /** @type {number} */
          ctx.lineWidth = 1;
          /** @type {string} */
          ctx.strokeStyle = "rgba(255,0,0,1)";
          ctx.strokeRect(-size, -y, ctx.canvas.width * width, ctx.canvas.height * height);
          ctx.restore();
          /** @type {null} */
          var boeingData = null;
          try {
            boeingData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
          } catch (m) {
          }
          return boeingData;
        }
        return null;
      },
      paint: function () {
        if (null != this.eagleImageDatas) {
          var g = data.graphics;
          g.save();
          /** @type {string} */
          g.fillStyle = "rgba(211,211,211,0.3)";
          // g.fillStyle = "rgba(255,255,255,1)";
          g.fillRect(data.canvas.width - this.canvas.width - 2 * this.hgap, data.canvas.height - this.canvas.height - 1, data.canvas.width - this.canvas.width, this.canvas.height + 1);
          g.fill();
          g.save();
          /** @type {number} */
          g.lineWidth = 1;
          /** @type {string} */
          g.strokeStyle = "rgba(0,0,0,1)";
          // g.strokeStyle = "rgba(255,255,255,1)";
          g.rect(data.canvas.width - this.canvas.width - 2 * this.hgap, data.canvas.height - this.canvas.height - 1, data.canvas.width - this.canvas.width, this.canvas.height + 1);
          g.stroke();
          g.restore();
          g.putImageData(this.eagleImageDatas, data.canvas.width - this.canvas.width - this.hgap, data.canvas.height - this.canvas.height);
          g.restore();
        } else {
          this.eagleImageDatas = this.getData(data);
        }
      },
      eventHandler: function (type, event, module) {
        var i = event.x;
        var d = event.y;
        if (i > module.canvas.width - this.canvas.width && d > module.canvas.height - this.canvas.height) {
          if (i = event.x - this.canvas.width, d = event.y - this.canvas.height, "mousedown" == type && (this.lastTranslateX = module.childs[0].translateX, this.lastTranslateY = module.childs[0].translateY), "mousedrag" == type && module.childs.length > 0) {
            var width = event.dx;
            var distance = event.dy;
            var cssChanges = module.getBound();
            /** @type {number} */
            var numneutrals = this.canvas.width / module.childs[0].scaleX / cssChanges.width;
            /** @type {number} */
            var dStroke = this.canvas.height / module.childs[0].scaleY / cssChanges.height;
            /** @type {number} */
            module.childs[0].translateX = this.lastTranslateX - width / numneutrals;
            /** @type {number} */
            module.childs[0].translateY = this.lastTranslateY - distance / dStroke;
          }
        } else {
        }
      }
    };
  }
  /**
   * @param {(Object|string)} name
   * @return {undefined}
   */
  function init(name) {
    /**
     * @param {!Object} e
     * @return {?}
     */
    function get(e) {
      var a = r.util.getEventPosition(e);
      var b = r.util.getOffsetPosition(self.canvas);
      return a.offsetLeft = a.pageX - b.left, a.offsetTop = a.pageY - b.top, a.x = a.offsetLeft, a.y = a.offsetTop, a.target = null, a;
    }
    /**
     * @param {!Object} a
     * @return {undefined}
     */
    function start(a) {
      /**
       * @return {?}
       */
      document.onselectstart = function () {
        return false;
      };
      /** @type {boolean} */
      this.mouseOver = true;
      var id = get(a);
      self.dispatchEventToScenes("mouseover", id);
      self.dispatchEvent("mouseover", id);
    }
    /**
     * @param {!Object} props
     * @return {undefined}
     */
    function link(props) {
      /** @type {number} */
      hoverSelectionTimeout = setTimeout(function () {
        /** @type {boolean} */
        status = true;
      }, 500);
      /**
       * @return {?}
       */
      document.onselectstart = function () {
        return true;
      };
      var id = get(props);
      self.dispatchEventToScenes("mouseout", id);
      self.dispatchEvent("mouseout", id);
      /** @type {boolean} */
      self.needRepaint = 0 == self.animate ? false : true;
    }
    /**
     * @param {!Object} value
     * @return {undefined}
     */
    function onMouseDown(value) {
      var query = get(value);
      /** @type {boolean} */
      self.mouseDown = true;
      self.mouseDownX = query.x;
      self.mouseDownY = query.y;
      self.dispatchEventToScenes("mousedown", query);
      self.dispatchEvent("mousedown", query);
    }
    /**
     * @param {!Object} evt
     * @return {undefined}
     */
    function done(evt) {
      var id = get(evt);
      self.dispatchEventToScenes("mouseup", id);
      self.dispatchEvent("mouseup", id);
      /** @type {boolean} */
      self.mouseDown = false;
      /** @type {boolean} */
      self.needRepaint = 0 == self.animate ? false : true;
    }
    /**
     * @param {!Object} event
     * @return {undefined}
     */
    function move(event) {
      if (hoverSelectionTimeout) {
        window.clearTimeout(hoverSelectionTimeout);
        /** @type {null} */
        hoverSelectionTimeout = null;
      }
      /** @type {boolean} */
      status = false;
      var target = get(event);
      if (self.mouseDown) {
        if (0 == event.button) {
          /** @type {number} */
          target.dx = target.x - self.mouseDownX;
          /** @type {number} */
          target.dy = target.y - self.mouseDownY;
          self.dispatchEventToScenes("mousedrag", target);
          self.dispatchEvent("mousedrag", target);
          if (1 == self.eagleEye.visible) {
            self.eagleEye.update();
          }
        }
      } else {
        self.dispatchEventToScenes("mousemove", target);
        self.dispatchEvent("mousemove", target);
      }
    }
    /**
     * @param {!Object} value
     * @return {undefined}
     */
    function j(value) {
      var id = get(value);
      self.dispatchEventToScenes("click", id);
      self.dispatchEvent("click", id);
    }
    /**
     * @param {!Object} a
     * @return {undefined}
     */
    function callback(a) {
      var id = get(a);
      self.dispatchEventToScenes("dbclick", id);
      self.dispatchEvent("dbclick", id);
    }
    /**
     * @param {!Event} event
     * @return {undefined}
     */
    function fn(event) {
      var id = get(event);
      self.dispatchEventToScenes("mousewheel", id);
      self.dispatchEvent("mousewheel", id);
      if (null != self.wheelZoom) {
        if (event.preventDefault) {
          event.preventDefault();
        } else {
          event = event || window.event;
          /** @type {boolean} */
          event.returnValue = false;
        }
        if (1 == self.eagleEye.visible) {
          self.eagleEye.update();
        }
      }
    }
    /**
     * element -> canvas元素 初始化事件等 1338行调用
     * @param {!Element} element
     * @return {undefined}
     */
    function init(element) {
      if (r.util.isIE || !window.addEventListener) {
        /** @type {function(!Object): undefined} */
        element.onmouseout = link;
        /** @type {function(!Object): undefined} */
        element.onmouseover = start;
        /** @type {function(!Object): undefined} */
        element.onmousedown = onMouseDown;
        /** @type {function(!Object): undefined} */
        element.onmouseup = done;
        /** @type {function(!Object): undefined} */
        element.onmousemove = move;
        /** @type {function(!Object): undefined} */
        element.onclick = j;
        /** @type {function(!Object): undefined} */
        element.ondblclick = callback;
        /** @type {function(!Event): undefined} */
        element.onmousewheel = fn;
        /** @type {function(!Object): undefined} */
        element.touchstart = onMouseDown;
        /** @type {function(!Object): undefined} */
        element.touchmove = move;
        /** @type {function(!Object): undefined} */
        element.touchend = done;
      } else {
        element.addEventListener("mouseout", link);
        element.addEventListener("mouseover", start);
        element.addEventListener("mousedown", onMouseDown);
        element.addEventListener("mouseup", done);
        element.addEventListener("mousemove", move);
        element.addEventListener("click", j);
        element.addEventListener("dblclick", callback);
        if (r.util.isFirefox) {
          element.addEventListener("DOMMouseScroll", fn);
        } else {
          element.addEventListener("mousewheel", fn);
        }
      }
      if (window.addEventListener) {
        window.addEventListener("keydown", function (event) {
          self.dispatchEventToScenes("keydown", r.util.cloneEvent(event));
          /** @type {number} */
          var keyCode = event.keyCode;
          if (37 == keyCode || 38 == keyCode || 39 == keyCode || 40 == keyCode) {
            if (event.preventDefault) {
              event.preventDefault();
            } else {
              /** @type {!Event} */
              event = event || window.event;
              /** @type {boolean} */
              event.returnValue = false;
            }
          }
        }, true);
        window.addEventListener("keyup", function (event) {
          self.dispatchEventToScenes("keyup", r.util.cloneEvent(event));
          /** @type {number} */
          var keyCode = event.keyCode;
          if (37 == keyCode || 38 == keyCode || 39 == keyCode || 40 == keyCode) {
            if (event.preventDefault) {
              event.preventDefault();
            } else {
              /** @type {!Event} */
              event = event || window.event;
              /** @type {boolean} */
              event.returnValue = false;
            }
          }
        }, true);
      }
    }
    r.stage = this;
    var self = this;
    /**
     * @param {!Object} c
     * @return {undefined}
     */
    this.initialize = function (c) {
      init(c);
      /** @type {!Object} */
      this.canvas = c;
      this.graphics = c.getContext("2d");
      /** @type {!Array} */
      this.childs = [];
      /** @type {number} */
      this.frames = 24;
      this.messageBus = new r.util.MessageBus;
      this.eagleEye = exports(this);
      /** @type {null} */
      this.wheelZoom = null;
      /** @type {number} */
      this.mouseDownX = 0;
      /** @type {number} */
      this.mouseDownY = 0;
      /** @type {boolean} */
      this.mouseDown = false;
      /** @type {boolean} */
      this.mouseOver = false;
      /** @type {boolean} */
      this.needRepaint = true;
      /** @type {!Array} */
      this.serializedProperties = ["frames", "wheelZoom"];
    };
    if (null != name) {
      this.initialize(name);
    }
    /** @type {boolean} */
    var status = true;
    /** @type {null} */
    var hoverSelectionTimeout = null;
    /**
     * @return {?}
     */
    document.oncontextmenu = function () {
      return status;
    };
    /**
     * @param {string} type
     * @param {!Object} obj
     * @return {?}
     */
    this.dispatchEventToScenes = function (type, obj) {
      if (0 != this.frames && (this.needRepaint = true), 1 == this.eagleEye.visible && -1 != type.indexOf("mouse")) {
        var x = obj.x;
        var y = obj.y;
        if (x > this.width - this.eagleEye.width && y > this.height - this.eagleEye.height) {
          return void this.eagleEye.eventHandler(type, obj, this);
        }
      }
      this.childs.forEach(function (that) {
        if (1 == that.visible) {
          var fn = that[type + "Handler"];
          if (null == fn) {
            throw new Error("Function not found:" + type + "Handler");
          }
          fn.call(that, obj);
        }
      });
    };
    /**
     * @param {!Object} child
     * @return {undefined}
     */
    this.add = function (child) {
      /** @type {number} */
      var i = 0;
      for (; i < this.childs.length; i++) {
        if (this.childs[i] === child) {
          return;
        }
      }
      child.addTo(this);
      this.childs.push(child);
    };
    /**
     * @param {!Object} child
     * @return {?}
     */
    this.remove = function (child) {
      if (null == child) {
        throw new Error("Stage.remove\u00e5\u2021\u00ba\u00e9\u201d\u2122: \u00e5\u008f\u201a\u00e6\u2022\u00b0\u00e4\u00b8\u00banull!");
      }
      /** @type {number} */
      var i = 0;
      for (; i < this.childs.length; i++) {
        if (this.childs[i] === child) {
          return child.stage = null, this.childs = this.childs.del(i), this;
        }
      }
      return this;
    };
    /**
     * @return {undefined}
     */
    this.clear = function () {
      /** @type {!Array} */
      this.childs = [];
    };
    /**
     * @param {string} type
     * @param {!Function} f
     * @return {?}
     */
    this.addEventListener = function (type, f) {
      var jsav = this;
      /**
       * @param {?} rt
       * @return {undefined}
       */
      var fn = function (rt) {
        f.call(jsav, rt);
      };
      return this.messageBus.subscribe(type, fn), this;
    };
    /**
     * @param {?} message
     * @return {undefined}
     */
    this.removeEventListener = function (message) {
      this.messageBus.unsubscribe(message);
    };
    /**
     * @return {undefined}
     */
    this.removeAllEventListener = function () {
      this.messageBus = new r.util.MessageBus;
    };
    /**
     * @param {string} type
     * @param {!Object} e
     * @return {?}
     */
    this.dispatchEvent = function (type, e) {
      return this.messageBus.publish(type, e), this;
    };
    /** @type {!Array<string>} */
    var pipelets = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(",");
    var animationConfigs = this;
    pipelets.forEach(function (event) {
      /**
       * @param {!Object} b
       * @return {undefined}
       */
      animationConfigs[event] = function (b) {
        if (null != b) {
          this.addEventListener(event, b);
        } else {
          this.dispatchEvent(event);
        }
      };
    });
    /**
     * @param {undefined} a
     * @param {undefined} b
     * @return {?}
     */
    this.saveImageInfo = function (a, b) {
      var bySmiley = this.eagleEye.getImage(a, b);
      /** @type {(Window|null)} */
      var previewWind = window.open("about:blank");
      return previewWind.document.write("<img src='" + bySmiley + "' alt='from canvas'/>"), this;
    };
    /**
     * @param {undefined} a
     * @param {undefined} i
     * @return {?}
     */
    this.saveAsLocalImage = function (a, i) {
      var data = this.eagleEye.getImage(a, i);
      return data.replace("image/png", "image/octet-stream"), window.location.href = data, this;
    };
    /**
     * @return {undefined}
     */
    this.paint = function () {
      if (null != this.canvas) {
        this.graphics.save();
        this.graphics.clearRect(0, 0, this.width, this.height);
        this.childs.forEach(function (state) {
          if (1 == state.visible) {
            state.repaint(self.graphics);
          }
        });
        if (1 == this.eagleEye.visible) {
          this.eagleEye.paint(this);
        }
        this.graphics.restore();
      }
    };
    /**
     * @return {undefined}
     */
    this.repaint = function () {
      if (0 != this.frames) {
        if (!(this.frames < 0 && 0 == this.needRepaint)) {
          this.paint();
          if (this.frames < 0) {
            /** @type {boolean} */
            this.needRepaint = false;
          }
        }
      }
    };
    /**
     * @param {number} value
     * @return {undefined}
     */
    this.zoom = function (value) {
      this.childs.forEach(function (elem) {
        if (0 != elem.visible) {
          elem.zoom(value);
        }
      });
    };
    /**
     * @param {number} opt_zoomFactor
     * @return {undefined}
     */
    this.zoomOut = function (opt_zoomFactor) {
      this.childs.forEach(function (scope) {
        if (0 != scope.visible) {
          scope.zoomOut(opt_zoomFactor);
        }
      });
    };
    /**
     * @param {number} delta
     * @return {undefined}
     */
    this.zoomIn = function (delta) {
      this.childs.forEach(function (options) {
        if (0 != options.visible) {
          options.zoomIn(delta);
        }
      });
    };
    /**
     * @return {undefined}
     */
    this.centerAndZoom = function () {
      this.childs.forEach(function (oPresentationNode) {
        if (0 != oPresentationNode.visible) {
          oPresentationNode.centerAndZoom();
        }
      });
    };
    /**
     * @param {number} lat
     * @param {number} lng
     * @return {undefined}
     */
    this.setCenter = function (lat, lng) {
      var iplImage = this;
      this.childs.forEach(function (after) {
        /** @type {number} */
        var size = lat - iplImage.canvas.width / 2;
        /** @type {number} */
        var movement = lng - iplImage.canvas.height / 2;
        /** @type {number} */
        after.translateX = -size;
        /** @type {number} */
        after.translateY = -movement;
      });
    };
    /**
     * @return {?}
     */
    this.getBound = function () {
      var box = {
        left: Number.MAX_VALUE,
        right: Number.MIN_VALUE,
        top: Number.MAX_VALUE,
        bottom: Number.MIN_VALUE
      };
      return this.childs.forEach(function (b) {
        var pos = b.getElementsBound();
        if (pos.left < box.left) {
          box.left = pos.left;
          box.leftNode = pos.leftNode;
        }
        if (pos.top < box.top) {
          box.top = pos.top;
          box.topNode = pos.topNode;
        }
        if (pos.right > box.right) {
          box.right = pos.right;
          box.rightNode = pos.rightNode;
        }
        if (pos.bottom > box.bottom) {
          box.bottom = pos.bottom;
          box.bottomNode = pos.bottomNode;
        }
      }), box.width = box.right - box.left, box.height = box.bottom - box.top, box;
    };
    /**
     * @return {?}
     */
    this.toJson = function () {
      {
        var query = this;
        /** @type {string} */
        var ret = '{"version":"' + r.version + '",';
        this.serializedProperties.length;
      }
      return this.serializedProperties.forEach(function (x) {
        var required = query[x];
        if ("string" == typeof required) {
          /** @type {string} */
          required = '"' + required + '"';
        }
        ret = ret + ('"' + x + '":' + required + ",");
      }), ret = ret + '"childs":[', this.childs.forEach(function (result) {
        ret = ret + result.toJson();
      }), ret = ret + "]", ret = ret + "}";
    };
    (function () {
      if (0 == self.frames) {
        setTimeout(arguments.callee, 100);
      } else {
        if (self.frames < 0) {
          self.repaint();
          setTimeout(arguments.callee, 1e3 / -self.frames);
        } else {
          self.repaint();
          setTimeout(arguments.callee, 1e3 / self.frames);
        }
      }
    })();
    setTimeout(function () {
      self.mousewheel(function (event) {
        var b = null == event.wheelDelta ? event.detail : event.wheelDelta;
        if (null != this.wheelZoom) {
          if (b > 0) {
            this.zoomIn(this.wheelZoom);
          } else {
            this.zoomOut(this.wheelZoom);
          }
        }
      });
      self.paint();
    }, 300);
    setTimeout(function () {
      self.paint();
    }, 1e3);
    setTimeout(function () {
      self.paint();
    }, 3e3);
  }
  init.prototype = {
    get width() {
      return this.canvas.width;
    },
    get height() {
      return this.canvas.height;
    },
    set cursor(grabbing) {
      /** @type {string} */
      this.canvas.style.cursor = grabbing;
    },
    get cursor() {
      return this.canvas.style.cursor;
    },
    set mode(value) {
      this.childs.forEach(function (options) {
        /** @type {string} */
        options.mode = value;
      });
    }
  };
  /** @type {function((Object|string)): undefined} */
  r.Stage = init;
}(JTopo), function (self) {
  /**
   * @param {!Object} parent
   * @return {?}
   */
  function init(parent) {
    /**
     * @param {?} left
     * @param {?} color
     * @param {?} height
     * @param {?} radius
     * @return {?}
     */
    function draw(left, color, height, radius) {
      return function (ctx) {
        ctx.beginPath();
        /** @type {string} */
        ctx.strokeStyle = "rgba(0,0,236,0.5)";
        /** @type {string} */
        ctx.fillStyle = "rgba(0,0,236,0.1)";
        ctx.rect(left, color, height, radius);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      };
    }
    var that = this;
    /**
     * @return {undefined}
     */
    this.initialize = function () {
      init.prototype.initialize.apply(this, arguments);
      this.messageBus = new self.util.MessageBus;
      /** @type {string} */
      this.elementType = "scene";
      /** @type {!Array} */
      this.childs = [];
      this.zIndexMap = {};
      /** @type {!Array} */
      this.zIndexArray = [];
      /** @type {string} */
      this.backgroundColor = "255,255,255";
      /** @type {boolean} */
      this.visible = true;
      /** @type {number} */
      this.alpha = 0;
      /** @type {number} */
      this.scaleX = 1;
      /** @type {number} */
      this.scaleY = 1;
      this.mode = self.SceneMode.normal;
      /** @type {boolean} */
      this.translate = true;
      /** @type {number} */
      this.translateX = 0;
      /** @type {number} */
      this.translateY = 0;
      /** @type {number} */
      this.lastTranslateX = 0;
      /** @type {number} */
      this.lastTranslateY = 0;
      /** @type {boolean} */
      this.mouseDown = false;
      /** @type {null} */
      this.mouseDownX = null;
      /** @type {null} */
      this.mouseDownY = null;
      /** @type {null} */
      this.mouseDownEvent = null;
      /** @type {boolean} */
      this.areaSelect = true;
      /** @type {!Array} */
      this.operations = [];
      /** @type {!Array} */
      this.selectedElements = [];
      /** @type {boolean} */
      this.paintAll = false;
      /** @type {!Array<string>} */
      var imageDataArr = "background,backgroundColor,mode,paintAll,areaSelect,translate,translateX,translateY,lastTranslatedX,lastTranslatedY,alpha,visible,scaleX,scaleY".split(",");
      this.serializedProperties = this.serializedProperties.concat(imageDataArr);
    };
    this.initialize();
    /**
     * @param {string} background
     * @return {undefined}
     */
    this.setBackground = function (background) {
      /** @type {string} */
      this.background = background;
    };
    /**
     * @param {!Object} name
     * @return {undefined}
     */
    this.addTo = function (name) {
      if (this.stage !== name && null != name) {
        /** @type {!Object} */
        this.stage = name;
      }
    };
    if (null != parent) {
      parent.add(this);
      this.addTo(parent);
    }
    /**
     * @return {undefined}
     */
    this.show = function () {
      /** @type {boolean} */
      this.visible = true;
    };
    /**
     * @return {undefined}
     */
    this.hide = function () {
      /** @type {boolean} */
      this.visible = false;
    };
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @return {undefined}
     */
    this.paint = function (ctx) {
      if (0 != this.visible && null != this.stage) {
        if (ctx.save(), this.paintBackgroud(ctx), ctx.restore(), ctx.save(), ctx.scale(this.scaleX, this.scaleY), 1 == this.translate) {
          var bounds = this.getOffsetTranslate(ctx);
          ctx.translate(bounds.translateX, bounds.translateY);
        }
        this.paintChilds(ctx);
        ctx.restore();
        ctx.save();
        this.paintOperations(ctx, this.operations);
        ctx.restore();
      }
    };
    /**
     * @param {!CanvasRenderingContext2D} data
     * @return {undefined}
     */
    this.repaint = function (data) {
      if (0 != this.visible) {
        this.paint(data);
      }
    };
    /**
     * @param {!CanvasRenderingContext2D} context
     * @return {undefined}
     */
    this.paintBackgroud = function (context) {
      if (null != this.background) {
        context.drawImage(this.background, 0, 0, context.canvas.width, context.canvas.height);
      } else {
        context.beginPath();
        /** @type {string} */
        context.fillStyle = "rgba(" + this.backgroundColor + "," + this.alpha + ")";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.closePath();
      }
    };
    /**
     * @return {?}
     */
    this.getDisplayedElements = function () {
      /** @type {!Array} */
      var dimsWithHiers = [];
      /** @type {number} */
      var layer_i = 0;
      for (; layer_i < this.zIndexArray.length; layer_i++) {
        var layer = this.zIndexArray[layer_i];
        var obj = this.zIndexMap[layer];
        /** @type {number} */
        var i = 0;
        for (; i < obj.length; i++) {
          var f = obj[i];
          if (this.isVisiable(f)) {
            dimsWithHiers.push(f);
          }
        }
      }
      return dimsWithHiers;
    };
    /**
     * @return {?}
     */
    this.getDisplayedNodes = function () {
      /** @type {!Array} */
      var lsup = [];
      /** @type {number} */
      var i = 0;
      for (; i < this.childs.length; i++) {
        var child = this.childs[i];
        if (child instanceof self.Node && this.isVisiable(child)) {
          lsup.push(child);
        }
      }
      return lsup;
    };
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @return {undefined}
     */
    this.paintChilds = function (ctx) {
      /** @type {number} */
      var layer_i = 0;
      for (; layer_i < this.zIndexArray.length; layer_i++) {
        var layer = this.zIndexArray[layer_i];
        var obj = this.zIndexMap[layer];
        /** @type {number} */
        var i = 0;
        for (; i < obj.length; i++) {
          var o = obj[i];
          if (1 == this.paintAll || this.isVisiable(o)) {
            if (ctx.save(), 1 == o.transformAble) {
              var viewTranslate = o.getCenterLocation();
              ctx.translate(viewTranslate.x, viewTranslate.y);
              if (o.rotate) {
                ctx.rotate(o.rotate);
              }
              if (o.scaleX && o.scaleY) {
                ctx.scale(o.scaleX, o.scaleY);
              } else {
                if (o.scaleX) {
                  ctx.scale(o.scaleX, 1);
                } else {
                  if (o.scaleY) {
                    ctx.scale(1, o.scaleY);
                  }
                }
              }
            }
            if (1 == o.shadow) {
              ctx.shadowBlur = o.shadowBlur;
              ctx.shadowColor = o.shadowColor;
              ctx.shadowOffsetX = o.shadowOffsetX;
              ctx.shadowOffsetY = o.shadowOffsetY;
            }
            if (o instanceof self.InteractiveElement) {
              if (o.selected && 1 == o.showSelected) {
                o.paintSelected(ctx);
              }
              if (1 == o.isMouseOver) {
                o.paintMouseover(ctx);
              }
            }
            o.paint(ctx);
            ctx.restore();
          }
        }
      }
    };
    /**
     * @param {string} node
     * @return {?}
     */
    this.getOffsetTranslate = function (node) {
      var orgW = this.stage.canvas.width;
      var size = this.stage.canvas.height;
      if (null != node && "move" != node) {
        orgW = node.canvas.width;
        size = node.canvas.height;
      }
      /** @type {number} */
      var width = orgW / this.scaleX / 2;
      /** @type {number} */
      var y = size / this.scaleY / 2;
      var result = {
        translateX: this.translateX + (width - width * this.scaleX),
        translateY: this.translateY + (y - y * this.scaleY)
      };
      return result;
    };
    /**
     * @param {!Object} parent
     * @return {?}
     */
    this.isVisiable = function (parent) {
      if (1 != parent.visible) {
        return false;
      }
      if (parent instanceof self.Link) {
        return true;
      }
      var options = this.getOffsetTranslate();
      var width = parent.x + options.translateX;
      var height = parent.y + options.translateY;
      /** @type {number} */
      width = width * this.scaleX;
      /** @type {number} */
      height = height * this.scaleY;
      var styleWidth = width + parent.width * this.scaleX;
      var moveCalc = height + parent.height * this.scaleY;
      return width > this.stage.canvas.width || height > this.stage.canvas.height || 0 > styleWidth || 0 > moveCalc ? false : true;
    };
    /**
     * @param {!CanvasRenderingContext2D} obj
     * @param {!NodeList} callbacks
     * @return {undefined}
     */
    this.paintOperations = function (obj, callbacks) {
      /** @type {number} */
      var i = 0;
      for (; i < callbacks.length; i++) {
        callbacks[i](obj);
      }
    };
    /**
     * @param {!Function} selector
     * @return {?}
     */
    this.findElements = function (selector) {
      /** @type {!Array} */
      var results = [];
      /** @type {number} */
      var i = 0;
      for (; i < this.childs.length; i++) {
        if (1 == selector(this.childs[i])) {
          results.push(this.childs[i]);
        }
      }
      return results;
    };
    /**
     * @param {!Function} Impromptu
     * @return {?}
     */
    this.getElementsByClass = function (Impromptu) {
      return this.findElements(function (impromptuInstance) {
        return impromptuInstance instanceof Impromptu;
      });
    };
    /**
     * @param {?} index
     * @return {?}
     */
    this.addOperation = function (index) {
      return this.operations.push(index), this;
    };
    /**
     * @return {?}
     */
    this.clearOperations = function () {
      return this.operations = [], this;
    };
    /**
     * @param {undefined} x
     * @param {undefined} y
     * @return {?}
     */
    this.getElementByXY = function (x, y) {
      /** @type {null} */
      var autoReview = null;
      /** @type {number} */
      var iccId = this.zIndexArray.length - 1;
      for (; iccId >= 0; iccId--) {
        var i = this.zIndexArray[iccId];
        var preset = this.zIndexMap[i];
        /** @type {number} */
        var option = preset.length - 1;
        for (; option >= 0; option--) {
          var data = preset[option];
          if (data instanceof self.InteractiveElement && this.isVisiable(data) && data.isInBound(x, y)) {
            return autoReview = data;
          }
        }
      }
      return autoReview;
    };
    /**
     * scene.add()
     * @param {!Object} child
     * @return {undefined}
     */
    this.add = function (child) {
      this.childs.push(child);
      if (null == this.zIndexMap[child.zIndex]) {
        /** @type {!Array} */
        this.zIndexMap[child.zIndex] = [];
        this.zIndexArray.push(child.zIndex);
        this.zIndexArray.sort(function (b, a) {
          return b - a;
        });
      }
      this.zIndexMap["" + child.zIndex].push(child);
    };
    /**
     * @param {!Object} item
     * @return {undefined}
     */
    this.remove = function (item) {
      this.childs = self.util.removeFromArray(this.childs, item);
      var control = this.zIndexMap[item.zIndex];
      if (control) {
        this.zIndexMap[item.zIndex] = self.util.removeFromArray(control, item);
      }
      item.removeHandler(this);
    };
    /**
     * @return {undefined}
     */
    this.clear = function () {
      var handler = this;
      this.childs.forEach(function (logger) {
        logger.removeHandler(handler);
      });
      /** @type {!Array} */
      this.childs = [];
      /** @type {!Array} */
      this.operations = [];
      /** @type {!Array} */
      this.zIndexArray = [];
      this.zIndexMap = {};
    };
    /**
     * @param {?} data
     * @return {undefined}
     */
    this.addToSelected = function (data) {
      this.selectedElements.push(data);
    };
    /**
     * @param {?} a
     * @return {undefined}
     */
    this.cancleAllSelected = function (a) {
      /** @type {number} */
      var i = 0;
      for (; i < this.selectedElements.length; i++) {
        this.selectedElements[i].unselectedHandler(a);
      }
      /** @type {!Array} */
      this.selectedElements = [];
    };
    /**
     * @param {?} size
     * @return {?}
     */
    this.notInSelectedNodes = function (size) {
      /** @type {number} */
      var i = 0;
      for (; i < this.selectedElements.length; i++) {
        if (size === this.selectedElements[i]) {
          return false;
        }
      }
      return true;
    };
    /**
     * @param {?} item
     * @return {undefined}
     */
    this.removeFromSelected = function (item) {
      /** @type {number} */
      var i = 0;
      for (; i < this.selectedElements.length; i++) {
        var element = this.selectedElements[i];
        if (item === element) {
          this.selectedElements = this.selectedElements.del(i);
        }
      }
    };
    /**
     * @param {!Object} obj
     * @return {?}
     */
    this.toSceneEvent = function (obj) {
      var node = self.util.clone(obj);
      if (node.x /= this.scaleX, node.y /= this.scaleY, 1 == this.translate) {
        var options = this.getOffsetTranslate();
        node.x -= options.translateX;
        node.y -= options.translateY;
      }
      return null != node.dx && (node.dx /= this.scaleX, node.dy /= this.scaleY), null != this.currentElement && (node.target = this.currentElement), node.scene = this, node;
    };
    /**
     * @param {!Object} event
     * @return {undefined}
     */
    this.selectElement = function (event) {
      var item = that.getElementByXY(event.x, event.y);
      if (null != item) {
        if (event.target = item, item.mousedownHander(event), item.selectedHandler(event), that.notInSelectedNodes(item)) {
          if (!event.ctrlKey) {
            that.cancleAllSelected();
          }
          that.addToSelected(item);
        } else {
          if (1 == event.ctrlKey) {
            item.unselectedHandler();
            this.removeFromSelected(item);
          }
          /** @type {number} */
          var i = 0;
          for (; i < this.selectedElements.length; i++) {
            var element = this.selectedElements[i];
            element.selectedHandler(event);
          }
        }
      } else {
        if (!event.ctrlKey) {
          that.cancleAllSelected();
        }
      }
      this.currentElement = item;
    };
    /**
     * @param {!Object} event
     * @return {?}
     */
    this.mousedownHandler = function (event) {
      var e = this.toSceneEvent(event);
      if (this.mouseDown = true, this.mouseDownX = e.x, this.mouseDownY = e.y, this.mouseDownEvent = e, this.mode == self.SceneMode.normal) {
        this.selectElement(e);
        if ((null == this.currentElement || this.currentElement instanceof self.Link) && 1 == this.translate) {
          this.lastTranslateX = this.translateX;
          this.lastTranslateY = this.translateY;
        }
      } else {
        if (this.mode == self.SceneMode.drag && 1 == this.translate) {
          return this.lastTranslateX = this.translateX, void (this.lastTranslateY = this.translateY);
        }
        if (this.mode == self.SceneMode.select) {
          this.selectElement(e);
        } else {
          if (this.mode == self.SceneMode.edit) {
            this.selectElement(e);
            if ((null == this.currentElement || this.currentElement instanceof self.Link) && 1 == this.translate) {
              this.lastTranslateX = this.translateX;
              this.lastTranslateY = this.translateY;
            }
          }
        }
      }
      that.dispatchEvent("mousedown", e);
    };
    /**
     * @param {!Object} event
     * @return {undefined}
     */
    this.mouseupHandler = function (event) {
      if (this.stage.cursor != self.MouseCursor.normal) {
        this.stage.cursor = self.MouseCursor.normal;
      }
      that.clearOperations();
      var e = this.toSceneEvent(event);
      if (null != this.currentElement) {
        e.target = that.currentElement;
        this.currentElement.mouseupHandler(e);
      }
      this.dispatchEvent("mouseup", e);
      /** @type {boolean} */
      this.mouseDown = false;
    };
    /**
     * @param {!Object} obj
     * @return {undefined}
     */
    this.dragElements = function (obj) {
      if (null != this.currentElement && 1 == this.currentElement.dragable) {
        /** @type {number} */
        var i = 0;
        for (; i < this.selectedElements.length; i++) {
          var element = this.selectedElements[i];
          if (0 != element.dragable) {
            var e = self.util.clone(obj);
            e.target = element;
            element.mousedragHandler(e);
          }
        }
      }
    };
    /**
     * @param {!Object} endpoints
     * @return {undefined}
     */
    this.mousedragHandler = function (endpoints) {
      var e = this.toSceneEvent(endpoints);
      if (this.mode == self.SceneMode.normal) {
        if (null == this.currentElement || this.currentElement instanceof self.Link) {
          if (1 == this.translate) {
            this.stage.cursor = self.MouseCursor.closed_hand;
            this.translateX = this.lastTranslateX + e.dx;
            this.translateY = this.lastTranslateY + e.dy;
          }
        } else {
          this.dragElements(e);
        }
      } else {
        if (this.mode == self.SceneMode.drag) {
          if (1 == this.translate) {
            this.stage.cursor = self.MouseCursor.closed_hand;
            this.translateX = this.lastTranslateX + e.dx;
            this.translateY = this.lastTranslateY + e.dy;
          }
        } else {
          if (this.mode == self.SceneMode.select) {
            if (null != this.currentElement) {
              if (1 == this.currentElement.dragable) {
                this.dragElements(e);
              }
            } else {
              if (1 == this.areaSelect) {
                this.areaSelectHandle(e);
              }
            }
          } else {
            if (this.mode == self.SceneMode.edit) {
              if (null == this.currentElement || this.currentElement instanceof self.Link) {
                if (1 == this.translate) {
                  this.stage.cursor = self.MouseCursor.closed_hand;
                  this.translateX = this.lastTranslateX + e.dx;
                  this.translateY = this.lastTranslateY + e.dy;
                }
              } else {
                this.dragElements(e);
              }
            }
          }
        }
      }
      this.dispatchEvent("mousedrag", e);
    };
    /**
     * @param {!Object} data
     * @return {undefined}
     */
    this.areaSelectHandle = function (data) {
      var width = data.offsetLeft;
      var count = data.offsetTop;
      var left = this.mouseDownEvent.offsetLeft;
      var max = this.mouseDownEvent.offsetTop;
      var x = width >= left ? left : width;
      var top = count >= max ? max : count;
      /** @type {number} */
      var w = Math.abs(data.dx) * this.scaleX;
      /** @type {number} */
      var height = Math.abs(data.dy) * this.scaleY;
      var rect = new draw(x, top, w, height);
      that.clearOperations().addOperation(rect);
      width = data.x;
      count = data.y;
      left = this.mouseDownEvent.x;
      max = this.mouseDownEvent.y;
      x = width >= left ? left : width;
      top = count >= max ? max : count;
      /** @type {number} */
      w = Math.abs(data.dx);
      /** @type {number} */
      height = Math.abs(data.dy);
      var x2 = x + w;
      var setTop = top + height;
      /** @type {number} */
      var i = 0;
      for (; i < that.childs.length; i++) {
        var o = that.childs[i];
        if (o.x > x && o.x + o.width < x2 && o.y > top && o.y + o.height < setTop && that.notInSelectedNodes(o)) {
          o.selectedHandler(data);
          that.addToSelected(o);
        }
      }
    };
    /**
     * event
     * @param {!Object} e
     * @return {?}
     */
    this.mousemoveHandler = function (e) {
      this.mousecoord = {
        x: e.x,
        y: e.y
      };
      var event = this.toSceneEvent(e);
      if (this.mode == self.SceneMode.drag) {
        return void (this.stage.cursor = self.MouseCursor.open_hand);
      }
      if (this.mode == self.SceneMode.normal) {
        this.stage.cursor = self.MouseCursor.normal;
      } else {
        if (this.mode == self.SceneMode.select) {
          this.stage.cursor = self.MouseCursor.normal;
        }
      }
      var state = that.getElementByXY(event.x, event.y);
      if (null != state) {
        if (that.mouseOverelement && that.mouseOverelement !== state) {
          event.target = state;
          that.mouseOverelement.mouseoutHandler(event);
        }
        that.mouseOverelement = state;
        if (0 == state.isMouseOver) {
          event.target = state;
          state.mouseoverHandler(event);
          that.dispatchEvent("mouseover", event);
        } else {
          event.target = state;
          state.mousemoveHandler(event);
          that.dispatchEvent("mousemove", event);
        }
      } else {
        if (that.mouseOverelement) {
          event.target = state;
          that.mouseOverelement.mouseoutHandler(event);
          /** @type {null} */
          that.mouseOverelement = null;
          that.dispatchEvent("mouseout", event);
        } else {
          /** @type {null} */
          event.target = null;
          that.dispatchEvent("mousemove", event);
        }
      }
    };
    /**
     * @param {!Object} event
     * @return {undefined}
     */
    this.mouseoverHandler = function (event) {
      var id = this.toSceneEvent(event);
      this.dispatchEvent("mouseover", id);
    };
    /**
     * @param {!Object} e
     * @return {undefined}
     */
    this.mouseoutHandler = function (e) {
      var id = this.toSceneEvent(e);
      this.dispatchEvent("mouseout", id);
    };
    /**
     * @param {!Object} e
     * @return {undefined}
     */
    this.clickHandler = function (e) {
      var evt = this.toSceneEvent(e);
      if (this.currentElement) {
        evt.target = this.currentElement;
        this.currentElement.clickHandler(evt);
      }
      this.dispatchEvent("click", evt);
    };
    /**
     * @param {!Object} endpoints
     * @return {undefined}
     */
    this.dbclickHandler = function (endpoints) {
      var e = this.toSceneEvent(endpoints);
      if (this.currentElement) {
        e.target = this.currentElement;
        this.currentElement.dbclickHandler(e);
      } else {
        that.cancleAllSelected();
      }
      this.dispatchEvent("dbclick", e);
    };
    /**
     * @param {!Object} e
     * @return {undefined}
     */
    this.mousewheelHandler = function (e) {
      var id = this.toSceneEvent(e);
      this.dispatchEvent("mousewheel", id);
    };
    this.touchstart = this.mousedownHander;
    /** @type {function(!Object): undefined} */
    this.touchmove = this.mousedragHandler;
    this.touchend = this.mousedownHander;
    /**
     * @param {!Object} e
     * @return {undefined}
     */
    this.keydownHandler = function (e) {
      this.dispatchEvent("keydown", e);
    };
    /**
     * @param {!Object} evt
     * @return {undefined}
     */
    this.keyupHandler = function (evt) {
      this.dispatchEvent("keyup", evt);
    };
    /**
     * scene.click 2 (click, callback)
     * @param {string} type
     * @param {!Function} f
     * @return {?}
     */
    this.addEventListener = function (type, f) {
      var jsav = this;
      /**
       * @param {?} rt
       * @return {undefined}
       */
      var fn = function (rt) {
        f.call(jsav, rt);
      };
      return this.messageBus.subscribe(type, fn), this;
    };
    /**
     * @param {?} message
     * @return {undefined}
     */
    this.removeEventListener = function (message) {
      this.messageBus.unsubscribe(message);
    };
    /**
     * @return {undefined}
     */
    this.removeAllEventListener = function () {
      this.messageBus = new self.util.MessageBus;
    };
    /**
     * scene.click 触发 2
     * @param {string} type
     * @param {!Object} e
     * @return {?}
     */
    this.dispatchEvent = function (type, e) {
      return this.messageBus.publish(type, e), this;
    };
    /** @type {!Array<string>} */
    var pipelets = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(",");
    var animationConfigs = this;
    return pipelets.forEach(function (event) {
      /**
       * scene.click 1
       * @param {!Object} b
       * @return {undefined}
       */
      animationConfigs[event] = function (b) {
        if (null != b) {
          this.addEventListener(event, b);
        } else {
          this.dispatchEvent(event);
        }
      };
    }), this.zoom = function (value, scale) {
      if (null != value && 0 != value) {
        /** @type {number} */
        this.scaleX = value;
      }
      if (null != scale && 0 != scale) {
        /** @type {number} */
        this.scaleY = scale;
      }
    }, this.zoomOut = function (opt_zoomFactor) {
      if (0 != opt_zoomFactor) {
        if (null == opt_zoomFactor) {
          /** @type {number} */
          opt_zoomFactor = .8;
        }
        this.scaleX /= opt_zoomFactor;
        this.scaleY /= opt_zoomFactor;
      }
    }, this.zoomIn = function (amount) {
      if (0 != amount) {
        if (null == amount) {
          /** @type {number} */
          amount = .8;
        }
        this.scaleX *= amount;
        this.scaleY *= amount;
      }
    }, this.getBound = function () {
      return {
        left: 0,
        top: 0,
        right: this.stage.canvas.width,
        bottom: this.stage.canvas.height,
        width: this.stage.canvas.width,
        height: this.stage.canvas.height
      };
    }, this.getElementsBound = function () {
      return self.util.getElementsBound(this.childs);
    }, this.translateToCenter = function (s) {
      var bboxClient = this.getElementsBound();
      /** @type {number} */
      var targetX = this.stage.canvas.width / 2 - (bboxClient.left + bboxClient.right) / 2;
      /** @type {number} */
      var targetY = this.stage.canvas.height / 2 - (bboxClient.top + bboxClient.bottom) / 2;
      if (s) {
        /** @type {number} */
        targetX = s.canvas.width / 2 - (bboxClient.left + bboxClient.right) / 2;
        /** @type {number} */
        targetY = s.canvas.height / 2 - (bboxClient.top + bboxClient.bottom) / 2;
      }
      /** @type {number} */
      this.translateX = targetX;
      /** @type {number} */
      this.translateY = targetY;
    }, this.setCenter = function (y, numTiles) {
      /** @type {number} */
      var change = y - this.stage.canvas.width / 2;
      /** @type {number} */
      var missingRects = numTiles - this.stage.canvas.height / 2;
      /** @type {number} */
      this.translateX = -change;
      /** @type {number} */
      this.translateY = -missingRects;
    }, this.centerAndZoom = function (type, x, s) {
      if (this.translateToCenter(s), null == type || null == x) {
        var visibleInputBounds = this.getElementsBound();
        /** @type {number} */
        var scale = visibleInputBounds.right - visibleInputBounds.left;
        /** @type {number} */
        var verticalTiles = visibleInputBounds.bottom - visibleInputBounds.top;
        /** @type {number} */
        var w = this.stage.canvas.width / scale;
        /** @type {number} */
        var containerWidth = this.stage.canvas.height / verticalTiles;
        if (s) {
          /** @type {number} */
          w = s.canvas.width / scale;
          /** @type {number} */
          containerWidth = s.canvas.height / verticalTiles;
        }
        /** @type {number} */
        var x = Math.min(w, containerWidth);
        if (x > 1) {
          return;
        }
        this.zoom(x, x);
      }
      this.zoom(type, x);
    }, this.getCenterLocation = function () {
      return {
        x: that.stage.canvas.width / 2,
        y: that.stage.canvas.height / 2
      };
    }, this.doLayout = function (require) {
      if (require) {
        require(this, this.childs);
      }
    }, this.toJson = function () {
      {
        var self = this;
        /** @type {string} */
        var val = "{";
        this.serializedProperties.length;
      }
      this.serializedProperties.forEach(function (operator) {
        var value = self[operator];
        if ("background" == operator) {
          value = self._background.src;
        }
        if ("string" == typeof value) {
          /** @type {string} */
          value = '"' + value + '"';
        }
        val = val + ('"' + operator + '":' + value + ",");
      });
      val = val + '"childs":[';
      var l = this.childs.length;
      return this.childs.forEach(function (result, i) {
        val = val + result.toJson();
        if (l > i + 1) {
          /** @type {string} */
          val = val + ",";
        }
      }), val = val + "]", val = val + "}";
    }, that;
  }
  init.prototype = new self.Element;
  var savedFleets = {};
  Object.defineProperties(init.prototype, {
    background: {
      get: function () {
        return this._background;
      },
      set: function (name) {
        if ("string" == typeof name) {
          var tmp = savedFleets[name];
          if (null == tmp) {
            /** @type {!Image} */
            tmp = new Image;
            /** @type {!Object} */
            tmp.src = name;
            /**
             * @return {undefined}
             */
            tmp.onload = function () {
              savedFleets[name] = tmp;
            };
          }
          this._background = tmp;
        } else {
          /** @type {!Object} */
          this._background = name;
        }
      }
    }
  });
  /** @type {function(!Object): ?} */
  self.Scene = init;
}(JTopo), function (exports) {
  /**
   * @return {undefined}
   */
  function factory() {
    /**
     * @return {undefined}
     */
    this.initialize = function () {
      factory.prototype.initialize.apply(this, arguments);
      /** @type {string} */
      this.elementType = "displayElement";
      /** @type {number} */
      this.x = 0;
      /** @type {number} */
      this.y = 0;
      /** @type {number} */
      this.width = 32;
      /** @type {number} */
      this.height = 32;
      /** @type {boolean} */
      this.visible = true;
      /** @type {number} */
      this.alpha = 1;
      /** @type {number} */
      this.rotate = 0;
      /** @type {number} */
      this.scaleX = 1;
      /** @type {number} */
      this.scaleY = 1;
      /** @type {string} */
      this.strokeColor = "22,124,255";
      /** @type {string} */
      this.borderColor = "22,124,255";
      /** @type {string} */
      this.fillColor = "22,124,255";
      /** @type {boolean} */
      this.shadow = false;
      /** @type {number} */
      this.shadowBlur = 5;
      /** @type {string} */
      this.shadowColor = "rgba(0,0,0,0.5)";
      /** @type {number} */
      this.shadowOffsetX = 3;
      /** @type {number} */
      this.shadowOffsetY = 6;
      /** @type {boolean} */
      this.transformAble = false;
      /** @type {number} */
      this.zIndex = 0;
      /** @type {!Array<string>} */
      var imageDataArr = "x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex".split(",");
      this.serializedProperties = this.serializedProperties.concat(imageDataArr);
    };
    this.initialize();
    /**
     * @param {!CanvasRenderingContext2D} context
     * @return {undefined}
     */
    this.paint = function (context) {
      context.beginPath();
      /** @type {string} */
      context.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
      context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
      context.fill();
      context.stroke();
      context.closePath();
    };
    /**
     * @return {?}
     */
    this.getLocation = function () {
      return {
        x: this.x,
        y: this.y
      };
    };
    /**
     * @param {number} x
     * @param {number} y
     * @return {?}
     */
    this.setLocation = function (x, y) {
      return this.x = x, this.y = y, this;
    };
    /**
     * @return {?}
     */
    this.getCenterLocation = function () {
      return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
      };
    };
    /**
     * @param {number} x
     * @param {number} y
     * @return {?}
     */
    this.setCenterLocation = function (x, y) {
      return this.x = x - this.width / 2, this.y = y - this.height / 2, this;
    };
    /**
     * @return {?}
     */
    this.getSize = function () {
      return {
        width: this.width,
        height: this.heith
      };
    };
    /**
     * @param {number} value
     * @param {number} size
     * @return {?}
     */
    this.setSize = function (value, size) {
      return this.width = value, this.height = size, this;
    };
    /**
     * @return {?}
     */
    this.getBound = function () {
      return {
        left: this.x,
        top: this.y,
        right: this.x + this.width,
        bottom: this.y + this.height,
        width: this.width,
        height: this.height
      };
    };
    /**
     * @param {undefined} left
     * @param {undefined} top
     * @param {undefined} width
     * @param {undefined} height
     * @return {?}
     */
    this.setBound = function (left, top, width, height) {
      return this.setLocation(left, top), this.setSize(width, height), this;
    };
    /**
     * @return {?}
     */
    this.getDisplayBound = function () {
      return {
        left: this.x,
        top: this.y,
        right: this.x + this.width * this.scaleX,
        bottom: this.y + this.height * this.scaleY
      };
    };
    /**
     * @return {?}
     */
    this.getDisplaySize = function () {
      return {
        width: this.width * this.scaleX,
        height: this.height * this.scaleY
      };
    };
    /**
     * @param {string} object
     * @return {?}
     */
    this.getPosition = function (object) {
      var v;
      var bound = this.getBound();
      return "Top_Left" == object ? v = {
        x: bound.left,
        y: bound.top
      } : "Top_Center" == object ? v = {
        x: this.cx,
        y: bound.top
      } : "Top_Right" == object ? v = {
        x: bound.right,
        y: bound.top
      } : "Middle_Left" == object ? v = {
        x: bound.left,
        y: this.cy
      } : "Middle_Center" == object ? v = {
        x: this.cx,
        y: this.cy
      } : "Middle_Right" == object ? v = {
        x: bound.right,
        y: this.cy
      } : "Bottom_Left" == object ? v = {
        x: bound.left,
        y: bound.bottom
      } : "Bottom_Center" == object ? v = {
        x: this.cx,
        y: bound.bottom
      } : "Bottom_Right" == object && (v = {
        x: bound.right,
        y: bound.bottom
      }), v;
    };
  }
  /**
   * @return {undefined}
   */
  function init() {
    /**
     * @return {undefined}
     */
    this.initialize = function () {
      init.prototype.initialize.apply(this, arguments);
      /** @type {string} */
      this.elementType = "interactiveElement";
      /** @type {boolean} */
      this.dragable = false;
      /** @type {boolean} */
      this.selected = false;
      /** @type {boolean} */
      this.showSelected = true;
      /** @type {null} */
      this.selectedLocation = null;
      /** @type {boolean} */
      this.isMouseOver = false;
      /** @type {!Array<string>} */
      var imageDataArr = "dragable,selected,showSelected,isMouseOver".split(",");
      this.serializedProperties = this.serializedProperties.concat(imageDataArr);
    };
    this.initialize();
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @return {undefined}
     */
    this.paintSelected = function (ctx) {
      if (0 != this.showSelected) {
        ctx.save();
        ctx.beginPath();
        /** @type {string} */
        ctx.strokeStyle = "rgba(168,202,255, 0.9)";
        /** @type {string} */
        ctx.fillStyle = "rgba(168,202,236,0.7)";
        ctx.rect(-this.width / 2 - 3, -this.height / 2 - 3, this.width + 6, this.height + 6);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }
    };
    /**
     * @param {!CanvasRenderingContext2D} context
     * @return {?}
     */
    this.paintMouseover = function (context) {
      return this.paintSelected(context);
    };
    /**
     * @param {number} mouseX
     * @param {number} mouseY
     * @return {?}
     */
    this.isInBound = function (mouseX, mouseY) {
      return mouseX > this.x && mouseX < this.x + this.width * Math.abs(this.scaleX) && mouseY > this.y && mouseY < this.y + this.height * Math.abs(this.scaleY);
    };
    /**
     * 设置选中
     * @return {undefined}
     */
    this.selectedHandler = function () {
      /** @type {boolean} */
      this.selected = true;
      this.selectedLocation = {
        x: this.x,
        y: this.y
      };
    };
    /**
     * @return {undefined}
     */
    this.unselectedHandler = function () {
      /** @type {boolean} */
      this.selected = false;
      /** @type {null} */
      this.selectedLocation = null;
    };
    /**
     * @param {!Object} e
     * @return {undefined}
     */
    this.dbclickHandler = function (e) {
      this.dispatchEvent("dbclick", e);
    };
    /**
     * @param {!Object} evt
     * @return {undefined}
     */
    this.clickHandler = function (evt) {
      this.dispatchEvent("click", evt);
    };
    /**
     * @param {!Object} evt
     * @return {undefined}
     */
    this.mousedownHander = function (evt) {
      this.dispatchEvent("mousedown", evt);
    };
    /**
     * @param {!Object} e
     * @return {undefined}
     */
    this.mouseupHandler = function (e) {
      this.dispatchEvent("mouseup", e);
    };
    /**
     * @param {!Object} evt
     * @return {undefined}
     */
    this.mouseoverHandler = function (evt) {
      /** @type {boolean} */
      this.isMouseOver = true;
      this.dispatchEvent("mouseover", evt);
    };
    /**
     * @param {!Object} evt
     * @return {undefined}
     */
    this.mousemoveHandler = function (evt) {
      this.dispatchEvent("mousemove", evt);
    };
    /**
     * @param {!Object} e
     * @return {undefined}
     */
    this.mouseoutHandler = function (e) {
      /** @type {boolean} */
      this.isMouseOver = false;
      this.dispatchEvent("mouseout", e);
    };
    /**
     * @param {!Object} evt
     * @return {undefined}
     */
    this.mousedragHandler = function (evt) {
      var newX = this.selectedLocation.x + evt.dx;
      var y = this.selectedLocation.y + evt.dy;
      this.setLocation(newX, y);
      this.dispatchEvent("mousedrag", evt);
    };
    /**
     * @param {string} type
     * @param {!Function} f
     * @return {?}
     */
    this.addEventListener = function (type, f) {
      var jsav = this;
      /**
       * @param {?} rt
       * @return {undefined}
       */
      var fn = function (rt) {
        f.call(jsav, rt);
      };
      return this.messageBus || (this.messageBus = new exports.util.MessageBus), this.messageBus.subscribe(type, fn), this;
    };
    /**
     * scene.click 触发 1（节点触发点击，冒泡上去）
     * @param {string} type
     * @param {!Object} e
     * @return {?}
     */
    this.dispatchEvent = function (type, e) {
      return this.messageBus ? (this.messageBus.publish(type, e), this) : null;
    };
    /**
     * @param {?} message
     * @return {undefined}
     */
    this.removeEventListener = function (message) {
      this.messageBus.unsubscribe(message);
    };
    /**
     * @return {undefined}
     */
    this.removeAllEventListener = function () {
      this.messageBus = new exports.util.MessageBus;
    };
    /** @type {!Array<string>} */
    var pipelets = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,touchstart,touchmove,touchend".split(",");
    var animationConfigs = this;
    pipelets.forEach(function (event) {
      /**
       * @param {!Object} b
       * @return {undefined}
       */
      animationConfigs[event] = function (b) {
        if (null != b) {
          this.addEventListener(event, b);
        } else {
          this.dispatchEvent(event);
        }
      };
    });
  }
  /**
   * @return {undefined}
   */
  function PlacesAutoComplete() {
    /**
     * @return {undefined}
     */
    this.initialize = function () {
      PlacesAutoComplete.prototype.initialize.apply(this, arguments);
      /** @type {boolean} */
      this.editAble = false;
      /** @type {null} */
      this.selectedPoint = null;
    };
    /**
     * @param {string} props
     * @return {?}
     */
    this.getCtrlPosition = function (props) {
      /** @type {number} */
      var range2X = 5;
      /** @type {number} */
      var range2Y = 5;
      var icenter = this.getPosition(props);
      return {
        left: icenter.x - range2X,
        top: icenter.y - range2Y,
        right: icenter.x + range2X,
        bottom: icenter.y + range2Y
      };
    };
    /**
     * 添加选中状态
     * @param {!Object} event
     * @return {undefined}
     */
    this.selectedHandler = function (event) {
      // 进入 2953 行
      PlacesAutoComplete.prototype.selectedHandler.apply(this, arguments);
      this.selectedSize = {
        width: this.width,
        height: this.height
      };
      if (event.scene.mode == exports.SceneMode.edit) {
        /** @type {boolean} */
        this.editAble = true;
      }
    };
    /**
     * @return {undefined}
     */
    this.unselectedHandler = function () {
      PlacesAutoComplete.prototype.unselectedHandler.apply(this, arguments);
      /** @type {null} */
      this.selectedSize = null;
      /** @type {boolean} */
      this.editAble = false;
    };
    /** @type {!Array} */
    var crossfilterable_layers = ["Top_Left", "Top_Center", "Top_Right", "Middle_Left", "Middle_Right", "Bottom_Left", "Bottom_Center", "Bottom_Right"];
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @return {undefined}
     */
    this.paintCtrl = function (ctx) {
      if (0 != this.editAble) {
        ctx.save();
        /** @type {number} */
        var layer_i = 0;
        for (; layer_i < crossfilterable_layers.length; layer_i++) {
          var bounds = this.getCtrlPosition(crossfilterable_layers[layer_i]);
          bounds.left -= this.cx;
          bounds.right -= this.cx;
          bounds.top -= this.cy;
          bounds.bottom -= this.cy;
          /** @type {number} */
          var width = bounds.right - bounds.left;
          /** @type {number} */
          var height = bounds.bottom - bounds.top;
          ctx.beginPath();
          /** @type {string} */
          ctx.strokeStyle = "rgba(0,0,0,0.8)";
          ctx.rect(bounds.left, bounds.top, width, height);
          ctx.stroke();
          ctx.closePath();
          ctx.beginPath();
          /** @type {string} */
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.rect(bounds.left + 1, bounds.top + 1, width - 2, height - 2);
          ctx.stroke();
          ctx.closePath();
        }
        ctx.restore();
      }
    };
    /**
     * @param {number} x
     * @param {number} y
     * @return {?}
     */
    this.isInBound = function (x, y) {
      if (this.selectedPoint = null, 1 == this.editAble) {
        /** @type {number} */
        var layer_i = 0;
        for (; layer_i < crossfilterable_layers.length; layer_i++) {
          var bounds = this.getCtrlPosition(crossfilterable_layers[layer_i]);
          if (x > bounds.left && x < bounds.right && y > bounds.top && y < bounds.bottom) {
            return this.selectedPoint = crossfilterable_layers[layer_i], true;
          }
        }
      }
      return PlacesAutoComplete.prototype.isInBound.apply(this, arguments);
    };
    /**
     * @param {!Object} e
     * @return {undefined}
     */
    this.mousedragHandler = function (e) {
      if (null == this.selectedPoint) {
        var x = this.selectedLocation.x + e.dx;
        var y = this.selectedLocation.y + e.dy;
        this.setLocation(x, y);
        this.dispatchEvent("mousedrag", e);
      } else {
        if ("Top_Left" == this.selectedPoint) {
          /** @type {number} */
          var dim = this.selectedSize.width - e.dx;
          /** @type {number} */
          var height = this.selectedSize.height - e.dy;
          x = this.selectedLocation.x + e.dx;
          y = this.selectedLocation.y + e.dy;
          if (x < this.x + this.width) {
            this.x = x;
            /** @type {number} */
            this.width = dim;
          }
          if (y < this.y + this.height) {
            this.y = y;
            /** @type {number} */
            this.height = height;
          }
        } else {
          if ("Top_Center" == this.selectedPoint) {
            /** @type {number} */
            height = this.selectedSize.height - e.dy;
            y = this.selectedLocation.y + e.dy;
            if (y < this.y + this.height) {
              this.y = y;
              /** @type {number} */
              this.height = height;
            }
          } else {
            if ("Top_Right" == this.selectedPoint) {
              dim = this.selectedSize.width + e.dx;
              y = this.selectedLocation.y + e.dy;
              if (y < this.y + this.height) {
                this.y = y;
                /** @type {number} */
                this.height = this.selectedSize.height - e.dy;
              }
              if (dim > 1) {
                this.width = dim;
              }
            } else {
              if ("Middle_Left" == this.selectedPoint) {
                /** @type {number} */
                dim = this.selectedSize.width - e.dx;
                x = this.selectedLocation.x + e.dx;
                if (x < this.x + this.width) {
                  this.x = x;
                }
                if (dim > 1) {
                  /** @type {number} */
                  this.width = dim;
                }
              } else {
                if ("Middle_Right" == this.selectedPoint) {
                  dim = this.selectedSize.width + e.dx;
                  if (dim > 1) {
                    this.width = dim;
                  }
                } else {
                  if ("Bottom_Left" == this.selectedPoint) {
                    /** @type {number} */
                    dim = this.selectedSize.width - e.dx;
                    x = this.selectedLocation.x + e.dx;
                    if (dim > 1) {
                      this.x = x;
                      /** @type {number} */
                      this.width = dim;
                    }
                    height = this.selectedSize.height + e.dy;
                    if (height > 1) {
                      this.height = height;
                    }
                  } else {
                    if ("Bottom_Center" == this.selectedPoint) {
                      height = this.selectedSize.height + e.dy;
                      if (height > 1) {
                        this.height = height;
                      }
                    } else {
                      if ("Bottom_Right" == this.selectedPoint) {
                        dim = this.selectedSize.width + e.dx;
                        if (dim > 1) {
                          this.width = dim;
                        }
                        height = this.selectedSize.height + e.dy;
                        if (height > 1) {
                          this.height = height;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        this.dispatchEvent("resize", e);
      }
    };
  }
  factory.prototype = new exports.Element;
  Object.defineProperties(factory.prototype, {
    cx: {
      get: function () {
        return this.x + this.width / 2;
      },
      set: function (value) {
        /** @type {number} */
        this.x = value - this.width / 2;
      }
    },
    cy: {
      get: function () {
        return this.y + this.height / 2;
      },
      set: function (value) {
        /** @type {number} */
        this.y = value - this.height / 2;
      }
    }
  });
  init.prototype = new factory;
  PlacesAutoComplete.prototype = new init;
  /** @type {function(): undefined} */
  exports.DisplayElement = factory;
  /** @type {function(): undefined} */
  exports.InteractiveElement = init;
  /** @type {function(): undefined} */
  exports.EditableElement = PlacesAutoComplete;
}(JTopo), function (exports) {
  /**
   * @param {undefined} name
   * @return {undefined}
   */
  function Connection(name) {
    /**
     * @param {!Object} value
     * @return {undefined}
     */
    this.initialize = function (value) {
      Connection.prototype.initialize.apply(this, arguments);
      /** @type {string} */
      this.elementType = "node";
      this.zIndex = exports.zIndex_Node;
      /** @type {!Object} */
      this.text = value;
      /** @type {string} */
      this.font = "12px Consolas";
      /** @type {string} */
      this.fontColor = "255,255,255";
      /** @type {number} */
      this.borderWidth = 0;
      /** @type {string} */
      this.borderColor = "255,255,255";
      /** @type {null} */
      this.borderRadius = null;
      /** @type {boolean} */
      this.dragable = true;
      /** @type {string} */
      this.textPosition = "Bottom_Center";
      /** @type {number} */
      this.textOffsetX = 0;
      /** @type {number} */
      this.textOffsetY = 0;
      /** @type {boolean} */
      this.transformAble = true;
      /** @type {null} */
      this.inLinks = null;
      /** @type {null} */
      this.outLinks = null;
      /** @type {!Array<string>} */
      var imageDataArr = "text,font,fontColor,textPosition,textOffsetX,textOffsetY,borderRadius".split(",");
      this.serializedProperties = this.serializedProperties.concat(imageDataArr);
    };
    this.initialize(name);
    /**
     * @param {!CanvasRenderingContext2D} context
     * @return {undefined}
     */
    this.paint = function (context) {
      if (this.image) {
        var opacity = context.globalAlpha;
        context.globalAlpha = this.alpha;
        if (null != this.image.alarm && null != this.alarm) {
          context.drawImage(this.image.alarm, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
          context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        }
        context.globalAlpha = opacity;
      } else {
        context.beginPath();
        /** @type {string} */
        context.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
        if (null == this.borderRadius || 0 == this.borderRadius) {
          context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        } else {
          context.JTopoRoundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius);
        }
        context.fill();
        context.closePath();
      }
      this.paintText(context);
      this.paintBorder(context);
      this.paintCtrl(context);
      this.paintAlarmText(context);
    };
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @return {undefined}
     */
    this.paintAlarmText = function (ctx) {
      if (null != this.alarm && "" != this.alarm) {
        var b = this.alarmColor || "255,0,0";
        var c = this.alarmAlpha || .5;
        ctx.beginPath();
        ctx.font = this.alarmFont || "10px \u00e5\u00be\u00ae\u00e8\u00bd\u00af\u00e9\u203a\u2026\u00e9\u00bb\u2018";
        var width = ctx.measureText(this.alarm).width + 6;
        var bracket_height = ctx.measureText("\u00e7\u201d\u00b0").width + 6;
        /** @type {number} */
        var x = this.width / 2 - width / 2;
        /** @type {number} */
        var line_y = -this.height / 2 - bracket_height - 8;
        /** @type {string} */
        ctx.strokeStyle = "rgba(" + b + ", " + c + ")";
        /** @type {string} */
        ctx.fillStyle = "rgba(" + b + ", " + c + ")";
        /** @type {string} */
        ctx.lineCap = "round";
        /** @type {number} */
        ctx.lineWidth = 1;
        ctx.moveTo(x, line_y);
        ctx.lineTo(x + width, line_y);
        ctx.lineTo(x + width, line_y + bracket_height);
        ctx.lineTo(x + width / 2 + 6, line_y + bracket_height);
        ctx.lineTo(x + width / 2, line_y + bracket_height + 8);
        ctx.lineTo(x + width / 2 - 6, line_y + bracket_height);
        ctx.lineTo(x, line_y + bracket_height);
        ctx.lineTo(x, line_y);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        /** @type {string} */
        ctx.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
        /** @type {string} */
        ctx.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
        ctx.fillText(this.alarm, x + 2, line_y + bracket_height - 4);
        ctx.closePath();
      }
    };
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @return {undefined}
     */
    this.paintText = function (ctx) {
      var line = this.text;
      if (null != line && "" != line) {
        ctx.beginPath();
        ctx.font = this.font;
        var widthA = ctx.measureText(line).width;
        var charsetBitSize = ctx.measureText("\u00e7\u201d\u00b0").width;
        /** @type {string} */
        ctx.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
        var point2d = this.getTextPostion(this.textPosition, widthA, charsetBitSize);
        ctx.fillText(line, point2d.x, point2d.y);
        ctx.closePath();
      }
    };
    /**
     * @param {!CanvasRenderingContext2D} context
     * @return {undefined}
     */
    this.paintBorder = function (context) {
      if (0 != this.borderWidth) {
        context.beginPath();
        context.lineWidth = this.borderWidth;
        /** @type {string} */
        context.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")";
        /** @type {number} */
        var hLeft = this.borderWidth / 2;
        if (null == this.borderRadius || 0 == this.borderRadius) {
          context.rect(-this.width / 2 - hLeft, -this.height / 2 - hLeft, this.width + this.borderWidth, this.height + this.borderWidth);
        } else {
          context.JTopoRoundRect(-this.width / 2 - hLeft, -this.height / 2 - hLeft, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius);
        }
        context.stroke();
        context.closePath();
      }
    };
    /**
     * @param {string} a
     * @param {number} w
     * @param {number} y
     * @return {?}
     */
    this.getTextPostion = function (a, w, y) {
      /** @type {null} */
      var value = null;
      return null == a || "Bottom_Center" == a ? value = {
        x: -this.width / 2 + (this.width - w) / 2,
        y: this.height / 2 + y
      } : "Top_Center" == a ? value = {
        x: -this.width / 2 + (this.width - w) / 2,
        y: -this.height / 2 - y / 2
      } : "Top_Right" == a ? value = {
        x: this.width / 2,
        y: -this.height / 2 - y / 2
      } : "Top_Left" == a ? value = {
        x: -this.width / 2 - w,
        y: -this.height / 2 - y / 2
      } : "Bottom_Right" == a ? value = {
        x: this.width / 2,
        y: this.height / 2 + y
      } : "Bottom_Left" == a ? value = {
        x: -this.width / 2 - w,
        y: this.height / 2 + y
      } : "Middle_Center" == a ? value = {
        x: -this.width / 2 + (this.width - w) / 2,
        y: y / 2
      } : "Middle_Right" == a ? value = {
        x: this.width / 2,
        y: y / 2
      } : "Middle_Left" == a && (value = {
        x: -this.width / 2 - w,
        y: y / 2
      }), null != this.textOffsetX && (value.x += this.textOffsetX), null != this.textOffsetY && (value.y += this.textOffsetY), value;
    };
    /**
     * node.setImage
     * @param {!Object} size
     * @param {number} width
     * @return {undefined}
     */
    this.setImage = function (size, width) {
      if (null == size) {
        throw new Error("Node.setImage(): \u00e5\u008f\u201a\u00e6\u2022\u00b0Image\u00e5\u00af\u00b9\u00e8\u00b1\u00a1\u00e4\u00b8\u00ba\u00e7\u00a9\u00ba!");
      }
      var context = this;
      if ("string" == typeof size) {
        var canvas = bufferCache[size];
        if (null == canvas) {
          /** @type {!Image} */
          canvas = new Image;
          /** @type {!Object} */
          canvas.src = size;
          /**
           * @return {undefined}
           */
          canvas.onload = function () {
            bufferCache[size] = canvas;
            if (1 == width) {
              context.setSize(canvas.width, canvas.height);
            }
            var alarm = exports.util.genImageAlarm(canvas);
            if (alarm) {
              // 源码被修改1: 为了不让告警时影响原icon的颜色
              // canvas.alarm = alarm;
            }
            context.image = canvas;
          };
        } else {
          if (width) {
            this.setSize(canvas.width, canvas.height);
          }
          this.image = canvas;
        }
      } else {
        /** @type {!Object} */
        this.image = size;
        if (1 == width) {
          this.setSize(size.width, size.height);
        }
      }
    };
    /**
     * @param {!FileEntry} logger
     * @return {undefined}
     */
    this.removeHandler = function (logger) {
      var d = this;
      if (this.outLinks) {
        this.outLinks.forEach(function (link) {
          if (link.nodeA === d) {
            logger.remove(link);
          }
        });
        /** @type {null} */
        this.outLinks = null;
      }
      if (this.inLinks) {
        this.inLinks.forEach(function (spec) {
          if (spec.nodeZ === d) {
            logger.remove(spec);
          }
        });
        /** @type {null} */
        this.inLinks = null;
      }
    };
  }
  /**
   * @return {undefined}
   */
  function Model() {
    Model.prototype.initialize.apply(this, arguments);
  }
  /**
   * @param {string} text
   * @return {undefined}
   */
  function create(text) {
    this.initialize();
    /** @type {string} */
    this.text = text;
    /** @type {string} */
    this.elementType = "TextNode";
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @return {undefined}
     */
    this.paint = function (ctx) {
      ctx.beginPath();
      ctx.font = this.font;
      this.width = ctx.measureText(this.text).width;
      this.height = ctx.measureText("\u00e7\u201d\u00b0").width;
      /** @type {string} */
      ctx.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
      /** @type {string} */
      ctx.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
      ctx.fillText(this.text, -this.width / 2, this.height / 2);
      ctx.closePath();
      this.paintBorder(ctx);
      this.paintCtrl(ctx);
      this.paintAlarmText(ctx);
    };
  }
  /**
   * @param {string} txt
   * @param {string} url
   * @param {!Object} seconds
   * @return {undefined}
   */
  function init(txt, url, seconds) {
    this.initialize();
    /** @type {string} */
    this.text = txt;
    /** @type {string} */
    this.href = url;
    /** @type {!Object} */
    this.target = seconds;
    /** @type {string} */
    this.elementType = "LinkNode";
    /** @type {boolean} */
    this.isVisited = false;
    /** @type {null} */
    this.visitedColor = null;
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @return {undefined}
     */
    this.paint = function (ctx) {
      ctx.beginPath();
      ctx.font = this.font;
      this.width = ctx.measureText(this.text).width;
      this.height = ctx.measureText("\u00e7\u201d\u00b0").width;
      if (this.isVisited && null != this.visitedColor) {
        /** @type {string} */
        ctx.strokeStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")";
        /** @type {string} */
        ctx.fillStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")";
      } else {
        /** @type {string} */
        ctx.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
        /** @type {string} */
        ctx.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
      }
      ctx.fillText(this.text, -this.width / 2, this.height / 2);
      if (this.isMouseOver) {
        ctx.moveTo(-this.width / 2, this.height);
        ctx.lineTo(this.width / 2, this.height);
        ctx.stroke();
      }
      ctx.closePath();
      this.paintBorder(ctx);
      this.paintCtrl(ctx);
      this.paintAlarmText(ctx);
    };
    this.mousemove(function () {
      /** @type {!NodeList<Element>} */
      var addedImgs = document.getElementsByTagName("canvas");
      if (addedImgs && addedImgs.length > 0) {
        /** @type {number} */
        var i = 0;
        for (; i < addedImgs.length; i++) {
          /** @type {string} */
          addedImgs[i].style.cursor = "pointer";
        }
      }
    });
    this.mouseout(function () {
      /** @type {!NodeList<Element>} */
      var addedImgs = document.getElementsByTagName("canvas");
      if (addedImgs && addedImgs.length > 0) {
        /** @type {number} */
        var i = 0;
        for (; i < addedImgs.length; i++) {
          /** @type {string} */
          addedImgs[i].style.cursor = "default";
        }
      }
    });
    this.click(function () {
      if ("_blank" == this.target) {
        window.open(this.href);
      } else {
        location = this.href;
      }
      /** @type {boolean} */
      this.isVisited = true;
    });
  }
  /**
   * @param {string} data
   * @return {undefined}
   */
  function view(data) {
    this.initialize(arguments);
    /** @type {number} */
    this._radius = 20;
    /** @type {number} */
    this.beginDegree = 0;
    /** @type {number} */
    this.endDegree = 2 * Math.PI;
    /** @type {string} */
    this.text = data;
    /**
     * @param {!CanvasRenderingContext2D} context
     * @return {undefined}
     */
    this.paint = function (context) {
      context.save();
      context.beginPath();
      /** @type {string} */
      context.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
      context.arc(0, 0, this.radius, this.beginDegree, this.endDegree, true);
      context.fill();
      context.closePath();
      context.restore();
      this.paintText(context);
      this.paintBorder(context);
      this.paintCtrl(context);
      this.paintAlarmText(context);
    };
    /**
     * @param {!CanvasRenderingContext2D} context
     * @return {undefined}
     */
    this.paintSelected = function (context) {
      context.save();
      context.beginPath();
      /** @type {string} */
      context.strokeStyle = "rgba(168,202,255, 0.9)";
      /** @type {string} */
      context.fillStyle = "rgba(168,202,236,0.7)";
      context.arc(0, 0, this.radius + 3, this.beginDegree, this.endDegree, true);
      context.fill();
      context.stroke();
      context.closePath();
      context.restore();
    };
  }
  /**
   * @param {number} options
   * @param {number} stream
   * @param {undefined} value
   * @return {undefined}
   */
  function ObjectId(options, stream, value) {
    this.initialize();
    this.frameImages = options || [];
    /** @type {number} */
    this.frameIndex = 0;
    /** @type {boolean} */
    this.isStop = true;
    var number = stream || 1e3;
    /** @type {boolean} */
    this.repeatPlay = false;
    var self = this;
    /**
     * @return {undefined}
     */
    this.nextFrame = function () {
      if (!this.isStop && null != this.frameImages.length) {
        if (this.frameIndex++ , this.frameIndex >= this.frameImages.length) {
          if (!this.repeatPlay) {
            return;
          }
          /** @type {number} */
          this.frameIndex = 0;
        }
        this.setImage(this.frameImages[this.frameIndex], value);
        setTimeout(function () {
          self.nextFrame();
        }, number / options.length);
      }
    };
  }
  /**
   * @param {!Object} value
   * @param {number} size
   * @param {number} len
   * @param {number} target
   * @param {number} width
   * @return {undefined}
   */
  function ctor(value, size, len, target, width) {
    this.initialize();
    var self = this;
    this.setImage(value);
    /** @type {number} */
    this.frameIndex = 0;
    /** @type {boolean} */
    this.isPause = true;
    /** @type {boolean} */
    this.repeatPlay = false;
    var one = target || 1e3;
    width = width || 0;
    /**
     * @param {!CanvasRenderingContext2D} context
     * @return {undefined}
     */
    this.paint = function (context) {
      if (this.image) {
        var w = this.width;
        var height = this.height;
        context.save();
        context.beginPath();
        /** @type {string} */
        context.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
        /** @type {number} */
        var py = (Math.floor(this.frameIndex / len) + width) * height;
        /** @type {number} */
        var x = Math.floor(this.frameIndex % len) * w;
        context.drawImage(this.image, x, py, w, height, -w / 2, -height / 2, w, height);
        context.fill();
        context.closePath();
        context.restore();
        this.paintText(context);
        this.paintBorder(context);
        this.paintCtrl(context);
        this.paintAlarmText(context);
      }
    };
    /**
     * @return {undefined}
     */
    this.nextFrame = function () {
      if (!this.isStop) {
        if (this.frameIndex++ , this.frameIndex >= size * len) {
          if (!this.repeatPlay) {
            return;
          }
          /** @type {number} */
          this.frameIndex = 0;
        }
        setTimeout(function () {
          if (!self.isStop) {
            self.nextFrame();
          }
        }, one / (size * len));
      }
    };
  }
  /**
   * @return {?}
   */
  function SoundManager() {
    /** @type {null} */
    var sprite = null;
    return sprite = arguments.length <= 3 ? new ObjectId(arguments[0], arguments[1], arguments[2]) : new ctor(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]), sprite.stop = function () {
      /** @type {boolean} */
      sprite.isStop = true;
    }, sprite.play = function () {
      /** @type {boolean} */
      sprite.isStop = false;
      /** @type {number} */
      sprite.frameIndex = 0;
      sprite.nextFrame();
    }, sprite;
  }
  var bufferCache = {};
  Connection.prototype = new exports.EditableElement;
  Model.prototype = new Connection;
  create.prototype = new Model;
  init.prototype = new create;
  view.prototype = new Model;
  Object.defineProperties(view.prototype, {
    radius: {
      get: function () {
        return this._radius;
      },
      set: function (value) {
        /** @type {number} */
        this._radius = value;
        /** @type {number} */
        var dim = 2 * this.radius;
        /** @type {number} */
        var height = 2 * this.radius;
        /** @type {number} */
        this.width = dim;
        /** @type {number} */
        this.height = height;
      }
    },
    width: {
      get: function () {
        return this._width;
      },
      set: function (width) {
        /** @type {number} */
        this._radius = width / 2;
        /** @type {number} */
        this._width = width;
      }
    },
    height: {
      get: function () {
        return this._height;
      },
      set: function (width) {
        /** @type {number} */
        this._radius = width / 2;
        /** @type {number} */
        this._height = width;
      }
    }
  });
  ObjectId.prototype = new Model;
  ctor.prototype = new Model;
  SoundManager.prototype = new Model;
  /** @type {function(): undefined} */
  exports.Node = Model;
  /** @type {function(string): undefined} */
  exports.TextNode = create;
  /** @type {function(string, string, !Object): undefined} */
  exports.LinkNode = init;
  /** @type {function(string): undefined} */
  exports.CircleNode = view;
  /** @type {function(): ?} */
  exports.AnimateNode = SoundManager;
}(JTopo), function (exports) {
  /**
   * @param {string} a
   * @param {string} b
   * @return {?}
   */
  function end(a, b) {
    /** @type {!Array} */
    var buffer = [];
    if (null == a || null == b) {
      return buffer;
    }
    if (a && b && a.outLinks && b.inLinks) {
      /** @type {number} */
      var j = 0;
      for (; j < a.outLinks.length; j++) {
        var x = a.outLinks[j];
        /** @type {number} */
        var i = 0;
        for (; i < b.inLinks.length; i++) {
          var id = b.inLinks[i];
          if (x === id) {
            buffer.push(id);
          }
        }
      }
    }
    return buffer;
  }
  /**
   * @param {string} i
   * @param {string} cb
   * @return {?}
   */
  function filter(i, cb) {
    var result = end(i, cb);
    var index = end(cb, i);
    var string = result.concat(index);
    return string;
  }
  /**
   * @param {?} self
   * @return {?}
   */
  function split(self) {
    var muxed = filter(self.nodeA, self.nodeZ);
    return muxed = muxed.filter(function (process) {
      return self !== process;
    });
  }
  /**
   * @param {string} a
   * @param {string} n
   * @return {?}
   */
  function length(a, n) {
    return filter(a, n).length;
  }
  /**
   * @param {undefined} type
   * @param {string} cfg
   * @param {string} app
   * @return {undefined}
   */
  function init(type, cfg, app) {
    /**
     * @param {!Object} target
     * @param {!Object} pos
     * @return {?}
     */
    function onMouseMove(target, pos) {
      var blob = exports.util.lineF(target.cx, target.cy, pos.cx, pos.cy);
      var raw = target.getBound();
      var decrypted = exports.util.intersectionLineBound(blob, raw);
      return decrypted;
    }
    /**
     * @param {!Object} a
     * @param {string} f
     * @param {string} text
     * @return {undefined}
     */
    this.initialize = function (a, f, text) {
      if (init.prototype.initialize.apply(this, arguments), this.elementType = "link", this.zIndex = exports.zIndex_Link, 0 != arguments.length) {
        /** @type {string} */
        this.text = text;
        /** @type {!Object} */
        this.nodeA = a;
        /** @type {string} */
        this.nodeZ = f;
        if (this.nodeA && null == this.nodeA.outLinks) {
          /** @type {!Array} */
          this.nodeA.outLinks = [];
        }
        if (this.nodeA && null == this.nodeA.inLinks) {
          /** @type {!Array} */
          this.nodeA.inLinks = [];
        }
        if (this.nodeZ && null == this.nodeZ.inLinks) {
          /** @type {!Array} */
          this.nodeZ.inLinks = [];
        }
        if (this.nodeZ && null == this.nodeZ.outLinks) {
          /** @type {!Array} */
          this.nodeZ.outLinks = [];
        }
        if (null != this.nodeA) {
          this.nodeA.outLinks.push(this);
        }
        if (null != this.nodeZ) {
          this.nodeZ.inLinks.push(this);
        }
        this.caculateIndex();
        /** @type {string} */
        this.font = "12px Consolas";
        /** @type {string} */
        this.fontColor = "255,255,255";
        /** @type {number} */
        this.lineWidth = 2;
        /** @type {string} */
        this.lineJoin = "miter";
        /** @type {boolean} */
        this.transformAble = false;
        /** @type {number} */
        this.bundleOffset = 20;
        /** @type {number} */
        this.bundleGap = 12;
        /** @type {number} */
        this.textOffsetX = 0;
        /** @type {number} */
        this.textOffsetY = 0;
        /** @type {null} */
        this.arrowsRadius = null;
        /** @type {number} */
        this.arrowsOffset = 0;
        /** @type {null} */
        this.dashedPattern = null;
        /** @type {!Array} */
        this.path = [];
        /** @type {!Array<string>} */
        var imageDataArr = "text,font,fontColor,lineWidth,lineJoin".split(",");
        this.serializedProperties = this.serializedProperties.concat(imageDataArr);
      }
    };
    /**
     * @return {undefined}
     */
    this.caculateIndex = function () {
      var currentValueLength = length(this.nodeA, this.nodeZ);
      if (currentValueLength > 0) {
        /** @type {number} */
        this.nodeIndex = currentValueLength - 1;
      }
    };
    this.initialize(type, cfg, app);
    /**
     * @return {undefined}
     */
    this.removeHandler = function () {
      var tag = this;
      if (this.nodeA && this.nodeA.outLinks) {
        this.nodeA.outLinks = this.nodeA.outLinks.filter(function (b) {
          return b !== tag;
        });
      }
      if (this.nodeZ && this.nodeZ.inLinks) {
        this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function (b) {
          return b !== tag;
        });
      }
      var regroupLines = split(this);
      regroupLines.forEach(function (nodeB, idxB) {
        /** @type {number} */
        nodeB.nodeIndex = idxB;
      });
    };
    /**
     * @return {?}
     */
    this.getStartPosition = function () {
      var p = {
        x: this.nodeA.cx,
        y: this.nodeA.cy
      };
      return p;
    };
    /**
     * @return {?}
     */
    this.getEndPosition = function () {
      var currentShadingPosition;
      return null != this.arrowsRadius && (currentShadingPosition = onMouseMove(this.nodeZ, this.nodeA)), null == currentShadingPosition && (currentShadingPosition = {
        x: this.nodeZ.cx,
        y: this.nodeZ.cy
      }), currentShadingPosition;
    };
    /**
     * @return {?}
     */
    this.getPath = function () {
      /** @type {!Array} */
      var statPointCoordinatesList = [];
      var startPos = this.getStartPosition();
      var point = this.getEndPosition();
      if (this.nodeA === this.nodeZ) {
        return [startPos, point];
      }
      var currentValueLength = length(this.nodeA, this.nodeZ);
      if (1 == currentValueLength) {
        return [startPos, point];
      }
      /** @type {number} */
      var angle = Math.atan2(point.y - startPos.y, point.x - startPos.x);
      var center = {
        x: startPos.x + this.bundleOffset * Math.cos(angle),
        y: startPos.y + this.bundleOffset * Math.sin(angle)
      };
      var centerPoint = {
        x: point.x + this.bundleOffset * Math.cos(angle - Math.PI),
        y: point.y + this.bundleOffset * Math.sin(angle - Math.PI)
      };
      /** @type {number} */
      var ang = angle - Math.PI / 2;
      /** @type {number} */
      var theta = angle - Math.PI / 2;
      /** @type {number} */
      var k = currentValueLength * this.bundleGap / 2 - this.bundleGap / 2;
      /** @type {number} */
      var radius = this.bundleGap * this.nodeIndex;
      var rect = {
        x: center.x + radius * Math.cos(ang),
        y: center.y + radius * Math.sin(ang)
      };
      var node = {
        x: centerPoint.x + radius * Math.cos(theta),
        y: centerPoint.y + radius * Math.sin(theta)
      };
      return rect = {
        x: rect.x + k * Math.cos(ang - Math.PI),
        y: rect.y + k * Math.sin(ang - Math.PI)
      }, node = {
        x: node.x + k * Math.cos(theta - Math.PI),
        y: node.y + k * Math.sin(theta - Math.PI)
      }, statPointCoordinatesList.push({
        x: startPos.x,
        y: startPos.y
      }), statPointCoordinatesList.push({
        x: rect.x,
        y: rect.y
      }), statPointCoordinatesList.push({
        x: node.x,
        y: node.y
      }), statPointCoordinatesList.push({
        x: point.x,
        y: point.y
      }), statPointCoordinatesList;
    };
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @param {!Object} values
     * @return {?}
     */
    this.paintPath = function (ctx, values) {
      if (this.nodeA === this.nodeZ) {
        return void this.paintLoop(ctx);
      }
      ctx.beginPath();
      ctx.moveTo(values[0].x, values[0].y);
      /** @type {number} */
      var i = 1;
      for (; i < values.length; i++) {
        if (null == this.dashedPattern) {
          ctx.lineTo(values[i].x, values[i].y);
        } else {
          ctx.JTopoDashedLineTo(values[i - 1].x, values[i - 1].y, values[i].x, values[i].y, this.dashedPattern);
        }
      }
      if (ctx.stroke(), ctx.closePath(), null != this.arrowsRadius) {
        var val = values[values.length - 2];
        var oldValue = values[values.length - 1];
        this.paintArrow(ctx, val, oldValue);
      }
    };
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @return {undefined}
     */
    this.paintLoop = function (ctx) {
      ctx.beginPath();
      {
        /** @type {number} */
        var innerBarRadius = this.bundleGap * (this.nodeIndex + 1) / 2;
        Math.PI + Math.PI / 2;
      }
      ctx.arc(this.nodeA.x, this.nodeA.y, innerBarRadius, Math.PI / 2, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
    };
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @param {!Object} min
     * @param {!Object} p1
     * @return {undefined}
     */
    this.paintArrow = function (ctx, min, p1) {
      var r = this.arrowsOffset;
      /** @type {number} */
      var rlng = this.arrowsRadius / 2;
      /** @type {!Object} */
      var start = min;
      /** @type {!Object} */
      var p = p1;
      /** @type {number} */
      var theta = Math.atan2(p.y - start.y, p.x - start.x);
      /** @type {number} */
      var R = exports.util.getDistance(start, p) - this.arrowsRadius;
      var objectLeft = start.x + (R + r) * Math.cos(theta);
      var borderfull = start.y + (R + r) * Math.sin(theta);
      var insertionHalfWidth = p.x + r * Math.cos(theta);
      var lY1 = p.y + r * Math.sin(theta);
      /** @type {number} */
      theta = theta - Math.PI / 2;
      var crosshair = {
        x: objectLeft + rlng * Math.cos(theta),
        y: borderfull + rlng * Math.sin(theta)
      };
      var lineEnd = {
        x: objectLeft + rlng * Math.cos(theta - Math.PI),
        y: borderfull + rlng * Math.sin(theta - Math.PI)
      };
      ctx.beginPath();
      /** @type {string} */
      ctx.fillStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")";
      ctx.moveTo(crosshair.x, crosshair.y);
      ctx.lineTo(insertionHalfWidth, lY1);
      ctx.lineTo(lineEnd.x, lineEnd.y);
      ctx.stroke();
      ctx.closePath();
    };
    /**
     * @param {!CanvasRenderingContext2D} context
     * @return {undefined}
     */
    this.paint = function (context) {
      if (null != this.nodeA && null != !this.nodeZ) {
        var value = this.getPath(this.nodeIndex);
        this.path = value;
        /** @type {string} */
        context.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")";
        context.lineWidth = this.lineWidth;
        this.paintPath(context, value);
        if (value && value.length > 0) {
          this.paintText(context, value);
        }
      }
    };
    /** @type {number} */
    var ratio = -(Math.PI / 2 + Math.PI / 4);
    /**
     * @param {!CanvasRenderingContext2D} context
     * @param {!Array} array
     * @return {undefined}
     */
    this.paintText = function (context, array) {
      var c = array[0];
      var p = array[array.length - 1];
      if (4 == array.length && (c = array[1], p = array[2]), this.text && this.text.length > 0) {
        var gx = (p.x + c.x) / 2 + this.textOffsetX;
        var y = (p.y + c.y) / 2 + this.textOffsetY;
        context.save();
        context.beginPath();
        context.font = this.font;
        var beginWidth = context.measureText(this.text).width;
        var lw = context.measureText("\u00e7\u201d\u00b0").width;
        if (context.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", this.nodeA === this.nodeZ) {
          /** @type {number} */
          var dy = this.bundleGap * (this.nodeIndex + 1) / 2;
          gx = this.nodeA.x + dy * Math.cos(ratio);
          y = this.nodeA.y + dy * Math.sin(ratio);
          context.fillText(this.text, gx, y);
        } else {
          context.fillText(this.text, gx - beginWidth / 2, y - lw / 2);
        }
        context.stroke();
        context.closePath();
        context.restore();
      }
    };
    /**
     * @param {!CanvasRenderingContext2D} context
     * @return {undefined}
     */
    this.paintSelected = function (context) {
      /** @type {number} */
      context.shadowBlur = 10;
      /** @type {string} */
      context.shadowColor = "rgba(0,0,0,1)";
      /** @type {number} */
      context.shadowOffsetX = 0;
      /** @type {number} */
      context.shadowOffsetY = 0;
    };
    /**
     * @param {number} relX
     * @param {number} relY
     * @return {?}
     */
    this.isInBound = function (relX, relY) {
      if (this.nodeA === this.nodeZ) {
        /** @type {number} */
        var requiredContrast = this.bundleGap * (this.nodeIndex + 1) / 2;
        /** @type {number} */
        var dContrast = exports.util.getDistance(this.nodeA, {
          x: relX,
          y: relY
        }) - requiredContrast;
        return Math.abs(dContrast) <= 3;
      }
      /** @type {boolean} */
      var f = false;
      /** @type {number} */
      var i = 1;
      for (; i < this.path.length; i++) {
        var p0 = this.path[i - 1];
        var currentWaypoint = this.path[i];
        if (1 == exports.util.isPointInLine({
          x: relX,
          y: relY
        }, p0, currentWaypoint)) {
          /** @type {boolean} */
          f = true;
          break;
        }
      }
      return f;
    };
  }
  /**
   * @param {undefined} type
   * @param {string} config
   * @param {string} app
   * @return {undefined}
   */
  function Router(type, config, app) {
    /**
     * @return {undefined}
     */
    this.initialize = function () {
      Router.prototype.initialize.apply(this, arguments);
      /** @type {string} */
      this.direction = "horizontal";
    };
    this.initialize(type, config, app);
    /**
     * @return {?}
     */
    this.getStartPosition = function () {
      var leftRenderRect = {
        x: this.nodeA.cx,
        y: this.nodeA.cy
      };
      return "horizontal" == this.direction ? this.nodeZ.cx > leftRenderRect.x ? leftRenderRect.x += this.nodeA.width / 2 : leftRenderRect.x -= this.nodeA.width / 2 : this.nodeZ.cy > leftRenderRect.y ? leftRenderRect.y += this.nodeA.height / 2 : leftRenderRect.y -= this.nodeA.height / 2, leftRenderRect;
    };
    /**
     * @return {?}
     */
    this.getEndPosition = function () {
      var leftRenderRect = {
        x: this.nodeZ.cx,
        y: this.nodeZ.cy
      };
      return "horizontal" == this.direction ? this.nodeA.cy < leftRenderRect.y ? leftRenderRect.y -= this.nodeZ.height / 2 : leftRenderRect.y += this.nodeZ.height / 2 : leftRenderRect.x = this.nodeA.cx < leftRenderRect.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width, leftRenderRect;
    };
    /**
     * @param {?} size
     * @return {?}
     */
    this.getPath = function (size) {
      /** @type {!Array} */
      var statPointCoordinatesList = [];
      var center = this.getStartPosition();
      var pos = this.getEndPosition();
      if (this.nodeA === this.nodeZ) {
        return [center, pos];
      }
      var k;
      var i;
      var currentValueLength = length(this.nodeA, this.nodeZ);
      /** @type {number} */
      var sizeY = (currentValueLength - 1) * this.bundleGap;
      /** @type {number} */
      var offset = this.bundleGap * size - sizeY / 2;
      return "horizontal" == this.direction ? (k = pos.x + offset, i = center.y - offset, statPointCoordinatesList.push({
        x: center.x,
        y: i
      }), statPointCoordinatesList.push({
        x: k,
        y: i
      }), statPointCoordinatesList.push({
        x: k,
        y: pos.y
      })) : (k = center.x + offset, i = pos.y - offset, statPointCoordinatesList.push({
        x: k,
        y: center.y
      }), statPointCoordinatesList.push({
        x: k,
        y: i
      }), statPointCoordinatesList.push({
        x: pos.x,
        y: i
      })), statPointCoordinatesList;
    };
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @param {!Object} text
     * @return {undefined}
     */
    this.paintText = function (ctx, text) {
      if (this.text && this.text.length > 0) {
        var c = text[1];
        var xpos = c.x + this.textOffsetX;
        var h = c.y + this.textOffsetY;
        ctx.save();
        ctx.beginPath();
        ctx.font = this.font;
        var previewWidth = ctx.measureText(this.text).width;
        var lineWidth = ctx.measureText("\u00e7\u201d\u00b0").width;
        /** @type {string} */
        ctx.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
        ctx.fillText(this.text, xpos - previewWidth / 2, h - lineWidth / 2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }
    };
  }
  /**
   * @param {undefined} width
   * @param {string} font
   * @param {string} text
   * @return {undefined}
   */
  function initialize(width, font, text) {
    /**
     * @return {undefined}
     */
    this.initialize = function () {
      initialize.prototype.initialize.apply(this, arguments);
      /** @type {string} */
      this.direction = "vertical";
      /** @type {number} */
      this.offsetGap = 44;
    };
    this.initialize(width, font, text);
    /**
     * @return {?}
     */
    this.getStartPosition = function () {
      var leftRenderRect = {
        x: this.nodeA.cx,
        y: this.nodeA.cy
      };
      return "horizontal" == this.direction ? leftRenderRect.x = this.nodeZ.cx < leftRenderRect.x ? this.nodeA.x : this.nodeA.x + this.nodeA.width : leftRenderRect.y = this.nodeZ.cy < leftRenderRect.y ? this.nodeA.y : this.nodeA.y + this.nodeA.height, leftRenderRect;
    };
    /**
     * @return {?}
     */
    this.getEndPosition = function () {
      var leftRenderRect = {
        x: this.nodeZ.cx,
        y: this.nodeZ.cy
      };
      return "horizontal" == this.direction ? leftRenderRect.x = this.nodeA.cx < leftRenderRect.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width : leftRenderRect.y = this.nodeA.cy < leftRenderRect.y ? this.nodeZ.y : this.nodeZ.y + this.nodeZ.height, leftRenderRect;
    };
    /**
     * @param {?} size
     * @return {?}
     */
    this.getPath = function (size) {
      var start = this.getStartPosition();
      var bbox = this.getEndPosition();
      if (this.nodeA === this.nodeZ) {
        return [start, bbox];
      }
      /** @type {!Array} */
      var statPointCoordinatesList = [];
      var currentValueLength = length(this.nodeA, this.nodeZ);
      /** @type {number} */
      var sizeY = (currentValueLength - 1) * this.bundleGap;
      /** @type {number} */
      var w = this.bundleGap * size - sizeY / 2;
      var padding = this.offsetGap;
      return "horizontal" == this.direction ? (this.nodeA.cx > this.nodeZ.cx && (padding = -padding), statPointCoordinatesList.push({
        x: start.x,
        y: start.y + w
      }), statPointCoordinatesList.push({
        x: start.x + padding,
        y: start.y + w
      }), statPointCoordinatesList.push({
        x: bbox.x - padding,
        y: bbox.y + w
      }), statPointCoordinatesList.push({
        x: bbox.x,
        y: bbox.y + w
      })) : (this.nodeA.cy > this.nodeZ.cy && (padding = -padding), statPointCoordinatesList.push({
        x: start.x + w,
        y: start.y
      }), statPointCoordinatesList.push({
        x: start.x + w,
        y: start.y + padding
      }), statPointCoordinatesList.push({
        x: bbox.x + w,
        y: bbox.y - padding
      }), statPointCoordinatesList.push({
        x: bbox.x + w,
        y: bbox.y
      })), statPointCoordinatesList;
    };
  }
  /**
   * @param {undefined} a
   * @param {string} b
   * @param {string} c
   * @return {undefined}
   */
  function PlacesAutoComplete(a, b, c) {
    /**
     * @return {undefined}
     */
    this.initialize = function () {
      PlacesAutoComplete.prototype.initialize.apply(this, arguments);
    };
    this.initialize(a, b, c);
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @param {!Object} buffer
     * @return {?}
     */
    this.paintPath = function (ctx, buffer) {
      if (this.nodeA === this.nodeZ) {
        return void this.paintLoop(ctx);
      }
      ctx.beginPath();
      ctx.moveTo(buffer[0].x, buffer[0].y);
      /** @type {number} */
      var i = 1;
      for (; i < buffer.length; i++) {
        var s = buffer[i - 1];
        var p = buffer[i];
        /** @type {number} */
        var rx = (s.x + p.x) / 2;
        /** @type {number} */
        var cp1y = (s.y + p.y) / 2;
        /** @type {number} */
        cp1y = cp1y + (p.y - s.y) / 2;
        /** @type {string} */
        ctx.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")";
        ctx.lineWidth = this.lineWidth;
        ctx.moveTo(s.x, s.cy);
        ctx.quadraticCurveTo(rx, cp1y, p.x, p.y);
        ctx.stroke();
      }
      if (ctx.stroke(), ctx.closePath(), null != this.arrowsRadius) {
        var val = buffer[buffer.length - 2];
        var v2 = buffer[buffer.length - 1];
        this.paintArrow(ctx, val, v2);
      }
    };
  }
  init.prototype = new exports.InteractiveElement;
  Router.prototype = new init;
  initialize.prototype = new init;
  PlacesAutoComplete.prototype = new init;
  /** @type {function(undefined, string, string): undefined} */
  exports.Link = init;
  /** @type {function(undefined, string, string): undefined} */
  exports.FoldLink = Router;
  /** @type {function(undefined, string, string): undefined} */
  exports.FlexionalLink = initialize;
  /** @type {function(undefined, string, string): undefined} */
  exports.CurveLink = PlacesAutoComplete;
}(JTopo), function (config) {
  /**
   * @param {undefined} name
   * @return {undefined}
   */
  function init(name) {
    /**
     * @param {string} value
     * @return {undefined}
     */
    this.initialize = function (value) {
      init.prototype.initialize.apply(this, null);
      /** @type {string} */
      this.elementType = "container";
      this.zIndex = config.zIndex_Container;
      /** @type {number} */
      this.width = 100;
      /** @type {number} */
      this.height = 100;
      /** @type {!Array} */
      this.childs = [];
      /** @type {number} */
      this.alpha = .5;
      /** @type {boolean} */
      this.dragable = true;
      /** @type {boolean} */
      this.childDragble = true;
      /** @type {boolean} */
      this.visible = true;
      /** @type {string} */
      this.fillColor = "10,100,80";
      /** @type {number} */
      this.borderWidth = 0;
      /** @type {string} */
      this.borderColor = "255,255,255";
      /** @type {null} */
      this.borderRadius = null;
      /** @type {string} */
      this.font = "12px Consolas";
      /** @type {string} */
      this.fontColor = "255,255,255";
      /** @type {string} */
      this.text = value;
      /** @type {string} */
      this.textPosition = "Bottom_Center";
      /** @type {number} */
      this.textOffsetX = 0;
      /** @type {number} */
      this.textOffsetY = 0;
      this.layout = new config.layout.AutoBoundLayout;
    };
    this.initialize(name);
    /**
     * @param {!Object} child
     * @return {undefined}
     */
    this.add = function (child) {
      this.childs.push(child);
      child.dragable = this.childDragble;
    };
    /**
     * @param {!Object} child
     * @return {undefined}
     */
    this.remove = function (child) {
      /** @type {number} */
      var i = 0;
      for (; i < this.childs.length; i++) {
        if (this.childs[i] === child) {
          /** @type {null} */
          child.parentContainer = null;
          this.childs = this.childs.del(i);
          child.lastParentContainer = this;
          break;
        }
      }
    };
    /**
     * @return {undefined}
     */
    this.removeAll = function () {
      /** @type {!Array} */
      this.childs = [];
    };
    /**
     * @param {number} x
     * @param {number} y
     * @return {undefined}
     */
    this.setLocation = function (x, y) {
      /** @type {number} */
      var dx = x - this.x;
      /** @type {number} */
      var dy = y - this.y;
      /** @type {number} */
      this.x = x;
      /** @type {number} */
      this.y = y;
      /** @type {number} */
      var i = 0;
      for (; i < this.childs.length; i++) {
        var box = this.childs[i];
        box.setLocation(box.x + dx, box.y + dy);
      }
    };
    /**
     * @param {?} require
     * @return {undefined}
     */
    this.doLayout = function (require) {
      if (require) {
        require(this, this.childs);
      }
    };
    /**
     * @param {!CanvasRenderingContext2D} context
     * @return {undefined}
     */
    this.paint = function (context) {
      if (this.visible) {
        if (this.layout) {
          this.layout(this, this.childs);
        }
        context.beginPath();
        /** @type {string} */
        context.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
        if (null == this.borderRadius || 0 == this.borderRadius) {
          context.rect(this.x, this.y, this.width, this.height);
        } else {
          context.JTopoRoundRect(this.x, this.y, this.width, this.height, this.borderRadius);
        }
        context.fill();
        context.closePath();
        this.paintText(context);
        this.paintBorder(context);
      }
    };
    /**
     * @param {!CanvasRenderingContext2D} context
     * @return {undefined}
     */
    this.paintBorder = function (context) {
      if (0 != this.borderWidth) {
        context.beginPath();
        context.lineWidth = this.borderWidth;
        /** @type {string} */
        context.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")";
        /** @type {number} */
        var radius = this.borderWidth / 2;
        if (null == this.borderRadius || 0 == this.borderRadius) {
          context.rect(this.x - radius, this.y - radius, this.width + this.borderWidth, this.height + this.borderWidth);
        } else {
          context.JTopoRoundRect(this.x - radius, this.y - radius, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius);
        }
        context.stroke();
        context.closePath();
      }
    };
    /**
     * @param {!CanvasRenderingContext2D} ctx
     * @return {undefined}
     */
    this.paintText = function (ctx) {
      var line = this.text;
      if (null != line && "" != line) {
        ctx.beginPath();
        ctx.font = this.font;
        var widthA = ctx.measureText(line).width;
        var charsetBitSize = ctx.measureText("\u00e7\u201d\u00b0").width;
        /** @type {string} */
        ctx.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
        var point2d = this.getTextPostion(this.textPosition, widthA, charsetBitSize);
        ctx.fillText(line, point2d.x, point2d.y);
        ctx.closePath();
      }
    };
    /**
     * @param {string} a
     * @param {number} w
     * @param {number} y
     * @return {?}
     */
    this.getTextPostion = function (a, w, y) {
      /** @type {null} */
      var value = null;
      return null == a || "Bottom_Center" == a ? value = {
        x: this.x + this.width / 2 - w / 2,
        y: this.y + this.height + y
      } : "Top_Center" == a ? value = {
        x: this.x + this.width / 2 - w / 2,
        y: this.y - y / 2
      } : "Top_Right" == a ? value = {
        x: this.x + this.width - w,
        y: this.y - y / 2
      } : "Top_Left" == a ? value = {
        x: this.x,
        y: this.y - y / 2
      } : "Bottom_Right" == a ? value = {
        x: this.x + this.width - w,
        y: this.y + this.height + y
      } : "Bottom_Left" == a ? value = {
        x: this.x,
        y: this.y + this.height + y
      } : "Middle_Center" == a ? value = {
        x: this.x + this.width / 2 - w / 2,
        y: this.y + this.height / 2 + y / 2
      } : "Middle_Right" == a ? value = {
        x: this.x + this.width - w,
        y: this.y + this.height / 2 + y / 2
      } : "Middle_Left" == a && (value = {
        x: this.x,
        y: this.y + this.height / 2 + y / 2
      }), null != this.textOffsetX && (value.x += this.textOffsetX), null != this.textOffsetY && (value.y += this.textOffsetY), value;
    };
    /**
     * @return {undefined}
     */
    this.paintMouseover = function () {
    };
    /**
     * @param {!CanvasRenderingContext2D} context
     * @return {undefined}
     */
    this.paintSelected = function (context) {
      /** @type {number} */
      context.shadowBlur = 10;
      /** @type {string} */
      context.shadowColor = "rgba(0,0,0,1)";
      /** @type {number} */
      context.shadowOffsetX = 0;
      /** @type {number} */
      context.shadowOffsetY = 0;
    };
  }
  init.prototype = new config.InteractiveElement;
  /** @type {function(undefined): undefined} */
  config.Container = init;
}(JTopo), function (exports) {
  /**
   * @param {!Array} data
   * @return {?}
   */
  function renderLine(data) {
    /** @type {number} */
    var x = 0;
    /** @type {number} */
    var y = 0;
    data.forEach(function (size) {
      x = x + size.cx;
      y = y + size.cy;
    });
    var l = {
      x: x / data.length,
      y: y / data.length
    };
    return l;
  }
  /**
   * @param {!Array} line
   * @param {!Object} self
   * @return {?}
   */
  function render(line, self) {
    if (null == self) {
      self = {};
    }
    {
      var x = self.cx;
      var y = self.cy;
      var i = self.minRadius;
      var c = self.nodeDiameter;
      var zoom = self.hScale || 1;
      var b = self.vScale || 1;
      if (!self.beginAngle) {
        0;
      }
      if (!self.endAngle) {
        2 * Math.PI;
      }
    }
    if (null == x || null == y) {
      var loc = renderLine(line);
      x = loc.x;
      y = loc.y;
    }
    /** @type {number} */
    var total = 0;
    /** @type {!Array} */
    var array = [];
    /** @type {!Array} */
    var result = [];
    line.forEach(function (bubble) {
      if (null == self.nodeDiameter) {
        if (bubble.diameter) {
          c = bubble.diameter;
        }
        /** @type {number} */
        c = bubble.radius ? 2 * bubble.radius : Math.sqrt(2 * bubble.width * bubble.height);
        result.push(c);
      } else {
        result.push(c);
      }
      total = total + c;
    });
    line.forEach(function (a, m) {
      /** @type {number} */
      var i = result[m] / total;
      array.push(Math.PI * i);
    });
    var distKM = (line.length, array[0] + array[1]);
    /** @type {number} */
    var p = result[0] / 2 + result[1] / 2;
    /** @type {number} */
    var r = p / 2 / Math.sin(distKM / 2);
    if (null != i && i > r) {
      r = i;
    }
    /** @type {number} */
    var scale = r * zoom;
    /** @type {number} */
    var s = r * b;
    var a = self.animate;
    if (a) {
      var widthA = a.time || 1e3;
      /** @type {number} */
      var r = 0;
      line.forEach(function (alpha, k) {
        r = r + (0 == k ? array[k] : array[k - 1] + array[k]);
        var x3 = x + Math.cos(r) * scale;
        var yp = y + Math.sin(r) * s;
        exports.Animate.stepByStep(alpha, {
          x: x3 - alpha.width / 2,
          y: yp - alpha.height / 2
        }, widthA).start();
      });
    } else {
      /** @type {number} */
      r = 0;
      line.forEach(function (pt, k) {
        r = r + (0 == k ? array[k] : array[k - 1] + array[k]);
        var cx = x + Math.cos(r) * scale;
        var cy = y + Math.sin(r) * s;
        pt.cx = cx;
        pt.cy = cy;
      });
    }
    return {
      cx: x,
      cy: y,
      radius: scale,
      radiusA: scale,
      radiusB: s
    };
  }
  /**
   * @param {number} meshPath
   * @param {number} v3Offset
   * @return {?}
   */
  function _dragDial(meshPath, v3Offset) {
    return function (node) {
      var body = node.childs;
      if (!(body.length <= 0)) {
        var crect = node.getBound();
        var result = body[0];
        /** @type {number} */
        var eWidth = (crect.width - result.width) / v3Offset;
        /** @type {number} */
        var size = (crect.height - result.height) / meshPath;
        /** @type {number} */
        var bodyIndex = (body.length, 0);
        /** @type {number} */
        var eSize0 = 0;
        for (; meshPath > eSize0; eSize0++) {
          /** @type {number} */
          var zoomLoc = 0;
          for (; v3Offset > zoomLoc; zoomLoc++) {
            var result = body[bodyIndex++];
            var x = crect.left + eWidth / 2 + zoomLoc * eWidth;
            var y = crect.top + size / 2 + eSize0 * size;
            if (result.setLocation(x, y), bodyIndex >= body.length) {
              return;
            }
          }
        }
      }
    };
  }
  /**
   * @param {number} w
   * @param {number} h
   * @return {?}
   */
  function createBanner(w, h) {
    return null == w && (w = 0), null == h && (h = 0), function (root) {
      var childs = root.childs;
      if (!(childs.length <= 0)) {
        var e = root.getBound();
        var x = e.left;
        var y = e.top;
        /** @type {number} */
        var i = 0;
        for (; i < childs.length; i++) {
          var child = childs[i];
          if (x + child.width >= e.right) {
            x = e.left;
            y = y + (h + child.height);
          }
          child.setLocation(x, y);
          x = x + (w + child.width);
        }
      }
    };
  }
  /**
   * @return {?}
   */
  function draw_icon() {
    return function (curr, array) {
      if (array.length > 0) {
        /** @type {number} */
        var x = 1e7;
        /** @type {number} */
        var w = -1e7;
        /** @type {number} */
        var y = 1e7;
        /** @type {number} */
        var h = -1e7;
        /** @type {number} */
        var max = w - x;
        /** @type {number} */
        var ny = h - y;
        /** @type {number} */
        var i = 0;
        for (; i < array.length; i++) {
          var o = array[i];
          if (o.x <= x) {
            x = o.x;
          }
          if (o.x >= w) {
            w = o.x;
          }
          if (o.y <= y) {
            y = o.y;
          }
          if (o.y >= h) {
            h = o.y;
          }
          max = w - x + o.width;
          ny = h - y + o.height;
        }
        curr.x = x;
        curr.y = y;
        curr.width = max;
        curr.height = ny;
      }
    };
  }
  /**
   * @param {!Array} scope
   * @return {?}
   */
  function inViewDirectiveLink(scope) {
    /** @type {!Array} */
    var c = [];
    var browserStrings = scope.filter(function (a) {
      return a instanceof exports.Link ? true : (c.push(a), false);
    });
    return scope = c.filter(function (a) {
      /** @type {number} */
      var b = 0;
      for (; b < browserStrings.length; b++) {
        if (browserStrings[b].nodeZ === a) {
          return false;
        }
      }
      return true;
    }), scope = scope.filter(function (subLink) {
      /** @type {number} */
      var b = 0;
      for (; b < browserStrings.length; b++) {
        if (browserStrings[b].nodeA === subLink) {
          return true;
        }
      }
      return false;
    });
  }
  /**
   * @param {!Array} options
   * @return {?}
   */
  function each(options) {
    /** @type {number} */
    var width = 0;
    /** @type {number} */
    var h = 0;
    return options.forEach(function (size) {
      width = width + size.width;
      h = h + size.height;
    }), {
        width: width / options.length,
        height: h / options.length
      };
  }
  /**
   * @param {!NodeList} text
   * @param {!Object} self
   * @param {number} d
   * @param {number} n
   * @return {undefined}
   */
  function add(text, self, d, n) {
    self.x += d;
    self.y += n;
    var obj = $(text, self);
    /** @type {number} */
    var i = 0;
    for (; i < obj.length; i++) {
      add(text, obj[i], d, n);
    }
  }
  /**
   * @param {(Node|NodeList|string)} c
   * @param {!Function} x
   * @return {?}
   */
  function c(c, x) {
    /**
     * @param {string} b
     * @param {number} i
     * @return {undefined}
     */
    function m(b, i) {
      var f = $(c, b);
      if (null == a[i]) {
        a[i] = {};
        /** @type {!Array} */
        a[i].nodes = [];
        /** @type {!Array} */
        a[i].childs = [];
      }
      a[i].nodes.push(b);
      a[i].childs.push(f);
      /** @type {number} */
      var h = 0;
      for (; h < f.length; h++) {
        m(f[h], i + 1);
        /** @type {string} */
        f[h].parent = b;
      }
    }
    /** @type {!Array} */
    var a = [];
    return m(x, 0), a;
  }
  /**
   * @param {string} key
   * @param {undefined} value
   * @param {number} width
   * @return {?}
   */
  function update(key, value, width) {
    return function (data) {
      /**
       * @param {(Node|string)} d
       * @param {!Function} e
       * @return {undefined}
       */
      function init(d, e) {
        var p = exports.layout.getTreeDeep(d, e);
        var obj = c(d, e);
        var arr = obj["" + p].nodes;
        /** @type {number} */
        var index = 0;
        for (; index < arr.length; index++) {
          var l = arr[index];
          /** @type {number} */
          var x = (index + 1) * (value + 10);
          /** @type {number} */
          var y = p * width;
          if (!("down" == key)) {
            if ("up" == key) {
              /** @type {number} */
              y = -y;
            } else {
              if ("left" == key) {
                /** @type {number} */
                x = -p * width;
                /** @type {number} */
                y = (index + 1) * (value + 10);
              } else {
                if ("right" == key) {
                  /** @type {number} */
                  x = p * width;
                  /** @type {number} */
                  y = (index + 1) * (value + 10);
                }
              }
            }
          }
          l.setLocation(x, y);
        }
        /** @type {number} */
        var i = p - 1;
        for (; i >= 0; i--) {
          var args = obj["" + i].nodes;
          var elements = obj["" + i].childs;
          /** @type {number} */
          index = 0;
          for (; index < args.length; index++) {
            var el = args[index];
            var child = elements[index];
            if ("down" == key ? el.y = i * width : "up" == key ? el.y = -i * width : "left" == key ? el.x = -i * width : "right" == key && (el.x = i * width), child.length > 0 ? "down" == key || "up" == key ? el.x = (child[0].x + child[child.length - 1].x) / 2 : ("left" == key || "right" == key) && (el.y = (child[0].y + child[child.length - 1].y) / 2) : index > 0 && ("down" == key || "up" == key ? el.x = args[index - 1].x + args[index - 1].width + value : ("left" == key || "right" == key) && (el.y =
              args[index - 1].y + args[index - 1].height + value)), index > 0) {
              if ("down" == key || "up" == key) {
                if (el.x < args[index - 1].x + args[index - 1].width) {
                  var screenWidth = args[index - 1].x + args[index - 1].width + value;
                  /** @type {number} */
                  var delta = Math.abs(screenWidth - el.x);
                  /** @type {number} */
                  var i = index;
                  for (; i < args.length; i++) {
                    add(data.childs, args[i], delta, 0);
                  }
                }
              } else {
                if (("left" == key || "right" == key) && el.y < args[index - 1].y + args[index - 1].height) {
                  var h = args[index - 1].y + args[index - 1].height + value;
                  /** @type {number} */
                  var n = Math.abs(h - el.y);
                  /** @type {number} */
                  i = index;
                  for (; i < args.length; i++) {
                    add(data.childs, args[i], 0, n);
                  }
                }
              }
            }
          }
        }
      }
      /** @type {null} */
      var current = null;
      if (null == value) {
        current = each(data.childs);
        value = current.width;
        if ("left" == key || "right" == key) {
          value = current.width + 10;
        }
      }
      if (null == width) {
        if (null == current) {
          current = each(data.childs);
        }
        /** @type {number} */
        width = 2 * current.height;
      }
      if (null == key) {
        /** @type {string} */
        key = "down";
      }
      var obj = exports.layout.getRootNodes(data.childs);
      if (obj.length > 0) {
        init(data.childs, obj[0]);
        var bboxClient = exports.util.getElementsBound(data.childs);
        var xhair = data.getCenterLocation();
        /** @type {number} */
        var mergeAxisLength = xhair.x - (bboxClient.left + bboxClient.right) / 2;
        /** @type {number} */
        var z = xhair.y - (bboxClient.top + bboxClient.bottom) / 2;
        data.childs.forEach(function (obj) {
          if (obj instanceof exports.Node) {
            obj.x += mergeAxisLength;
            obj.y += z;
          }
        });
      }
    };
  }
  /**
   * @param {number} res
   * @return {?}
   */
  function chart(res) {
    return function (current) {
      /**
       * @param {!NodeList} t
       * @param {!Object} c
       * @param {number} r
       * @return {undefined}
       */
      function update(t, c, r) {
        var schema = $(t, c);
        if (0 != schema.length) {
          if (null == r) {
            /** @type {number} */
            r = res;
          }
          /** @type {number} */
          var sita = 2 * Math.PI / schema.length;
          schema.forEach(function (a, PI) {
            var div = c.x + r * Math.cos(sita * PI);
            var y = c.y + r * Math.sin(sita * PI);
            a.setLocation(div, y);
            /** @type {number} */
            var now = r / 2;
            update(t, a, now);
          });
        }
      }
      var spec = exports.layout.getRootNodes(current.childs);
      if (spec.length > 0) {
        update(current.childs, spec[0]);
        var bboxClient = exports.util.getElementsBound(current.childs);
        var xhair = current.getCenterLocation();
        /** @type {number} */
        var mergeAxisLength = xhair.x - (bboxClient.left + bboxClient.right) / 2;
        /** @type {number} */
        var z = xhair.y - (bboxClient.top + bboxClient.bottom) / 2;
        current.childs.forEach(function (obj) {
          if (obj instanceof exports.Node) {
            obj.x += mergeAxisLength;
            obj.y += z;
          }
        });
      }
    };
  }
  /**
   * @param {number} a
   * @param {number} b
   * @param {number} h
   * @param {number} s
   * @param {number} t
   * @param {number} d
   * @return {?}
   */
  function callback(a, b, h, s, t, d) {
    /** @type {!Array} */
    var _results = [];
    /** @type {number} */
    var j = 0;
    for (; h > j; j++) {
      /** @type {number} */
      var c = 0;
      for (; s > c; c++) {
        _results.push({
          x: a + c * t,
          y: b + j * d
        });
      }
    }
    return _results;
  }
  /**
   * @param {number} a
   * @param {number} b
   * @param {number} i
   * @param {number} d
   * @param {number} options
   * @param {number} params
   * @return {?}
   */
  function loop(a, b, i, d, options, params) {
    var o = options ? options : 0;
    var l = params ? params : 2 * Math.PI;
    /** @type {number} */
    var n = l - o;
    /** @type {number} */
    var h = n / i;
    /** @type {!Array} */
    var chart = [];
    o = o + h / 2;
    var r = o;
    for (; l >= r; r = r + h) {
      var val = a + Math.cos(r) * d;
      var v = b + Math.sin(r) * d;
      chart.push({
        x: val,
        y: v
      });
    }
    return chart;
  }
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} left
   * @param {number} width
   * @param {number} offset
   * @param {string} dir
   * @return {?}
   */
  function create(x, y, left, width, offset, dir) {
    var direction = dir || "bottom";
    /** @type {!Array} */
    var statPointCoordinatesList = [];
    if ("bottom" == direction) {
      /** @type {number} */
      var i = x - left / 2 * width + width / 2;
      /** @type {number} */
      var n = 0;
      for (; left >= n; n++) {
        statPointCoordinatesList.push({
          x: i + n * width,
          y: y + offset
        });
      }
    } else {
      if ("top" == direction) {
        /** @type {number} */
        i = x - left / 2 * width + width / 2;
        /** @type {number} */
        n = 0;
        for (; left >= n; n++) {
          statPointCoordinatesList.push({
            x: i + n * width,
            y: y - offset
          });
        }
      } else {
        if ("right" == direction) {
          /** @type {number} */
          i = y - left / 2 * width + width / 2;
          /** @type {number} */
          n = 0;
          for (; left >= n; n++) {
            statPointCoordinatesList.push({
              x: x + offset,
              y: i + n * width
            });
          }
        } else {
          if ("left" == direction) {
            /** @type {number} */
            i = y - left / 2 * width + width / 2;
            /** @type {number} */
            n = 0;
            for (; left >= n; n++) {
              statPointCoordinatesList.push({
                x: x - offset,
                y: i + n * width
              });
            }
          }
        }
      }
    }
    return statPointCoordinatesList;
  }
  /**
   * @param {number} a
   * @param {number} b
   * @param {number} h
   * @param {number} s
   * @param {number} t
   * @param {number} d
   * @return {?}
   */
  function callback(a, b, h, s, t, d) {
    /** @type {!Array} */
    var _results = [];
    /** @type {number} */
    var j = 0;
    for (; h > j; j++) {
      /** @type {number} */
      var c = 0;
      for (; s > c; c++) {
        _results.push({
          x: a + c * t,
          y: b + j * d
        });
      }
    }
    return _results;
  }
  /**
   * @param {!Object} data
   * @param {!NodeList} e
   * @return {undefined}
   */
  function init(data, e) {
    if (data.layout) {
      var options = data.layout;
      var feedType = options.type;
      /** @type {null} */
      var res = null;
      if ("circle" == feedType) {
        var callback = options.radius || Math.max(data.width, data.height);
        res = loop(data.cx, data.cy, e.length, callback, data.layout.beginAngle, data.layout.endAngle);
      } else {
        if ("tree" == feedType) {
          var value = options.width || 50;
          var cb = options.height || 50;
          var direction = options.direction;
          res = create(data.cx, data.cy, e.length, value, cb, direction);
        } else {
          if ("grid" != feedType) {
            return;
          }
          res = callback(data.x, data.y, options.rows, options.cols, options.horizontal || 0, options.vertical || 0);
        }
      }
      /** @type {number} */
      var i = 0;
      for (; i < e.length; i++) {
        e[i].setCenterLocation(res[i].x, res[i].y);
      }
    }
  }
  /**
   * @param {!NodeList} el
   * @param {!Object} id
   * @return {?}
   */
  function $(el, id) {
    /** @type {!Array} */
    var returnValue = [];
    /** @type {number} */
    var i = 0;
    for (; i < el.length; i++) {
      if (el[i] instanceof exports.Link && el[i].nodeA === id) {
        returnValue.push(el[i].nodeZ);
      }
    }
    return returnValue;
  }
  /**
   * @param {!HTMLElement} parent
   * @param {!Object} obj
   * @param {number} args
   * @return {?}
   */
  function fn(parent, obj, args) {
    var data = $(parent.childs, obj);
    if (0 == data.length) {
      return null;
    }
    if (init(obj, data), 1 == args) {
      /** @type {number} */
      var i = 0;
      for (; i < data.length; i++) {
        fn(parent, data[i], args);
      }
    }
    return null;
  }
  /**
   * @param {!Object} x
   * @param {?} _
   * @return {undefined}
   */
  function get(x, _) {
    /**
     * @param {!Object} a
     * @param {!Object} f
     * @return {undefined}
     */
    function callback(a, f) {
      /** @type {number} */
      var h = a.x - f.x;
      /** @type {number} */
      var d = a.y - f.y;
      w = w + h * ratio;
      left = left + d * ratio;
      /** @type {number} */
      w = w * zoom;
      /** @type {number} */
      left = left * zoom;
      left = left + rule_width;
      f.x += w;
      f.y += left;
    }
    /**
     * @return {undefined}
     */
    function e() {
      if (!(++k > 150)) {
        /** @type {number} */
        var i = 0;
        for (; i < props.length; i++) {
          if (props[i] != x) {
            callback(x, props[i], props);
          }
        }
        setTimeout(e, 1e3 / 24);
      }
    }
    /** @type {number} */
    var ratio = .01;
    /** @type {number} */
    var zoom = .95;
    /** @type {number} */
    var rule_width = -5;
    /** @type {number} */
    var w = 0;
    /** @type {number} */
    var left = 0;
    /** @type {number} */
    var k = 0;
    var props = _.getElementsByClass(exports.Node);
    e();
  }
  /**
   * @param {(Node|NodeList|string)} key
   * @param {!Function} obj
   * @return {?}
   */
  function refresh(key, obj) {
    /**
     * @param {!NodeList} a
     * @param {string} obj
     * @param {!Object} min
     * @return {undefined}
     */
    function callback(a, obj, min) {
      var e = $(a, obj);
      if (min > value) {
        /** @type {!Object} */
        value = min;
      }
      /** @type {number} */
      var i = 0;
      for (; i < e.length; i++) {
        callback(a, e[i], min + 1);
      }
    }
    /** @type {number} */
    var value = 0;
    return callback(key, obj, 0), value;
  }
  exports.layout = exports.Layout = {
    layoutNode: fn,
    getNodeChilds: $,
    adjustPosition: init,
    springLayout: get,
    getTreeDeep: refresh,
    getRootNodes: inViewDirectiveLink,
    GridLayout: _dragDial,
    FlowLayout: createBanner,
    AutoBoundLayout: draw_icon,
    CircleLayout: chart,
    TreeLayout: update,
    getNodesCenter: renderLine,
    circleLayoutNodes: render
  };
}(JTopo), function (exports) {
  /**
   * @return {?}
   */
  function render() {
    var $scope = new exports.CircleNode;
    return $scope.radius = 150, $scope.colors = ["#3666B0", "#2CA8E0", "#77D1F6"], $scope.datas = [.3, .3, .4], $scope.titles = ["A", "B", "C"], $scope.paint = function (context) {
      /** @type {number} */
      var c = 2 * $scope.radius;
      /** @type {number} */
      var d = 2 * $scope.radius;
      /** @type {number} */
      $scope.width = c;
      /** @type {number} */
      $scope.height = d;
      /** @type {number} */
      var x = 0;
      /** @type {number} */
      var i = 0;
      for (; i < this.datas.length; i++) {
        /** @type {number} */
        var delta = this.datas[i] * Math.PI * 2;
        context.save();
        context.beginPath();
        context.fillStyle = $scope.colors[i];
        context.moveTo(0, 0);
        context.arc(0, 0, this.radius, x, x + delta, false);
        context.fill();
        context.closePath();
        context.restore();
        context.beginPath();
        context.font = this.font;
        /** @type {string} */
        var value = this.titles[i] + ": " + (100 * this.datas[i]).toFixed(2) + "%";
        var lw = context.measureText(value).width;
        /** @type {number} */
        var angle = (context.measureText("\u00e7\u201d\u00b0").width, (x + x + delta) / 2);
        /** @type {number} */
        var w = this.radius * Math.cos(angle);
        /** @type {number} */
        var y = this.radius * Math.sin(angle);
        if (angle > Math.PI / 2 && angle <= Math.PI) {
          /** @type {number} */
          w = w - lw;
        } else {
          if (angle > Math.PI && angle < 2 * Math.PI * 3 / 4) {
            /** @type {number} */
            w = w - lw;
          } else {
            angle > 2 * Math.PI * .75;
          }
        }
        /** @type {string} */
        context.fillStyle = "#FFFFFF";
        context.fillText(value, w, y);
        context.moveTo(this.radius * Math.cos(angle), this.radius * Math.sin(angle));
        if (angle > Math.PI / 2 && angle < 2 * Math.PI * 3 / 4) {
          /** @type {number} */
          w = w - lw;
        }
        angle > Math.PI;
        context.fill();
        context.stroke();
        context.closePath();
        /** @type {number} */
        x = x + delta;
      }
    }, $scope;
  }
  /**
   * @return {?}
   */
  function init() {
    var options = new exports.Node;
    return options.showSelected = false, options.width = 250, options.height = 180, options.colors = ["#3666B0", "#2CA8E0", "#77D1F6"], options.datas = [.3, .3, .4], options.titles = ["A", "B", "C"], options.paint = function (ctx) {
      /** @type {number} */
      var width = 3;
      /** @type {number} */
      var dx = (this.width - width) / this.datas.length;
      ctx.save();
      ctx.beginPath();
      /** @type {string} */
      ctx.fillStyle = "#FFFFFF";
      /** @type {string} */
      ctx.strokeStyle = "#FFFFFF";
      ctx.moveTo(-this.width / 2 - 1, -this.height / 2);
      ctx.lineTo(-this.width / 2 - 1, this.height / 2 + 3);
      ctx.lineTo(this.width / 2 + width + 1, this.height / 2 + 3);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
      /** @type {number} */
      var i = 0;
      for (; i < this.datas.length; i++) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = options.colors[i];
        var line = this.datas[i];
        /** @type {number} */
        var elemX = i * (dx + width) - this.width / 2;
        /** @type {number} */
        var h = this.height - line - this.height / 2;
        ctx.fillRect(elemX, h, dx, line);
        /** @type {string} */
        var string = "" + parseInt(this.datas[i]);
        var dw = ctx.measureText(string).width;
        var radius = ctx.measureText("\u00e7\u201d\u00b0").width;
        /** @type {string} */
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(string, elemX + (dx - dw) / 2, h - radius);
        ctx.fillText(this.titles[i], elemX + (dx - dw) / 2, this.height / 2 + radius);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      }
    }, options;
  }
  /** @type {function(): ?} */
  exports.BarChartNode = init;
  /** @type {function(): ?} */
  exports.PieChartNode = render;
}(JTopo), function (self) {
  /**
   * @param {!Function} callback
   * @param {?} interval
   * @return {?}
   */
  function List(callback, interval) {
    var slideshowtimer;
    /** @type {null} */
    var c = null;
    return {
      stop: function () {
        return slideshowtimer ? (window.clearInterval(slideshowtimer), c && c.publish("stop"), this) : this;
      },
      start: function () {
        var value = this;
        return slideshowtimer = setInterval(function () {
          callback.call(value);
        }, interval), this;
      },
      onStop: function (id) {
        return null == c && (c = new self.util.MessageBus), c.subscribe("stop", id), this;
      }
    };
  }
  /**
   * @param {!Object} a
   * @param {!Object} op
   * @return {?}
   */
  function init(a, op) {
    op = op || {};
    var bytesAdded = op.gravity || .1;
    var x = op.dx || 0;
    var l = op.dy || 5;
    var stop = op.stop;
    var hostModel = op.interval || 30;
    var list = new List(function () {
      if (stop && stop()) {
        /** @type {number} */
        l = .5;
        this.stop();
      } else {
        l = l + bytesAdded;
        a.setLocation(a.x + x, a.y + l);
      }
    }, hostModel);
    return list;
  }
  /**
   * @param {!Object} data
   * @param {!Object} form
   * @param {number} w
   * @param {?} n
   * @param {?} balanced
   * @return {?}
   */
  function parse(data, form, w, n, balanced) {
    /** @type {number} */
    var size = 1e3 / 24;
    var p = {};
    var i;
    for (i in form) {
      var value = form[i];
      /** @type {number} */
      var m = value - data[i];
      p[i] = {
        oldValue: data[i],
        targetValue: value,
        step: m / w * size,
        isDone: function (name) {
          /** @type {boolean} */
          return this.step > 0 && data[name] >= this.targetValue || this.step < 0 && data[name] <= this.targetValue;
        }
      };
    }
    var extensions = new List(function () {
      /** @type {boolean} */
      var b = true;
      var i;
      for (i in form) {
        if (!p[i].isDone(i)) {
          data[i] += p[i].step;
          /** @type {boolean} */
          b = false;
        }
      }
      if (b) {
        if (!n) {
          return this.stop();
        }
        for (i in form) {
          if (balanced) {
            var oldValue = p[i].targetValue;
            p[i].targetValue = p[i].oldValue;
            p[i].oldValue = oldValue;
            /** @type {number} */
            p[i].step = -p[i].step;
          } else {
            data[i] = p[i].oldValue;
          }
        }
      }
      return this;
    }, size);
    return extensions;
  }
  /**
   * @param {!Object} options
   * @return {?}
   */
  function setOptions(options) {
    if (null == options) {
      options = {};
    }
    var dt = options.spring || .1;
    var speed = options.friction || .8;
    var scrollTop = options.grivity || 0;
    var tileSize = (options.wind || 0, options.minLength || 0);
    return {
      items: [],
      timer: null,
      isPause: false,
      addNode: function (workspace, host) {
        var params = {
          node: workspace,
          target: host,
          vx: 0,
          vy: 0
        };
        return this.items.push(params), this;
      },
      play: function (i) {
        this.stop();
        i = null == i ? 1e3 / 24 : i;
        var self = this;
        /** @type {number} */
        this.timer = setInterval(function () {
          self.nextFrame();
        }, i);
      },
      stop: function () {
        if (null != this.timer) {
          window.clearInterval(this.timer);
        }
      },
      nextFrame: function () {
        /** @type {number} */
        var i = 0;
        for (; i < this.items.length; i++) {
          var self = this.items[i];
          var p = self.node;
          var point = self.target;
          var vx = self.vx;
          var vy = self.vy;
          /** @type {number} */
          var dx = point.x - p.x;
          /** @type {number} */
          var dy = point.y - p.y;
          /** @type {number} */
          var direction = Math.atan2(dy, dx);
          if (0 != tileSize) {
            /** @type {number} */
            var demi = point.x - Math.cos(direction) * tileSize;
            /** @type {number} */
            var grid1 = point.y - Math.sin(direction) * tileSize;
            vx = vx + (demi - p.x) * dt;
            vy = vy + (grid1 - p.y) * dt;
          } else {
            vx = vx + dx * dt;
            vy = vy + dy * dt;
          }
          /** @type {number} */
          vx = vx * speed;
          /** @type {number} */
          vy = vy * speed;
          vy = vy + scrollTop;
          p.x += vx;
          p.y += vy;
          self.vx = vx;
          self.vy = vy;
        }
      }
    };
  }
  /**
   * @param {!Object} config
   * @param {!Object} extra
   * @return {?}
   */
  function main(config, extra) {
    /**
     * @return {?}
     */
    function run() {
      return n = setInterval(function () {
        return o ? void t.stop() : (config.rotate += count || .2, void (config.rotate > 2 * Math.PI && (config.rotate = 0)));
      }, 100), t;
    }
    /**
     * @return {?}
     */
    function stop() {
      return window.clearInterval(n), t.onStop && t.onStop(config), t;
    }
    /** @type {null} */
    var n = (extra.context, null);
    var t = {};
    var count = extra.v;
    return t.run = run, t.stop = stop, t.onStop = function (a) {
      return t.onStop = a, t;
    }, t;
  }
  /**
   * @param {!Function} self
   * @param {!Object} options
   * @return {?}
   */
  function onLoad(self, options) {
    /**
     * @return {?}
     */
    function stop() {
      return window.clearInterval(n), t.onStop && t.onStop(self), t;
    }
    /**
     * @return {?}
     */
    function render() {
      var path = options.dx || 0;
      var i = options.dy || 2;
      return n = setInterval(function () {
        return o ? void t.stop() : (i = i + GROUPSIZE, void (self.y + self.height < ctx.stage.canvas.height ? self.setLocation(self.x + path, self.y + i) : (i = 0, stop())));
      }, 20), t;
    }
    var ctx = options.context;
    var GROUPSIZE = options.gravity || .1;
    /** @type {null} */
    var n = null;
    var t = {};
    return t.run = render, t.stop = stop, t.onStop = function (a) {
      return t.onStop = a, t;
    }, t;
  }
  /**
   * @param {!Object} params
   * @param {!Object} options
   * @return {?}
   */
  function stop(params, options) {
    /**
     * @param {number} x
     * @param {undefined} y
     * @param {?} r
     * @param {?} pos
     * @param {?} e
     * @return {?}
     */
    function callback(x, y, r, pos, e) {
      var me = new self.Node;
      return me.setImage(params.image), me.setSize(params.width, params.height), me.setLocation(x, y), me.showSelected = false, me.dragable = false, me.paint = function (context) {
        context.save();
        context.arc(0, 0, r, pos, e);
        context.clip();
        context.beginPath();
        if (null != this.image) {
          context.drawImage(this.image, -this.width / 2, -this.height / 2);
        } else {
          /** @type {string} */
          context.fillStyle = "rgba(" + this.style.fillStyle + "," + this.alpha + ")";
          context.rect(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
          context.fill();
        }
        context.closePath();
        context.restore();
      }, me;
    }
    /**
     * @param {number} start
     * @param {!Object} el
     * @return {undefined}
     */
    function update(start, el) {
      /** @type {number} */
      var i = start;
      var x = start + Math.PI;
      var value = callback(params.x, params.y, params.width, i, x);
      var val = callback(params.x - 2 + 4 * Math.random(), params.y, params.width, i + Math.PI, i);
      /** @type {boolean} */
      params.visible = false;
      el.add(value);
      el.add(val);
      self.Animate.gravity(value, {
        context: el,
        dx: .3
      }).run().onStop(function () {
        el.remove(value);
        el.remove(val);
        t.stop();
      });
      self.Animate.gravity(val, {
        context: el,
        dx: -.2
      }).run();
    }
    /**
     * @return {?}
     */
    function noop() {
      return update(options.angle, length), t;
    }
    /**
     * @return {?}
     */
    function stop() {
      return t.onStop && t.onStop(params), t;
    }
    var length = options.context;
    var t = (params.style, {});
    return t.onStop = function (a) {
      return t.onStop = a, t;
    }, t.run = noop, t.stop = stop, t;
  }
  /**
   * @param {!Object} p
   * @param {!Object} state
   * @return {?}
   */
  function Renderer(p, state) {
    /**
     * @param {!Object} options
     * @return {undefined}
     */
    function draw(options) {
      /** @type {boolean} */
      options.visible = true;
      /** @type {number} */
      options.rotate = Math.random();
      /** @type {number} */
      var b = ctx.stage.canvas.width / 2;
      /** @type {number} */
      options.x = b + Math.random() * (b - 100) - Math.random() * (b - 100);
      options.y = ctx.stage.canvas.height;
      /** @type {number} */
      options.vx = 5 * Math.random() - 5 * Math.random();
      /** @type {number} */
      options.vy = -25;
    }
    /**
     * @return {?}
     */
    function render() {
      return draw(p), slideshowtimer = setInterval(function () {
        return o ? void t.stop() : (p.vy += y, p.x += p.vx, p.y += p.vy, void ((p.x < 0 || p.x > ctx.stage.canvas.width || p.y > ctx.stage.canvas.height) && (t.onStop && t.onStop(p), draw(p))));
      }, 50), t;
    }
    /**
     * @return {undefined}
     */
    function fn() {
      window.clearInterval(slideshowtimer);
    }
    /** @type {number} */
    var y = .8;
    var ctx = state.context;
    /** @type {null} */
    var slideshowtimer = null;
    var t = {};
    return t.onStop = function (a) {
      return t.onStop = a, t;
    }, t.run = render, t.stop = fn, t;
  }
  /**
   * @return {undefined}
   */
  function stopAll() {
    /** @type {boolean} */
    o = true;
  }
  /**
   * @return {undefined}
   */
  function k() {
    /** @type {boolean} */
    o = false;
  }
  /**
   * @param {!Object} player
   * @param {!Object} data
   * @return {?}
   */
  function update(player, data) {
    /**
     * @return {?}
     */
    function run() {
      return slideshowtimer = setInterval(function () {
        if (o) {
          return void app.stop();
        }
        var y = p1.y + dx + Math.sin(direction) * speed;
        player.setLocation(player.x, y);
        direction = direction + All;
      }, 100), app;
    }
    /**
     * @return {undefined}
     */
    function fn() {
      window.clearInterval(slideshowtimer);
    }
    var p1 = data.p1;
    var p2 = data.p2;
    var dx = (data.context, p1.x + (p2.x - p1.x) / 2);
    var dy = p1.y + (p2.y - p1.y) / 2;
    /** @type {number} */
    var speed = self.util.getDistance(p1, p2) / 2;
    /** @type {number} */
    var direction = Math.atan2(dy, dx);
    var All = data.speed || .2;
    var app = {};
    /** @type {null} */
    var slideshowtimer = null;
    return app.run = run, app.stop = fn, app;
  }
  /**
   * @param {number} data
   * @param {!Object} state
   * @return {?}
   */
  function render(data, state) {
    /**
     * @return {?}
     */
    function run() {
      return n = setInterval(function () {
        if (o) {
          return void t.stop();
        }
        /** @type {number} */
        var monthNodeHeightInPixels = position.x - data.x;
        /** @type {number} */
        var t = position.y - data.y;
        /** @type {number} */
        var offset = monthNodeHeightInPixels * idx;
        /** @type {number} */
        var ty = t * idx;
        data.x += offset;
        data.y += ty;
        if (.01 > offset && .1 > ty) {
          fn();
        }
      }, 100), t;
    }
    /**
     * @return {undefined}
     */
    function fn() {
      window.clearInterval(n);
    }
    var position = state.position;
    var idx = (state.context, state.easing || .2);
    var t = {};
    /** @type {null} */
    var n = null;
    return t.onStop = function (a) {
      return t.onStop = a, t;
    }, t.run = run, t.stop = fn, t;
  }
  /**
   * @param {!Object} p
   * @param {!Object} def
   * @return {?}
   */
  function read(p, def) {
    /**
     * @return {?}
     */
    function render() {
      return n = setInterval(function () {
        p.scaleX += num;
        p.scaleY += num;
        if (p.scaleX >= lastModified) {
          stop();
        }
      }, 100), t;
    }
    /**
     * @return {undefined}
     */
    function stop() {
      if (t.onStop) {
        t.onStop(p);
      }
      p.scaleX = x;
      p.scaleY = y;
      window.clearInterval(n);
    }
    var lastModified = (def.position, def.context, def.scale || 1);
    /** @type {number} */
    var num = .06;
    var x = p.scaleX;
    var y = p.scaleY;
    var t = {};
    /** @type {null} */
    var n = null;
    return t.onStop = function (a) {
      return t.onStop = a, t;
    }, t.run = render, t.stop = stop, t;
  }
  self.Animate = {};
  self.Effect = {};
  /** @type {boolean} */
  var o = false;
  /** @type {function(!Object): ?} */
  self.Effect.spring = setOptions;
  /** @type {function(!Object, !Object): ?} */
  self.Effect.gravity = init;
  /** @type {function(!Object, !Object, number, ?, ?): ?} */
  self.Animate.stepByStep = parse;
  /** @type {function(!Object, !Object): ?} */
  self.Animate.rotate = main;
  /** @type {function(!Object, !Object): ?} */
  self.Animate.scale = read;
  /** @type {function(number, !Object): ?} */
  self.Animate.move = render;
  /** @type {function(!Object, !Object): ?} */
  self.Animate.cycle = update;
  /** @type {function(!Object, !Object): ?} */
  self.Animate.repeatThrow = Renderer;
  /** @type {function(!Object, !Object): ?} */
  self.Animate.dividedTwoPiece = stop;
  /** @type {function(!Function, !Object): ?} */
  self.Animate.gravity = onLoad;
  /** @type {function(): undefined} */
  self.Animate.startAll = k;
  /** @type {function(): undefined} */
  self.Animate.stopAll = stopAll;
}(JTopo), function (Q) {
  /**
   * @param {!Array} a
   * @param {string} b
   * @return {?}
   */
  function fn(a, b) {
    /** @type {!Array} */
    var result = [];
    if (0 == a.length) {
      return result;
    }
    var d = b.match(/^\s*(\w+)\s*$/);
    if (null != d) {
      var e = a.filter(function (type) {
        return type.elementType == d[1];
      });
      if (null != e && e.length > 0) {
        /** @type {!Array<?>} */
        result = result.concat(e);
      }
    } else {
      /** @type {boolean} */
      var e = false;
      if (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*['"](\S+)['"]\s*\]\s*/), (null == d || d.length < 5) && (d = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*(\d+(\.\d+)?)\s*\]\s*/), e = true), null != d && d.length >= 5) {
        var stop = d[1];
        var j = d[2];
        var el = d[3];
        var c = d[4];
        e = a.filter(function (s) {
          if (s.elementType != stop) {
            return false;
          }
          var b = s[j];
          return 1 == e && (b = parseInt(b)), "=" == el ? b == c : ">" == el ? b > c : "<" == el ? c > b : "<=" == el ? c >= b : ">=" == el ? b >= c : "!=" == el ? b != c : false;
        });
        if (null != e && e.length > 0) {
          /** @type {!Array<?>} */
          result = result.concat(e);
        }
      }
    }
    return result;
  }
  /**
   * @param {!Object} data
   * @return {?}
   */
  function compile(data) {
    if (data.find = function (stateName) {
      return find.call(this, stateName);
    }, pipelets.forEach(function (k) {
      /**
       * @param {?} val
       * @return {?}
       */
      data[k] = function (val) {
        /** @type {number} */
        var j = 0;
        for (; j < this.length; j++) {
          this[j][k](val);
        }
        return this;
      };
    }), data.length > 0) {
      var msg = data[0];
      var i;
      for (i in msg) {
        var data = msg[i];
        if ("function" == typeof data) {
          !function (emitter) {
            /**
             * @return {?}
             */
            data[i] = function () {
              /** @type {!Array} */
              var allAnimationFrames = [];
              /** @type {number} */
              var i = 0;
              for (; i < data.length; i++) {
                allAnimationFrames.push(emitter.apply(data[i], arguments));
              }
              return allAnimationFrames;
            };
          }(data);
        }
      }
    }
    return data.attr = function (a, b) {
      if (null != a && null != b) {
        /** @type {number} */
        var i = 0;
        for (; i < this.length; i++) {
          this[i][a] = b;
        }
      } else {
        if (null != a && "string" == typeof a) {
          /** @type {!Array} */
          var obj = [];
          /** @type {number} */
          i = 0;
          for (; i < this.length; i++) {
            obj.push(this[i][a]);
          }
          return obj;
        }
        if (null != a) {
          /** @type {number} */
          i = 0;
          for (; i < this.length; i++) {
            var j;
            for (j in a) {
              this[i][j] = a[j];
            }
          }
        }
      }
      return this;
    }, data;
  }
  /**
   * @param {string} s
   * @return {?}
   */
  function find(s) {
    /** @type {!Array} */
    var tempArray = [];
    /** @type {!Array} */
    var array = [];
    if (this instanceof Q.Stage) {
      tempArray = this.childs;
      array = array.concat(tempArray);
    } else {
      if (this instanceof Q.Scene) {
        /** @type {!Array} */
        tempArray = [this];
      } else {
        array = this;
      }
    }
    tempArray.forEach(function (line) {
      array = array.concat(line.childs);
    });
    /** @type {null} */
    var js = null;
    return js = "function" == typeof s ? array.filter(s) : fn(array, s), js = compile(js);
  }
  /** @type {!Array<string>} */
  var pipelets = "click,mousedown,mouseup,mouseover,mouseout,mousedrag,keydown,keyup".split(",");
  /** @type {function(string): ?} */
  Q.Stage.prototype.find = find;
  /** @type {function(string): ?} */
  Q.Scene.prototype.find = find;
}(JTopo), function (token) {
  /**
   * @param {number} x
   * @param {number} y
   * @return {undefined}
   */
  function ParticleGenerator(x, y) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
  }
  /**
   * @param {(RegExp|string)} val
   * @return {undefined}
   */
  function self(val) {
    this.p = new ParticleGenerator(0, 0);
    this.w = new ParticleGenerator(1, 0);
    /** @type {(RegExp|string)} */
    this.paint = val;
  }
  /**
   * @param {?} done
   * @param {number} value
   * @param {undefined} url
   * @return {?}
   */
  function count(done, value, url) {
    return function (robot) {
      /** @type {number} */
      var result = 0;
      for (; value > result; result++) {
        done();
        if (url) {
          robot.turn(url);
        }
        robot.move(3);
      }
    };
  }
  /**
   * @param {?} c
   * @param {number} n
   * @return {?}
   */
  function e(c, n) {
    /** @type {number} */
    var NUM_PHOTOS = 2 * Math.PI;
    return function (Math) {
      /** @type {number} */
      var MAX_INT32 = 0;
      for (; n > MAX_INT32; MAX_INT32++) {
        c();
        Math.turn(NUM_PHOTOS / n);
      }
    };
  }
  /**
   * @param {number} _
   * @param {number} s
   * @param {?} a
   * @return {?}
   */
  function f(_, s, a) {
    return function (instance) {
      /** @type {number} */
      var ref5 = 0;
      for (; s > ref5; ref5++) {
        _();
        instance.resize(a);
      }
    };
  }
  /**
   * @param {number} duration
   * @return {?}
   */
  function update(duration) {
    /** @type {number} */
    var currentDeg = 2 * Math.PI;
    return function (options) {
      /** @type {number} */
      var maxLoopDuration = 0;
      for (; duration > maxLoopDuration; maxLoopDuration++) {
        options.forward(1);
        options.turn(currentDeg / duration);
      }
    };
  }
  /**
   * @param {number} value
   * @return {?}
   */
  function handler(value) {
    /** @type {number} */
    var currentDeg = 4 * Math.PI;
    return function (options) {
      /** @type {number} */
      var maxDistanceAbove = 0;
      for (; value > maxDistanceAbove; maxDistanceAbove++) {
        options.forward(1);
        options.turn(currentDeg / value);
      }
    };
  }
  /**
   * @param {?} _
   * @param {number} c
   * @param {undefined} dir
   * @param {?} value
   * @return {?}
   */
  function init(_, c, dir, value) {
    return function (p) {
      /** @type {number} */
      var midcolumn = 0;
      for (; c > midcolumn; midcolumn++) {
        _();
        p.forward(1);
        p.turn(dir);
        p.resize(value);
      }
    };
  }
  var scope = {};
  /**
   * @param {number} a
   * @return {?}
   */
  self.prototype.forward = function (a) {
    var start = this.p;
    var pt = this.w;
    return start.x = start.x + a * pt.x, start.y = start.y + a * pt.y, this.paint && this.paint(start.x, start.y), this;
  };
  /**
   * @param {number} a
   * @return {?}
   */
  self.prototype.move = function (a) {
    var start = this.p;
    var pt = this.w;
    return start.x = start.x + a * pt.x, start.y = start.y + a * pt.y, this;
  };
  /**
   * @param {number} data
   * @param {number} x
   * @return {?}
   */
  self.prototype.moveTo = function (data, x) {
    return this.p.x = data, this.p.y = x, this;
  };
  /**
   * @param {number} angle
   * @return {?}
   */
  self.prototype.turn = function (angle) {
    var point = (this.p, this.w);
    /** @type {number} */
    var targetBranchX = Math.cos(angle) * point.x - Math.sin(angle) * point.y;
    /** @type {number} */
    var targetBranchY = Math.sin(angle) * point.x + Math.cos(angle) * point.y;
    return point.x = targetBranchX, point.y = targetBranchY, this;
  };
  /**
   * @param {?} scale
   * @return {?}
   */
  self.prototype.resize = function (scale) {
    var capsule = this.w;
    return capsule.x = capsule.x * scale, capsule.y = capsule.y * scale, this;
  };
  /**
   * @return {?}
   */
  self.prototype.save = function () {
    return null == this._stack && (this._stack = []), this._stack.push([this.p, this.w]), this;
  };
  /**
   * @return {?}
   */
  self.prototype.restore = function () {
    if (null != this._stack && this._stack.length > 0) {
      var data = this._stack.pop();
      this.p = data[0];
      this.w = data[1];
    }
    return this;
  };
  /** @type {function((RegExp|string)): undefined} */
  scope.Tortoise = self;
  /** @type {function(?, number, undefined): ?} */
  scope.shift = count;
  /** @type {function(?, number): ?} */
  scope.spin = e;
  /** @type {function(number): ?} */
  scope.polygon = update;
  /** @type {function(?, number, undefined, ?): ?} */
  scope.spiral = init;
  /** @type {function(number): ?} */
  scope.star = handler;
  /** @type {function(number, number, ?): ?} */
  scope.scale = f;
  token.Logo = scope;
}(window);
