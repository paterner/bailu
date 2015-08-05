/**
 * Created by ChunkDing on 15/6/28.
 */

var drawFunction = function(){
    this.treeJumpTo = "#";
    this.elementsHeight = 33;
    this.elementsTopSpace = 10;

    this.btnSize = 17;
    this.childHeight = 35;
    this.initTop = 30;
    this.defaultEleTop = 20;
    this.endTop = 0;
    this.no1Key = true;


    this.width_12 = 148;    // 1,2级元素宽度
    this.width_34 = 116;    // 3,4级元素宽度

    this.distance_left = {  // 每一级元素居左位置
        class_0 : 35,
        class_1 : 140,
        class_2 : 220,
        class_3 : 400,
        class_4 : 580,
        class_5 : 760,
        class_child : 50
    }
    this.setwidth_12 = function(d){
        this.width_12 = d;
    }
    this.setwidth_34 = function(d){
        this.width_34 = d;
    }
    this.setDistance_left = function(d0,d1,d2,d3,d4,d5,child){
        this.distance_left = {  // 每一级元素居左位置
            class_0 : d0,
            class_1 : d1,
            class_2 : d2,
            class_3 : d3,
            class_4 : d4,
            class_5 : d5,
            class_child : child
        }
    }

    var getSize = function(id){ // 获得一个元素的位置和尺寸信息
        console.log(id.css("top"));
        var top = id.length>0 ? id.css("top") : "0px";
        var left = id.length>0  ? id.css("left") : "0px";
        var width = id.length>0  ? id.get(0).offsetWidth : 0;
        var height = id.length>0  ? id.get(0).offsetHeight : 0;
        return {
            top : eval("("+top.replace("px","")+")"),
            left : eval("("+top.replace("px","")+")"),
            width : width,
            height : height
        }
    }

    var drawLinkLine_xie = function(id1,id2,myId){   // 绘制两个元素块之间的连接线
        var xiuzheng_left = 0;
        var xiuzheng_top = -1;
        var pos = {
            a : getSize(id1),
            b : getSize(id2)
        };
        var a = {
            y : pos.a.top + pos.a.height / 2,
            x : pos.a.left + pos.a.width
        };
        var b ={
            y : pos.b.top + pos.b.height / 2,
            x : pos.b.left
        };

        var fu = a.y > b.y? -1 : 1;

        var long = Math.sqrt( (a.x- b.x)*(a.x- b.x) + (a.y- b.y)*(a.y- b.y) );
        var tmp_height = Math.abs(a.y- b.y);
        var jiaodu = Math.asin(tmp_height/long)*360/(2*Math.PI) * fu;
        var tmp_left = (long / 2) - Math.cos(jiaodu*2*Math.PI/360) * long / 2;
        var tmp_top = Math.sin(jiaodu*2*Math.PI/360) * long / 2;

        var final_left = a.x - tmp_left + xiuzheng_left;
        var final_top = a.y + tmp_top + xiuzheng_top;

        var code = "<div id='"+myId+"' class='line line_xie' style='-ms-transform:rotate("+jiaodu+"deg);transform:rotate("+jiaodu+"deg);width:"+long+"px;top:"+ final_top +"px;left:"+ final_left +"px;'></div>";
        return code;
    };
    var drawLinkLine_heng = function(id1,id2,myId){ // 为两个元素之间绘制一条横线连接线
        var xiuzheng_top = -1;
        var xiuzheng_left = -1;
        var pos = {
            a : getSize(id1),
            b : getSize(id2)
        };
        var t = Math.abs(pos.a.top + pos.a.height/2 + xiuzheng_top);
        var l = Math.abs(pos.a.left + pos.a.width + xiuzheng_left);
        var w = Math.abs(pos.b.left - l);

        var code = "<div id='"+myId+"' class='line line_heng' style='width:"+w+"px;top:"+t+"px;left:"+l+"px;'></div>";
        return code;

    };
    var drawLinkLine_shu = function(id1,id2,myId){ // 为两个元素之间绘制一条竖线连接线
        var xiuzheng_left = -1;
        var pos = {
            a : getSize(id1),
            b : getSize(id2)
        };
        var l = pos.a.left + pos.a.width/2 + xiuzheng_left;
        var t = pos.a.top + pos.a.height;
        var h = Math.abs(pos.b.top - t);
        var code = "<div id='"+myId+"' class='line line_shu' style='height:"+h+"px;top:"+t+"px;left:"+l+"px;'></d   iv>";
        return code;
    };
    var drawLinkLine_zhe = function(id1,id2,myId){
        var xiuzheng_left = -1;
        var xiuzheng_top = -1;
        var pos = {
            a : getSize(id1),
            b : getSize(id2)
        };
        var l = pos.a.left + pos.a.width/2 + xiuzheng_left;
        var t = pos.a.top + pos.a.height + xiuzheng_top;
        var h = Math.abs(pos.b.top + pos.b.height/2 - t);
        var w = Math.abs(pos.b.left - l);
        var code = "<div id='"+myId+"' class='line line_zhe' style='width:"+w+"px;height:"+h+"px;top:"+t+"px;left:"+l+"px;'></div>";
        return code;
    }
    var linkElements = function(id1,id2,myId){
        var a = getSize(id1);
        var b = getSize(id2);
        var cha_top = Math.abs((a.top + a.height/2) - (b.top+ b.height/2));
        var cha_left = Math.abs( (a.left + a.width/2) - (b.left + b.width/2));
        if( cha_top<=5 && cha_left>5){    // 被定义为横线连接
            return drawLinkLine_heng(id1,id2,myId);
        }else if(cha_top>5 && cha_left>5){   // 被定义为斜线连接
            return drawLinkLine_xie(id1,id2,myId);
        }else if(cha_top>5 && cha_left<=5){ // 被定义为竖线连接
            return drawLinkLine_shu(id1,id2,myId);
        }
    }


    var checkMaxHeight = function(){
        var id = $(".front .del");
        var d = 0;
        var t = 0;
        for(var i= 0,imax=id.length;i<imax;i++){

            var tmp_top = id.eq(i).css("top").replace("px","");


            tmp_top = tmp_top=="auto"?"0":tmp_top;


            t = eval("("+tmp_top+")") + id.eq(i).height();
            d = d<t?t:d;
        }
//    console.log(tmp_top,id.eq(i-1))
        return d;
    }
    var checkDrawHeight = function(idline, paddingBottom){
        var myPadding = 15;
        paddingBottom = (typeof(paddingBottom) == "number" ? paddingBottom : 0);
        var d = checkMaxHeight();
        var realHeight = d + paddingBottom + myPadding;
        idline.css({
            height : realHeight
        });
    }
    var addFront = function(id, line_id, code, callBack){
        id1.children(".del").remove();
        id1.append(code);
        checkDrawHeight(line_id,50);
        callBack ? callBack() : false;
    };
    var addBack = function(id, code){
        id2.children(".del").remove();
        id2.append(code);
    }


    var calcElementTop = function(){
        if(this.no1Key){
            this.defaultEleTop += this.initTop + this.elementsHeight + this.elementsTopSpace;
            this.no1Key = false;
        }else{
            this.defaultEleTop += this.elementsHeight + this.elementsTopSpace;
        }

        return this.defaultEleTop;
    }


    var getMiddleTop = function(d,childSum){
        if(childSum==undefined){childSum = 0}
        var res = 0;
        var n = d.length-1;
        if(n<=1 || childSum <= 1){
            res = d[0];
        }else{
            if(n%2==0){
                res = d[Math.floor(n/2-1)] + Math.abs(d[Math.floor(n/2)] - d[Math.floor(n/2-1)])/2;
            }else{
                res = d[Math.floor(n/2-1)] + Math.abs(d[Math.floor(n/2+1)] - d[Math.floor(n/2-1)])/2;
            }
        }
        return res;
    }


    var handlerClassTop = function(d){  // 重新计算元素距离顶端的距离
        if(d.length==1){
            d[1] = d[0];
        }else{
            if(d[d.length-1]!=d[d.lenght-2]){
                d[d.length] = d[d.lenght-1];
            }
        }
        return d;
    }

    this.createMyTaskStream = function(d, id1, id2, idline){
        var code = "";
        code += "<div class='elementsTitleBox' style='top:50px;'>任务启动日期<br>"+d[0].date+"</div>"+
        "<div class='circleBox1' style='left:125px;top:38px;'><div class='circleBox1Info'>开始</div></div>";
        for(var i= 1,imax= d.length-1;i<imax;i++){
            var class_1_top = [];
            var class_2_top = [];
            var class_3_top = [];
            var class_4_top = [];

            if(d[i].class_1.class_2!=undefined){
                for(var j= 0,jmax =d[i].class_1.class_2.length;j<jmax;j++ ){
                    /*-------------------------------------------------------------------------------------------*/
                    if(d[i].class_1.class_2[j].class_3!=undefined){
                        for(var k= 0,kmax=d[i].class_1.class_2[j].class_3.length;k<kmax;k++){
                            /*-------------------------------------------------------------------------------------------*/
                            if(d[i].class_1.class_2[j].class_3[k].class_4!=undefined){  // class4 层级元素位置


                                //class_4的元素在此开始添加
                                for(var l= 0,lmax=d[i].class_1.class_2[j].class_3[k].class_4.length;l<lmax;l++){
                                    class_4_top[l] = calcElementTop();
                                    var id_tmpp = "ele_"+i+"_"+j+"_"+k+"_"+l;
                                    var myId = d[i].class_1.class_2[j].class_3[k].class_4[l].eleId ? d[i].class_1.class_2[j].class_3[k].class_4[l].eleId : "";
                                    code += "<div data-myid='"+myId+"' id='"+id_tmpp+"' class='del elements elements_heard_"+boxType(d[i].class_1.class_2[j].class_3[k].class_4[l].tag)+"' style='top:"+(class_4_top[l])+"px;left:"+this.distance_left.class_5+"px;'>"+
                                    "<div class='s1bcc class_45'>"+d[i].class_1.class_2[j].class_3[k].class_4[l].text+"</div>"+
                                    "<div class='s1bce'></div>"+
                                    "</div>";

                                }
                                class_3_top[k] = getMiddleTop(class_4_top,lmax);
                            }else{
                                class_3_top[k] = calcElementTop();
                            }

                            /*-------------------------------------------------------------------------------------------*/
                            var id_tmpp = "ele_"+i+"_"+j+"_"+k;
                            var myId = d[i].class_1.class_2[j].class_3[k].eleId ? d[i].class_1.class_2[j].class_3[k].eleId : "";
                            code += "<div data-myid='"+myId+"' id='"+id_tmpp+"' class='del elements elements_heard_"+boxType(d[i].class_1.class_2[j].class_3[k].tag)+"' style='top:"+(class_3_top[k])+"px;left:"+this.distance_left.class_4+"px;'>"+
                            "<div class='s1bcc class_45'>"+d[i].class_1.class_2[j].class_3[k].text+"</div>"+
                            "<div class='s1bce'></div>"+
                            "</div>";
                            //添加按钮 - 下级
                            var tmp_t = class_3_top[k]+ this.elementsHeight/2 -this.btnSize/2;
                            var tmp_l = this.distance_left.class_4+this.width_34 - this.btnSize/2;
                            code += "<div data-father='"+id_tmpp+"' data-type='add_childClass' class='"+id_tmpp+" chlidBtn btn_add btn_add_"+boxType(d[i].class_1.class_2[j].class_3[k].tag)+"' style='top:"+tmp_t+"px;left:"+tmp_l+"px;'></div>";


                        }
                        class_2_top[j] = getMiddleTop(class_3_top,kmax);
                    }else{
                        class_2_top[j] = calcElementTop();
                    }
                    class_2_top = handlerClassTop(class_2_top);

                    // CLASS_2 的创建
                    var id_tmpp = "ele_"+i+"_"+j;
                    var myId = d[i].class_1.class_2[j].eleId ? d[i].class_1.class_2[j].eleId : "";
                    code += "<div data-myid='"+myId+"' id='"+id_tmpp+"' class='del elements elements_heard_"+boxType(d[i].class_1.class_2[j].tag)+"' style='top:"+(class_2_top[j])+"px;left:"+this.distance_left.class_3+"px;'>"+
                    "<div class='s1bcc class_23'>"+d[i].class_1.class_2[j].text+"</div>"+
                    "<div class='s1bce'></div>"+
                    "</div>";

                    //添加按钮 - 下级
                    var tmp_t = class_2_top[j]+ this.elementsHeight/2 - this.btnSize/2;
                    var tmp_l = this.distance_left.class_3  + this.width_12 - this.btnSize/2;
                    code += "<div data-father='"+id_tmpp+"' data-type='add_childClass' class='"+id_tmpp+" chlidBtn btn_add btn_add_"+boxType(d[i].class_1.class_2[j].tag)+"' style='top:"+tmp_t+"px;left:"+tmp_l+"px;'></div>";
                    class_1_top[i] = getMiddleTop(class_2_top,imax);
                }
                if(jmax==1){ class_1_top[i] = class_2_top[0]; }
            }else{

                class_1_top[i] = calcElementTop();
                this.defaultEleTop = this.defaultEleTop > class_1_top[class_1_top.length-1] ? this.defaultEleTop : class_1_top[class_1_top.length-1] + this.elementsTopSpace + this.elementsHeight;
            }

            class_1_top = handlerClassTop(class_1_top);
            var id_tmpp = "ele_"+i;
            var myId = d[i].class_1.eleId ? d[i].class_1.eleId : "";
            code += "<div class='elementsTitleBox' style='top:"+(class_1_top[i]+6)+"px;'>"+d[i].date+"</div>"+
            "<div data-myid='"+myId+"' id='"+id_tmpp+"' class='del elements elements_heard_"+boxType(d[i].class_1.tag)+"' style='top:"+(class_1_top[i])+"px;left:"+this.distance_left.class_2+"px;'>"+
            "<div class='s1bcc class_23'>"+d[i].class_1.text+"</div>"+
            "<div class='s1bce'></div>"+
            "</div>";

            //添加按钮 - 下级
            var tmp_t = class_1_top[i]+ this.elementsHeight/2 - this.btnSize/2;
            var tmp_l = this.distance_left.class_2 + this.width_12 - this.btnSize/2;
            code += "<div data-father='"+id_tmpp+"' data-type='add_childClass' class='"+id_tmpp+" chlidBtn btn_add btn_add_"+boxType(d[i].class_1.tag)+"' style='top:"+tmp_t+"px;left:"+tmp_l+"px;'></div>";

            code += "<div id='ele_0_"+i+"' class='del circleBox_"+(TagType(d[i].tag))+"' style='top:"+(class_1_top[i])+"px;left:"+this.distance_left.class_1+"px;'></div>";
       //console.log(i,imax);
        }

        var endTop = calcElementTop();

        code += "<div class='elementsTitleBox' style='top:"+endTop+"px;'>任务启动日期<br>"+d[d.length-1].date+"</div>"+
        "<div class='circleBox2' style='left:128px;top:"+(endTop-12)+"px;'><div class='circleBox2Info'>结束</div></div>";

        addFront(
            id1, id2, code,
            function(){
                drawAllLine(idline, d);
            }
        );
    }

    var createMyTaskStream = function(d){
        var code = "";
        code += "<div class='elementsTitleBox' style='top:50px;'>任务启动日期<br>"+d[0].date+"</div>"+
        "<div class='circleBox1' style='left:125px;top:38px;'><div class='circleBox1Info'>开始</div></div>";
        for(var i= 1,imax= d.length-1;i<imax;i++){
            var class_1_top = [];
            var class_2_top = [];
            var class_3_top = [];
            var class_4_top = [];

            if(d[i].class_1.class_2!=undefined){
                for(var j= 0,jmax =d[i].class_1.class_2.length;j<jmax;j++ ){
                    /*-------------------------------------------------------------------------------------------*/
                    if(d[i].class_1.class_2[j].class_3!=undefined){
                        for(var k= 0,kmax=d[i].class_1.class_2[j].class_3.length;k<kmax;k++){
                            /*-------------------------------------------------------------------------------------------*/
                            if(d[i].class_1.class_2[j].class_3[k].class_4!=undefined){  // class4 层级元素位置


                                //class_4的元素在此开始添加
                                for(var l= 0,lmax=d[i].class_1.class_2[j].class_3[k].class_4.length;l<lmax;l++){
                                    class_4_top[l] = calcElementTop();
                                    var id_tmpp = "ele_"+i+"_"+j+"_"+k+"_"+l;
                                    var myId = d[i].class_1.class_2[j].class_3[k].class_4[l].eleId ? d[i].class_1.class_2[j].class_3[k].class_4[l].eleId : "";
                                    code += "<div data-myid='"+myId+"' id='"+id_tmpp+"' class='del elements elements_heard_"+boxType(d[i].class_1.class_2[j].class_3[k].class_4[l].tag)+"' style='top:"+(class_4_top[l])+"px;left:"+this.distance_left.class_5+"px;'>"+
                                    "<div class='s1bcc class_45'>"+d[i].class_1.class_2[j].class_3[k].class_4[l].text+"</div>"+
                                    "<div class='s1bce'></div>"+
                                    "</div>";

                                }
                                class_3_top[k] = getMiddleTop(class_4_top,lmax);
                            }else{
                                class_3_top[k] = calcElementTop();
                            }

                            /*-------------------------------------------------------------------------------------------*/
                            var id_tmpp = "ele_"+i+"_"+j+"_"+k;
                            var myId = d[i].class_1.class_2[j].class_3[k].eleId ? d[i].class_1.class_2[j].class_3[k].eleId : "";
                            code += "<div data-myid='"+myId+"' id='"+id_tmpp+"' class='del elements elements_heard_"+boxType(d[i].class_1.class_2[j].class_3[k].tag)+"' style='top:"+(class_3_top[k])+"px;left:"+this.distance_left.class_4+"px;'>"+
                            "<div class='s1bcc class_45'>"+d[i].class_1.class_2[j].class_3[k].text+"</div>"+
                            "<div class='s1bce'></div>"+
                            "</div>";
                            //添加按钮 - 下级
                            var tmp_t = class_3_top[k]+ this.elementsHeight/2 -this.btnSize/2;
                            var tmp_l = this.distance_left.class_4+this.width_34 - this.btnSize/2;
                            code += "<div data-father='"+id_tmpp+"' data-type='add_childClass' class='"+id_tmpp+" chlidBtn btn_add btn_add_"+boxType(d[i].class_1.class_2[j].class_3[k].tag)+"' style='top:"+tmp_t+"px;left:"+tmp_l+"px;'></div>";


                        }
                        class_2_top[j] = getMiddleTop(class_3_top,kmax);
                    }else{
                        class_2_top[j] = calcElementTop();
                    }
                    class_2_top = handlerClassTop(class_2_top);

                    // CLASS_2 的创建
                    var id_tmpp = "ele_"+i+"_"+j;
                    var myId = d[i].class_1.class_2[j].eleId ? d[i].class_1.class_2[j].eleId : "";
                    code += "<div data-myid='"+myId+"' id='"+id_tmpp+"' class='del elements elements_heard_"+boxType(d[i].class_1.class_2[j].tag)+"' style='top:"+(class_2_top[j])+"px;left:"+this.distance_left.class_3+"px;'>"+
                    "<div class='s1bcc class_23'>"+d[i].class_1.class_2[j].text+"</div>"+
                    "<div class='s1bce'></div>"+
                    "</div>";

                    //添加按钮 - 下级
                    var tmp_t = class_2_top[j]+ this.elementsHeight/2 - this.btnSize/2;
                    var tmp_l = this.distance_left.class_3  + this.width_12 - this.btnSize/2;
                    code += "<div data-father='"+id_tmpp+"' data-type='add_childClass' class='"+id_tmpp+" chlidBtn btn_add btn_add_"+boxType(d[i].class_1.class_2[j].tag)+"' style='top:"+tmp_t+"px;left:"+tmp_l+"px;'></div>";
                    class_1_top[i] = getMiddleTop(class_2_top,imax);
                }
                if(jmax==1){ class_1_top[i] = class_2_top[0]; }
            }else{

                class_1_top[i] = calcElementTop();
                this.defaultEleTop = this.defaultEleTop > class_1_top[class_1_top.length-1] ? this.defaultEleTop : class_1_top[class_1_top.length-1] + this.elementsTopSpace + this.elementsHeight;
            }

            class_1_top = handlerClassTop(class_1_top);
            var id_tmpp = "ele_"+i;
            var myId = d[i].class_1.eleId ? d[i].class_1.eleId : "";
            code += "<div class='elementsTitleBox' style='top:"+(class_1_top[i]+6)+"px;'>"+d[i].date+"</div>"+
            "<div data-myid='"+myId+"' id='"+id_tmpp+"' class='del elements elements_heard_"+boxType(d[i].class_1.tag)+"' style='top:"+(class_1_top[i])+"px;left:"+this.distance_left.class_2+"px;'>"+
            "<div class='s1bcc class_23'>"+d[i].class_1.text+"</div>"+
            "<div class='s1bce'></div>"+
            "</div>";

            //添加按钮 - 下级
            var tmp_t = class_1_top[i]+ this.elementsHeight/2 - this.btnSize/2;
            var tmp_l = this.distance_left.class_2 + this.width_12 - this.btnSize/2;
            code += "<div data-father='"+id_tmpp+"' data-type='add_childClass' class='"+id_tmpp+" chlidBtn btn_add btn_add_"+boxType(d[i].class_1.tag)+"' style='top:"+tmp_t+"px;left:"+tmp_l+"px;'></div>";

            code += "<div id='ele_0_"+i+"' class='del circleBox_"+(TagType(d[i].tag))+"' style='top:"+(class_1_top[i])+"px;left:"+this.distance_left.class_1+"px;'></div>";
        }

        var endTop = calcElementTop();

        code += "<div class='elementsTitleBox' style='top:"+endTop+"px;'>任务启动日期<br>"+d[d.length-1].date+"</div>"+
        "<div class='circleBox2' style='left:128px;top:"+(endTop-12)+"px;'><div class='circleBox2Info'>结束</div></div>";

        console.log(code);

        addFront(
            code,
            function(){
                drawAllLine(d);
            }
        );
    }

    var drawAllLine = function(d){
        for(var i= 1,imax= d.length-1;i<imax;i++){
            if(i==1){
                addBack(linkElements($(".circleBox1"),$("#ele_0_"+i),""));
            }else{
                addBack(linkElements($("#ele_0_"+(i-1)),$("#ele_0_"+i),""));
            }
            addBack(linkElements($("#ele_0_"+i),$("#ele_"+i),"line_0_1_"+i));
            if(d[i].class_1.class_2!=undefined){
                for(var j= 0,jmax =d[i].class_1.class_2.length;j<jmax;j++ ){
                    addBack(linkElements($("#ele_"+i),$("#ele_"+i+"_"+j),"line_1_2_"+j));
                    if(d[i].class_1.class_2[j].child!=undefined){
                        addBack(drawLinkLine_zhe($("#ele_"+i+"_"+j),$("#child_"+i+"_"+j),"zhe_1_2_"+j));
                    }
                    if(d[i].class_1.class_2[j].class_3!=undefined){
                        for(var k= 0,kmax=d[i].class_1.class_2[j].class_3.length;k<kmax;k++){
                            addBack(linkElements($("#ele_"+i+"_"+j),$("#ele_"+i+"_"+j+"_"+k),"line_1_2_"+j));
                            if(d[i].class_1.class_2[j].class_3[k].child!=undefined){
                                addBack(drawLinkLine_zhe($("#ele_"+i+"_"+j+"_"+k),$("#child_"+i+"_"+j+"_"+k),"zhe_1_2_"+j));
                            }
                            if(d[i].class_1.class_2[j].class_3[k].class_4!=undefined){
                                for(var l= 0,lmax=d[i].class_1.class_2[j].class_3[k].class_4.length;l<lmax;l++){
                                    addBack(linkElements($("#ele_"+i+"_"+j+"_"+k),$("#ele_"+i+"_"+j+"_"+k+"_"+l),"line_1_2_"+j));
                                    if(d[i].class_1.class_2[j].class_3[k].class_4[l].child!=undefined){
                                        addBack(drawLinkLine_zhe($("#ele_"+i+"_"+j+"_"+k+"_"+l),$("#child_"+i+"_"+j+"_"+k+"_"+l),"zhe_1_2_"+j));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        addBack(linkElements($("#ele_0_"+ (d.length-2)),$(".circleBox2")));
    }

    var boxType = function(tag){
        var res = "red";
        switch(tag){// 1->灰色框,2->红色框,3->绿色框,4->蓝色框
            case 1:
                res = "gray";
                break;
            case 2:
                res = "red";
                break;
            case 3:
                res = "green";
                break;
            case 4:
                res = "blue";
                break;
            default :
                res = "red";
        }
        return res;
    }

    var TagType = function(tag){
        var res = "ok";
        switch(tag){    // 1->对勾,2->惊叹号,3->今天,0->差,4->时钟
            case 1:
                res = "ok";
                break;
            case 2:
                res = "tanhao";
                break;
            case 3:
                res = "now";
                break;
            case 4:
                res = "clock";
                break;
            default :
                res = "ok";
        }
        return res;
    }

    var setWidth = function(){
        var w = $(".taskInfoBox").width();
        $(".absBox").css({width : w})
    }

}