package com.didichuxing.datachannel.arius.admin.task.template;

import com.didichuxing.datachannel.arius.admin.biz.indices.IndicesManager;
import com.didichuxing.datachannel.arius.admin.common.bean.common.Result;
import com.didichuxing.datachannel.arius.admin.common.bean.entity.template.IndexTemplate;
import com.didichuxing.datachannel.arius.admin.common.bean.entity.template.IndexTemplatePhy;
import com.didichuxing.datachannel.arius.admin.common.bean.entity.template.IndexTemplateWithPhyTemplates;
import com.didichuxing.datachannel.arius.admin.common.constant.arius.AriusUser;
import com.didichuxing.datachannel.arius.admin.common.exception.AdminOperateException;
import com.didichuxing.datachannel.arius.admin.common.util.SizeUtil;
import com.didichuxing.datachannel.arius.admin.core.service.template.logic.IndexTemplateService;
import com.didichuxing.datachannel.arius.admin.task.BaseConcurrentTemplateTask;
import com.didiglobal.logi.elasticsearch.client.response.indices.catindices.CatIndexResult;
import com.didiglobal.logi.job.annotation.Task;
import com.didiglobal.logi.job.common.TaskResult;
import com.didiglobal.logi.job.core.job.Job;
import com.didiglobal.logi.job.core.job.JobContext;
import com.google.common.collect.Lists;
import org.apache.commons.collections4.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.stream.LongStream;

/**
 * 定时判断是否对模版禁写
 *    判断依据：模版下所有分区总存储大小 > 模版配额磁盘大小
 *    每五分钟执行一次
 *
 * @Authoer: zyl
 * @Date: 2022/07/07
 * @Version: 1.0
 */

@Task(name = "JudgeTemplateBlockWriteTask", description = "检查模版磁盘使用率是否达到上限", cron = "0 */5 * * * ?", autoRegister = true)
public class JudgeTemplateBlockWriteTask extends BaseConcurrentTemplateTask implements Job {
    private static final Logger  LOGGER = LoggerFactory.getLogger(JudgeTemplateBlockWriteTask.class);

    @Autowired
    private IndexTemplateService indexTemplateService;

    @Autowired
    private IndicesManager       indicesManager;

    @Override
    public String getTaskName() {
        return "检查模版磁盘使用率是否达到上限";
    }

    @Override
    public int poolSize() {
        return 10;
    }

    @Override
    public int current() {
        return 10;
    }

    @Override
    public TaskResult execute(JobContext jobContext) throws Exception {
        LOGGER.info("class=JudgeTemplateBlockWriteTask||method=execute||msg=JudgeTemplateBlockWriteTask start.");
        if (execute()) {
            return TaskResult.SUCCESS;
        }
        return TaskResult.FAIL;
    }

    @Override
    protected boolean executeByLogicTemplate(Integer logicId) throws AdminOperateException {
        IndexTemplateWithPhyTemplates indexTemplateWithPhyTemplates = indexTemplateService
            .getLogicTemplateWithPhysicalsById(logicId);

        if (indexTemplateWithPhyTemplates == null) {
            throw new AdminOperateException(String.format("模板[%s]不存在", logicId));
        }

        long limitDiskSize = (long) (indexTemplateWithPhyTemplates.getDiskSize() * 1024 * 1024 * 1024);

        IndexTemplatePhy masterPhyTemplate = indexTemplateWithPhyTemplates.getMasterPhyTemplate();
        if (masterPhyTemplate == null) {
            throw new AdminOperateException(String.format("模板[%s]对应的物理模板不存在", logicId));
        }

        List<CatIndexResult> catIndexResults = indicesManager
            .listIndexCatInfoByTemplatePhyId(masterPhyTemplate.getId());

        long templateIndicesDiskSum = 0;
        if (CollectionUtils.isNotEmpty(catIndexResults)) {
            // 统计逻辑模版所有索引的占用磁盘大小
            // storeSize属性为string类型，把单位统一转换为byte
            templateIndicesDiskSum = catIndexResults.stream().mapToLong(r -> SizeUtil.getUnitSize(r.getStoreSize()))
                .sum();
        }

        // 判断是否禁写
        if (templateIndicesDiskSum < limitDiskSize) {
            return true;
        }

        Result<Void> ret = indexTemplateService.updateBlockWriteState(indexTemplateWithPhyTemplates.getId(), true,
            AriusUser.SYSTEM.getDesc());
        return !ret.failed();
    }
}