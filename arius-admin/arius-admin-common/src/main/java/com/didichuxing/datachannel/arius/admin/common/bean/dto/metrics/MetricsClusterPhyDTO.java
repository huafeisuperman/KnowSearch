package com.didichuxing.datachannel.arius.admin.common.bean.dto.metrics;

import com.didichuxing.datachannel.arius.admin.common.bean.dto.BaseDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by linyunan on 2021-07-30
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "指标信息")
public class MetricsClusterPhyDTO extends BaseDTO {

    @ApiModelProperty("物理集群名称")
    private String       clusterPhyName;

    @ApiModelProperty("逻辑集群名称")
    private String       clusterLogicName;

    @ApiModelProperty("开始时间")
    private Long         startTime;

    @ApiModelProperty("结束时间")
    private Long         endTime;

    @ApiModelProperty("聚合类型")
    private String       aggType;

    @ApiModelProperty("指标类型")
    private List<String> metricsTypes;

    @ApiModelProperty("Top-Level:5,10,15,20")
    private Integer      topNu;

    @ApiModelProperty("Top计算时间步长:1,5,10,15")
    private Integer      topTimeStep;

    @ApiModelProperty("Top计算方式:max,avg")
    private String       topMethod;

    /**
     * 逻辑集群下的节点名，索引名，索引模板名
     */
    private List<String> itemNamesUnderClusterLogic;
    @ApiModelProperty(value = "内置，不需要前端传入，项目id",hidden = true)
    private Integer       projectId;

}