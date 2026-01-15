import React from 'react'
import { Spinner } from '@heroui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table'
import type { Selection, SortDescriptor } from '@heroui/table'
import './styles.css'

// Definir el tipo Column
export type Column = {
  name: string
  uid: string
  sortable?: boolean
  align?: 'center' | 'start' | 'end'
  width?: string | number
}

type classNamesTypes = {
  base?: string,
  tableWrapper?: string
  topContent?: string
}

type CustomTableNextUiProps<T extends { id: React.Key }> = {
  items: Array<T>
  columns: Array<Column>
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode
  selectedKeys?: Selection
  onSelectionChange?: (keys: Selection) => void
  sortDescriptor?: SortDescriptor
  onSortChange?: (sort: SortDescriptor) => void
  topContent?: React.ReactNode
  bottomContent?: React.ReactNode
  onRowClick?: (item: T) => void
  loading?: boolean
  loadingContent?: React.ReactNode
  selectionMode?: 'single' | 'multiple' | 'none'
  classNames?: classNamesTypes
}

const CustomTableNextUi = <T extends { id: React.Key }>({
  items,
  columns,
  renderCell,
  selectedKeys,
  onSelectionChange,
  sortDescriptor,
  onSortChange,
  topContent,
  bottomContent,
  onRowClick,
  loading,
  loadingContent = <Spinner size="lg" color="primary" />,
  selectionMode = 'none',
  classNames
}: CustomTableNextUiProps<T>) => {
  
  return (
    <div className={`p-4 md:p-6 bg-content flex flex-col gap-4 md:gap-5 h-full rounded-xl sm:rounded-2xl ${classNames?.base}`}>
      {topContent && <div className={`top-content ${classNames?.topContent}`}>{topContent}</div>}
      <Table
        aria-label={'Table'}
        color="primary"
        isStriped 
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        onSelectionChange={onSelectionChange}
        onSortChange={onSortChange}
        selectionMode={selectionMode}
        classNames={{
          wrapper: `p-0 rounded-none h-full shadow-none table-report dark:bg-[#28292b] ${classNames?.tableWrapper}`,
          tbody: 'dark:text-white',
          th: 'bg-primary text-white h-9',
          tr: '!rounded-full',
          td: 'py-[.18rem]',
          base: 'h-full',
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.align ? column.align : 'start'}
              allowsSorting={column.sortable}
              /* @ts-ignore - Ignoring type check for width prop as it's handled correctly at runtime */
              width={column.width}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={'No items found'}
          items={items}
          isLoading={loading}
          loadingContent={loadingContent}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell onClick={() => onRowClick?.(item)}>
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {bottomContent && <div className="bottom-content">{bottomContent}</div>}
    </div>
  )
}

export default CustomTableNextUi
