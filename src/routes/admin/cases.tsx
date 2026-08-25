import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import * as stylex from '@stylexjs/stylex'
import { colors, spacing, radii } from '@/styles/tokens.stylex'

const styles = stylex.create({
  page: {
    padding: spacing[8],
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
  },
  meta: {
    fontSize: '0.875rem',
    color: colors.gray500,
  },
  searchInput: {
    maxWidth: '24rem',
    marginBottom: spacing[4],
  },
  tableWrapper: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    fontSize: '0.875rem',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: colors.muted,
  },
  th: {
    textAlign: 'left',
    padding: spacing[3],
    fontWeight: 500,
    cursor: 'pointer',
    userSelect: 'none',
  },
  tr: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    ':hover': {
      backgroundColor: 'rgba(243, 244, 246, 0.5)',
    },
  },
  td: {
    padding: spacing[3],
  },
  badge: {
    paddingLeft: spacing[2],
    paddingRight: spacing[2],
    paddingTop: spacing[0.5],
    paddingBottom: spacing[0.5],
    fontSize: '0.75rem',
    borderRadius: radii.full,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    color: colors.primary,
    fontWeight: 500,
  },
  monoText: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
  },
})

export interface CaseRow {
  id: string
  status: string
  createdAt: string
  claimant: { email: string }
  respondent: { email: string } | null
  caseManager: { name: string | null } | null
}

const getAdminCases = createServerFn({ method: 'GET' }).handler(async (): Promise<CaseRow[]> => {
  const cases = await prisma.case.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      createdAt: true,
      claimant: { select: { email: true } },
      respondent: { select: { email: true } },
      caseManager: { select: { name: true } },
    },
  })

  return cases.map((case_) => ({
    ...case_,
    createdAt: formatDate(case_.createdAt),
  }))
})

const columnHelper = createColumnHelper<CaseRow>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => <span {...stylex.props(styles.monoText)}>{info.getValue().slice(0, 8)}…</span>,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <span {...stylex.props(styles.badge)}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor((row) => row.claimant?.email, {
    id: 'claimant',
    header: 'Claimant',
  }),
  columnHelper.accessor((row) => row.respondent?.email || '—', {
    id: 'respondent',
    header: 'Respondent',
  }),
  columnHelper.accessor((row) => row.caseManager?.name || 'Unassigned', {
    id: 'caseManager',
    header: 'Case Manager',
  }),
  columnHelper.accessor('createdAt', { header: 'Created' }),
]

export const Route = createFileRoute('/admin/cases')({
  component: AdminCasesPage,
  loader: () => getAdminCases(),
  head: () => ({ meta: [{ title: 'Case Management | Sulajh Admin' }] }),
})

function AdminCasesPage() {
  const cases = Route.useLoaderData()
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data: cases,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.headerRow)}>
        <h1 {...stylex.props(styles.title)}>Case Management</h1>
        <div {...stylex.props(styles.meta)}>Total: {cases.length}</div>
      </div>

      <Input
        placeholder="Search cases…"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        style={styles.searchInput}
      />

      <div {...stylex.props(styles.tableWrapper)}>
        <table {...stylex.props(styles.table)}>
          <thead {...stylex.props(styles.thead)}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    {...stylex.props(styles.th)}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} {...stylex.props(styles.tr)}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} {...stylex.props(styles.td)}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
