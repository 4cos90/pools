(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        global.Pools = factory();
    }
})(this, function() {

    function Pools() {
        var __ChanList = {};
        var __FnList = {};

        this.NewChannel = function(key, fn) {
            if (typeof __FnList[key] === 'undefined') {
                __FnList[key] = [fn];
            } else {
                __FnList[key].push(fn);
            }
        };

        this.Receive = function(key, channelkey, obj) {
            if (!__FnList[channelkey]) {
                return;
            }
            if (typeof __ChanList[key] === 'undefined') {
                __ChanList[key] = [{ channelkey: channelkey, obj: obj }];
            } else {
                __ChanList[key].push({ channelkey: channelkey, obj: obj });
            }
        };

        this.Send = function(key, rlt) {
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
        };

        this.Finish = function(key) {
            if (__ChanList[key] && __ChanList[key].length >= 1) {
                __ChanList[key].splice(0, 1);
            }
        };

        this.ClearChannel = function(key) {
            for (key in __ChanList) {
                if (__ChanList[key] instanceof Array && __ChanList[key].length > 0) {
                    __ChanList[key] = __ChanList[key].filter(o => o.channelkey != key);
                }
            }
        };

        this.ClearReceive = function(key) {
            __ChanList[key] = [];
        };
    }

    return Pools;
});