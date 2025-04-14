"use client";

import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import MediaUpload from "@/components/custom/MediaUpload";
import DocumentUpload from "@/components/custom/DocumentUpload";
import PreviewModel from "@/components/model/PreviewModel";
import { useEffect, useState } from "react";
import propertyImg1 from "@/assets/images/property_Img_Test.jpg";
import propertyImg2 from "@/assets/images/Property_Img_test_2.jpg";
import propertyImg3 from "@/assets/images/Property_Img_test_3.jpg";
import propertyImg4 from "@/assets/images/Property_Img_test_4.jpg";
import { useRouter } from "next/navigation";
import PropertyAddress from "../custom/PropertyAddress";
import { propertyTypeOptions } from "@/lib/contant";

interface PropertyFormProps {
  initialValues?: any;
  handleSubmit: (formValues: any) => void;
}

// Form schema for validation
const formSchema = z.object({
  // Basic Info
  offeringName: z.string().min(1, "Offering name is required"),
  category: z.string().min(1, "Category is required"),
  propertyType: z.string().min(1, "Property type is required"),
  listingStatus: z.string().min(1, "Listing status is required"),
  builtIn: z.string().min(1, "Built in is required"),

  // Physical Address
  address: z.string().min(1, "Address is required"),
  city: z.string(),
  province: z.string(),
  // country: z.string().min(1, "Country is required"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .length(6, "Pincode must be 6 characters"),
  propertyDescription: z.string().min(1, "Property overview is required"),

  // Investment Details
  propertyValuation: z.string().min(1, "Property valuation is required"),
  // investmentTenure: z.string(),
  totalUnits: z.string(),
  expectedDividend: z.string().min(1, "Expected dividend is required"),
  // expectedDividendPayout: z
  //   .string()
  //   .min(1, "Expected dividend payout is required"),

  // Media Files
  mediaFiles: z
    .array(
      z.object({
        file: z.instanceof(File),
        previewUrl: z.string().url(), // or just z.string() if it's not always a valid URL
      }),
      {
        required_error: "Media files are required",
      }
    )
    .min(1, "At least one media file is required"),

  // Documents
  publicDocuments: z
    .array(
      z.object({
        file: z.instanceof(File),
        previewUrl: z.string().url(), // or just z.string() if it's not always a valid URL
      }),
      {
        required_error: "Public document are required",
      }
    )
    .min(1, "At least public document is required"),
  privateDocuments: z
    .array(
      z.object({
        file: z.instanceof(File),
        previewUrl: z.string().url(), // or just z.string() if it's not always a valid URL
      }),
      {
        required_error: "Private document are required",
      }
    )
    .min(1, "At least private document is required"),
});

export default function PropertyForm({
  initialValues,
  handleSubmit,
}: PropertyFormProps) {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  // const addProperty = usePropertyStore((state) => state.addProperty);
  const router = useRouter();

  // Initialize react-hook-form with default values for preview
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const formValues: any = useWatch({ control: form.control });
  const mediaFiles: any = formValues.mediaFiles || [];

  const handlePreviewClick = () => {
    setIsPreviewModalOpen(true);
  };

  // Check if required fields are filled and media files are uploaded
  const isPreviewDisabled = () => {
    // Check if basic required fields are filled
    const requiredFields = [
      "offeringName",
      "category",
      "propertyType",
      "listingStatus",
      "builtIn",
      "address",
      "city",
      "province",
      // "country",
      "postalCode",
      "propertyDescription",
      "propertyValuation",
      // "investmentTenure",
      "totalUnits",
      "expectedDividend",
      // "expectedDividendPayout",
    ];

    const hasRequiredFields = requiredFields.every(
      (field) => formValues[field] && formValues[field].length > 0
    );

    // Check if media files are uploaded
    const hasMediaFiles = mediaFiles.length > 0;

    // Return true if either required fields are missing or no media files
    return !hasRequiredFields || !hasMediaFiles;
  };

  const handleDiscard = () => {
    form.reset();
    form.clearErrors();
    setResetKey((prev) => prev + 1);
  };

  const years: Array<number> = [];
  const currentYear = new Date()?.getFullYear();
  for (let i = 1976; i < currentYear; i++) {
    years.push(i);
  }

  return (
    <div className="w-full max-w-[740px] mx-auto py-8 px-4">
      <FormProvider {...form}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* Offering Details Section */}
            <div>
              <h2 className="text-lg font-medium mb-10">Offering Details</h2>

              {/* Basic Info */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-8">Basic Info</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="offeringName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Offering Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter listing title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Category
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential">
                              Residential
                            </SelectItem>
                            <SelectItem value="commercial">
                              Commercial
                            </SelectItem>
                            <SelectItem value="industrial">
                              Industrial
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Property Type
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {propertyTypeOptions?.map((item) => (
                              <SelectItem value={item?.value} key={item?.label}>
                                {item?.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="listingStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Listing Status
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="builtIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Built In (Year)
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="!w-[50%]">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years?.map((year) => (
                              <SelectItem value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                            <SelectItem value="2025">2025</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Physical Address */}
                <PropertyAddress form={form} />

                {/* Property Overview */}
                <div className="mt-6 pb-10 border-b border-[#ECECEC]">
                  <FormField
                    control={form.control}
                    name="propertyDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Property Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write here"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Investment Details */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-8">Investment Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="propertyValuation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Property Valuation
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="pl-6"
                            placeholder="Ex.0.00"
                            type="number"
                            {...field}
                            onChange={(e) => {
                              const value = e?.target?.value?.trim();
                              if (value.length > 0) {
                                const totalUnits = +value / 10;
                                form.setValue(
                                  "totalUnits",
                                  totalUnits?.toString?.()?.split?.(".")?.[0]
                                );
                              }
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="investmentTenure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Investment Tenure
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="short">Short Term</SelectItem>
                            <SelectItem value="medium">Medium Term</SelectItem>
                            <SelectItem value="long">Long Term</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <FormField
                    control={form.control}
                    name="totalUnits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Total Units
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="pr-6"
                              placeholder="10,000"
                              {...field}
                              type="number"
                              disabled
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <FormField
                    control={form.control}
                    name="expectedDividend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Expected Dividend (%)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="pl-6"
                              placeholder="Ex. 00.00"
                              {...field}
                              type="number"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="expectedDividendPayout"
                    
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Expected Dividend Payout
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>
              </div>

              {/* Media Upload - REPLACED WITH NEW COMPONENT */}
              <div className="mb-6 pb-10 border-b border-[#ECECEC]">
                <h3 className="text-lg font-medium mb-4">Media Upload</h3>
                <FormField
                  control={form.control}
                  name="mediaFiles"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MediaUpload
                          name="mediaFiles"
                          accept=".jpg,.jpeg"
                          key={resetKey}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Legal Documents Upload */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">
                  Legal Documents Upload
                </h3>

                <Accordion
                  type="multiple"
                  className="space-y-4"
                  defaultValue={[
                    formValues?.publicDocuments?.length > 0
                      ? "publicDocuments"
                      : "",
                    formValues?.publicDocuments?.length > 0
                      ? "privateDocuments"
                      : "",
                  ]}
                >
                  <FormField
                    control={form.control}
                    name="publicDocuments"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <DocumentUpload
                            name={"publicDocuments"}
                            label="Public Documents"
                            description="Visible before & after login"
                            accept=".pdf"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="border-[0.1px] border-gray-200"></div>
                  <FormField
                    control={form.control}
                    name="privateDocuments"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <DocumentUpload
                            name={"privateDocuments"}
                            label="Private Documents"
                            description="Visible after login"
                            accept=".pdf"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Accordion>
              </div>

              {/* Form Actions */}
              <div
                className={`mt-14 flex items-center ${
                  !isPreviewDisabled() ? "justify-between" : "justify-end"
                }`}
              >
                {!isPreviewDisabled() && (
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
                    disabled={isPreviewDisabled()}
                    onClick={handlePreviewClick}
                  >
                    Preview
                  </Button>
                  <Button
                    type="submit"
                    variant="outline"
                    className="!rounded-4xl cursor-pointer"
                  >
                    {initialValues?.id ? "Update Property" : "Post Property"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </FormProvider>

      <PreviewModel
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        formData={formValues}
        propertyId={initialValues?.id || null}
      />
    </div>
  );
}
