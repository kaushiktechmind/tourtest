"use client";
import categoryEl from "@/public/img/category-section-el.png";
import Image from "next/image";
import SubHeadingBtn from "./SubHeadingBtn";
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import FeaturedCardHome2 from "./FeaturedCardHome2";
import Link from "next/link";
import axios from "axios";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Property = () => {
  const [categories, setCategories] = useState<Record<string, any[] | null>>({
    "Port-Blair": null,
    "Neil-Island": null,
    "Havelock": null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("Port-Blair");

  const fetchDataForLocation = async (location: string) => {
    if (categories[location] !== null) return; // Skip if data is already fetched

    try {
      setLoading(true);
      const response = await axios.get(
        `https://yrpitsolutions.com/tourism_api/api/hostels/location/${location}`
      );
      const apiData = response.data.data;

      setCategories((prevCategories) => ({
        ...prevCategories,
        [location]: apiData.length > 0
          ? apiData.map((item: { id: any; hotel_name: any; seo_title: any; location_name: any; no_of_bedrooms: any; hotel_or_home_stay: any; no_of_beds: any; no_of_bathrooms: any; room_size: any; starting_price: any; highest_price: any; banner_images: any; }) => ({
              id: item.id,
              title: item.hotel_name,
              seo_title: item.seo_title,
              address: item.location_name,
              rooms: item.no_of_bedrooms,
              type: item.hotel_or_home_stay,
              bed: item.no_of_beds,
              bath: item.no_of_bathrooms,
              area: item.room_size,
              starting_price: item.starting_price,
              highest_price: item.highest_price,
              img: item.banner_images,
            }))
          : null, // If no data, set as null
      }));
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };

  const handleTabChange = (index: number) => {
    const selectedLocation = ["Port-Blair", "Neil-Island", "Havelock"][index];
    setSelectedTab(selectedLocation);
    fetchDataForLocation(selectedLocation); // Fetch data for the selected location
  };

  useEffect(() => {
    fetchDataForLocation(selectedTab); // Fetch data on initial render for default tab
  }, []);

  return (
    <section className="bg-[var(--bg-2)] py-[60px] lg:py-[120px] relative">
      <Image
        className="absolute hidden lg:block top-12 right-12"
        src={categoryEl}
        alt="img"
      />
      <div className="container">
        <div className="max-w-[570px] mx-auto flex flex-col items-center text-center">
          <SubHeadingBtn text="Properties" classes="bg-white" />
          <h2 className="h2 mt-3 ">Featured Listed Hotels</h2>
          <p className="text-neutral-600 pt-5 pb-8 lg:pb-14">
            Book hotels at affordable prices with comfort and convenience,
            offering quality amenities for every traveler.
          </p>
        </div>
        <div>
          <Tab.Group onChange={handleTabChange}>
            <div className="flex justify-between flex-wrap items-center mb-6 gap-4 px-3">
              <Tab.List className="flex gap-3 flex-wrap">
                {Object.keys(categories).map((category) => (
                  <Tab
                    key={category}
                    className={({ selected }) =>
                      classNames(
                        "rounded-full px-7 py-4 leading-5 duration-300 font-semibold",
                        selected
                          ? "bg-primary shadow text-white outline-none"
                          : "text-neutral-600 hover:bg-primary bg-[var(--primary-light)] hover:text-white"
                      )
                    }>
                    {category}
                  </Tab>
                ))}
              </Tab.List>
              <Link
                href="hotels"
                className="btn-outline flex items-center gap-2">
                View All
                <i className="las la-long-arrow-alt-right text-2xl"></i>
              </Link>
            </div>
            <Tab.Panels className="mt-2">
              {Object.entries(categories).map(([category, posts], idx) => (
                <Tab.Panel key={idx} className="grid grid-cols-12 gap-6">
                  {posts === null ? (
                    <div className="col-span-12 text-center text-xl text-neutral-600">
                      No Data Available for {category}
                    </div>
                  ) : posts ? (
                    posts.map((post) => (
                      <FeaturedCardHome2 key={post.id} item={post} />
                    ))
                  ) : loading ? (
                    <div className="col-span-12 text-center">Loading...</div>
                  ) : null}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </section>
  );
};

export default Property;
