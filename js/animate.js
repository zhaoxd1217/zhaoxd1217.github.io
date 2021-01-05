var isRun = true;

function Animate(id) {
  var ele = document.getElementById(id),
    eletext = ele.innerText,
    arr = eletext.split(" "),
    _this = this;
  this.resetTime = 10; //最大值100
  this.color = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#9e9e9e",
    "#607d8b",
  ];
  this.randomColor = function () {
    var colorIndex = Math.floor(this.color.length * Math.random());
    return this.color[colorIndex];
  };

  this.posRangencala = function () {
    return ele.hasAttribute("ele-range")
      ? {
          minRange: {
            x: ele.getBoundingClientRect().left,
            y: ele.getBoundingClientRect().top,
          },
          maxRange: {
            x: ele.getBoundingClientRect().right,
            y: ele.getBoundingClientRect().bottom,
          },
        }
      : {
          minRange: {
            x: 0,
            y: 0,
          },
          maxRange: {
            x: document.documentElement.clientWidth,
            y: document.documentElement.clientHeight,
          },
        };
  };
  this.spanArr = (function () {
    ele.innerHTML = "";
    var spanArr = [];
    arr.forEach(function (value, index) {
      var spanDom = document.createElement("span");
      spanDom.style.display = "inline-block";
      spanDom.innerHTML = value;
      spanDom.style.position = "relative";
      spanDom.style.color = _this.randomColor();
      spanDom.style.fontSize = "26px";
      spanDom.own = {
        pos: {
          x: 0,
          y: 0,
        },
        ran: {
          x: -0.5 + Math.random(),
          y: -0.5 + Math.random(),
        },
        speed: {
          x: 1,
          y: 1,
        },
        dir: {
          x: 1,
          y: 1,
        },
      };
      ele.appendChild(spanDom);
      spanArr.push(spanDom);
    });
    return spanArr;
  })();
  this.spanOrigin = function () {
    this.spanArr.forEach(function (value, index) {
      value.own.realPos = {
        minx: value.getBoundingClientRect().left,
        maxx: value.getBoundingClientRect().right,
        miny: value.getBoundingClientRect().top,
        maxy: value.getBoundingClientRect().bottom,
      };
    });
    this.posRangen = this.posRangencala();
  };
  this.spanOrigin();
  this.resetpos = function () {
    this.spanOrigin();
    this.spanArr.forEach(function (span, index) {
      if (span.own.realPos.minx + span.own.pos.x < _this.posRangen.minRange.x)
        span.own.pos.x = 0;
      if (span.own.realPos.maxx + span.own.pos.x > _this.posRangen.maxRange.x)
        span.own.pos.x = 0;
      if (span.own.realPos.miny + span.own.pos.y < _this.posRangen.minRange.y)
        span.own.pos.y = 0;
      if (span.own.realPos.maxy + span.own.pos.y > _this.posRangen.maxRange.y)
        span.own.pos.y = 0;
    });
  };

  this.floatText = function () {
    this.spanArr.forEach(function (span, index) {
      if (
        span.own.realPos.minx + span.own.pos.x < _this.posRangen.minRange.x ||
        span.own.realPos.maxx + span.own.pos.x > _this.posRangen.maxRange.x
      ) {
        span.own.dir.x = -span.own.dir.x;
      }
      if (
        span.own.realPos.miny + span.own.pos.y < _this.posRangen.minRange.y ||
        span.own.realPos.maxy + span.own.pos.y > _this.posRangen.maxRange.y
      ) {
        span.own.dir.y = -span.own.dir.y;
      }

      if (isRun) {
        timeOut(span, 0);
      } else {
        for (var a = 0; a < 20; a++) {
          timeOut(span, 10);
        }
      }
    });
  };

  function timeOut(span, time) {
    setTimeout(function () {
      span.own.pos.x += span.own.ran.x * span.own.speed.x * span.own.dir.x;
      span.own.pos.y += span.own.ran.y * span.own.speed.y * span.own.dir.y;
      span.style.transform =
        "translateX(" +
        span.own.pos.x +
        "px) translateY(" +
        span.own.pos.y +
        "px)";
    }, time);
  }

  var boolClick = true;
  this.floatBack = function () {
    this.spanArr.forEach(function (value, index) {
      var text = value.innerText;
      var x = value.own.pos.x - (value.own.pos.x * _this.resetTime) / 100 - 100;
      var y = value.own.pos.y - (value.own.pos.y * _this.resetTime) / 100 - 100;
      var vip = localStorage.getItem("vip");
      if (vip == text) {
        if (boolClick) {
          var tTop = value.getBoundingClientRect().top;
          var tLeft = value.getBoundingClientRect().left;
          var sizeW = winW / 2;
          var sizeH = winH / 2;
          var s = value.getBoundingClientRect().width / 3;
          var endX = sizeW - tLeft - s * 2;
          var endY = sizeH - tTop - 36;

          $(value).animate({ top: endY, left: endX, fontSize: "36px" });
          boolClick = false;
        }
      } else {
        value.style.transform =
          "translateX(" + x + "px) translateY(" + y + "px)";
        setTimeout(function () {
          $(value).animate({ top: "-150px" });
        }, 200);
      }
    });

    if (this.resetTime === 100) {
      cancelAnimationFrame(_this.send);
      return true;
    } else {
      this.resetTime += 5;
    }
  };
  this.restart = function () {
    this.spanArr.forEach(function (value, index) {
      value.own.pos.x = 0;
      value.own.pos.y = 0;
    });
  };
  this.render = {
    run: function () {
      _this.sren = requestAnimationFrame(_this.render.run);
      _this.floatText();
    },
    end: function () {
      _this.send = requestAnimationFrame(_this.render.end);
      _this.floatBack();
    },
    killer: function (bool) {
      if (bool) {
        isRun = true;
        window.location.reload();
      } else {
        isRun = false;
        setTimeout(function () {
          var that = _this;
          cancelAnimationFrame(that.sren);
          that.render.end();
        }, 5000);
      }
    },
  };

  var winW = 0;
  var winH = 0;
  window.onresize = function () {
    _this.resetpos();
  };

  getWh();

  function getWh() {
    winW = document.body.offsetWidth;
    winH = document.documentElement.clientHeight;
  }
}
