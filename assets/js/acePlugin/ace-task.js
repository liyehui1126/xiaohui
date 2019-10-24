/**
 * Created by nntk on 2017/11/11.
 * version:201711131002
 */

(function ($) {

    var settings;
    var isRun = false;
    var methods = {
        start: function () {

            if (isRun) {
                return;

            }
            var _this = this;

            var tmpl = "<li name='myTaskName' id='taskId'>\n" +
                "                                    <a href=\"#\">\n" +
                "                                        <div class=\"clearfix\">\n" +
                "                                            <span class=\"pull-left\">taskName</span>\n" +
                "                                            <span class=\"pull-right\">myProgress%</span>\n" +
                "                                        </div>\n" +
                "\n" +
                "                                        <div class=\"progress progress-mini\">\n" +
                "                                            <div style=\"width:myProgress1%\" class=\"progress-bar\"></div>\n" +
                "                                        </div>\n" +
                "                                    </a>\n" +
                "                                </li>";

            var old = [];

            _this.everyTime(settings.time, 'D', function () {

                XAJA(settings.url).success(function (data) {

                    //清空数组
                    old = [];
                    _this.find(".badge-grey").html(data.length);

                    if (data.length == 0) {

                        _this.find(".dropdown-content .dropdown-menu").empty();
                        //停止掉定时器
                        isRun = false;
                        _this.stopTime('D');


                    } else {


                        $(data).each(function (index, item) {
                            old.push(item.id);
                            //查看是否含有任务
                            var is = _this.find("li[id=" + item.id + "]");

                            var progress = parseInt(item.progress * 100);

                            if (is.length == 1) {
                                // 已经存在，只需要修改值即可

                                is.find(".pull-right").html(progress + "%");
                                is.find(".progress-bar").css("width", progress + "%");


                            } else {
                                var cp = new Object();
                                cp = tmpl;
                                cp = cp.replace("taskName", item.name);
                                cp = cp.replace("myProgress", progress);
                                cp = cp.replace("myProgress1", progress);
                                cp = cp.replace("taskId", item.id);
                                cp = cp.replace("myTaskName", item.name);


                                _this.find(".dropdown-content .dropdown-menu").append(cp);
                            }


                        });

                        //遍历old，清空那些不见了的任务
                        //找出当前的数据
                        $(_this.find(".dropdown-content  li")).each(function (index, obj) {
                            var id = $.inArray(parseInt($(obj).attr("id")), old);

                            if (id == -1) {
                                //删掉
                                $(obj).remove();

                            }

                        });


                    }


                }).get();

            }, 0, true);

            isRun = true;

        },

        stop: function () {
            var _this = this;
            isRun = false;
            _this.stopTime('D');
        },


        init: function (options) {
            var _this = this;

            settings = $.extend({
                url: '../../getProgress',
                time: 5
            }, options);


        }
    };

    $.fn.aceTask = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
    };
})(jQuery);