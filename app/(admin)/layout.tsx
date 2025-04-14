"use client";
import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Bell,
  ChevronLeft,
  ChevronRight,
  Info,
  LayoutDashboard,
  PanelLeft,
  PanelRight,
  Upload,
} from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";
import Image from "next/image";
import propertyIcon from "../../assets/icons/propertyIcon.svg";
import profileAvatar from "../../assets/images/profileAvatar.png";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    const handleError = (event: any) => {
      setError(event?.error);
    };

    const handleUnhandledrejection = (event: any) => {
      setError(event?.reason);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledrejection);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledrejection
      );
    };
  }, []);

  useEffect(() => {
    setError(null);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-white">
      {isSidebarOpen && (
        <div className="w-[250px] border-r border-gray-200 !h-full !sticky left-0 !top-0 flex flex-col">
          <div className="flex justify-between items-center border-b border-gray-200 p-5 h-[65px]">
            <Image
              src={"https://www.propxchange.ca/logo.svg"}
              height={30}
              width={150}
              alt="Company Logo"
            />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto p-1 hover:bg-gray-100 rounded"
            >
              <PanelRight size={20} className="cursor-pointer" />
            </button>
          </div>

          <nav className="space-y-2 p-4">
            <Link href="/admin/dashboard">
              <div
                className={`flex items-center gap-2 p-2 ${
                  pathname?.includes("dashboard") ? "bg-[#F7EEFF]" : ""
                } rounded cursor-pointer`}
              >
                <LayoutDashboard color="black" />
                <span
                  className={`${
                    pathname?.includes("dashboard")
                      ? "text-black"
                      : "text-gray-500"
                  }`}
                >
                  Dashboard
                </span>
              </div>
            </Link>
            <Link href="/admin/properties">
              <div
                className={`flex items-center gap-2 p-2 text-gray-500 hover:bg-gray-100 rounded cursor-pointer ${
                  pathname?.includes("properties") ? "bg-[#F7EEFF]" : ""
                }`}
              >
                <Image src={propertyIcon} alt="Property Icon" />
                <span
                  className={`${
                    pathname?.includes("properties")
                      ? "text-black"
                      : "text-gray-500"
                  }`}
                >
                  Properties
                </span>
              </div>
            </Link>
            <Link href="/admin/blog/add-blog">
              <div
                className={`flex items-center gap-2 p-2 ${
                  pathname?.includes("blog") ? "bg-[#F7EEFF]" : ""
                } rounded cursor-pointer`}
              >
                <Upload color="black" />
                <span
                  className={`${
                    pathname?.includes("add-blog")
                      ? "text-black"
                      : "text-gray-500"
                  }`}
                >
                  Upload Blog
                </span>
              </div>
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 h-[65px] sticky top-0 bg-white z-10 min-w-0">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <PanelLeft size={20} className="cursor-pointer" />
            </button>
          )}

          <div className="flex-1">
            {pathname == "/admin/dashboard" && (
              <h1 className="text-lg font-medium">Dashboard</h1>
            )}
            {pathname == "/admin/properties" && (
              <h1 className="text-lg font-medium">Properties</h1>
            )}
            {(pathname == "/admin/properties/add-property" ||
              pathname?.includes?.("/admin/properties/update-property")) && (
              <h1 className="text-lg font-medium flex items-center gap-1">
                <button onClick={() => router.back()}>
                  <ChevronLeft size={24} className={"cursor-pointer"} />
                </button>
                {/* </Link> */}
                {pathname?.includes("add") ? "Add New " : "Update "} Property
              </h1>
            )}
            {pathname?.includes?.("/admin/properties/investor-list") && (
              <h1 className="text-lg font-medium flex items-center gap-1">
                <Link href={"/admin/properties"}>
                  <div className="text-gray-400 font-medium">Properties</div>
                </Link>
                <ChevronRight size={24} className={"cursor-pointer"} />
                <div>Investor's List</div>
              </h1>
            )}
            {(pathname == "/admin/blog/add-blog" ||
              pathname == "/admin/blog/update-blog") && (
              <h1 className="text-lg font-medium flex items-center gap-1">
                <button onClick={() => router.back()}>
                  <ChevronLeft size={24} className={"cursor-pointer"} />
                </button>
                {/* </Link> */}
                {pathname?.includes("add") ? "Add New " : "Update "} Blog
              </h1>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[#000000]">
              <Bell size={20} />
            </button>
            <button className="text-[#000000]">
              <Info size={20} />
            </button>
            <Avatar.Root className="w-8 h-8 bg-gray flex items-center justify-center text-white">
              <Image
                src={profileAvatar}
                alt="Company Logo"
                className="rounded-full"
              />
            </Avatar.Root>
          </div>
        </div>
        {error ? (
          <div className="flex justify-center items-center h-screen m-auto">
            <Card className="mx-auto max-w-md p-4">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                  <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-red-500 pb-2">
                  Something went wrong
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4 text-muted-foreground">
                  We encountered an error while processing your request. This
                  could be due to a network issue. We are already fixing it.
                </p>
                {error.digest && (
                  <p className="text-xs text-muted-foreground">
                    Error reference:{" "}
                    <code className="rounded bg-muted px-1 py-0.5">
                      {error.digest}
                    </code>
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    setError(null);
                    router.push("/admin/dashboard");
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="flex-1 overflow-auto relative">{children}</div>
        )}
      </div>
    </div>
  );
}
