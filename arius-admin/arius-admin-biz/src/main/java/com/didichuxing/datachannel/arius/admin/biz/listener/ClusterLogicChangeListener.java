package com.didichuxing.datachannel.arius.admin.biz.listener;

import com.didichuxing.datachannel.arius.admin.biz.cluster.ClusterLogicManager;
import com.didichuxing.datachannel.arius.admin.common.exception.EventException;
import com.didichuxing.datachannel.arius.admin.common.util.EventRetryExecutor;
import com.didichuxing.datachannel.arius.admin.common.util.RetryExecutor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import com.didichuxing.datachannel.arius.admin.biz.cluster.ClusterContextManager;
import com.didichuxing.datachannel.arius.admin.common.event.resource.ClusterLogicEvent;
import com.didiglobal.logi.log.ILog;
import com.didiglobal.logi.log.LogFactory;

/**
 * Created by linyunan on 2021-06-03
 */
@Component
public class ClusterLogicChangeListener extends ApplicationRetryListener<ClusterLogicEvent> {

    private static final ILog     LOGGER = LogFactory.getLog(ClusterLogicChangeListener.class);

    @Autowired
    private ClusterLogicManager   clusterLogicManager;

    @Override
    public boolean onApplicationRetryEvent(ClusterLogicEvent event) throws EventException {
        try {
            return clusterLogicManager.updateClusterLogicHealth(event.getClusterLogicId());
       } catch (Exception e) {
            LOGGER.error(
                    "class=ClusterPhyChangeListener||method=onApplicationEvent||projectId={}||clusterPhyName={}||ErrorMsg={}",
                    event.getProjectId(), event.getClusterLogicId(), e.getMessage());
            throw new EventException(e.getMessage(), e);
        }
    }

    @SneakyThrows
    @Override
    public void onApplicationEvent(ClusterLogicEvent event) {

        EventRetryExecutor.eventRetryExecute("更新逻辑集群状态", () -> onApplicationRetryEvent(event));

    }
}