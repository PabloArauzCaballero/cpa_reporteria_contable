import type { ReactNode } from 'react';

interface ToolbarFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
}

export function ToolbarField({ label, htmlFor, children }: ToolbarFieldProps) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}
