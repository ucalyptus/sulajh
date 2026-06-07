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

const getAdminCases = createServerFn({ method: 'GET' }).handler(async () => {
  const cases = await prisma.case.findMany({
    include: {
      claimant: { select: { id: true, name: true, email: true } },
      respondent: { select: { id: true, name: true, email: true } },
      caseManager: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return cases.map((case_) => ({
    ...case_,
    createdAt: formatDate(case_.createdAt),
    submissionDate: formatDate(case_.submissionDate),
  }))
})

type CaseRow = Awaited<ReturnType<typeof getAdminCases>>[number]

const columnHelper = createColumnHelper<CaseRow>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => <span className="font-mono text-xs">{info.getValue().slice(0, 8)}…</span>,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Case Management</h1>
        <div className="text-sm text-gray-500">Total: {cases.length}</div>
      </div>

      <Input
        placeholder="Search cases…"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm mb-4"
      />

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left p-3 font-medium cursor-pointer select-none"
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
              <tr key={row.id} className="border-t hover:bg-muted/50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3">
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
