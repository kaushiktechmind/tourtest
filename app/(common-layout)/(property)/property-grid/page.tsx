"use client";
import { featuredItems } from "@/public/data/featured";
import FeaturedCardPropertyList from "@/components/FeaturedCardPropertyList";
import CardPagination from "@/components/CardPagination";

const page = () => {
  return (
    <>
      {featuredItems["Mumbai"].map((item) => (
        <FeaturedCardPropertyList item={item} key={item.id} />
      ))}
      <CardPagination currentPage={0} totalPages={0} onPageChange={function (page: number): void {
        throw new Error("Function not implemented.");
      } } />
    </>
  );
};

export default page;
