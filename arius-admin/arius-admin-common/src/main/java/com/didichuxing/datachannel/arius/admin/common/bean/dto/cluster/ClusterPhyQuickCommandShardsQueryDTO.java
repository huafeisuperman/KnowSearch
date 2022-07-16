package com.didichuxing.datachannel.arius.admin.common.bean.dto.cluster;

import com.didichuxing.datachannel.arius.admin.common.bean.dto.PageDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author lyn
 * @date 2021/09/29
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "快捷命令索引条件查询实体")
public class ClusterPhyQuickCommandShardsQueryDTO extends PageDTO {

    @ApiModelProperty("集群")
    private String cluster;

    @ApiModelProperty("关键字")
    private String keyword;

    @ApiModelProperty("索引名称")
    private String index;

    @ApiModelProperty("状态 green yellow red")
    private String health;

    @ApiModelProperty("状态 open close")
    private String status;

    @ApiModelProperty("排序字段(docs)")
    private String sortTerm;

    @ApiModelProperty(value = "是否降序排序（默认降序）", dataType = "Boolean", required = false)
    private Boolean orderByDesc = true;
}