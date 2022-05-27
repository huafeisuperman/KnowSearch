package com.didichuxing.datachannel.arius.admin.rest.controller.v3.app;

import static com.didichuxing.datachannel.arius.admin.common.constant.ApiVersion.V3;

import com.didichuxing.datachannel.arius.admin.biz.app.ESUserManager;
import com.didichuxing.datachannel.arius.admin.common.bean.common.Result;
import com.didichuxing.datachannel.arius.admin.common.bean.dto.app.ConsoleESUserDTO;
import com.didichuxing.datachannel.arius.admin.common.bean.dto.app.ESUserDTO;
import com.didichuxing.datachannel.arius.admin.common.bean.entity.app.ESUser;
import com.didichuxing.datachannel.arius.admin.common.bean.vo.app.ConsoleESUserVO;
import com.didichuxing.datachannel.arius.admin.common.bean.vo.app.ConsoleESUserWithVerifyCodeVO;
import com.didichuxing.datachannel.arius.admin.common.constant.AuthConstant;
import com.didichuxing.datachannel.arius.admin.common.util.HttpRequestUtils;
import com.didiglobal.logi.security.common.enums.ResultCode;
import com.didiglobal.logi.security.util.HttpRequestUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import java.util.Objects;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * 项目关联的es user
 *
 * @author shizeying
 * @date 2022/05/26
 * @since 0.3
 */
@RestController
@RequestMapping({ V3 + "/es-user/" })
@Api(tags = "应用关联es user (REST)")
public class ESUserV3Controller {
    
    @Autowired
    private ESUserManager esUserManager;
    
    @PostMapping("{projectId}")
    @ResponseBody
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "query", dataType = "Integer", name = "projectId", value = "projectId", required = true) })
    public Result<Integer> createESUerByProject(HttpServletRequest request,
                                                @PathVariable("projectId") Integer projectId,
                                                @RequestBody ESUserDTO appDTO) {
        return esUserManager.registerESUser(appDTO, projectId, HttpRequestUtil.getOperator(request));
    }
     @GetMapping("/get-no-code-login")
    @ResponseBody
    @ApiOperation(value = "查询用户可以免密登陆的APP接口", notes = "该接口包含APP的校验码等敏感信息,需要调用方提供ticket")
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "header", dataType = "String", name = "X-ARIUS-APP-TICKET", value = "接口ticket", required = true) })
    public Result<List<ConsoleESUserWithVerifyCodeVO>> getNoCodeESUser(HttpServletRequest request) {
        return esUserManager.getNoCodeESUser(request);
    }
    
    @GetMapping("all")
    @ResponseBody
    @ApiOperation(value = "管理员获取所有项目的es user")
    public Result<List<ESUser>> list(HttpServletRequest request) {
        final String operator = HttpRequestUtil.getOperator(request);
        if (!operator.equals(AuthConstant.SUPER_USER_NAME)) {
            return Result.buildFail("当前用户权限不足");
        }
        return esUserManager.listESUsers();
    }
    
    @GetMapping()
    @ResponseBody
    @ApiOperation(value = "获取项目下的es user")
    public Result<List<ESUser>> listESUserByProjectId(HttpServletRequest request) {
        return esUserManager.listESUsersByProjectId(HttpRequestUtil.getProjectId(request),
                HttpRequestUtils.getOperator(request));
    }
    
    @DeleteMapping("{projectId}/{esUser}")
    @ResponseBody
    @ApiOperation(value = "删除项目下指定的es user")
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "path", dataType = "Integer", name = "projectId", value = "projectId",
                    required = true),
            @ApiImplicitParam(paramType = "path", dataType = "Integer", name = "esUser", value = "es user", required = true) })
    public Result<Void> deleteESUserByProject(HttpServletRequest request, @PathVariable("projectId") Integer projectId,
                                              @PathVariable("esUser") Integer esUserName) {
        if (Objects.isNull(projectId)) {
            Result.build(ResultCode.PARAM_IS_BLANK.getCode(), ResultCode.PARAM_IS_BLANK.getMessage());
        }
        return esUserManager.deleteESUserByProject(esUserName, projectId, HttpRequestUtils.getOperator(request));
    }
    
    @DeleteMapping("{projectId}")
    @ResponseBody
    @ApiOperation(value = "删除项目下全部的es user")
        @ApiImplicitParams({
            @ApiImplicitParam(paramType = "path", dataType = "Integer", name = "projectId", value = "projectId",
                    required = true) })
    public Result<Void> deleteAllESUserByProject(HttpServletRequest request,
                                                 @PathVariable("projectId") Integer projectId) {
        if (Objects.isNull(projectId)) {
            Result.build(ResultCode.PARAM_IS_BLANK.getCode(), ResultCode.PARAM_IS_BLANK.getMessage());
        }
        return esUserManager.deleteAllESUserByProject(projectId, HttpRequestUtils.getOperator(request));
    }
    
    @PutMapping("")
    @ResponseBody
    @ApiOperation(value = "编辑APP接口", notes = "支持修改数据中心、备注")
    public Result<Void> update(HttpServletRequest request, @RequestBody ConsoleESUserDTO appDTO) {
        //获取项目id
        Integer projectId = HttpRequestUtil.getProjectId(request);
        //获取操作用户
        String userName = HttpRequestUtil.getOperator(request);
        return esUserManager.update(projectId, userName, appDTO);
    }
    
    @GetMapping("/{esUser}")
    @ResponseBody
    @ApiOperation(value = "获取es user详情接口")
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "path", dataType = "Integer", name = "esUser", value = "esUser详情", required = true) })
    public Result<ConsoleESUserVO> get(@PathVariable("esUser") Integer esUser) {
        return esUserManager.get(esUser);
    }
    
   
    
}