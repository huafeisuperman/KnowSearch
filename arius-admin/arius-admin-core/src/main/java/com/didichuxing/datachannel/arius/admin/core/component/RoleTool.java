package com.didichuxing.datachannel.arius.admin.core.component;

import com.didichuxing.datachannel.arius.admin.common.constant.AuthConstant;
import com.didiglobal.knowframework.security.common.vo.user.UserBriefVO;
import com.didiglobal.knowframework.security.service.RoleService;
import com.didiglobal.knowframework.security.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.List;

/**
 * 角色工具
 *
 * @author shizeying
 * @date 2022/06/01
 * @see com.didiglobal.knowframework.security.service.RoleService 实现admin册指定角色任务的判断
 */
@Component
public class RoleTool {
    @Autowired
    private RoleService roleService;
    @Autowired
    private UserService userService;

    /**
     * 校验用户是否为管理员
     *
     * @param userName 用户名
     * @return boolean
     */
    public boolean isAdmin(String userName) {
        List<UserBriefVO> userVOS = userService.getUserBriefListByRoleType(AuthConstant.ADMIN_ROLE_TYPE);
        if (CollectionUtils.isEmpty(userVOS)) {
            return false;
        }
        return userVOS.stream().map(UserBriefVO::getUserName).anyMatch(user -> StringUtils.equals(user, userName));
    }

    /**
     * 管理员用户列表
     *
     * @return {@code List<UserBriefVO>}
     */
    public List<UserBriefVO> getAdminList() {
        return userService.getUserBriefListByRoleType(AuthConstant.ADMIN_ROLE_TYPE);
    }

    public boolean isAdmin(Integer userId) {
        List<UserBriefVO> userVOS = userService.getUserBriefListByRoleType(AuthConstant.ADMIN_ROLE_TYPE);
        if (CollectionUtils.isEmpty(userVOS)) {
            return false;
        }
        return userVOS.stream().map(UserBriefVO::getId).anyMatch(user -> user.equals(userId));
    }

    /**
     * 校验角色是否为管理员
     *
     * @param roleIds 角色id
     * @return boolean
     */
    public boolean isAdminByRoleId(List<Integer> roleIds) {
        List<Integer> adminRoleIds = roleService.selectByRoleType(AuthConstant.ADMIN_ROLE_TYPE);
        if (CollectionUtils.isEmpty(adminRoleIds)) {
            return false;
        }
        return adminRoleIds.stream().anyMatch(adminRoleId -> roleIds.contains(adminRoleId));
    }

}