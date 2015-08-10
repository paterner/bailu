(function(){
    var mainNavTime = "";
    var size = "";
    var leftMenu = "";

    var createRightNaviBar = function(displayTag){
        var code = {
            find: "<div class='FRBchip' id='chazhao'></div>",
            edit: "<div class='FRBchip' id='xiugai'></div>",
            save: "<div class='FRBchip' id='baocun'></div>",
            urgent: "<div class='FRBchip' id='jiaji'></div>",
            alert: "<div class='FRBchip' id='baojing'></div>",
            pause: "<div class='FRBchip' id='zanting'></div>",
            authorize: "<div class='FRBchip' id='shouquan'></div>",
            restart: "<div class='FRBchip' id='chongqi'></div>",
            archive: "<div class='FRBchip' id='guidang'></div>",
            discuss: "<div class='FRBchip' id='taolun'></div>",
            comment: "<div class='FRBchip' id='pinglun'></div>"
        };
        var res = "<div class='fixedRightTools'>";
        for(var x in code){
            for(var i= 0,imax=displayTag.length;i<imax;i++){
                if(displayTag[i] == "all"){
                    res += code[x];
                    break;
                }else if(displayTag[i]==x){
                    res += code[x];
                    break;
                }
            }
        }
        res += "</div>";
        $(".fixedRightTools").remove();
        $("body").append(res);
        $(".fixedRightTools").css({
            "margin-top" : "-"+$(".fixedRightTools").height()/2+"px"
        })

    }

    var textColour = function(d,key){
        for(var i= 0,imax= key.length; i<imax; i++){
            d = d.replace(key[i],"<span class='public_logBox_chip_title_zhuose_red'>"+key[i]+"</span>")
        }
        return d;
    }

    var createPublicSearchBox = function(filter,d){
        var code = "<div class='public_searchBox'>"+
                        "<div class='public_searchBoxTitle'>"+
                            "<span class='public_searchBox_titleTEXT public_searchBox_titleMian'>查找</span>"+
                            "<span class='public_searchBox_titleTEXT public_searchBox_titleChild'>"+ d.title+"</span>"+
                            "<div class='public_searchBox_titleBtn public_searchBox_close'><span class='fa fa-close'></span></div>"+
                            "<div class='public_searchBox_titleBtn public_searchBox_min'><span class='fa fa-minus'></span></div>"+
                        "</div>"+
                        "<div class='public_searchBoxContent'>"+
                            "<div class='public_searchBox_timeBox'>"+
                                "<div class='public_searchBox_timeBox_title'>设定时间:</div>"+
                                "<div class='public_searchBox_timeBox_content'>"+
                                    "<span>"+ d.startdate+"</span>至 <span>"+ d.enddate+"</span>"+
                                "</div>"+
                            "</div>"+
                            "<div class='public_searchBox_filterBox public_searchBox_filterBox_1'>"+
                                "<div class='public_searchBox_filterBox_1_title'>关联人:</div>"+
                                "<div class='public_searchBox_filterBox_1_content'>";
        for(var i= 0,imax = filter.linkUser.length;i<imax;i++){
            code += "<div class='public_searchBox_filterBox_radio"+(filter.linkUser[i].checked==1?" public_searchBox_filterBox_radio_checked" : "")+"' id='"+filter.linkUser[i].key+"'>"+filter.linkUser[i].title+"</div>";
        }
        code += "</div></div><div class='public_searchBox_timeBox public_searchBox_keyBox'>"+
                    "<div class='public_searchBox_keyBox_title'>关键字:</div>"+
                    "<div class='public_searchBox_keyBox_content'>"+
                        "<input type='text' class='public_searchBox_keyBox_content_input' value='"+(d!=undefined? d.key[0]:"")+"'/>"+
                        "<span class='fa fa-search'></span>"+
                    "</div>"+
                "</div>"+
                "<div class='public_searchBox_filterBox public_searchBox_filterBox_2'>"+
                    "<div class='public_searchBox_filterBox_2_title'>文件类型:</div>"+
                    "<div class='public_searchBox_filterBox_2_content'>";
        for(var i= 0,imax = filter.fileType.length;i<imax;i++){
            code += "<div class='public_searchBox_filterBox_radio"+(filter.fileType[i].checked==1?" public_searchBox_filterBox_radio_checked" : "")+"' id='"+filter.fileType[i].key+"'>"+filter.fileType[i].title+"</div>";
        }
        code += "</div></div><div class='public_searchBox_filterBox public_searchBox_filterBox_3'>"+
                    "<div class='public_searchBox_filterBox_3_title'>成果类型:</div>"+
                    "<div class='public_searchBox_filterBox_3_content'>";
        for(var i= 0,imax = filter.resultType.length;i<imax;i++){
            code += "<div class='public_searchBox_filterBox_radio"+(filter.resultType[i].checked==1?" public_searchBox_filterBox_radio_checked" : "")+"' id='"+filter.resultType[i].key+"'>"+filter.resultType[i].title+"</div>";
        }
        code += "</div></div><div class='public_logBox'>";
        if(d!=undefined){
            for(var i= 0,imax= d.result.length; i<imax;i++){
                code += "<div class='public_logBox_chip'>"+
                            "<div class='public_logBox_chip_title'>"+
                                "<span class='public_logBox_chip_title_time'>"+ d.result[i].data+"</span>--"+
                                "<span class='public_logBox_chip_title_item'>"+ d.result[i].item+"</span>--"+
                                "<span class='public_logBox_chip_title_class'>"+ d.result[i].sub+"</span>--"+
                                "<span class='public_logBox_chip_title_name'>"+ textColour(d.result[i].name, d.key)+"</span>"+
                            "</div>"+
                            "<div class='public_logBox_chip_content'>"+
                                "<div class='public_logBox_chip_content_chip public_logBox_chip_content_1'>上传人: <span>"+ d.result[i].upuser+"</span></div>"+
                                "<div class='public_logBox_chip_content_chip public_logBox_chip_content_2'>上传时间: <span>"+ d.result[i].update+"</span></div>"+
                                "<div class='public_logBox_chip_content_chip public_logBox_chip_content_3'>最后更新人: <span>"+ d.result[i].enduser+"</span></div>"+
                                "<div class='public_logBox_chip_content_chip public_logBox_chip_content_4'>最后更新时间: <span>"+ d.result[i].enddate+"</span></div>"+
                                "<div class='public_logBox_chip_content_chip public_logBox_chip_content_5'>"+ d.result[i].look+"</div>"+
                                "<div class='public_logBox_chip_content_chip public_logBox_chip_content_6'>"+ d.result[i].download+"</div>"+
                            "</div>"+
                        "</div>"
            }
        }
        code += "</div></div>"+
                 "<span class='public_searchBox_footer'>没找到?去<span>高级搜索</span></span>"
                "</div>";
        $(".public_searchBox").remove()
        $("body").append(code);
    }

    var createLeftNavi = function(d){
        leftMenu = d;
        var code = "";
        for(var i= 0,imax= d.length;i<imax;i++){
            code += "<div class='ln_btn"+(i==imax-1?" ln_btn_end":"")+"' id='"+d[i].id+"' alt='"+i+"'>"+
                        "<div class='l_icon l_icon_style"+(i%3)+"' style='background-position: 0 "+d[i].pos+"px;' ></div>"+
                        "<div class='r_info'>"+d[i].title+"</div>"+
                    "</div>";
            if(d[i].child!=undefined){
                for(var j= 0,jmax=d[i].child.length;j<jmax;j++){
                    code += "<div class='ln_btn_child "+d[i].id+"' id='"+d[i].child[j].tag+"'>"+
                            "<div class='l_icon_child l_icon_style"+(j%3)+"'><span class='fa fa-angle-right fa-lg'></span></div>"+
                            "<div class='r_info_child'>"+d[i].child[j].title+"</div>"+
                        "</div>";
                }
            }
        }
        $(".leftNav").html(code);
    }

    var filtrateCondition = function(id,d){

        var code =  "<div class='filtrationResult'>"+
            "<li class='filtrationTitle'>筛选结果:</li>"+
//                        "<li class='filtrationChip'>今日需完成<span class='fa fa-close selected_filtrationChip'></span></li>"+
//                        "<li class='filtrationChip'>个人计划的<span class='fa fa-close'></span></li>"+
            "<div class='filtrationSubmit'>保存结果</div>"+
            "</div>"+
            "<div class='conditionBox'>";
        for(var i= 0,imax= d.length;i<imax;i++){
            code += "<div class='conditionBoxChip conditionBoxChipStyle"+(i%2==0?"1":"2")+(i==3?" conditionBoxChipEnd" :"")+"'><li class='conditionBoxChipTitle'>"+d[i].title+":</li>";
            for(var k= 0,kmax= d[i].child.length;k<kmax;k++){
                code += "<li class='conditionBoxChipOne' id='"+d[i].child[k].key+"'>"+d[i].child[k].title+"</li>";
            }
            code += "<div class='add'><span class='fa fa-plus'></span></div></div>";
        }
        code += "<div class='upAndDownBtn'></div></div>";
        id.html(code);
    }

    $(document)
        .on("mouseover", ".ln_btn", function(){
            var d = leftMenu[$(this).attr("alt")];
            $(this).children(".l_icon").css({
                "background-position" : "-54px "+d.pos+"px"
            })
        })

        .on("mouseout", ".ln_btn", function(){
            var d = leftMenu[$(this).attr("alt")];
            if($(this).attr("class").indexOf("ln_btn_clicked")<0){
                $(this).children(".l_icon").css({
                    "background-position" : "0 "+d.pos+"px"
                })
            }
        })

        .on("click", ".ln_btn", function(){
            var d = leftMenu[$(this).attr("alt")];
            $(".ln_btn_clicked").children(".l_icon").css({
                "background-position" : "0 "+d.pos+"px"
            })
            $(".ln_btn_clicked").removeClass("ln_btn_clicked");

            $(this).addClass("ln_btn_clicked");
            $(this).children(".l_icon").css({
                "background-position" : "-54px "+d.pos+"px"
            });
            $(".ln_btn_child").stop();
            $(".ln_btn_child").css({height:0})
            $("."+ d.id).animate(
                {height : 40},
                400,
                "swing"
            )
        })

        .on("click", ".ln_btn_child", function(){
            $(".ln_btn_child_clicked").removeClass("ln_btn_child_clicked");
            $(this).addClass("ln_btn_child_clicked");
        })

        .on("mouseover", ".ln_btn_child", function(){
            clearTimeout(mainNavTime);
            $(".now_this").css({opacity:0}).eq($(this).index()).css({opacity:1});
        })

        .on("click", ".ln_btn_child", function(){
            $(".now_this").css({opacity:0}).eq($(this).index()).css({opacity:1});
            for(var i= 0,imax=$(".btn").length;i<imax;i++){
                var id = $(".btn").eq(i);
                id.removeClass(id.attr("id")+"_clicked");
            }
            $(this).addClass($(this).attr("id")+"_clicked");
        })

        .on("mouseout", ".ln_btn_child", function(){
            mainNavTime = setTimeout(function(){
                $(".now_this").css({opacity:0});
                var id = $(".btn");
                for(var i= 0,imax=id.length;i<imax;i++){
                    if(id.eq(i).attr("class").indexOf("_clicked")>0){
                        $(".now_this").eq(i).css({opacity:1});
                    }
                }
            },100);
        })

        .on("click", ".public_searchBox_filterBox_radio", function(){
            if($(this).attr("class").indexOf("public_searchBox_filterBox_radio_checked")<0){
                $(this).addClass("public_searchBox_filterBox_radio_checked");
            }else{
                $(this).removeClass("public_searchBox_filterBox_radio_checked");
            }
        })

        .on("click", ".public_searchBox_close,.public_searchBox_min", function(){
            $(".public_searchBox").remove();
        })

        .on("click", "#chazhao", function(){
            createPublicSearchBox(publicSearchBoxFilterData,publicSearchBoxData);
        })

        .on("click",".conditionBoxChipOne",function(){
            var d = {
                title : $(this).text(),
                id : "selected_"+$(this).attr("id")
            }
            //            console.log($("#"+d.id).length)
            if($("#"+d.id).length>0){
                $("#"+ d.id).remove();
            }else{
                var code = "<li class='filtrationChip' id='"+d.id+"'>"+ d.title+"<span class='fa fa-close selected_filtrationChip'></span></li>";
                if($(".filtrationChip").length>0){
                    $(".filtrationChip").eq($(".filtrationChip").length-1).after(code);
                }else{
                    $(".filtrationTitle").after(code);
                }

            }
        })

        .on("click",".selected_filtrationChip",function(){
            $(this).parent().remove();
        })






    $(document).ready(function(){

    });

    return public = {
        createRightNaviBar : createRightNaviBar,
        createLeftNavi : createLeftNavi,
        filtrateCondition : filtrateCondition
    }
})();