"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface PageDetails {
  page_name: string;
  page_description: string;
}

const PageDetails = () => {
  const [pageDetails, setPageDetails] = useState<PageDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchPageDetails = async () => {
      if (!id) return;

      try {
        const response = await fetch(
          `https://yrpitsolutions.com/tourism_api/api/get_page_by_id/${id}`
        );
        const data = await response.json();
        if (data) {
          setPageDetails(data);
        }
      } catch (error) {
        console.error("Error fetching page details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!pageDetails) {
    return <p className="text-center py-10">Page not found</p>;
  }

  return (
    <div className="bg-[var(--bg-2)]">
      <header className="text-white text-center py-[60px] px-3 lg:py-[120px] bg-[var(--dark)]">
        <h1 className="h1 font-semibold mb-4 lg:mb-6">{pageDetails.page_name}</h1>
      </header>
      <div className="bg-[var(--bg-2)] relative before:absolute before:w-full before:h-[150px] before:top-0 before:left-0 before:bg-[var(--dark)] mb-[60px] lg:mb-[120px]">
        <div className="container px-3 relative z-[1] p-5 md:p-8 lg:p-10 rounded-2xl bg-white">
          <h3 className="h3">{pageDetails.page_name}</h3>
          <p className="mt-4" dangerouslySetInnerHTML={{ __html: pageDetails?.page_description }} />
          <div className="border border-t border-dashed my-4 lg:my-6 xl:my-8"></div>
          {/* <ul className="marker:text-primary list-disc list-inside flex flex-col gap-3">
            <li>
              This is a family farmhouse, hence we request you to not indulge.
            </li>
            <li>
              Drinking and smoking within controlled limits are permitted at
              the farmhouse but please do not create a mess or ruckus at the
              house.
            </li>
            <li>
              Drugs and intoxicating illegal products are banned and not to be
              brought to the house or consumed.
            </li>
          </ul> */}
        </div>
      </div>
    </div>
  );
};

export default PageDetails;
