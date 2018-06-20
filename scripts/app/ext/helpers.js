var maps, D, strings, errors, setting,
    operators = {
        eq: function(r, l) { return r === l; },
        gt: function(r, l) { return r > l; },
        lt: function(r, l) { return r < l; },
        ge: function(r, l) { return r >= l; },
        le: function(r, l) { return r <= l; },
        ne: function(r, l) { return r !== l; }
    },
    toDateString = function(value) {
        var d, year, month, date;
        d = new Date(value);
        year = d.getFullYear() + '';
        month = (d.getMonth() + 1) + '';
        date = d.getDate() + '';
        month = month.length === 1 ? '0' + month : month;
        date = date.length === 1 ? '0' + date : date;
        return [year, month, date].join('-');
    },
    toTimeString = function(value, unit) {
        var d, hour, min, sec;
        d = new Date(value);
        hour = d.getHours() + '';
        min = d.getMinutes() + '';
        sec = d.getSeconds() + '';
        hour = hour.length === 1 ? '0' + hour : hour;
        min = min.length === 1 ? '0' + min : min;
        sec = sec.length === 1 ? '0' + sec : sec;
        if (unit === 'minute') {
            return [hour, min].join(':');
        }
        return [hour, min, sec].join(':');
    };

maps = require('./maps');
D = require('drizzlejs');
strings = require('./strings');
errors = require('./errors');
setting = require('./setting');

module.exports = {
    pick: function(val, def) {
        if (val !== 0 && !val) {
            return def;
        }
        return val;
    },

    module: function(options) {
        return (this.Self instanceof D.Module) ? options.fn(this) : '';
    },

    view: function(name, options) {
        return (this.Self instanceof D.View) && this.Self.name === name ? options.fn(this) : '';
    },

    map: function(type, value) {
        var o = maps[type];
        return o[value] || '';
    },

    compare: function(value, op, rvalue, options) {
        return operators[op](value, rvalue) ? options.fn(this) : options.inverse(this);
    },

    date: function(value) {
        var v = value;
        if (!v) return '';
        // 如果不是数值，那么就是已经格式化好的字符串
        if (isNaN(new Date(v).getTime())) v = v.replace && v.replace(/-/g, '/');
        // modify by weicb 2017-05-15 兼容IE、fireFox处理
        v = Number(new Date(v).getTime());
        return toDateString(v);
    },
    dateToTimeMillis: function(value) {
        var v = value;
        // if (v === undefined) return undefined;
        if (!v) return 0;
        // 如果不是数值，那么就是已经格式化好的字符串
        // modify by weicb 2017-05-15 兼容IE、fireFox处理
        if (!isNaN(new Date(v).getTime())) return new Date(v).getTime();
        return new Date(v.replace(/-/g, '/')).getTime();
    },
    dateTime: function(value) {
        var v = value;
        if (!v) return '';
        if (isNaN(new Date(v).getTime())) v = v.replace && v.replace(/-/g, '/');
        v = Number(new Date(v).getTime());
        return toDateString(v) + ' ' + toTimeString(v);
    },

    dateTimeDefault: function(value, def) {
        var v = value;
        if (!v && def) return def;
        if (!v) return '';
        if (isNaN(new Date(v).getTime())) v = v.replace && v.replace(/-/g, '/');
        v = Number(new Date(v).getTime());
        return toDateString(v) + ' ' + toTimeString(v);
    },

    dateMinute: function(value) {
        var v = value;
        if (!v) return '';
        if (isNaN(new Date(v).getTime())) v = v.replace && v.replace(/-/g, '/');
        v = Number(new Date(v).getTime());
        return toDateString(v) + ' ' + toTimeString(v, 'minute');
    },
    // 秒转化成 时分秒
    secondToDate: function(result) {
        var h = Math.floor(result / 3600) ? Math.floor(result / 3600) + ' 时 ' : '';
        var m = Math.floor((result / 60) % 60) ? Math.floor((result / 60) % 60) + ' 分 ' : '';
        var s = Math.floor((result % 60));
        return h + m + s + ' 秒';
    },
    setting: function(key) {
        return setting.get(key);
    },

    string: function(key) {
        return strings.get(key);
    },
    errors: function(code) {
        errors.get(code);
    },
    calc: function(number1, expr, number2) {
        var a = parseFloat(number1);
        var b = parseFloat(number2);
        switch (expr) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return a / b;
        default:
            break;
        }
        return 0;
    },

    restoreNumber: function(value, n) {
        if (value && n) return value / n;
        return value / 100;
    },
    // 数字保留n位小数点的时候
    restoreNumberFixed: function(val, m, n) {
        var value;
        if (!val) return '-';
        if (val && n && m) {
            value = (val / m) + '';
            return value.indexOf('.') > 0 ? Number(value).toFixed(n) : Number(value);
        }
        value = (val / 100) + '';
        return value.indexOf('.') > 0 ? Number(value).toFixed(2) : Number(value);
    },
    isGrant: function(operatorType, organizationId, options) {
        var view = options.data.root.Self,
            grants,
            types;

        if (!view) return '';

        grants = view.module.store.models.Grants;
        if (!grants || !grants.data) return '';

        grants = grants.data;

        if (!organizationId) {
            if (Object.keys(grants).some(function(k) {
                if (grants[k].indexOf(operatorType) !== -1) return true;
                return false;
            })) {
                return options.fn(this);
            }
        }

        types = grants[organizationId];
        if (types && types.indexOf(operatorType) !== -1) {
            return options.fn(this);
        }
        return '';
    },

    times: function() {
        var fn,
            ret = [],
            i,
            count = 1,
            start,
            end,
            options;
        if (arguments.length === 2) {
            start = 0;
            end = arguments[0];
            options = arguments[1];
        } else {
            start = arguments[0];
            end = arguments[1];
            options = arguments[2];
        }
        fn = options.fn;

        function execIteration (index) {
            ret.push(fn({ count: count, index: index }));
            count++;
        }
        for (i = start; i < end; i++) {
            execIteration(i);
        }
        return ret.join('');
    },
    inner: function(data, key, options) {
        var fn = options.fn,
            ret;
        ret = fn(data[key]);
        return ret;
    },
    downloadUrl: function(fileId) {
        var Self = arguments[arguments.length - 1].data.root.Self,
            token = Self.app.global.OAuth.token.access_token,
            rootPath = Self.app.options.urlRoot,
            url = rootPath + '/human/file/download?id=' + fileId + '&access_token=' + token;
        return fileId && url;
    },
    // 修改样式 keeley
    secondToMinute: function(time) {
        var parseInt = window.parseInt;
        var second = time;
        var min = 0; // 分
        var hour = 0; // 小时
        var supple = function(str) {
            if (str <= 9) return '0' + str;
            return str;
        };
        if (!time) return '-';
        if (time >= 60) {
            second = parseInt(time % 60);
            min = parseInt(time / 60);
            if (min >= 60) {
                min = parseInt(time / 60) % 60;
                hour = parseInt(parseInt(time / 60) / 60);
            }
        }
        return supple(hour) + ':' + supple(min) + ':' + supple(second);
    },
    // 根据数据权限配置来决定新建岗位、职务、职务类别等8类数据时所属部门的级别
    organizationLevel: function(code) {
        var level = '';
        if (window.app.global.dataPermission[code].deptLevel) {
            level = 4;
        } else if (window.app.global.dataPermission[code].orgLevel) {
            level = 3;
        } else {
            level = 2;
        }
        return level;
    },
    // 根据数据权限配置来判断给定级别是否符合要求
    matchOrganizationLevel: function(code, level) {
        var item = {
            2: !!window.app.global.dataPermission[code].groupLevel,
            3: !!window.app.global.dataPermission[code].orgLevel,
            4: !!window.app.global.dataPermission[code].deptLevel
        };
        return item[level];
    },
    // 秒转换成分钟
    secondsToMinutes: function(seconds) {
        return parseInt(seconds / 60, 10);
    },
    // 秒转换成分钟(忽略掉小时)
    secondsToMinutesWithIgnoreHours: function(seconds) {
        var minutes = this.secondsToMinutes(seconds),
            hours = this.minutesToHours(minutes, true);
        return (minutes - (hours * 60));
    },
    secondsToHours: function(seconds) {
        return this.minutesToHours(this.secondsToMinutes(seconds), true);
    },
    secondsToHoursWithDecimal: function(seconds) {
        return this.minutesToHours(this.secondsToMinutes(seconds), false);
    },
    // 分钟转换成小时
    minutesToHours: function(minutes, isFixed) {
        return isFixed ? parseInt(minutes / 60, 10) : (minutes / 60).toFixed(2);
    },
    minutesToMinutesWithIgnoreHours: function(minutes) {
        return minutes - ((this.minutesToHours(minutes, true)) * 60);
    },
    // title属性控制300个字符，超过部分显示为...
    titleSub: function(content) {
        if (content.length > 300) {
            return content.substring(0, 300) + '...';
        }
        return content;
    },
    // 对象数组去重
    uniqueObjectArr: function(arr) {
        var hash = {};
        return (arr || []).filter(function(item) {
            if (hash[item.id]) {
                return false;
            }
            hash[item.id] = 1;
            return true;
        });
    },
    // 普通数组去重
    uniqueArr: function(arr) {
        var result = [],
            hash = {},
            elem;
        return (arr || []).filter(function(item, index) {
            elem = arr[index];
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
                return true;
            }
            return false;
        });
    },

    // 过滤xss攻击
    echoX: function() {
        var key,
            content = '';
        /*eslint-disable*/ 
        for (key in arguments) {
            if (arguments[key] && arguments[key] !== '' && (typeof arguments[key] === 'string')) {
                content += window.myXss(arguments[key]);
            }
        }
        return content;
    }
};
