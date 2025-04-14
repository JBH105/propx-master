"use client";


import React from "react";
import { getTransactionHistoryColumnDef, UTransactionHistory } from "./column";
import { useDataTable } from "@/hooks/use-data-table";
import { TransactionHistoryItemDataTableToolbar } from "./header/transactionhistory-item-table-header";
import { DataTable } from "@/components/tables/data-tables";


interface HoldingItemDataTableProps {
    data: UTransactionHistory[]
}

const HoldingsItemTable = ({ data }: HoldingItemDataTableProps) => {

    const columns = getTransactionHistoryColumnDef();
    const { table } = useDataTable<UTransactionHistory>({
        data: data || [],
        columns: columns,
    });

    return (
        <DataTable table={table} dataLayoutClassName="rounded-t-none w-full border-x border-b">
            <TransactionHistoryItemDataTableToolbar table={table} />
        </DataTable>
    );
};

export default HoldingsItemTable;