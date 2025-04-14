"use client";

import React from "react";
import BlogForm from "@/components/form/BlogForm";
import { usePathname } from "next/navigation";

const page = () => {
  const pathname = usePathname();

  const blogDetails = {
    defaultValues: {
      coverImage: undefined,
      profileImage: undefined,
      blogTitle: "How to Build a Profitable Real Estate Portfolio",
      author: "Samantha P.",
      publishDate: "26/03/2025",
      seoTags: "Test Tag",
      seoTitle: "Test Title",
      seoDetails: "Test Details",
      description: "Building a profitable real estate portfolio requires careful planning.",
      isCommentAdded: true,
    },
  };

  const isUpdateRoute = pathname == "/admin/blog/update-blog";
  const isUpdate = isUpdateRoute ? blogDetails : undefined;

  return <BlogForm isUpdate={isUpdate} />;
};

export default page;
