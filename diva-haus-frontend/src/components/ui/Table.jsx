import React from 'react';

const Table = ({ className, ...props }) => (
  <div className="relative w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className || ''}`} {...props} />
  </div>
);

const TableHeader = ({ className, ...props }) => (
  <thead className={`[&_tr]:border-b border-glass-border/30 ${className || ''}`} {...props} />
);

const TableBody = ({ className, ...props }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className || ''}`} {...props} />
);

const TableFooter = ({ className, ...props }) => (
  <tfoot className={`border-t bg-muted/50 font-medium [&>tr]:last:border-b-0 ${className || ''}`} {...props} />
);

const TableRow = ({ className, ...props }) => (
  <tr
    className={`border-b border-glass-border/30 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className || ''}`}
    {...props}
  />
);

const TableHead = ({ className, ...props }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className || ''}`}
    {...props}
  />
);

const TableCell = ({ className, ...props }) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className || ''}`} {...props} />
);

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell };
