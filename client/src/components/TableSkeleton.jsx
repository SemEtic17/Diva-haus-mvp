import React from 'react';
import { Skeleton } from './ui/Skeleton';
import { TableRow, TableCell } from './ui/Table';

const TableSkeleton = ({ columns, rows = 5 }) => {
  return (
    <>
      {[...Array(rows)].map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {[...Array(columns)].map((_, colIndex) => (
            <TableCell key={colIndex}>
              <div className="flex items-center gap-3">
                {colIndex === 0 && (
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                )}
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className={`h-4 ${colIndex === 0 ? 'w-32' : 'w-20'}`} />
                  {colIndex === 0 && <Skeleton className="h-3 w-20" />}
                </div>
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
