/**
 * Created by hhm on 2018/7/11.
 */
window.AVRGlobal = {
    apiUrl: 'http://localhost:8081/api',
    socketUrl: "ws://localhost:8081/api/webSocket"


}


window.xaja = function (url) {
    return new _xaja(url);
}


function _xaja(url) {
    this.url = url;
}

xaja_config = {
    headerToken: null,
    baseAPI: 'http://localhost:8081/api',
    successKey: "code",
    successValue: 0,

    setGlobalToken: function () {
        var token = CookieUtils.getcookie("token");
        $.ajaxSetup({
            headers: {'Authorization': token},
        });
        return this;
    },

    //默认成功的回调方法
    successTipPlugin: function (ret) {
        console.info(ret);
    },

    //默认不成功的回调方法
    unSuccessTipPlugin: function (ret) {
        console.info(ret);
        swal(
            '执行结果',
            ret.msg,
            'error'
        )
    },

    //默认执行的错误回调方法
    errorTipPlugin: function (xhr) {
        console.info(xhr);


    },

    //默认before之前做的事
    beforePlugin: function () {
    },
    //默认after之前做的事
    afterPlugin: function () {
    },


    do401Plugin: function () {
        //调回到主页等
        if (window.parent) {
            parent.location.replace("login.html")
        } else {
            window.location.replace("login.html")

        }

    },

    isDo401: true,


    confirmPlugin: function (obj, callback) {
        swal({
            title: '操作提示',
            text: obj && obj.hasOwnProperty("title") ? obj.title : "确定执行该操作吗？",
            type: obj && obj.hasOwnProperty("type") ? obj.type : "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "取消",
            confirmButtonText: '是的，确定执行！'
        }).then(function () {
            callback();
        }, function () {

        })
    }
}

_xaja.prototype = {
    //传入参数
    data: function (data) {
        this._data = data;
        return this;
    },

    //传入参数，装成formData
    formData: function (data) {
        var formData = new FormData();
        //遍历对象
        for (var Key in data) {
            formData.append(Key, data[Key]);
        }
        this._formData = formData;
        return this;
    },


    xWWWFormUrlencoded: function () {
        this._xWWWFormUrlencoded = true;
        return this;

    },


    //请求后执行的函数（例如隐藏进度条什么的）
    after: function (callback) {
        this.afterFUN = callback;
        return this;
    },

    before: function (callback) {
        this.beforeFUN = callback;
        return this;
    },

    doBefore: function () {

        if (this.beforeFUN) {
            this.beforeFUN()
        } else {
            if (!this._noUseAB) {
                xaja_config.beforePlugin();
            }
        }
    },
    //成功时执行的函数
    success: function (callback) {
        this.successFUN = callback;
        return this;
    },
    //成功时返回所有数据
    success2: function (callback) {
        this.successFUN2 = callback;
        return this;
    },

    unifyHandle: function (callback) {
        this.unifyHandleFUN = callback;
        return this;
    },

    //一切除了成功之外的任何客户不愿想看到的处理
    doUnifyHandle: function (ret) {
        if (this.unifyHandleFUN) {
            this.isDoUnifyHandle = true;
            this.unifyHandleFUN(ret);
        }
    },
    //正常处理（返回code即可）
    doSuccess: function (ret) {

        if (ret[xaja_config.successKey] == xaja_config.successValue) {
            //操作成功
            if (this.successFUN2) {
                if (ret) {
                    this.successFUN2(ret)
                }
                return;
            }
            if (this.successFUN) {
                //执行用户自定义方法
                if (ret.data) {
                    this.successFUN(ret.data)
                } else {
                    this.successFUN(ret.info);
                }
            } else {
                // 执行默认方法
                xaja_config.successTipPlugin(ret);
            }

            if (this.afterSuccessFUN) {
                this.afterSuccessFUN(ret);

            } else {
                //执行配置方法(很少用到，就拿最后关闭加载提示框而已，每个页面可能都不一样，不过可在特定页面自定义配置)
            }
        } else {
            //操作非成功
            this.doUnifyHandle(ret);
            //先看看是否开启了统一处理
            if (this.isDoUnifyHandle) {
                return;
            }
            if (this.unSuccessFUN) {
                //执行用户自定义方法
                this.unSuccessFUN(ret)
            } else {
                xaja_config.unSuccessTipPlugin(ret);
            }
        }
    },


    //统一请求错误的处理
    error: function (callback) {

        this.errorFUN = callback;
        return this;

    },


    //异常处理
    doError: function (xhr) {

        if (xaja_config.isDo401 == true) {
            //优先处理401(该地方设计页面跳转)
            if (xhr.status == 401) {
                xaja_config.do401Plugin(xhr);
                return;
            }
        }


        //先看看是够客户端已经开启了统一处理
        this.doUnifyHandle(xhr);
        //先看看是否已经开启了统一处理
        if (this.isDoUnifyHandle) {
            return;
        }

        if (this.errorFUN) {
            this.errorFUN(xhr);
        } else {
            xaja_config.errorTipPlugin(xhr);
        }


    },


    doComplete: function () {
        if (this.afterFUN) {
            this.afterFUN();
        } else {
            if (!this._noUseAB) {
                xaja_config.afterPlugin();
            }
        }
    },


    confirm: function (obj) {
        this.confirmFUN = true;
        if (obj) {
            this.confirmObj = obj;
        }
        return this;
    },

    get: function () {

        var _this = this;


        if (_this.confirmFUN) {
            //弹出确认框
            xaja_config.confirmPlugin(_this.confirmObj, function () {
                _this.doByType("GET", _this)

            })
        } else {
            _this.doByType("GET", _this)

        }


    },


    post: function () {

        var _this = this;


        if (_this.confirmFUN) {
            //弹出确认框
            xaja_config.confirmPlugin(_this.confirmObj, function () {
                _this.doByType("POST", _this)

            })
        } else {
            _this.doByType("POST", _this)

        }


    },


    doByType: function (type, _this) {


        var contentType = this._formData ? false : "application/json; charset=utf-8";
        if (this._xWWWFormUrlencoded) {
            contentType = "application/x-www-form-urlencoded; charset=UTF-8";
        }


        var data;

        if (this._data) {
            data = this._data
        } else if (this._formData) {
            data = this._formData
        }
        $.ajax({
            beforeSend: this.doBefore(),

            url: xaja_config.baseAPI + this.url,

            type: type,
            // async: true,
            data: data,
            //processData: false,
            contentType: contentType,
            dataType: "json",
            // crossDomain: true,
            // xhrFields: {
            //     withCredentials: true
            // },
            success: function (result) {
                _this.doSuccess(result);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                _this.doError(XMLHttpRequest);
            },
            complete: function () {
                _this.doComplete();
            }
        });
    },


   form: function ($form) {
        var _this = this;

        $.ajax({
            beforeSend: this.doBefore(),
            url: xaja_config.baseAPI + this.url,
            type: "POST",
            data: $($form).serialize(),
            dataType: "json",
            success: function (result) {
                _this.doSuccess(result);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                _this.doError(XMLHttpRequest);
            },
            complete: function () {
                _this.doComplete();
            }
        });

    }


}


CookieUtils = {

    getcookie: function (objname) {
        //获取指定名称的cookie的值
        var arrstr = document.cookie.split("; ");
        for (var i = 0; i < arrstr.length; i++) {
            var temp = arrstr[i].split("=");
            if (temp[0] == objname) return unescape(temp[1]);
        }
    }

}


TimeUtils = {

    parseMS: function (ms) {
        var s = Math.round(ms / 1000);


        return Math.round(s / 60) + "分" + (s - Math.floor(s / 60) * 60) + "秒";

    },


    getDateDiff: function (dateTimeStamp) {
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var halfamonth = day * 15;
        var month = day * 30;
        var now = new Date().getTime();
        var diffValue = now - dateTimeStamp;
        if (diffValue < 0) {
            return;
        }
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;
        if (monthC >= 1) {
            result = "" + parseInt(monthC) + "月前";
        }
        else if (weekC >= 1) {
            result = "" + parseInt(weekC) + "周前";
        }
        else if (dayC >= 1) {
            result = "" + parseInt(dayC) + "天前";
        }
        else if (hourC >= 1) {
            result = "" + parseInt(hourC) + "小时前";
        }
        else if (minC >= 1) {
            result = "" + parseInt(minC) + "分钟前";
        } else
            result = "刚刚";
        return result;
    }


}


window.FormUtils = function ($form) {
    return new _FormUtils($form);
}


function _FormUtils($form) {
    this.$form = $form;

}

_FormUtils.prototype = {
    exclude: function () {

        this.excludeProp = arguments;


        return this;


    },
    autoLoadHTMLById: function (data) {
        var _this = this;
        for (var Key in data) {
            if (!$.inArray(Key, _this.excludeProp)) {
                continue;

            } else {
                $("#" + Key).html(data[Key]);

            }

        }

    },
    autoLoadByName: function (data) {
        var _this = this;

        for (var Key in data) {
            if (!$.inArray(Key, _this.excludeProp)) {
                continue;

            } else {
                $("[name='" + Key + "']", _this.$form).val(data[Key]);

            }

        }

    }

}


$.fn.serializeJson = function () {
    var serializeObj = {};
    var array = this.serializeArray();
    var str = this.serialize();
    $(array).each(function () {
        if (serializeObj[this.name]) {
            if ($.isArray(serializeObj[this.name])) {
                serializeObj[this.name].push(this.value);
            } else {
                serializeObj[this.name] = [serializeObj[this.name], this.value];
            }
        } else {
            serializeObj[this.name] = this.value;
        }
    });
    return serializeObj;
};
//扩展这个serializeArray，让其支持得到未选择的checkbox
$.fn.serializeAll = function () {

    var formObj = this.serializeArray();
    formObj = formObj.concat(
        jQuery('input[type=checkbox]:not(:checked)', this).map(
            function () {
                return {
                    "name": this.name,
                    "value": "0"
                }
            }).get()
    );
    return formObj;
};