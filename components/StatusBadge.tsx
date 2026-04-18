import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  PENDING_RESPONDENT: { label: 'Awaiting Respondent', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  ASSIGNED_TO_MANAGER: { label: 'Assigned to Manager', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  PENDING_PREPROCEEDING_CLAIMANT: { label: 'Pre-proceeding (Claimant)', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  PENDING_PREPROCEEDING_RESPONDENT: { label: 'Pre-proceeding (Respondent)', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  PENDING_NEUTRAL: { label: 'Awaiting Neutral', className: 'bg-purple-50 text-purple-700 border-purple-200' },
  NEUTRAL_ASSIGNED: { label: 'Neutral Assigned', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-sky-50 text-sky-700 border-sky-200' },
  DECISION_ISSUED: { label: 'Decision Issued', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CLOSED: { label: 'Closed', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  APPEALED: { label: 'Appealed', className: 'bg-red-50 text-red-700 border-red-200' },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-700 border-gray-200' }

  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
