"use client";
import Image from "next/image";
import {
  ChevronUp,
  Edit,
  Trash2,
  ChevronDown,
  Upload,
  Monitor,
  Smartphone,
  Tablet,
  Plus,
  Download,
  SlidersHorizontal,
  UserRoundSearch,
  Users,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import * as Progress from "@radix-ui/react-progress";
import { propertiesData } from "./propertiesData";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import StateCards from "@/components/common/Stats";
import usePropertyStore from "@/zustandStore/property.store";
import { Loader } from "@/components/ui/loader";

export default function Dashboard() {
  const [rowSelection, setRowSelection] = useState({});

  const properties = usePropertyStore((state) => state?.properties?.data);
  const getAllProperties = usePropertyStore((state) => state?.getAllProperties);
  const loading = usePropertyStore((state) => state?.properties?.loading);

  useEffect(() => {
    getAllProperties();
  }, []);

  const propertyColumnHelper = createColumnHelper<any>();

  const propertyColumns = [
    {
      id: "select",
      header: ({ table }: any) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-[#595959]"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-[#595959]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    propertyColumnHelper.accessor("images", {
      header: "Offerings",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="rounded overflow-hidden">
            <Image
              src={info?.getValue?.()?.[0] || "/placeholder.svg"}
              alt={info.row.original.offering}
              width={100}
              height={50}
              className="object-cover"
              style={{
                minWidth: "100px",
                minHeight: "50px",
              }}
            />
          </div>
          <span>{info.row.original.name}</span>
        </div>
      ),
    }),
    propertyColumnHelper.accessor("location", {
      header: "Location",
      cell: (info) => {
        return (
          <div>
            {info?.row?.original?.city},{info?.row?.original?.state}
          </div>
        );
      },
    }),
    propertyColumnHelper.accessor("total_investors", {
      header: "Total Investment",
    }),
    // propertyColumnHelper.accessor("dayLeftToClose", {
    //   header: "Day Left To Close",
    // }),
    propertyColumnHelper.accessor("fundRaised", {
      header: "Fund Raised",
      cell: (info) => {
        const price = info?.row?.original?.price || 0;
        const fund_raised = info?.row?.original?.fund_raised || 0;
        let fundRaisedPercent = price === 0 ? 0 : fund_raised / price;
        return (
          <div className="flex flex-col gap-1 items-start">
            {fundRaisedPercent >= 100 ? (
              <span className="text-xs text-[#578F56] flex items-center gap-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM7 11.4L3.6 8L5 6.6L7 8.6L11 4.6L12.4 6L7 11.4Z"
                    fill="#578F56"
                  />
                </svg>
                Fully Funded!
              </span>
            ) : (
              <>
                <span className="w-8">{fundRaisedPercent}%</span>
                <Progress.Root
                  className="relative overflow-hidden bg-gray-200 rounded-full w-24 h-[5px]"
                  value={fundRaisedPercent}
                >
                  <Progress.Indicator
                    className="w-full h-full transition-transform duration-300"
                    style={{
                      transform: `translateX(-${100 - fundRaisedPercent}%)`,
                      backgroundColor: "#578F56",
                    }}
                  />
                </Progress.Root>
              </>
            )}
          </div>
        );
      },
    }),
    propertyColumnHelper.accessor("total_investors", {
      header: "Total Investors",
    }),
    propertyColumnHelper.accessor("", {
      header: "Action",
      cell: (info) => (
        <div className="flex gap-4">
          <Link
            href={
              "/admin/properties/update-property/" + info?.row?.original?.id
            }
            className="text-gray-500 hover:cursor-pointer"
          >
            <Edit size={16} />
          </Link>
          <button className="text-gray-500 hover:cursor-pointer">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    }),
    propertyColumnHelper.accessor("id", {
      header: " ",
      cell: (info) => (
        <div className="">
          <Link
            href={"/admin/properties/investor-list/" + info?.row?.original?.id}
          >
            <button className="text-[#812AD8] hover:text-purple-700 text-xs hover:cursor-pointer flex gap-2 items-center">
              <UserRoundSearch size={20} color="#812AD8" />
              View Investors
            </button>
          </Link>
        </div>
      ),
    }),
  ];

  const propertiesTable = useReactTable({
    data: properties || [{}, {}, {}, {}],
    columns: propertyColumns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center text-center items-center m-auto">
        <Loader label="Loading..." size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      <div className="h-[60vh] bg-[#F5F5F5] w-full absolute top-0 left-0"></div>
      <div className="relative z-10 p-4">
        {/* Metrics */}
        <div>
          <StateCards />
        </div>

        {/* Listed Properties */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Listed Properties</h2>
            <div className="flex gap-2">
              {/* <Button
                variant={"purple"}
                className="text-xs rounded-[36px] py-[8px] !px-[20px] flex items-center gap-2 cursor-pointer"
              >
                <Download />
                Download PDF
              </Button>
              <Button
                variant={"purple"}
                className="text-xs rounded-[36px] py-[8px] !px-[20px] flex items-center gap-2 cursor-pointer"
              >
                <SlidersHorizontal />
                Add Filter
              </Button> */}
              <Link href="/admin/properties/add-property">
                <Button
                  variant={"outline"}
                  className="bg-[#812AD8] text-white text-xs rounded-[36px] py-[8px] !px-[20px] flex items-center gap-2 cursor-pointer"
                >
                  <Plus />
                  Add Property
                </Button>
              </Link>
            </div>
          </div>
          {/* Listed Properties */}
          <div className="border border-gray-200 rounded-lg overflow-x-auto">
            <table className="w-full bg-white">
              <thead className="bg-[#EAEAEA] text-left text-sm text-gray-500">
                {propertiesTable.getHeaderGroups().map((headerGroup, index) => (
                  <tr key={index}>
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
                {propertiesTable.getRowModel().rows.map((row, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    {row.getVisibleCells().map((cell, index) => (
                      <td key={index} className="px-4 py-3 text-sm">
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
          </div>
        </div>
      </div>
    </div>
  );
}
