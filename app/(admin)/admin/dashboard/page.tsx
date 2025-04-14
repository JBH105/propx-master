"use client";
import Image from "next/image";
import {
  Edit,
  Trash2,
  Upload,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import * as Progress from "@radix-ui/react-progress";
import { dashboardData } from "./dashboardData";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import PreviewModel from "@/components/model/PreviewModel";
import propertyImg1 from "@/assets/images/property_Img_Test.jpg";
import propertyImg2 from "@/assets/images/Property_Img_test_2.jpg";
import propertyImg3 from "@/assets/images/Property_Img_test_3.jpg";
import propertyImg4 from "@/assets/images/Property_Img_test_4.jpg";
import defaultCoverImage from "@/assets/images/Property_Img_test_2.jpg";
import defaultProfileImage from "@/assets/images/Test_User_Img.png";
import BlogDetailsPreviewModel from "@/components/model/BlogDetailsPreviewModel";
import useBlogStore from "@/zustandStore/blog.store";
import StateCards from "@/components/common/Stats";
import usePropertyStore from "@/zustandStore/property.store";
import { fileFromUrl } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";

export default function Dashboard() {
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [propertyFormData, setPropertyFormData] = useState<any>(null);
  const [blogFormData, setBlogFormData] = useState({});

  const dashboardBlogs = useBlogStore((state) => state?.dashboardBlogs);

  const properties = usePropertyStore((state) => state?.properties?.data);
  const getAllProperties = usePropertyStore((state) => state?.getAllProperties);
  const loading = usePropertyStore((state) => state?.properties?.loading);

  useEffect(() => {
    getAllProperties();
  }, []);

  const propertyColumnHelper = createColumnHelper<any>();
  const blogColumnHelper = createColumnHelper<(typeof dashboardBlogs)[0]>();
  const loginColumnHelper =
    createColumnHelper<(typeof dashboardData.loginActivity)[0]>();

  const handlePropertyViewDetailsClick = async (property: any) => {
    try {
      const mediaFileUrls = property?.images;
      const mediaFiles = mediaFileUrls?.map((url: string) => ({ previewUrl: url }))

      setPropertyFormData({
        id: property.id,
        offeringName: property?.name,
        category: property?.category,
        propertyType: property?.property_type,
        listingStatus: property?.status,
        builtIn: property?.built_in?.toString(),
        address: property?.address_line1,
        city: property?.city,
        province: property?.state,
        postalCode: property?.pincode,
        propertyDescription: property?.description,
        propertyValuation: property?.valuation?.toString(),
        totalUnits: property?.total_units?.toString(),
        expectedDividend: property?.expected_dividend?.toString(),
        mediaFiles,
      });
      setIsPropertyModalOpen(true);
    } catch (error) {}
  };

  const handleBlogViewDetailsClick = async () => {
    try {
      const [coverResponse, profileResponse] = await Promise.all([
        fetch(defaultCoverImage.src),
        fetch(defaultProfileImage.src),
      ]);

      const coverBlob = await coverResponse.blob();
      const profileBlob = await profileResponse.blob();

      const coverFile = new File([coverBlob], "default_cover.png", {
        type: coverBlob.type,
      });

      const profileFile = new File([profileBlob], "default_profile.png", {
        type: profileBlob.type,
      });

      setBlogFormData({
        coverImage: coverFile,
        profileImage: profileFile,
        blogTitle: "How to Build a Profitable Real Estate Portfolio",
        author: "Samantha P.",
        publishDate: "26/03/2025",
        seoTags: "Test Tag",
        seoTitle: "Test Title",
        seoDetails: "Test Details",
        description:
          "<p>Building a profitable real estate portfolio requires careful planning.</p>",
        isCommentAdded: true,
      });
      setIsBlogModalOpen(true);
    } catch (error) {}
  };

  const propertyColumns = [
    propertyColumnHelper.accessor("images", {
      header: "Offerings",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="rounded overflow-hidden">
            <Image
              src={info?.getValue?.()?.[0] || "/placeholder.svg"}
              alt={info.row.original.offering}
              width={70}
              height={45}
              className="object-cover"
              style={{
                minWidth: "70px",
                minHeight: "45px",
              }}
            />
          </div>
          <span>{info?.row?.original?.name}</span>
        </div>
      ),
    }),
    propertyColumnHelper.accessor("category", {
      header: "Category",
      cell: (info) => {
        return (
          <div>
            {info?.row?.original?.category ||
              info?.row?.original?.property_type}
          </div>
        );
      },
    }),
    propertyColumnHelper.accessor("city", {
      header: "Location",
      cell: (info) => {
        return (
          <div>
            {info?.row?.original?.city},{info?.row?.original?.state}
          </div>
        );
      },
    }),
    propertyColumnHelper.accessor("ppu", {
      header: "PPU",
      cell: (info) => {
        return (
          <div>
            {info?.row?.original?.total_units === 0
              ? 0
              : (info?.row?.original?.price || 0) /
                info?.row?.original?.total_units}
          </div>
        );
      },
    }),
    propertyColumnHelper.accessor("total_units", {
      header: "Total Units",
    }),
    propertyColumnHelper.accessor("fundRaised", {
      header: "Fund Raised",
      cell: (info) => {
        const price = info?.row?.original?.price || 0;
        const fund_raised = info?.row?.original?.fund_raised || 0;
        let fundRaisedPercent = price === 0 ? 0 : fund_raised / price;
        return (
          <div className="flex flex-col items-start gap-1">
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
        <div className="flex gap-2">
          <button
            onClick={() => handlePropertyViewDetailsClick(info?.row?.original)}
            className="text-[#812AD8] hover:text-purple-700 text-xs hover:cursor-pointer"
          >
            View Details
          </button>
        </div>
      ),
    }),
  ];

  const blogColumns = [
    blogColumnHelper.accessor("image", {
      header: "Blog Title",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="rounded overflow-hidden">
            <Image
              src={info.getValue() || "/placeholder.svg"}
              alt={info.row.original.title}
              width={70}
              height={45}
              className="object-cover"
              style={{
                minWidth: "70px",
                minHeight: "45px",
              }}
            />
          </div>
          <span>{info.row.original.title}</span>
        </div>
      ),
    }),
    blogColumnHelper.accessor("publishedDate", {
      header: "Published Date",
    }),
    blogColumnHelper.accessor("engagement", {
      header: "Engagement",
    }),
    propertyColumnHelper.accessor("totalInvestors", {
      header: "Action",
      cell: () => (
        <div className="flex gap-4">
          <Link
            href={"/admin/blog/update-blog"}
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
      cell: () => (
        <div className="flex gap-2">
          <button
            onClick={handleBlogViewDetailsClick}
            className="text-[#812AD8] hover:text-purple-700 text-xs hover:cursor-pointer"
          >
            View Details
          </button>
        </div>
      ),
    }),
  ];

  const loginColumns = [
    loginColumnHelper.accessor("userName", {
      header: "User Name",
    }),
    loginColumnHelper.accessor("contactDetails", {
      header: "Contact Details",
      cell: (info) => (
        <div className="flex flex-col">
          <span className="text-[#812AD8]">{info.getValue().email}</span>
          <span>{info.getValue().phone}</span>
        </div>
      ),
    }),
    loginColumnHelper.accessor("loginDateTime", {
      header: "Login Date & Time",
    }),
    loginColumnHelper.accessor("deviceType", {
      header: "Device Type",
      cell: (info) => (
        <div className="flex items-center gap-2">
          {info.getValue() === "Mobile" && <Smartphone size={20} />}
          {info.getValue() === "Desktop" && <Monitor size={20} />}
          {info.getValue() === "Tablet" && <Tablet size={20} />}
          {info.getValue()}
        </div>
      ),
    }),
    loginColumnHelper.accessor("ipAddress", {
      header: "IP Address",
    }),
    loginColumnHelper.accessor("location", {
      header: "Location",
    }),
    loginColumnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
  ];

  const propertiesTable = useReactTable({
    data: properties || [],
    columns: propertyColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const blogsTable = useReactTable({
    data: dashboardBlogs,
    columns: blogColumns as any,
    getCoreRowModel: getCoreRowModel(),
  });

  const loginTable = useReactTable({
    data: dashboardData.loginActivity,
    columns: loginColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center text-center items-center m-auto">
        <Loader label="Loading..." size="lg" />
      </div>
    );
  }

  return (
    <>
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
              <Link href="/admin/properties">
                <Button
                  variant={"outline"}
                  className="bg-[#812AD8] text-white text-xs rounded-[36px] py-[8px] px-[20px] flex items-center gap-1 cursor-pointer"
                >
                  View All
                </Button>
              </Link>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full bg-white">
                <thead className="bg-[#EAEAEA] text-left text-sm text-gray-500">
                  {propertiesTable
                    .getHeaderGroups()
                    .map((headerGroup, index) => (
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

          {/* Listed Blogs */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Listed Blogs</h2>
              <Link href="/admin/blog/add-blog">
                <Button
                  variant={"outline"}
                  className="bg-[#812AD8] text-white text-xs rounded-[36px] py-[8px] px-[20px] flex items-center gap-1 cursor-pointer"
                >
                  <Upload size={15} />
                  Upload Blog
                </Button>
              </Link>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full bg-white">
                <thead className="bg-[#EAEAEA] text-left text-sm text-gray-500">
                  {blogsTable.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-4 py-3 font-medium">
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
                  {blogsTable.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-t border-gray-200">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm">
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

          {/* Login Activity */}
          {/* <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Login Activity</h2>
              <Button
                variant={"outline"}
                className="bg-[#812AD8] text-white text-xs rounded-[36px] py-[8px] px-[20px] flex items-center gap-1 cursor-pointer"
              >
                View All
              </Button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full bg-white">
                <thead className="bg-[#EAEAEA] text-left text-sm text-gray-500">
                  {loginTable.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-4 py-3 font-medium">
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
                  {loginTable.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-t border-gray-200">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm">
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
          </div> */}
        </div>
      </div>

      {isPropertyModalOpen && (
        <PreviewModel
          isOpen={isPropertyModalOpen}
          onClose={() => setIsPropertyModalOpen(false)}
          formData={propertyFormData}
          propertyId={propertyFormData?.id as string}
        />
      )}

      {isBlogModalOpen && (
        <BlogDetailsPreviewModel
          isOpen={isBlogModalOpen}
          onClose={() => setIsBlogModalOpen(false)}
          formData={blogFormData}
        />
      )}
    </>
  );
}
