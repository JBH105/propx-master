"use client";
import React, { useEffect, useState } from "react";
import PropertyForm from "@/components/form/PropertyForm";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import usePropertyStore from "@/zustandStore/property.store";
import { fileFromUrl } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";

const Index = () => {
  const params = useParams<{ id: string }>();

  const router = useRouter();
  const updateProperty = usePropertyStore((state) => state.updateProperty);
  const getPropertyById = usePropertyStore((state) => state.getPropertyById);
  const loading = usePropertyStore((state) => state.propertyById?.loading);
  const property = usePropertyStore((state) => state.propertyById?.data);

  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    getPropertyById(params?.id);
  }, []);

  useEffect(() => {
    const createInitialValues = async () => {
      const mediaFileUrls = property?.images;
      const mediaFiles = await Promise.all(
        mediaFileUrls?.map((url: string) => {
          return new Promise(async (resolve) => {
            const file = await fileFromUrl(url);
            resolve({ file: file, previewUrl: url });
          });
        })
      );
      const privateDocumentsUrls = property?.confidential_docs;
      const privateDocuments = await Promise.all(
        privateDocumentsUrls?.map((url: string) => {
          return new Promise(async (resolve) => {
            const file = await fileFromUrl(url);
            resolve({ file: file, previewUrl: url });
          });
        })
      );
      const publicDocumentsUrls = property?.non_confidential_docs;
      const publicDocuments = await Promise.all(
        publicDocumentsUrls?.map((url: string) => {
          return new Promise(async (resolve) => {
            const file = await fileFromUrl(url);
            resolve({ file: file, previewUrl: url });
          });
        })
      );
      setInitialValues({
        id: property?.id,
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
        publicDocuments,
        privateDocuments,
      });
    };
    if (!loading && property?.id) {
      createInitialValues();
    }
  }, [property?.id, loading]);

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
    const { data, error } = await updateProperty(params?.id, payload);
    if (data) {
      toast.success("Property Updated Successfully");
      router?.push("/admin/properties");
    }
    {
      toast.error("Failed to Update Property");
    }
  };
  return initialValues?.offeringName && !loading ? (
    <PropertyForm initialValues={initialValues} handleSubmit={handleSubmit} />
  ) : (
    <div className="h-full w-full flex justify-center text-center items-center m-auto">
      <Loader label="Loading property details..." size="lg" />
    </div>
  );
};

export default Index;