import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { propertyTypeOptions } from "@/lib/contant";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  propertyId?: string;
}
const PreviewModel = ({
  isOpen,
  onClose,
  formData,
  propertyId,
}: PreviewModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mediaFiles = formData?.mediaFiles || [];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? mediaFiles.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === mediaFiles.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Format current date for publishing date
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString(
    "default",
    { month: "short" }
  )}, ${currentDate.getFullYear()}`;
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal>
      <DialogContent className="sm:max-w-[1200px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto bg-white [&>button]:hidden">
        <div className="p-4">
          {/* Header with title and buttons */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{formData.offeringName}</h2>
            <div className="flex items-center gap-2">
              {propertyId && (
                <Link href={"/admin/properties/update-property/" + propertyId}>
                  <Button
                    variant="outline"
                    size="sm"
                    className=" text-white rounded-md"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-md"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left side - Images */}
            <div className="md:col-span-2">
              {/* Main Image with Navigation */}
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                {mediaFiles.length > 0 && (
                  <>
                    {mediaFiles[currentImageIndex] && (
                      <div className="w-full h-full relative">
                        <Image
                          src={
                            mediaFiles[currentImageIndex]?.previewUrl ||
                            "/placeholder.svg"
                          }
                          alt={`Property image ${currentImageIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    {mediaFiles.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute bottom-0 left-[44%] -translate-y-1/2 z-10 bg-white rounded-full h-8 w-8 p-0"
                          onClick={handlePrevImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-[44%]  bottom-0 -translate-y-1/2 z-10 bg-white rounded-full h-8 w-8 p-0"
                          onClick={handleNextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {/* Property Type Badge */}
                    <div className="absolute top-4 right-4 z-10 bg-white rounded-full px-3 py-1 text-sm">
                      {formData.category || "Villa"}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {mediaFiles.length > 1 && (
                <div className="flex overflow-x-auto gap-2 mt-2">
                  {mediaFiles.map((file: any, index: number) => (
                    <div
                      key={index}
                      className={`relative w-24 h-24 flex-shrink-0 cursor-pointer rounded-md overflow-hidden ${
                        currentImageIndex === index
                          ? "ring-2 ring-purple-600"
                          : ""
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <Image
                        src={file?.previewUrl || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Property Overview */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Property Overview</h3>
                <p
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: formData?.propertyDescription || "",
                  }}
                ></p>
              </div>
            </div>

            {/* Right side - Property Details */}
            <div className="border rounded-lg p-3 md:p-4 h-fit w-full">
              <div className="flex flex-col !items-center sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                <div>
                  <h2 className="text-lg font-medium">
                    {formData.offeringName}
                  </h2>
                  <p className="text-gray-500">
                    {formData.address}, {formData.city}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-purple-600 font-medium">
                    CA${formData.expectedDividend || 0}
                    <span className="text-gray-500">/Unit</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Property Valuation</p>
                  <p className="font-medium">
                    CA${formData?.propertyValuation || 0}
                  </p>
                </div>

                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Prop Units Available</p>
                  <p className="font-medium">{formData.totalUnits}</p>
                </div>

                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium flex items-center">
                    <span className="text-purple-600 mr-1">●</span>
                    {formData.city}
                  </p>
                </div>

                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Investment Tenure</p>
                  <p className="font-medium">0</p>
                </div>

                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Investment Type</p>
                  <p className="font-medium">
                    {
                      propertyTypeOptions?.find?.(
                        (item) => item?.value == formData.propertyType
                      )?.label
                    }
                  </p>
                </div>

                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Built In</p>
                  <p className="font-medium">{formData.builtIn}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Date of Publishing */}
          {/* <div className="mt-4 text-right">
            <p className="text-sm text-gray-500">Date of Publishing</p>
            <p className="text-gray-600">{formattedDate}</p>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModel;
