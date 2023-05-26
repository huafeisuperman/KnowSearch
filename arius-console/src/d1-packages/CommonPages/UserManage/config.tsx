import * as React from "react";
import { formatDate } from "knowdesign/lib/utils/tools";
import { renderAttributes } from "container/custom-component";
import { Input, InputNumber, Select, Button, Tooltip, Form, message, } from "antd";
import { regChecCode, regUserPassword } from "constants/reg";
import { checkRegisterUser, updateUserInfo } from "api/logi-security";
import { CloseOutlined } from "@ant-design/icons";
export interface ITableBtn {
  clickFunc?: () => void;
  type?: string;
  customFormItem?: string | JSX.Element;
  isRouterNav?: boolean;
  label: string | JSX.Element;
  className?: string;
  needConfirm?: boolean;
  aHref?: string;
  confirmText?: string;
  noRefresh?: boolean;
  loading?: boolean;
  disabled?: boolean;
  invisible?: boolean; // 不可见
}
export enum FormItemType {
  input = "input",
  inputPassword = "inputPassword",
  inputNumber = "inputNumber",
  custom = "custom",
  select = "select",
}

export interface IFormItem {
  key: string;
  type: FormItemType;
  attrs?: any;
  rules?: any[];
  invisible?: boolean;
  customFormItem?: any;
  select?: any;
}

export const getFormCol = (deptItem, roleItem) => {
  return [
    {
      type: "input",
      title: "用户账号:",
      dataIndex: "userName",
      placeholder: "请输入用户账号",
      componentProps: {
        maxLength: 128,
      },
    },
    {
      type: "input",
      title: "用户实名:",
      dataIndex: "realName",
      placeholder: "请输入用户实名",
      componentProps: {
        maxLength: 128,
      },
    },
  ];
};

export const getFormText: { searchText: string; resetText: string } = {
  searchText: "查询",
  resetText: "重置",
};

export const getTableCol = (renderIndex, renderUserNameCol, renderOptCol) => {
  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      render: renderIndex,
    },
    {
      title: "用户账号",
      dataIndex: "userName",
      key: "userName",
      render: renderUserNameCol,
    },
    {
      title: "用户实名",
      dataIndex: "realName",
      key: "realName",
      render: renderUserNameCol,
    },
    {
      title: "所属应用",
      dataIndex: "projectList",
      key: "projectList",
      render: (list) =>
        renderAttributes({
          data: list?.map((item: any) => item && item.projectName) || [],
          limit: 2,
          placement: "bottomLeft",
        }),
    },
    {
      title: "电话",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => {
        return <>{text || "-"}</>;
      },
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      render: (text: string) => {
        return <>{text || "-"}</>;
      },
    },
    {
      title: "分配角色",
      dataIndex: "roleList",
      key: "roleList",
      render: (value: any) =>
        renderAttributes({
          data: value?.map((item: any) => item && item.roleName) || [],
          limit: 2,
          placement: "bottomLeft",
        }),
    },
    {
      title: "最后更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      render: (value) => {
        return formatDate(value, "YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      filterTitle: true,
      key: "operation",
      width: 150,
      render: renderOptCol,
    },
  ];
  return columns;
};

const columnsRender = (item: string, maxWidth) => {
  return (
    <Tooltip placement="right" title={item}>
      <div
        className="row-ellipsis"
        style={{
          maxWidth,
          display: "inline-block",
        }}
      >
        {item || (typeof item === "number" ? item : "-")}
      </div>
    </Tooltip>
  );
};

export const readableForm = [
  {
    flag: ["detail", "update"],
    label: "已选用户",
    prop: ["userName", "realName"],
    readText: "",
  },
  {
    flag: ["detail"],
    label: "密码",
    prop: "userName",
    readText: "",
    render: (userName) => {
      const [open, setOpen] = React.useState(false);
      const handleClick = () => {
        setOpen(true);
      };

      const description = () => {
        const onFinish = async ({ pw }) => {
          const req = {
            userName,
            pw,
            ignorePasswordMatching: true,
          };
          const { res } = await updateUserInfo(req);
          if (res.code === 0) {
            message.success("重置成功");
          } else {
            message.error("重置失败");
          }
          cancelSbm();
        };

        const cancelSbm = () => {
          formRef.resetFields();
          setOpen(false);
        };

        const tailLayout = {
          wrapperCol: { offset: 8, span: 16 },
        };
        const [formRef] = Form.useForm();
        return (
          <div
            className="reset-form-blk"
            style={{
              display: open ? "block" : "none",
            }}
          >
            <Form
              name="basic"
              form={formRef}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <div className="reset-title">
                <span className="title"> {"重置密码"}</span>
                <span className="reset-icon" onClick={cancelSbm}>
                  <CloseOutlined />
                </span>
              </div>
              <Form.Item
                label="新密码"
                name="pw"
                rules={[
                  {
                    required: true,
                    message: "密码支持中英文字母、数字，标点符号，6-128位字符",
                  },
                  {
                    validator: (rule: any, value: string) => {
                      if (value && !new RegExp(regChecCode).test(value)) {
                        return Promise.reject(
                          new Error(
                            "密码支持中英文字母、数字，标点符号，6-128位字符"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                style={{
                  marginBottom: "20px",
                }}
              >
                <Input allowClear />
              </Form.Item>
              <Form.Item
                label="确认密码"
                name="confirm"
                rules={[
                  {
                    required: true,
                    message: "两次密码不一致",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("pw") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("两次密码不一致");
                    },
                  }),
                ]}
              >
                <Input allowClear />
              </Form.Item>
              <Form.Item
                {...tailLayout}
                style={{
                  marginTop: "20px",
                }}
              >
                <Button
                  htmlType="button"
                  onClick={cancelSbm}
                  style={{
                    margin: "0 20px",
                  }}
                >
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  确认
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      };
      return (
        <div className="pswd-blk">
          {"******"}
          <Button
            onClick={handleClick}
            style={{
              width: "64px",
              height: "32px",
              marginLeft: "15px",
              padding: 0,
            }}
            type="primary"
          >
            {"重置"}
          </Button>
          {description()}
        </div>
      );
    },
  },
  {
    flag: ["detail", "update"],
    label: "所属应用",
    prop: "projectList",
    readText: "",
    render: (list) => {
      return columnsRender(
        list?.map((item: any) => item && item.projectName)?.join("；") || "-",
        "180px"
      );
      // return renderAttributes({ data: list?.map((item: any) => item && item.projectName) || [], limit: 2, placement: "bottomLeft" });
    },
  },
  {
    flag: ["detail"],
    label: "绑定角色",
    prop: "roleList",
    readText: "",
    render: (list) => {
      return columnsRender(
        list?.map((item: any) => item && item.roleName)?.join("；") || "-",
        "210px"
      );
      // return renderAttributes({ data: list?.map((item: any) => item && item.roleName) || [], limit: 6, placement: "bottomLeft" });
    },
  },
];

const CHECK_TYPE = {
  user: 1,
  phone: 2,
  email: 3,
};

// 用户校验
const UserInfoCheck = (props) => {
  const onChange = (e) => {
    props?.onChange(e.target.value);
  };

  const onBlur = (e) => {
    const value = e.target.value;
    if (props.checkFn && !props.checkFn(value)) {
      return;
    }

    checkRegisterUser(props.type, value)
      .then(() => {
        props?.onChange({ checked: true, value });
      })
      .catch(() => {
        props?.onChange("-9999");
      });
  };

  return (
    <Input
      allowClear
      size="large"
      key={props.type + "user"}
      placeholder={props.placeholder || ""}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

const userNameCheck = (value) => {
  let flat_5_50 = value && value.length > 4 && value.length <= 50;
  const reg = /^[0-9a-zA-Z_]{1,}$/;

  return flat_5_50 && reg.test(value);
};

const userPhoneCheck = (value) => {
  const reg = /^[1][3-9][0-9]{9}$/;

  return reg.test(value);
};

const userEmailCheck = (value) => {
  const reg = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/;

  return reg.test(value);
};
export const renderFormItem = (item: IFormItem) => {
  switch (item.type) {
    default:
    case FormItemType.input:
      return <Input allowClear key={item.key} {...item.attrs} />;
    case FormItemType.inputPassword:
      return <Input.Password allowClear key={item.key} {...item.attrs} />;
    case FormItemType.inputNumber:
      return <InputNumber key={item.key} {...item.attrs} />;
    case FormItemType.custom:
      return (item as IFormItem).customFormItem;
    case FormItemType.select:
      return <Select key={item.key} {...item.attrs} />;
  }
};

export const RegisterFormMap = [
  {
    key: "userName",
    label: "用户账号",
    type: FormItemType.custom,
    customFormItem: (
      <UserInfoCheck
        checkFn={userNameCheck}
        placeholder="请输入用户账号"
        autocomplete="off"
        type={CHECK_TYPE.user}
      />
    ),
    rules: [
      {
        required: true,
        validator: (rule: any, value: string) => {
          if (value === "-9999") {
            return Promise.reject("账号已存在，请重新填写");
          }
          if (value === "-1" || !value) {
            return Promise.reject("请输入用户账号");
          }

          if (typeof value === "object") {
            return Promise.resolve();
          }

          if (!userNameCheck(value)) {
            return Promise.reject("支持英文字母/数字/下划线,5-50个字符");
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    key: "password",
    type: FormItemType.inputPassword,
    label: "密码",
    rules: [
      {
        required: true,
        message: "支持英文字母/数字/标点符号(除空格),6-20个字符",
        validator: (rule: any, value: string) => {
          if (!value) return Promise.reject("请输入密码");
          let flat_6_20 = value && value.length > 5 && value.length <= 20;
          if (flat_6_20 && regUserPassword.test(value)) {
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        },
      },
    ],
    attrs: {
      autocomplete: "new-password",
      size: "large",
      placeholder: "请输入密码",
    },
  },
  {
    key: "confirm",
    type: FormItemType.inputPassword,
    label: "确认密码",
    size: "large",
    rules: [
      {
        required: true,
        message: "两次密码不统一",
      },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue("password") === value) {
            return Promise.resolve();
          }
          return Promise.reject("两次密码不统一");
        },
      }),
    ],
    attrs: {
      size: "large",
      placeholder: "请再次输入密码",
    },
  },
  {
    key: "realName",
    label: "用户实名",
    type: FormItemType.input,
    rules: [
      {
        required: true,
        validator: (rule: any, value: string) => {
          if (!value) {
            return Promise.reject("请输入用户实名");
          }
          let flat_1_50 = value && value.length > 0 && value.length <= 50;
          const reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
          if (!reg.test(value)) {
            return Promise.reject("请输入中文或英文");
          } else if (!flat_1_50) {
            return Promise.reject("1-50字符");
          } else {
            return Promise.resolve();
          }
        },
      },
    ],
    attrs: {
      size: "large",
      placeholder: "请输入用户实名",
    },
  },
  {
    key: "phone",
    label: "手机号",
    type: FormItemType.custom,
    customFormItem: (
      <UserInfoCheck
        checkFn={userPhoneCheck}
        placeholder="请输入手机号码"
        type={CHECK_TYPE.phone}
      />
    ),
    rules: [
      {
        required: false,
        validator: (rule: any, value: string) => {
          if (!value) {
            return Promise.resolve();
          }
          if (value === "-9999") {
            return Promise.reject("该手机号已存在，请重新输入");
          }
          if (typeof value === "object") {
            return Promise.resolve();
          }
          if (!userPhoneCheck(value)) {
            return Promise.reject("请输入正确手机号码");
          } else {
            return Promise.resolve();
          }
        },
      },
    ],
  },
  {
    key: "mailbox",
    attrs: {
      size: "large",
    },
    label: "邮箱",
    size: "large",
    type: FormItemType.custom,
    customFormItem: (
      <UserInfoCheck
        checkFn={userEmailCheck}
        placeholder="请输入邮箱地址"
        type={CHECK_TYPE.email}
      />
    ),
    rules: [
      {
        required: false,
        validator: (rule: any, value: string) => {
          if (!value) {
            return Promise.resolve();
          }
          if (value === "-9999") {
            return Promise.reject("该邮箱地址已存在，请重新输入");
          }
          if (typeof value === "object") {
            return Promise.resolve();
          }
          if (!userEmailCheck(value)) {
            return Promise.reject("请输入完整的邮件格式");
          } else {
            return Promise.resolve();
          }
        },
      },
    ],
  },
];
