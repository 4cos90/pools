# pools
Asynchronous transaction processing

## pools.js
提供了基于key-value异步回调的一些方法。

### NewChannel(key, fn)
新建一个事务,key是本事务的唯一标识,fn是本事务执行时的函数。

### Receive(key, channelkey, obj)
新建一个接收回调的实例,key是本实例的唯一标识,channelkey是需要执行事务的key,obj可缓存执行本次回调时所需的相关信息。

### Send(key, rlt)
执行一次回调实例的key最新的事务。rlt是本次执行回调的参数。

#### 最终执行的函数为 fn.call(obj,rlt);

### Finish(key)
清除回调实例key中最新的事务。

### ClearChannel(channelkey)
清除所有回调实例中的指定事务:channelkey。

### ClearReceive(key)
清除回调实例key的所有事务。