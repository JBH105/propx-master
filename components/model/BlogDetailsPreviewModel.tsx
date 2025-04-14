"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Edit } from "lucide-react";
import Link from "next/link";

interface BlogDetailsPreviewModelProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
}

const BlogDetailsPreviewModel = ({
  isOpen,
  onClose,
  formData,
}: BlogDetailsPreviewModelProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal>
      <DialogContent className="sm:max-w-[1100px] max-w-[90%] w-full p-0 overflow-hidden max-h-[90vh] overflow-y-auto bg-white [&>button]:hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{formData?.blogTitle}</h2>
            <div className="flex items-center gap-2">
              <Link href={"/admin/blog/update-blog"}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white rounded-md"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
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
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
            <div className="w-full h-full relative">
              <Image
                src={URL.createObjectURL(formData?.coverImage)}
                alt="Blog Cover Image"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-10 left-10">
                <div className="flex gap-3 items-start justify-start">
                  <div className="">
                    <Image
                      src={URL.createObjectURL(formData?.profileImage)}
                      alt="Author Image"
                      className="rounded"
                      height={56}
                      width={56}
                    />
                  </div>
                  <div className="flex flex-col justify-start">
                    <p className="text-[#FFFFFF] text-base font-medium">
                      {formData?.author}
                    </p>
                    <p className="text-[#AFAFAF] text-sm font-normal">Writer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <div
              dangerouslySetInnerHTML={{ __html: formData?.description || "" }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDetailsPreviewModel;
