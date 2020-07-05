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
        Receive: function(key, channelkey, obj) {
            if (!__FnList[channelkey]) {
                return;
            }
            if (typeof __ChanList[key] === 'undefined') {
                __ChanList[key] = [{ channelkey: channelkey, obj: obj }];
            } else {
                __ChanList[key].push({ channelkey: channelkey, obj: obj });
            }
        },
        Send: function(key, rlt) {
            if (!__ChanList[key] || __ChanList[key].length == 0) {
                return;
            }
            var channelkey = __ChanList[key][0].channelkey;
            if (!__FnList[channelkey]) {
                return;
            }
            if (__FnList[channelkey] instanceof Array && __ChanList[key] instanceof Array && __ChanList[key].length > 0) {
                for (var i = __FnList[channelkey].length - 1; i >= 0; i--) {
                    __FnList[channelkey][i].call(__ChanList[key][0].obj, rlt);
                }
            }
        },
        Finish: function(key) {
            if (__ChanList[key] && __ChanList[key].length >= 1) {
                __ChanList[key].splice(0, 1);
            }
        },
        ClearChannel: function(channelkey) {
            for (key in __ChanList) {
                if (__ChanList[key] instanceof Array && __ChanList[key].length > 0) {
                    __ChanList[key] = __ChanList[key].filter(o => o.channelkey != channelkey);
                }
            }
        },
        ClearReceive: function(key) {
            __ChanList[key] = [];
        }
    }
})();