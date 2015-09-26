(function(){

    var c2datadata = {
        chart1 : "",
        chart2 : [
            [
                {
                    name : 'DPS01A',
                    value:[45],
                    color:'#47b2c8'
                },
                {
                    name : 'DPS01B',
                    value:[60],
                    color:'#db6086'
                }
            ],[
                {
                    name : 'DPS01A',
                    value:[45],
                    color:'#47b2c8'
                },
                {
                    name : 'DPS01B',
                    value:[60],
                    color:'#db6086'
                }
            ],[
                {
                    name : 'DPS01A',
                    value:[45],
                    color:'#47b2c8'
                },
                {
                    name : 'DPS01B',
                    value:[60],
                    color:'#db6086'
                }
            ]
        ],
        chart3 : ""
    }


    var filtrateCondition = function(d){
        var code = "";
        for(var i= 0,imax= d.length;i<imax;i++){

            code += "<div class='conditionBoxChip conditionBoxChipStyle"+(i%2==0?"1":"2")+(i==3?" conditionBoxChipEnd" :"")+"'><li class='conditionBoxChipTitle'>"+d[i].title+":</li>";
            for(var k= 0,kmax= d[i].child.length;k<kmax;k++){
                code += "<li class='conditionBoxChipOne' id='"+d[i].child[k].key+"'>"+d[i].child[k].title+"</li>";
            }
            code += "<div class='add'><span class='fa fa-plus'></span></div></div>";
        }
        code += "<div class='upAndDownBtn'></div>";
        $(".conditionBox").html(code);
    }

    $(".tagccchip").live({
        "click" : function(){
            $(".tagccchip_selected").removeClass("tagccchip_selected");
            $(this).addClass("tagccchip_selected");
            var tag = $(this).attr("id");
            $(".mmm_box").css({display:"none"});
            $("#mmm_"+tag).css({display:"block"});
        }
    })

    $(".mc_haveChild").live({
        "click" : function(){
            var h = 48;
            if($(this).next().height()>0){
                $(this).next().animate(
                    {
                        height : 0
                    },
                    400,
                    "swing",
                    function(){

                    }
                )
            }else{
                var n = $(this).next().children("div").length;
                $(".mc_topChildBox").css({height:0});
                $(this).next().animate(
                    {
                        height : h * n
                    },
                    400,
                    "swing",
                    function(){

                    }
                )
            }
        }
    })

    var moveTable = function(){
        this.selTableIds = "";
        this.mousePos = {x:"",y:""};
        this.moveX = true;
        this.moveY = false;
        this.boxNowPos = {x:0,y:0};
    }
    moveTable.prototype = {
        start : function(ids){
            var that = this;
            ids.live({
                "mousedown" : function(e){
                    that.selTableIds = ids;
                    if(that.mousePos.x==""){that.mousePos.x = e.offsetX}
                    if(that.mousePos.y==""){that.mousePos.y = e.offsetY}
                    that.boxNowPos.x = ids.get(0).offsetLeft;
                    that.boxNowPos.y = ids.get(0).offsetTop;
                },
                "mousemove" : function(e){
                    if(that.selTableIds==""){return false;}


                    if(that.moveX){
                        that.boxNowPos.x += e.offsetX - that.mousePos.x;
                        if(that.boxNowPos.x>0){that.boxNowPos.x = 0;}
                        if(that.boxNowPos.x<=(ids.parent().width() - ids.width())){that.boxNowPos.x = ids.parent().width() - ids.width();}
                        that.selTableIds.css({ left : that.boxNowPos.x });
                    }
//                    if(that.moveY){
//                        that.boxNowPos.y += e.offsetY - that.mousePos.y;
//                        that.selTableIds.css({ top : that.boxNowPos.y });
//                    }
                },
                "mouseup" : function(){
                    that.selTableIds = "";
                    that.mousePos = {x:"",y:""};
                    that.boxNowPos = {x:0,y:0};
                },
                "mouseout" : function(){
                    that.selTableIds = "";
                    that.mousePos = {x:"",y:""};
                    that.boxNowPos = {x:0,y:0};
                }
            })
        }
    }

    var tab1 = new moveTable();
    var tab2 = new moveTable();
    var tab3 = new moveTable();



    $(document).ready(function(){
        public.createLeftNavi(leftNavCode);
        public.filtrateCondition($(".filtrationResultOutBox"),shaixuan);
        tab1.start($(".t1c"));
        tab2.start($(".t2c"));
        tab3.start($(".t3c"));

        var c1data = [
            {
                name : 'DPS01A',
                value:[45,52,54,74,90,84],
                color:'#1385a5'
            },
            {
                name : 'DPS01B',
                value:[60,80,105,125,108,120],
                color:'#c56966'
            }
        ];

        var c2data = [
            {
                name : '',
                value:[45,55,65,35],
                color:'#47b2c8'
            },
            {
                name : '',
                value:[60,30,50,70],
                color:'#db6086'
            }
        ]

        var c3data = [
            {name : 'WinXP',value : 29,color:'#3883bd'},
            {name : 'WinXP',value : 29,color:'#3883bd'},
            {name : 'WinXP',value : 11,color:'#3883bd'},
            {name : 'Win7',value : 31,color:'#3F5C71'}
        ];

        new iChart.ColumnMulti2D({
            render : 'chart1',
            data: c1data,
            border : false,
            legend: false,
            coordinate : {
                border : true,
                axis: {
                    width: [ 0, 0, 1, 0]
                },
                scale:[{
                    position:'left',
                    scale_share:1,
                    scale_color: "#ffffff"
                }]

            },
            width : 290,
            height : 270,
            labels : ["","","",""]
        }).draw();

        new iChart.BarMulti2D({
            render : 'chart2',
            data: c2data,
            border : false,
            legend: false,
            coordinate : {
                border : true,
                axis: {
                    width: [ 0, 0, 1, 1]
                },
                scale:[{
                    position:'bottom',
                    scale_share:1,
                    scale_color: "#ffffff"
                }]

            },
            width : 290,
            height : 270,
            labels : ["","","",""]
        }).draw();

        new iChart.Pie2D({
            render : 'chart3',
            data: c3data,
            align: "center",
            border : false,
            coordinate: {
                axis: {
                    enable: false
                }
            },
            legend: {
                enable: false
            },
            sub_option : {
                border: {
                    enable: false
                },
                label: {
                    border: {
                        enable: false
                    },
                    color: "#ffffff",
                    background_color: "#ffffff",
                    line_thickness: 0,
                    sign_size: 0
                }
            },
            width : 290,
            height : 270
        }).draw();


    });

})();