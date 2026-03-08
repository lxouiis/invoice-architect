import React from "react";

interface FieldGroupProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function FieldGroup({ label, children, className = "" }: FieldGroupProps) {
  return (
    <div className={`space-y-0.5 ${className}`}>
      <label className="compact-label">{label}</label>
      {children}
    </div>
  );
}
