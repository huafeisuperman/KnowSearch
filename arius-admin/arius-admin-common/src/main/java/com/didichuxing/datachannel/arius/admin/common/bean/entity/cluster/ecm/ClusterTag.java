package com.didichuxing.datachannel.arius.admin.common.bean.entity.cluster.ecm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClusterTag {

    /**
     * 物理集群是「接入」还是「新建」0 接入 1 新建
     */
    private Integer createSource;

}