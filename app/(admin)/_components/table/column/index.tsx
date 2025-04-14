    import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import NumberFlow from "@number-flow/react";

export interface UTransactionHistory {
    id: string;
    amount: string;
    currency: string;
    type: string;
    status: string;
    date: string;
    fromWallet: string;
    toWallet: string;
}

export function getTransactionHistoryColumnDef(): ColumnDef<UTransactionHistory>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => {
                const dateValue = row.getValue("date");

                if (
                    !dateValue ||
                    typeof dateValue !== "string" ||
                    isNaN(Date.parse(dateValue))
                ) {
                    return <div>--</div>;
                }

                const formattedDate = format(new Date(dateValue), "dd-MM-yyyy");
                const truncatedDate =
                    formattedDate.length > 8 ? `${formattedDate.substring(0, 8)}...` : formattedDate;

                return (
                    <div className="font-publicSans py-2 text-sm font-semibold text-[#777777]">
                        {truncatedDate}
                    </div>
                );
            },
        },
        {
            accessorKey: "fromWallet",
            header: "From",
            cell: ({ row }) => {
                const walletowner = row.getValue("fromWallet") as string;
                const truncatedWallet =
                    walletowner && walletowner.length > 8
                        ? `${walletowner.substring(0, 8)}...`
                        : walletowner || "--";

                return (
                    <div className="font-publicSans text-sm font-semibold text-black">
                        {truncatedWallet}
                    </div>
                );
            },
        },
        {
            accessorKey: "toWallet",
            header: "To Wallet",
            cell: ({ row }) => {
                const walletowner = row.getValue("toWallet") as string;
                const truncatedWallet =
                    walletowner && walletowner.length > 8
                        ? `${walletowner.substring(0, 8)}...`
                        : walletowner || "--";

                return (
                    <div className="font-publicSans text-sm font-semibold text-black">
                        {truncatedWallet}
                    </div>
                );
            },
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => {
                const amount = row.original.amount;
                return (
                    <span
                        className={cn(
                            "font-publicSans text-sm font-semibold",
                            row.original.type === "Credit"
                                ? "text-[#578F56]"
                                : "text-[#BC512F]"
                        )}
                    >
                        {row.original.type === "Credit" ? "+" : "-"}
                        <NumberFlow
                            value={
                                parseInt(amount ?? "0.00") ?? 0
                            }
                            format={{
                                style: "currency",
                                currency: "CAD",
                                currencySign: "standard",
                                maximumFractionDigits: 2,
                            }}
                        />
                    </span>
                );
            },
        },
        {
            accessorKey: "type",
            header: "Transaction Type",
            cell: ({ row }) => {
                const transactiontype = row.original.type;

                const data = row?.original?.fromWallet?.length && row?.original?.toWallet?.length

                return (
                    <span
                        className={cn(
                            "font-publicSans text-sm font-semibold",

                        )}
                    >
                        {data && "Wallet"} {transactiontype}
                    </span>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = `${row.getValue("status")}`;

                return (
                    <div
                        className={cn(
                            "font-publicSans text-sm font-semibold",
                            status === "successful" ? "text-[#578F56]" : "text-[#BC512F]"
                        )}
                    >
                        {status}
                    </div>
                );
            },
        },
        {
            id: "action",
            header: "Action",
            cell: ({ row }) => {
                const [showTooltip, setShowTooltip] = useState(false);
                return (
                    <TooltipProvider>
                        <Tooltip open={showTooltip}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                >
                                    <Info className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                side="left"
                                className="rounded bg-black px-3 py-1 text-xs text-white"
                            >
                                Dispute Transaction
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            },
            size: 100,
        },
    ];
}
