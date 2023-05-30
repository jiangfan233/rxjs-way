import { Layout } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React, { useState } from "react";

const { Sider } = Layout;


interface LeftSiderProps  {
  collapsed: boolean;
  setCollapsed: Function
}

export const LeftSider: React.FC<LeftSiderProps> = ({ collapsed, setCollapsed }) => {

  return (
    <>
      <Sider className="h-full" collapsible trigger={null} collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "nav 1",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "nav 2",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "nav 3",
            },
          ]}
        />
      </Sider>
    </>
  );
};
