ALTER TABLE `arius_es_user`
ADD COLUMN `username`  varchar(50) NULL DEFAULT NULL COMMENT 'es集群用户名' AFTER `ip`,
ADD COLUMN `password`  varchar(50) NULL DEFAULT NULL COMMENT 'es集群用户密码' AFTER `username`;

ALTER TABLE `kf_security_role`
ADD COLUMN `role_type`  tinyint(1) NOT NULL COMMENT '角色类型（0：普通用户 1：管理员）' AFTER `role_code`;

UPDATE kf_security_role SET role_type = 1 WHERE id = 1;

UPDATE kf_security_permission SET is_delete = 0 where permission_name  = '绑定Gateway';
UPDATE kf_security_permission SET is_delete = 1 where permission_name  = '接入gateway';
UPDATE kf_security_role_permission SET is_delete = 0 WHERE id = 1959;