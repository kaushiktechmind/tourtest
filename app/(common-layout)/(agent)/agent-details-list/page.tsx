import { featuredItems } from "@/public/data/featured";
import FeaturedItemListCard from "@/components/FeaturedItemListCard";
import CardPagination from "@/components/CardPagination";

const Page = () => {
  return (
    <>
      {featuredItems.Mumbai.map((item) => (
        <FeaturedItemListCard item={item} key={item.id} />
      ))}
      <CardPagination currentPage={0} totalPages={0} onPageChange={function (page: number): void {
        throw new Error("Function not implemented.");
      } } />
    </>
  );
};

export default Page;
