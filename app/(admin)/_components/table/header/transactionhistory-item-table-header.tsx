"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { useRef, useState, useEffect } from "react";
// import { fetchTransactionsSlipHistory } from "./action/transaction-slip";
import { UTransactionHistory } from "../column";
import { toast } from "sonner";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function TransactionHistoryItemDataTableToolbar({
    table,
}: DataTableToolbarProps<UTransactionHistory>) {
    const rows = table.getSelectedRowModel().rows;
    const [loading, startTransition] = React.useTransition();


    return (
        <div className="flex w-full items-center gap-2 border-[#E3E3E3] bg-white rounded-t-xl p-3 border-t border-x overflow-auto pb-8">
            <div className="flex w-full items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold text-black">
                        Transaction History
                    </h2>
                    <p className="text-sm text-gray-500">
                        Total Transactions ({table.getRowCount()})
                    </p>
                </div>


            </div>

        </div>
    );
}
