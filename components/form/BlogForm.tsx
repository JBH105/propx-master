"use client";

import { BlogCoverImageUpload } from "@/components/custom/BlogCoverImageUpload";
import { ProfileImageUpload } from "@/components/custom/ProfileImageUpload";
import TextEditor from "@/components/custom/TextEditor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import CommentedUser1 from "../../assets/images/commented_user_1.png";
import CommentedUser2 from "../../assets/images/commented_user_2.png";
import CommentedUser3 from "../../assets/images/commented_user_3.png";
import CommentedUser4 from "../../assets/images/commented_user_4.png";
import Image from "next/image";
import BlogDetailsPreviewModel from "@/components/model/BlogDetailsPreviewModel";
import defaultCoverImage from "@/assets/images/property_Img_Test.jpg";
import defaultProfileImage from "@/assets/images/Test_User_Img.png";
import { useRouter } from "next/navigation";
import useBlogStore from "@/zustandStore/blog.store";
import { toast } from "sonner";

interface BlogFormprops {
  isUpdate?: any;
}

const commentsData = [
  {
    id: 1,
    name: "John Doe",
    description:
      "This blog gave me a new perspective on real estate investing. I especially loved the part about fractional ownership. Could you share more tips for beginners?",
    profileAvatar: CommentedUser1,
  },
  {
    id: 2,
    name: "Zaire Rosser",
    description: "Loved the tips here!",
    profileAvatar: CommentedUser2,
  },
  {
    id: 3,
    name: "Carter Westervelt",
    description:
      "Interesting read! It clarified a lot about investment options.",
    profileAvatar: CommentedUser3,
  },
  {
    id: 4,
    name: "Erin Kenter",
    description:
      "Loved the clarity in this post. Real estate seems much more approachable with this kind of guidance.",
    profileAvatar: CommentedUser4,
  },
];

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  coverImage: z.instanceof(File, { message: "Blog cover image is required" }),
  profileImage: z.instanceof(File, {
    message: "Author's Profile Image is required",
  }),
  blogTitle: z.string().min(1, "Blog Title is required"),
  author: z.string().min(1, "Author is required"),
  publishDate: z.string().min(1, "Publish Date is required"),
  seoTags: z.string().min(1, "Seo Tags are required"),
  seoTitle: z.string().min(1, "SEO title is required"),
  seoDetails: z.string().min(1, "SEO Details is required"),
  description: z
    .string()
    .refine(
      (val) =>
        !val || val?.length == 0 || val == "<p><br></p>" ? false : true,
      { message: "Description is required" }
    ),
  isCommentAdded: z.boolean(),
});

const BlogForm: React.FC<BlogFormprops> = ({ isUpdate }) => {
  const [resetKey, setResetKey] = useState(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const addBlog = useBlogStore((state) => state?.addBlog);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: isUpdate?.defaultValues || {
      coverImage: undefined,
      profileImage: undefined,
      blogTitle: "",
      author: "",
      publishDate: "",
      seoTags: "",
      seoTitle: "",
      seoDetails: "",
      description: "",
      isCommentAdded: false,
    },
  });

  useEffect(() => {
    const fetchDefaultImages = async () => {
      if (!isUpdate) return;

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

      form.reset({
        ...isUpdate.defaultValues,
        coverImage: coverFile,
        profileImage: profileFile,
      });
    };

    fetchDefaultImages();
  }, [isUpdate]);

  const handleDiscard = () => {
    form.reset();
    form.clearErrors();
    setResetKey((prev) => prev + 1);
  };

  const handlePreviewClick = () => {
    setIsPreviewModalOpen(true);
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    addBlog(data);
    toast.success("Blog Created Successfully");
    router?.push("/admin/dashboard");
  };

  const formValues: any = useWatch({ control: form.control });

  return (
    <div className="w-full max-w-[740px] mx-auto py-8 px-4">
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h2 className="text-lg font-medium mb-10">Blog Details</h2>
              <BlogCoverImageUpload
                control={form.control}
                name="coverImage"
                key={`cover-${resetKey}`}
              />
              <ProfileImageUpload
                name="profileImage"
                key={`profile-${resetKey}`}
              />
              <div className="mb-6">
                <h2 className="text-base font-medium">Basic Info</h2>
                <div className="mt-7">
                  <FormField
                    control={form.control}
                    name="blogTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Blog Title
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter blog title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Author
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Joe Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="publishDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Publish Date
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: DD/MM/YYYY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  <FormField
                    control={form.control}
                    name="seoTags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          SEO Tags
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: tech, programming, software"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          SEO Title
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Best Tech Blog" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="seoDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Blog Title
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Add SEO Details" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-6">
                  <TextEditor
                    name="description"
                    label="Description"
                    placeholder="Write Here ...."
                    key={`desc-${resetKey}`}
                  />
                </div>
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="isCommentAdded"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isCommentAdded"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-[#595959]"
                            />
                            <FormLabel className="font-medium">
                              Allow Comments
                            </FormLabel>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {formValues?.isCommentAdded && (
                  <div className="my-20">
                    <div className="flex justify-between items-center">
                      <p className="text-base text-[#000000] font-medium">
                        Comments (04)
                      </p>
                      <button className="text-sm text-[#000000] font-normal cursor-pointer">
                        View All
                      </button>
                    </div>
                    <div className="my-14">
                      {commentsData?.map((commentDetail) => (
                        <div
                          key={commentDetail?.id}
                          className="my-10 flex gap-3 justify-start items-start"
                        >
                          <Image
                            src={commentDetail?.profileAvatar}
                            alt="ProfileAvatar"
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="flex flex-col justify-start gap-2">
                            <p className="text-sm text-[#000000] font-medium">
                              {commentDetail?.name}
                            </p>
                            <p className="text-sm text-[#3C3C3C] font-normal">
                              {commentDetail?.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div
                  className={`flex ${
                    form.formState.isValid ? "justify-between" : "justify-end"
                  } items-center mt-14`}
                >
                  {form.formState.isValid && (
                    <button
                      onClick={handleDiscard}
                      className="text-[#812AD8] hover:text-purple-700 text-sm hover:cursor-pointer"
                    >
                      Discard Changes
                    </button>
                  )}
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="purple"
                      className="!rounded-4xl border border-black cursor-pointer"
                      disabled={!form.formState.isValid}
                      onClick={handlePreviewClick}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      type="submit"
                      className="!rounded-4xl cursor-pointer"
                    >
                      Add Blog
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </FormProvider>

      {isPreviewModalOpen && (
        <BlogDetailsPreviewModel
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          formData={formValues}
        />
      )}
    </div>
  );
};

export default BlogForm;
