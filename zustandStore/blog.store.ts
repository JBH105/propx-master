import { propertiesData } from "@/app/(admin)/admin/properties/propertiesData";
import { create } from "zustand";

type Store = {
  dashboardBlogs: Array<any>;
  addBlog: (newBlog: any) => void;
};

const useBlogStore = create<Store>()((set) => ({
  dashboardBlogs: propertiesData?.listedBlogs,
  addBlog: (newBlog) =>
    set((state) => ({
      dashboardBlogs: [
        ...state?.dashboardBlogs,
        {
          id: state?.dashboardBlogs?.length + 1,
          title: newBlog?.blogTitle,
          publishedDate: newBlog?.publishDate,
          engagement: 230,
          image: newBlog?.coverImage
            ? URL.createObjectURL(newBlog.coverImage)
            : null,
        },
      ],
    })),
}));

export default useBlogStore;
