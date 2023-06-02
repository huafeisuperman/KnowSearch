### 远程模式esUser权限控制流程(目前线上逻辑)
1. gateway定时任务从admin拉取esUser列表(见`ESClusterServiceImpl.init()`)
2. 前端切换app的时候调用接口`/v3/es-user/project/{projectId}`,然后cookie更新`Authorization`(生成规则是：`该应用默认的esUserId+":"+verifyCode`)
3. 后端接收到`Authorization`，解析出里面的`esUserId`，且把`Authorization`的生成规则更新为：`"user_"+esUserId+":"+verifyCode`，重新写入`header`
4. 最终第3点的`Authorization`会被过滤，不放进`header`，起作用的是`es_cluster_phy_info`的`password`

### 后端需要修改
1. 表`arius_es_user`增加字段`user_name`
2. 页面esUser涉及到的增加修改列表等接口(在admin模块)需要对应增加`userName`字段
3. gateway的ESClient的reset方法增加：
    ```java
    if (StringUtils.isNotEmpty(userName) && StringUtils.isNotEmpty(password)) {
        UsernamePasswordCredentials creds = new UsernamePasswordCredentials(userName, password);
        CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(AuthScope.ANY, creds);
        httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
    }
    ```
   上游方法需要对应增加入参`userName`,`password`
4. gateway中`ESActionRequest.buildRequest`中的：
    ```java
    if("Authorization".equals(entry.getKey())){
        //为了接入带认证es集群，这个判断会使action下传的Auth失效,直接使用client的Auth
        continue;
    }
    ```
   需要移除