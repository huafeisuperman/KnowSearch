import React from "react";
import { Form, Button, Space, message } from "knowdesign";
import { RegisterFormMap, renderFormItem } from "./config";
import { userRegister } from "api/logi-security";

const redTip = "#EF645C";
const greenTip = "#46D677";
const grayTip = "#A8ADBD";

export const RegAddForm: React.FC<any> = (props: {
  fn: (t: string) => any;
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {}, []);

  const handleSubmit = async (e: any) => {
    const userName =
      typeof e.userName === "object" ? e.userName.value : e.userName;
    const email = typeof e.mailbox === "object" ? e.mailbox.value : e.mailbox;
    const phone = typeof e.phone === "object" ? e.phone.value : e.phone;
    const req = {
      userName,
      pw: e.password,
      realName: e.realName,
      email,
      phone,
    };
    userRegister(req)
      .then(() => {
        message.success("新建成功");
        props.fn("login");
      })
      .catch(() => {
        message.error("新建失败");
      });
  };

  const cancelCb = () => {
    props.fn("取消");
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };
  return (
    <>
      <Form
        name="add_user"
        {...formItemLayout}
        form={form}
        className="add-user"
        labelAlign="right"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {RegisterFormMap.map((formItem) => {
          return (
            <Form.Item
              key={formItem.key}
              name={formItem.key}
              label={formItem.label}
              rules={formItem.rules}
              style={{ width: "100%" }}
            >
              {renderFormItem(formItem)}
            </Form.Item>
          );
        })}
        <div className="btn-blk">
          <Button
            className="submit-btn"
            onClick={cancelCb}
            style={{ width: "150px", marginRight: "17px" }}
          >
            取消
          </Button>

          <Button
            className="submit-btn"
            type="primary"
            htmlType="submit"
            style={{ width: "150px" }}
          >
            确认
          </Button>
        </div>
      </Form>
    </>
  );
};
