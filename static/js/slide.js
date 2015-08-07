/**
 * Created by sunchi.
 * Date: 15-8-7
 */

function Slider(options) {
    var defaults = {
        scrollBox: null, //父元素
        scrollImgUl: null, //图片列表
        scrollNumUl: null, //元素索引
        nextBtn: null, //下一个按钮
        preBtn: null, //上一个按钮
        scrollTimer: 3000, //滚动间隔
        isAutoPlay: true //是否自动滚动
    }
    this.settings = this.extend(defaults, options);
    this.scrollImgLi = this.settings.scrollImgUl.getElementsByTagName('li');
    this.scrollNumLi = null;
    this.eleWidth = this.settings.scrollBox.clientWidth;
    this.$index = 1;
    this.timer = null;
    this.timerAnimate = null;
    this.init();
}
Slider.prototype = {
    //初始化
    init: function() {
        var _this = this;
        for (var i = 1; i <= _this.scrollImgLi.length; i++) {
            var li_ele = document.createElement('li');
            li_ele.innerHTML = i;
            _this.settings.scrollNumUl.appendChild(li_ele); 
        }
        var imgobj = _this.settings.scrollImgUl.getElementsByTagName("img");
        for (var j = 0; j < _this.scrollImgLi.length; j++) {
            _this.scrollImgLi[j].style.width = _this.eleWidth + 'px';
        }
        _this.settings.scrollImgUl.insertBefore(_this.scrollImgLi[_this.scrollImgLi.length - 1].cloneNode(true), _this.scrollImgLi[0]);
        _this.settings.scrollImgUl.appendChild(this.scrollImgLi[1].cloneNode(true));
        _this.scrollNumLi = _this.settings.scrollNumUl.getElementsByTagName("li");
        _this.settings.scrollImgUl.style.width = _this.eleWidth * _this.scrollImgLi.length + 'px';
        _this.settings.scrollImgUl.style.left = -_this.eleWidth + 'px';
        _this.scrollNumLi[0].className = "current";
        window.addEventListener("resize",function(){_this.reSize()},false);
        _this.mouseoverout();
        _this.touchslide();
        _this.btnClick();
        _this.autoplay();
    },
     //自动播放
    autoplay: function() {
        var _this = this;
        if(_this.settings.isAutoPlay){
            clearInterval(_this.timer);
            _this.timer = setInterval(function() {
                if(_this.$index == _this.scrollImgLi.length) {
                    _this.$index = 2;
                    _this.settings.scrollImgUl.style.left = -_this.eleWidth + 'px';
                }else if(_this.$index == _this.scrollImgLi.length-1){
                    _this.settings.scrollImgUl.style.left = -_this.eleWidth*_this.scrollNumLi.length + 'px';
                }
                _this.scrollAnimate(_this.$index);
                _this.$index++
            },_this.settings.scrollTimer);
        }
    },
    //切换事件
    btnClick: function() {
        var _this = this;
        _this.settings.nextBtn.addEventListener('click', function() {
                if(_this.$index == _this.scrollImgLi.length - 1) {
                    _this.$index = 1;
                    _this.settings.scrollImgUl.style.left = -_this.eleWidth + 'px';
                }
                _this.$index++
                _this.scrollAnimate(_this.$index);
        });
        _this.settings.preBtn.addEventListener('click', function() {
                if(_this.$index == 0) {
                    _this.$index = 3;
                    _this.settings.scrollImgUl.style.left = -_this.eleWidth * _this.scrollNumLi.length + 'px';
                }
                _this.$index--
                _this.scrollAnimate(_this.$index);
        })
    },
    //鼠标事件
    mouseoverout: function() {
        var _this = this;
        _this.settings.scrollBox.onmouseover = function() {
            clearInterval(_this.timer);
        }
        _this.settings.scrollBox.onmouseout = function() {
            _this.autoplay();
        }
        for (var i = 0; i < _this.scrollNumLi.length; i++) {
            _this.scrollNumLi[i].index = i;
            _this.scrollNumLi[i].onmouseover = function() {
                if(_this.$index == _this.scrollImgLi.length && this.index == 1) _this.settings.scrollImgUl.style.left = -_this.eleWidth + 'px';
                _this.scrollAnimate(this.index+1);
                _this.$index = this.index+1
            }
        }
    },
    //滑动事件
    touchslide: function() {
        var _this = this;
        if(("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch) 
            _this.settings.scrollBox.addEventListener('touchstart',start,false);
        function start(event){
            clearInterval(_this.timer);
            //event.preventDefault();

            var touch = event.touches[0]; // 取第一个touch的坐标值
            startPos = {                                 
                x: touch.pageX,
                y: touch.pageY,
                time: +new Date
            };
            endPos = {x:0,y:0};
            _this.settings.scrollBox.addEventListener('touchmove',move,false);
            _this.settings.scrollBox.addEventListener('touchend',end,false);
        }
        function move(event){
            event.preventDefault();
            if (event.touches.length > 1 || event.scale && event.scale !== 1) return;
            
            var touch = event.touches[0];
            endPos = {
                x: touch.pageX - startPos.x,
                y: touch.pageY - startPos.y
            };          
        }
        function end(event){
            var curindex = 0;
            for (var i = 0; i < _this.scrollNumLi.length; i++) {
                if(_this.scrollNumLi[i].className == "current") {
                    curindex = i;
                }
            }
            var duration = +new Date - startPos.time; 
            if (Number(duration) > 100) {
                // 判断是左移还是右移，当偏移量大于50时执行
                if (endPos.x > 50) {
                    if(curindex == 0 && _this.$index == 2){
                        _this.$index = _this.scrollNumLi.length+1;
                        _this.scrollAnimate(curindex);
                    }else if(curindex == 0 && _this.$index == _this.scrollImgLi.length){
                        _this.scrollAnimate(_this.scrollNumLi.length);
                        _this.$index = _this.scrollNumLi.length+1;
                    }else if(curindex == _this.scrollNumLi.length-1 && _this.$index == _this.scrollNumLi.length+1){
                        _this.settings.scrollImgUl.style.left = -_this.eleWidth * _this.scrollNumLi.length + 'px';
                        _this.$index = curindex+1;
                        _this.scrollAnimate(curindex);
                    }else{                      
                        _this.$index = curindex+1;
                        _this.scrollAnimate(curindex);
                    }
                    
                } else if(endPos.x < -50) {
                    _this.scrollAnimate(curindex+2);
                    if (_this.$index == _this.scrollNumLi.length && curindex == _this.scrollNumLi.length-1) {
                        _this.$index = _this.scrollImgLi.length;
                    }else if(_this.$index == _this.scrollImgLi.length){
                        _this.$index = 2;
                        _this.settings.scrollImgUl.style.left = -_this.eleWidth + 'px';
                    }else{
                        _this.$index = curindex+2;
                    }
                }
            }
            _this.autoplay();
            _this.settings.scrollBox.removeEventListener('touchmove',move,false);
            _this.settings.scrollBox.removeEventListener('touchend',end,false);
        }
    },
    //滚动动画函数
    scrollAnimate: function(i){
        var _this = this;
        var target = -i * _this.eleWidth;
        var timerAnimate = null;        
        clearInterval(_this.timerAnimate);
        _this.timerAnimate = setInterval(function(){
            var cur = getCss(_this.settings.scrollImgUl,'left');
            var nSpeed = (target-cur)/8;      
            nSpeed = nSpeed > 0 ? Math.ceil(nSpeed) : Math.floor(nSpeed);        
            _this.settings.scrollImgUl.style.left = cur + nSpeed + "px";
            if (nSpeed == 0) {
                clearInterval( _this.timerAnimate);
            };
        }, 30);
        function getCss(ele,cssName){
            if(typeof getComputedStyle=="function"){
                return parseFloat(getComputedStyle(ele,null)[cssName]);
            }else{
                return parseFloat(ele.currentStyle[cssName]);
            }   
        }
        for (var m = 0; m < _this.scrollNumLi.length; m++) {
             _this.scrollNumLi[m].className = "";
        }
        var index = i > _this.scrollNumLi.length ? 0 : (i-1 < 0 ? _this.scrollNumLi.length-1 : i-1);
        _this.scrollNumLi[index].className = "current";
    },
    //屏幕宽度改变
    reSize: function(){
        var _this = this;
        _this.eleWidth = _this.settings.scrollBox.clientWidth;
        var imgobj = _this.settings.scrollImgUl.getElementsByTagName("img");
        for (var j = 0; j < imgobj.length; j++) {
            imgobj[j].width = _this.eleWidth;
        }
    },   
    extend: function(target, options) {
        for (name in options) {
            target[name] = options[name];
        }
        return target;
    }
}