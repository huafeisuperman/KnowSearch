package com.didichuxing.datachannel.arius.admin.biz.cluster;

import com.didichuxing.datachannel.arius.admin.common.bean.common.Result;
import com.didichuxing.datachannel.arius.admin.common.bean.dto.cluster.ESLogicClusterWithRegionDTO;
import com.didichuxing.datachannel.arius.admin.common.bean.entity.region.ClusterRegion;
import com.didichuxing.datachannel.arius.admin.common.bean.vo.cluster.ClusterRegionVO;
import com.didichuxing.datachannel.arius.admin.common.bean.vo.cluster.ClusterRegionWithNodeInfoVO;
import com.didichuxing.datachannel.arius.admin.common.exception.AdminOperateException;
import java.util.List;
import java.util.Set;

public interface ClusterRegionManager {

    /**
     * 构建regionVO
     * @param regions region列表
     * @return
     */
    List<ClusterRegionVO> buildLogicClusterRegionVO(List<ClusterRegion> regions);

    /**
     * 根据逻辑集群的类型筛选出可以绑定的region信息，返回的region列表中不包含cold region
     * @param clusterLogicType 逻辑集群类型
     * @param phyCluster 物理集群名称
     * @return 筛选后的region列表
     */
    Result<List<ClusterRegionVO>> listPhyClusterRegionsByLogicClusterTypeAndCluster(String phyCluster,
                                                                                    Integer clusterLogicType);

    /**
     * 构建regionVO
     * @param region region
     * @return
     */
    ClusterRegionVO buildLogicClusterRegionVO(ClusterRegion region);

    /**
     * 逻辑集群批量绑定region
     *
     * @param isAddClusterLogicFlag 是否要添加逻辑集群
     */
    Result<Void> batchBindRegionToClusterLogic(ESLogicClusterWithRegionDTO param, String operator,
                                               boolean isAddClusterLogicFlag) throws AdminOperateException;

    /**
     * 根据物理集群名称获region信息（包含空节点region），包含region中的数据节点信息
     * @param clusterName          物理集群名称
     * @return                     Result<List<ClusterRegionWithNodeInfoVO>>
     */
    Result<List<ClusterRegionWithNodeInfoVO>> listClusterRegionWithNodeInfoByClusterName(String clusterName);

    /**
     * 获取当前支持的所有划分方式
     * @return
     */
    Result<Set<String>> getAttributeDivideType();

    /**
     * 根据物理集群名称和划分方式获region信息，包含region中的数据节点信息
     * @param clusterName   物理集群名称
     * @param divideType  region划分方式
     * @return
     */
    Result<List<ClusterRegionWithNodeInfoVO>> listClusterRegionInfoWithDivideType(String clusterName, String divideType);

    /**
     * 获取可分配至dcdr的物理集群名称获region列表, 不包含空节点region
     *
     * @param clusterName         物理集群名称
     * @return                    Result<List<ClusterRegionVO>>
     */
    Result<List<ClusterRegionVO>> listNotEmptyClusterRegionByClusterName(String clusterName);

    /**
     * 删除物理集群region
     * @param regionId
     * @param operator
     * @param projectId
     * @return
     */
    Result<Void> deletePhyClusterRegion(Long regionId, String operator, Integer projectId) throws AdminOperateException;

    
    /**
     * 通过物理集群获取冷region
     *
     * @param phyCluster 物理集群名称
     * @return ClusterRegion 对象列表
     */
    List<ClusterRegion> getColdRegionByPhyCluster(String phyCluster);
    /**
     * 列出物理集群的所有region
     *
     * @param phyCluster 物理集群名称
     * @return ClusterRegion 对象列表
     */
    List<ClusterRegion> listRegionByPhyCluster(String phyCluster);
    
    /**
     * > 通过逻辑集群 id 构建逻辑集群region vo
     *
     * @param logicClusterId 逻辑集群 ID
     * @return 列表<ClusterRegionVO>
     */
    Result<List<ClusterRegionVO>> buildLogicClusterRegionVOByLogicClusterId(Long logicClusterId);
    
    
}