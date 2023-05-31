package com.didichuxing.datachannel.arius.admin.biz.project;

import com.didiglobal.knowframework.security.common.Result;
import com.didiglobal.knowframework.security.common.vo.permission.PermissionTreeVO;

/**
 * 权限点扩展管理器
 *
 * @author shizeying
 * @date 2022/06/14
 */
public interface PermissionExtendManager {
    /**
     * 建立资源owner角色权限树
     *
     * @return {@code Result<PermissionTreeVO>}
     */
    Result<PermissionTreeVO> buildPermissionTreeByResourceOwn();

    /**
     * 建立资源admin角色权限树
     *
     * @return {@code Result<PermissionTreeVO>}
     */
    Result<PermissionTreeVO> buildPermissionTreeByResourceAdmin();

}