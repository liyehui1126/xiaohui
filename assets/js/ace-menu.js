(function ($, window) {

    $.fn.acemenu = function (options) {
        // 默认参数

        var defaults = {
            //绑定对应展示的TabID
            menuTabID: "",
            //数据对象数据格式 title、icon、url、children[]
            data: null
        };
        //为了给自定义方法用
        var _self = $(this);
        _self.addClass("nav").addClass("nav-list");
        // 插件配置
        var opt = $.extend(defaults, options);


        var _init = function (target, data) {
            $.each(data, function (i, item) {
                var li = $("<li></li>");
                var a = $("<a></a>");
                var i = $("<i></i>");
                var span = $("<span></span>");
                target.append(li);
                if (item.children && item.children.length > 0) {
                    li.append(a);
                    //li.addClass("active").addClass("open");
                    if (target.hasClass("nav") && target.hasClass("nav-list")) {
                        //是第一级菜单
                    } else {
                        //是子菜单
                        a.append("<i class=\"fa fa-caret-right\"></i>")
                    }
                    a.addClass("dropdown-toggle");
                    if (item.url == "") {
                        a.attr("href", "javascript:ovid(0);");
                    } else {
                        a.attr("href", item.url).addClass("tabli");
                    }
                    a.append(i);
                    i.addClass(item.icon);
                    a.append(span);
                    span.addClass("menu-text").text(item.title);
                    var b = $("<b></b>");
                    b.addClass("arrow").addClass("fa fa-angle-down");
                    a.append(b);
                    var ul = $("<ul></ul>");
                    ul.addClass("submenu");
                    li.append(ul);
                    _init(ul, item.children);
                } else {
                    li.append(a);
                    if (item.url == "") {
                        a.attr("href", "javascript:void(0);");
                    } else {
                        a.attr("href", item.url).addClass("tabli");
                    }

                    if (target.hasClass("nav") && target.hasClass("nav-list")) {
                        //是第一级菜单
                    } else {
                        //是子菜单
                       // a.append("<i class=\"fa fa-caret-right\"></i>")
                    }
                    a.append(i);
                    i.addClass(item.icon);
                    a.append(span);
                    span.addClass("menu-text").text(item.title);
                }

            });
        }
        if (opt.data) {
            _init(_self, opt.data);
            //事件处理
            $(_self).find(".dropdown-toggle").bind("click", function () {
                $.each($(_self).find(".dropdown-toggle"), function () {
                    //设置打开一个，再点击可以隐藏
                    // $(this).next().hide();
                });

                //$(this).next().animate({
                //    height: 'toggle'
                //});
            });
            //打开第一个
            $(_self).find(".dropdown-toggle").first().next().animate({
                height: 'toggle'
            });
            $(_self).find(".dropdown-toggle").first().next().find("li").first().addClass("active");
            var tabA = $(_self).find(".tabli").first();


            //打开cookie记录下来的tab
            var icon = $.cookie("icon");
            var title = $.cookie("title");
            var url = $.cookie("url");
            if (title && url) {
                // $("#" + opt.menuTabID).aceaddtab({
                //     icon: icon,
                //     title: title,
                //     url: url
                // });
            }

            $("#" + opt.menuTabID).aceaddtab({
                icon: tabA.find("i").last().attr("class"),
                title: tabA.find("span").first().text(),
                url: tabA.attr("href")
            });


            //打开Tab
            $(_self).find(".tabli").bind("click", function () {
                $.each($(_self).find(".tabli"), function () {
                    $(this).parent().removeClass("active");
                })
                $(this).parent().addClass("active");


                var icon = $(this).find("i").last().attr("class");
                var title = $(this).find("span").first().text();
                var url = $(this).attr("href");

                $("#" + opt.menuTabID).aceaddtab({
                    icon: icon,
                    title: title,
                    url: url
                });

                $.cookie("icon", icon);
                $.cookie("title", title);
                $.cookie("url", url);


                return false;
            });
        }
        //-----------------------


        return this;

    }
})(jQuery, window);