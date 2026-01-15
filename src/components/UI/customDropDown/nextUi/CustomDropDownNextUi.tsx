// components/CustomDropDownNextUi.tsx
import React from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'
import type { Selection } from '@heroui/table'
import { capitalize } from '@/utils/utils'

type DropdownItemType = {
  uid: string
  name: string
}

type CustomDropDownNextUiProps = {
  items: Array<DropdownItemType>
  selectedKeys?: Selection
  onSelectionChange?: (keys: Selection) => void
  selectionMode: 'single' | 'multiple' | 'range'
  buttonContent: React.ReactNode
  buttonProps?: React.ComponentProps<typeof Button>
  disallowEmptySelection?: boolean
  closeOnSelect?: boolean
}

const CustomDropDownNextUi: React.FC<CustomDropDownNextUiProps> = ({
  items,
  selectedKeys,
  onSelectionChange,
  selectionMode = 'single',
  buttonContent,
  buttonProps,
  disallowEmptySelection,
  closeOnSelect = false,
}) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="flat" size='sm' radius='full' {...buttonProps}>
          {buttonContent}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection={disallowEmptySelection}
        closeOnSelect={closeOnSelect}
        selectionMode={selectionMode as 'single' | 'multiple'}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
      >
        {items.map((item) => (
          <DropdownItem key={item.uid} className="capitalize">
            {capitalize(item.name)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

export default CustomDropDownNextUi
