import { ConfigProvider, Menu } from 'antd'
import React from 'react'
import type { MenuProps } from 'antd'

// Definición de tipos para las props del componente
interface CustomMenuProps {
  items: MenuProps['items']
  onClick: MenuProps['onClick']
  className?: string
  defaultSelectedKeys?: Array<string>
  theme?: 'light' | 'dark'
  mode:
    | 'vertical'
    | 'vertical-left'
    | 'vertical-right'
    | 'horizontal'
    | 'inline'
  style?: React.CSSProperties
  selectedKeys?: Array<string>
}

const CustomMenu: React.FC<CustomMenuProps> = ({
  items,
  onClick,
  className,
  defaultSelectedKeys,
  theme = 'dark',
  // mode,
  style,
  selectedKeys,
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ffffff',
        },
      }}
    >
      <Menu
        onClick={onClick}
        theme={theme}
        // mode={mode}
        defaultSelectedKeys={defaultSelectedKeys}
        selectedKeys={selectedKeys}
        items={items}
        className={className}
        style={style}
        // overflowedIndicator={
        //   <MenuOutlined
        //     style={{ fontSize: "26px", color: "#08A262", padding: "5px 2px" }}
        //   />
        // }
      />
    </ConfigProvider>
  )
}

export default CustomMenu
