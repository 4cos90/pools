var Pools = (function() {
    var __ChanList = {};
    var __FnList = {};

    return {
        NewChannel: function(key, fn) {
            if (typeof __FnList[key] === 'undefined') {
                __FnList[key] = [fn];
            } else {
                __FnList[key].push(fn);
            }
        },
        Receive: function(key, fnkey, obj) {
            if (!__FnList[fnkey]) {
                return;
            }
            if (typeof __ChanList[key] === 'undefined') {
                __ChanList[key] = [{ fnkey: fnkey, obj: obj }];
            } else {
                __ChanList[key].push({ fnkey: fnkey, obj: obj });
            }
        },
        Send: function(key, rlt) {
            if (!__ChanList[key] || __ChanList[key].length == 0) {
                return;
            }
            var fnkey = __ChanList[key][0].fnkey;
            if (!__FnList[fnkey]) {
                return;
            }
            if (__FnList[fnkey] instanceof Array && __ChanList[key] instanceof Array && __ChanList[key].length > 0) {
                for (var i = __FnList[fnkey].length - 1; i >= 0; i--) {
                    __FnList[fnkey][i].call(__ChanList[key][0].obj, rlt);
                }

            }
        },
        Finish: function(key) {
            if (__ChanList[key] && __ChanList[key].length >= 1) {
                __ChanList[key].splice(0, 1);
            }
        },
        ClearChannel: function(key) {
            for (key in __ChanList) {
                if (__ChanList[key] instanceof Array && __ChanList[key].length > 0) {
                    __ChanList[key] = __ChanList[key].filter(o => o.fnkey != key);
                }
            }
        },
        ClearReceive: function(key) {
            __ChanList[key] = [];
        }
    }
})();