import React from 'react'
import styled from 'styled-components'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button } from 'reactstrap'
import { useTable, usePagination } from 'react-table'

const Styles = styled.div`
  padding-top: 1rem;
  font-size: 0.9rem;

  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`

const Table = (props) => {
  const {
    columns = [],
    data = [],
    paginationEnabled = true
  } = props

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageCount,
    gotoPage,
    pageOptions,
    state: { pageIndex }
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 5
      }
    },
    usePagination
  )

  // Render the UI for your table
  return (
    <div id='table' className='d-flex justify-content-center'>
      <Styles>
        <table {...getTableProps()} className='text-center'>
          <thead>
            {headerGroups.map((headerGroup, headerIndex) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerIndex}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th {...column.getHeaderProps()} key={columnIndex}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={rowIndex}>
                  {row.cells.map((cell, cellIndex) => {
                    return <td {...cell.getCellProps()} key={cellIndex}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        {paginationEnabled && (
          <div className='pagination d-flex justify-content-center'>
            <Button
              onClick={() => gotoPage(0)} disabled={!canPreviousPage}
            >
              {'<<'}
            </Button>
            &nbsp;
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              {'<'}
            </Button>
            &nbsp;
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              {'>'}
            </Button>
            &nbsp;
            <Button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {'>>'}
            </Button>
            &nbsp;
            <span className='mt-2'>
              &nbsp;
              <FormattedMessage id='page' />
              &nbsp;
              <strong>{pageIndex + 1}</strong> <FormattedMessage id='of' /> <strong>{pageOptions.length}</strong>
              &nbsp;
            </span>
            {/*
            <span>
              | Go to page:
              &nbsp;
              <input
                type='number'
                defaultValue={pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  gotoPage(page)
                }}
                style={{ width: '100px' }}
              />
            </span>
            */}
          </div>
        )}

      </Styles>
    </div>
  )
}

export default injectIntl(Table)
