'use client';

import { clsx } from 'clsx';
import { Lock } from 'lucide-react';

type FieldCategory = 'CustomerName' | 'CustomerCredit' | 'SupplierName' | 'ProcurementCost' | 'SourceUrl' | 'AgentReasoning';
type Role = 'Sales' | 'Procurement' | 'Risk' | 'Operations' | 'SystemAdmin' | 'CEO';
type FieldDisplayMode = 'Plaintext' | 'Redacted' | 'RedactedAsId' | 'RedactedAsRange' | 'RedactedAsSummary' | 'Hidden';

const FIELD_PERMISSION_MATRIX: Record<FieldCategory, Record<Role, FieldDisplayMode>> = {
  CustomerName: {
    Sales: 'Plaintext', Procurement: 'RedactedAsId', Risk: 'Plaintext',
    Operations: 'RedactedAsId', SystemAdmin: 'Plaintext', CEO: 'RedactedAsSummary',
  },
  CustomerCredit: {
    Sales: 'RedactedAsSummary', Procurement: 'Hidden', Risk: 'Plaintext',
    Operations: 'Hidden', SystemAdmin: 'Plaintext', CEO: 'RedactedAsSummary',
  },
  SupplierName: {
    Sales: 'RedactedAsId', Procurement: 'Plaintext', Risk: 'Hidden',
    Operations: 'RedactedAsId', SystemAdmin: 'Plaintext', CEO: 'RedactedAsSummary',
  },
  ProcurementCost: {
    Sales: 'RedactedAsRange', Procurement: 'Plaintext', Risk: 'Hidden',
    Operations: 'Hidden', SystemAdmin: 'Plaintext', CEO: 'Hidden',
  },
  SourceUrl: {
    Sales: 'Plaintext', Procurement: 'Plaintext', Risk: 'RedactedAsSummary',
    Operations: 'RedactedAsSummary', SystemAdmin: 'Plaintext', CEO: 'RedactedAsSummary',
  },
  AgentReasoning: {
    Sales: 'Plaintext', Procurement: 'Plaintext', Risk: 'Plaintext',
    Operations: 'RedactedAsSummary', SystemAdmin: 'Plaintext', CEO: 'RedactedAsSummary',
  },
};

interface RoleAwareFieldProps {
  fieldCategory: FieldCategory;
  value: string;
  role: Role;
  redactedPlaceholder?: string;
}

function formatRedacted(mode: FieldDisplayMode, value: string, placeholder: string) {
  switch (mode) {
    case 'Hidden':
      return null;
    case 'Redacted':
      return <span className="redacted">{placeholder}</span>;
    case 'RedactedAsId':
      return <span className="redacted text-[16px] font-mono">{placeholder}</span>;
    case 'RedactedAsRange':
      return <span className="text-gray-400 italic">{placeholder}</span>;
    case 'RedactedAsSummary':
      return <span className="text-gray-400 italic">{placeholder}</span>;
    case 'Plaintext':
    default:
      return <span>{value}</span>;
  }
}

export function RoleAwareField({
  fieldCategory,
  value,
  role,
  redactedPlaceholder = '●●●●',
}: RoleAwareFieldProps) {
  const mode = FIELD_PERMISSION_MATRIX[fieldCategory]?.[role] || 'Plaintext';

  if (mode === 'Hidden') return null;

  const display = formatRedacted(mode, value, redactedPlaceholder);

  if (mode !== 'Plaintext') {
    return (
      <span className="inline-flex items-center gap-1" title="字段受权限保护">
        {display}
        <Lock size={12} className="text-gray-300" />
      </span>
    );
  }

  return <>{display}</>;
}
