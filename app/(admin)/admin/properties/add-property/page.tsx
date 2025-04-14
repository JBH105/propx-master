"use client";

import React from "react";
import PropertyForm from "@/components/form/PropertyForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import usePropertyStore from "@/zustandStore/property.store";

const page = () => {
  const router = useRouter();
  const createProperty = usePropertyStore((state) => state.createProperty);

  const initialValues = {
    offeringName: "",
    category: "",
    propertyType: "",
    listingStatus: "",
    builtIn: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    propertyDescription: "",
    propertyValuation: "",
    totalUnits: "",
    expectedDividend: "",
    mediaFiles: [],
    publicDocuments: [],
    privateDocuments: [],
  };

  const handleSubmit = async (formValues: any) => {
    const confidential_docs = formValues?.privateDocuments?.map(
      (item: any) => item?.previewUrl
    );
    const images = formValues?.mediaFiles?.map((item: any) => item?.previewUrl);
    const non_confidential_docs = formValues?.publicDocuments?.map(
      (item: any) => item?.previewUrl
    );
    const payload = {
      name: formValues?.offeringName,
      property_type: formValues?.propertyType,
      description: formValues?.propertyDescription,
      price: +formValues?.propertyValuation,
      valuation: +formValues?.propertyValuation,
      total_units: +formValues?.totalUnits,
      min_investment_tenure: 0,
      max_investment_tenure: 0,
      city: formValues?.city,
      state: formValues?.province,
      pincode: formValues?.postalCode,
      total_investors: 0,
      fund_raised: 0,
      built_in: +formValues?.builtIn,
      status: formValues?.listingStatus,
      expected_dividend: +formValues?.expectedDividend,
      category: formValues?.category,
      address_line1: formValues?.address,
      confidential_docs,
      images,
      non_confidential_docs,
    };
    const { data, error } = await createProperty(payload);
    if(data) {
      toast.success("Property Created Successfully");
      router?.push("/admin/properties");
    }else{
      toast.error("Failed to Create Property");
    }
  };
  return (
    <PropertyForm initialValues={initialValues} handleSubmit={handleSubmit} />
  );
};

export default page;
