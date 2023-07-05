### zeus搭建es集群过程记录
1. 脚本修改   
   最新的`ecm.sh`，详见：http://172.18.22.14:8080/logiknowsearchtest/ecm_sh_7_1683700665045_ecm.sh    
   主要修改内容：
   + es_path_data和es_path_logs的解析规则
   + elastic-certificates.p12的下载地址
   + data和logs目录的chown处理
   
2. es集群3个节点的配置(该配置从`elasticsearch-v7.6.0.1400.tar.gz`中拿取，`transport.port`是另外添加的)：
   * master节点：
   ```yml
    cluster.name: huo_es3
    node.name: my-node1
    node.master: true
    node.data: false
    path.data: /know_es/es_data
    path.logs: /know_es/es_logs
    http.port: 8060
    http.host: 172.18.81.110
    network.host: 172.18.81.110
    transport.port: 9300
    discovery.seed_hosts: ["172.18.81.110:9300"]
    discovery.zen.minimum_master_nodes: 1
    discovery.type: legacy-zen
    node.attr.zen1: true
    gateway.recover_after_nodes: 1
    node.max_local_storage_nodes: 1
    indices.memory.index_buffer_size: 20%
    indices.queries.cache.size: 30%
    cluster.routing.allocation.same_shard.host: true
    node.processors: 16
    thread_pool.search.size: 16
    thread_pool.search.queue_size: 1000
    thread_pool.write.size: 16
    thread_pool.write.queue_size: 1000   
   ```
    * client节点：
   ```yml
    cluster.name: huo_es3
    node.name: my-node2
    node.master: false
    node.data: false
    path.data: /know_es/es_data
    path.logs: /know_es/es_logs
    http.port: 8060
    http.host: 172.18.81.111
    network.host: 172.18.81.111
    transport.port: 9300
    discovery.seed_hosts: ["172.18.81.110:9300"]
    discovery.zen.minimum_master_nodes: 1
    discovery.type: legacy-zen
    node.attr.zen1: true
    gateway.recover_after_nodes: 1
    node.max_local_storage_nodes: 1
    indices.memory.index_buffer_size: 20%
    indices.queries.cache.size: 30%
    cluster.routing.allocation.same_shard.host: true
    node.processors: 16
    thread_pool.search.size: 16
    thread_pool.search.queue_size: 1000
    thread_pool.write.size: 16
    thread_pool.write.queue_size: 1000   
   ```
    * data节点：
   ```yml
    cluster.name: huo_es3
    node.name: my-node3
    node.master: false
    node.data: true
    path.data: /know_es/es_data
    path.logs: /know_es/es_logs
    http.port: 8060
    http.host: 172.18.81.112
    network.host: 172.18.81.112
    transport.port: 9300
    discovery.seed_hosts: ["172.18.81.110:9300"]
    discovery.zen.minimum_master_nodes: 1
    discovery.type: legacy-zen
    node.attr.zen1: true
    gateway.recover_after_nodes: 1
    node.max_local_storage_nodes: 1
    indices.memory.index_buffer_size: 20%
    indices.queries.cache.size: 30%
    cluster.routing.allocation.same_shard.host: true
    node.processors: 16
    thread_pool.search.size: 16
    thread_pool.search.queue_size: 1000
    thread_pool.write.size: 16
    thread_pool.write.queue_size: 1000   
   ```     

3. 遇坑记录：
   + s3文件无权限下载，后运维在杉岩后台页面针对bucket配置ip网段白名单解决
   + ecm.sh中`knowSearch_server_address`配置不对，需加上/admin/api
   + ecm.sh中data和logs所属用户组不对，修改脚本解决
   + ecm.sh中`elastic-certificates.p12`下载不了，后把其放到s3提取固定url解决
   + 新建集群时用户不能用默认的`elastic`
   + es集群创建成功后，自动接入集群有问题，同时任务状态不对，应该是跟节点的端口没有放开有关——待解决