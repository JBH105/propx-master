"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import property1 from "../../../../../../assets/images/property1.png";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import * as Progress from "@radix-ui/react-progress";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { allInvestors } from "../investorData";
import { useParams } from "next/navigation";
import useInvestorListStore from "@/zustandStore/InvestorList.store";
import { Skeleton } from "@/components/ui/skeleton";
import usePropertyStore from "@/zustandStore/property.store";
import { format } from "date-fns";
import { Loader } from "@/components/ui/loader";

type Props = {};

const PropertyInvestorList = (props: Props) => {
  const params = useParams<{ id: string }>();

  const property = usePropertyStore((state) => state?.propertyById?.data);
  const getPropertyById = usePropertyStore((state) => state?.getPropertyById);
  const loading = usePropertyStore((state) => state?.propertyById?.loading);

  useEffect(() => {
    getPropertyById(params?.id);
  }, []);

  const columns = [
    {
      accessorKey: "name",
      header: "Investor Name",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell:(info: any) => (
        <div style={{ color: info?.getValue() == 'sell' ? 'green': 'red' }}>{info?.getValue()}</div>
      )
    },
    {
      accessorKey: "date",
      header: "Investment Date",
    },
    {
      accessorKey: "investment",
      header: "Total Investment",
    },
    {
      accessorKey: "units",
      header: "Total Units",
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const investorsList: Array<any> = [];

  property?.investors?.forEach((investor: any) => {
    investor?.investor_activity?.forEach((activity: any) => {
      investorsList.push({
        name: activity.name || "",
        action: activity.action || "",
        date: format(activity?.date, "yyyy-MM-dd"),
        investment: activity?.amount || 0,
        units: activity?.units || 0,
      });
    });
  });

  const table = useReactTable({
    data: investorsList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: currentPage,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: currentPage, pageSize });
        setCurrentPage(newState.pageIndex);
      } else {
        setCurrentPage(updater.pageIndex);
      }
    },
    debugTable: true,
  });

  const totalPages = Math.ceil(investorsList?.length / pageSize);
  const displayCurrentPage = currentPage + 1;

  const getPageNumbers = () => {
    const pages = [];

    pages.push(1);

    let startPage = Math.max(2, displayCurrentPage - 1);
    let endPage = Math.min(totalPages - 1, displayCurrentPage + 1);

    if (displayCurrentPage <= 3) {
      endPage = Math.min(4, totalPages - 1);
    }

    if (displayCurrentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
    }

    if (startPage > 2) {
      pages.push("ellipsis1");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push("ellipsis2");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const goToPage = (pageIndex: number) => {
    table.setPageIndex(pageIndex);
  };

  const price = property?.price || 0;
  const fund_raised = property?.fund_raised || 0;
  let fundRaisedPercent = price === 0 ? 0 : fund_raised / price;

  return (
    <>
      {loading ? (
        <div className="h-full w-full flex justify-center text-center items-center m-auto">
          <Loader label="Loading property details..." size="lg" />
        </div>
      ) : (
        <div className="p-4 relative">
          <div className="h-[40vh] bg-[#F5F5F5] w-full absolute top-0 left-0"></div>
          <div className="relative z-10 p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                <div className="rounded-md">
                  {property?.images?.[0] ? (
                    <Image
                      src={property?.images?.[0]}
                      alt="Harmony Heights"
                      height={80}
                      className="rounded-md"
                      width={105}
                    />
                  ) : (
                    <Skeleton className="h-[80px] w-[105px]" />
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <h2 className="font-medium">{property?.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Asset Builder
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  <div>
                    <p className="font-medium">CA${property?.fund_raised}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Investment
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{fundRaisedPercent}%</p>
                      <Progress.Root
                        className="relative overflow-hidden bg-gray-200 rounded-full w-24 h-[5px]"
                        value={fundRaisedPercent}
                      >
                        <Progress.Indicator
                          className="w-full h-full transition-transform duration-300"
                          style={{
                            transform: `translateX(-${
                              100 - fundRaisedPercent
                            }%)`,
                            backgroundColor: "#578F56",
                          }}
                        />
                      </Progress.Root>
                    </div>
                    <p className="text-sm text-muted-foreground">Fund Raised</p>
                  </div>
                  {/* <div>
                <p className="font-medium">15</p>
                <p className="text-sm text-muted-foreground">
                  Days left to Close
                </p>
              </div> */}
                  <div>
                    <p className="font-medium">{property?.total_investors}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Investors
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant={"purple"}
                className="text-xs rounded-[36px] py-[8px] !px-[20px] flex items-center gap-2 cursor-pointer"
              >
                <Download />
                Download PDF
              </Button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full bg-white">
                <thead className="bg-[#EAEAEA] text-left text-sm text-gray-500">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header, index) => (
                        <th key={index} className="px-4 py-3 font-medium">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      {row.getVisibleCells().map((cell, index) => (
                        <td key={index} className="px-5 py-4 text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination UI */}
              <div className="flex items-center justify-center py-4">
                <nav className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={!table.getCanPreviousPage()}
                    className="h-8 w-8 p-0 border-gray-200 cursor-pointer"
                    aria-label="Go to previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {pageNumbers.map((page, i) => {
                    if (page === "ellipsis1" || page === "ellipsis2") {
                      return (
                        <span key={`ellipsis-${i}`} className="px-2">
                          ...
                        </span>
                      );
                    }

                    const pageNum = Number(page);
                    const isCurrentPage = pageNum === displayCurrentPage;

                    return (
                      <Button
                        key={`page-${page}`}
                        variant={isCurrentPage ? "default" : "purple"}
                        size="sm"
                        onClick={() => goToPage(pageNum - 1)} // Convert to 0-based index
                        className={`h-8 w-8 p-0 cursor-pointer ${
                          isCurrentPage
                            ? "bg-purple-100 text-purple-600 hover:bg-purple-100 hover:text-purple-600 border-purple-200"
                            : "border-gray-200"
                        }`}
                        aria-label={`Go to page ${page}`}
                        aria-current={isCurrentPage ? "page" : undefined}
                      >
                        {page}
                      </Button>
                    );
                  })}

                  <Button
                    variant="purple"
                    size="icon"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={!table.getCanNextPage()}
                    className="h-8 w-8 p-0 border-gray-200 cursor-pointer"
                    aria-label="Go to next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyInvestorList;
