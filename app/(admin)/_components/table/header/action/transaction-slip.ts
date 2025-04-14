// "use server";

// import { apirequest } from "@/config/api";
// import { isAxiosError } from "axios";
// import { TransactionSlipInterface } from "../../../action/get-transaction";

// interface ResponseTransaction {
//     data: {
//         ErrorMessage: string;
//         NumberOfRecords: number;
//         Success: boolean;
//         Transactions: {
//             [key: string]: TransactionSlipInterface;
//         };
//     };
// }
// export const fetchTransactionsSlipHistory = async (): Promise<{
//     data: TransactionSlipInterface[] | null;
//     message: string;
//     status: number | undefined;
//     error?: string;
// }> => {
//     try {
//         const response = await apirequest.get<ResponseTransaction>(
//             "/payments/user-transaction-history"
//         );

//         if (
//             !response.data?.data?.Transactions ||
//             typeof response.data.data.Transactions !== "object" ||
//             Object.keys(response.data.data.Transactions).length === 0
//         ) {
//             return {
//                 data: [],
//                 message: "No transactions found",
//                 status: response.status,
//             };
//         }

//         const transactions: TransactionSlipInterface[] = Object.values(
//             response.data.data.Transactions
//         ).map((tx) => ({
//             ...tx,
//         }));

//         return {
//             data: transactions,
//             message: "success",
//             status: response.status,
//         };
//     } catch (error) {

//         if (isAxiosError(error)) {
//             return {
//                 data: null,
//                 message: "Failed to fetch transactions",
//                 error: error.response?.data?.message || "Unknown error occurred",
//                 status: error.response?.status,
//             };
//         }

//         return {
//             data: null,
//             message: "An unexpected error occurred",
//             error: "Unknown error",
//             status: 500,
//         };
//     }
// };
