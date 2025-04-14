import {
    getCoreRowModel,
    useReactTable,
    type VisibilityState,
    type TableOptions,
    SortingState,
    ColumnFiltersState,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import React from "react";

interface UserDataTableProps<TData> {
    data: TableOptions<TData>["data"];
    columns: TableOptions<TData>["columns"];
}

function useSkipper() {
    const shouldSkipRef = React.useRef(true);
    const shouldSkip = shouldSkipRef.current;

    const skip = React.useCallback(() => {
        shouldSkipRef.current = false;
    }, []);

    React.useEffect(() => {
        shouldSkipRef.current = true;
    });

    return [shouldSkip, skip] as const;
}

export function useDataTable<TData>({
    data: tableData,
    ...props
}: UserDataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [currentData, setData] = React.useState(tableData);
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

    const table = useReactTable({
        data: currentData,
        ...props,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        autoResetPageIndex,
        meta: {
            updateData: (rowIndex: number, columnId: string, value: unknown) => {
                skipAutoResetPageIndex();
                setData((old) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex]!,
                                [columnId]: value,
                            };
                        }
                        return row;
                    })
                );
            },
        },
    });

    return { table };
}
