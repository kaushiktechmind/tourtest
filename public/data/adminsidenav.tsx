export const sidenavData = [
  {
    id: 1,
    name: "Hotel",
    icon: <i className="las la-hotel text-2xl"></i>,
    submenus: [
      { url: "/hotel/all-hotels", title: "All Hotels" },
      { url: "/hotel/attributes", title: "Hotel Attributes" },
      { url: "/hotel/hotel-faq", title: " Hotel FAQ" },
      { url: "/hotel/hotel-policy", title: "Hotel Policy" },
    ],
  },
  {
    id: 2,
    name: "Packages",
    icon: <i className="las la-umbrella text-2xl"></i>,
    submenus: [
      { url: "/package/all-package", title: "All Packages" },
      { url: "/package/package-attribute", title: "Package Attributes" },
      { url: "/package/package-faq", title: "Package FAQs" },
      { url: "/package/package-include", title: "Package Includes" },
      { url: "/package/package-exclude", title: "Package Excludes" },
    ],
  },
  {
    id: 3,
    name: "Activities",
    icon: <i className="las la-network-wired text-2xl"></i>,
    submenus: [
      { url: "/activity/all-activity", title: "All Activities" },
      { url: "/activity/activity-attributes", title: "Activity Attributes" },
      { url: "/activity/activity-faq", title: "Activity FAQ" },
    ],
  },

  {
    id: 4,
    name: "Cab",
    icon: <i className="las la-taxi text-2xl"></i>,
    submenus: [
      { url: "/cab/all-cab", title: "All Cabs" },
      { url: "/cab/cab-attribute", title: "Cab Attributes" },
      { url: "/cab/cab-hotel", title: "Hotels" },
      { url: "/cab/cab-faq", title: "Cab FAQs" },
      { url: "/cab/cab-include", title: "Cab Includes" },
      { url: "/cab/cab-exclude", title: "Cab Excludes" },
    ],
  },

  {
    id: 5,
    name: "Booking",
    icon: <i className="las la-calendar-times text-2xl"></i>,
    url: "/booking",
  },
  {
    id: 6,
    name: "Enquiry",
    icon: <i className="las la-envelope text-2xl"></i>,
    url: "/enquiry",
  },
  {
  
  id: 7,
  name: "Location",
  icon: <i className="las la-map-marker-alt text-2xl"></i>,
  url: "/location/all-location",
  },

  {
    id: 8,
    name: "Guests",
    icon: <i className="las la-user-circle text-2xl"></i>,
    url: "/guest",
  },
 
  {
    id: 9,
    name: "Pages",
    icon: <i className="las la-file-alt text-2xl"></i>,  // Updated icon for Pages
    url: "/pages/all-pages",
  },
  {
    id: 10,
    name: "Blogs",
    icon: <i className="las la-blog text-2xl"></i>,  // Updated icon for Blogs
    submenus: [
      { url: "/blogs/add-blog", title: "Blogs" },
      { url: "/tag/add-tag", title: "Tags" },
    ],
  },
  {
    id: 11,
    name: "Reviews",
    icon: <i className="las la-comment-dots text-2xl"></i>,  // Updated icon for Reviews
    url: "/reviews",
  },
  {
    id: 12,
    name: "Coupon",
    icon: <i className="las la-ticket-alt text-2xl"></i>,  // Icon for Coupon remains the same
    url: "/coupon",
  },
  {
    id: 13,
    name: "Promotion",
    icon: <i className="las la-bullhorn text-2xl"></i>,   // Icon for Coupon remains the same
    url: "/promotion",
  },

  {
    id: 14,
    name: "Banner",
    icon: <i className="las la-image text-2xl"></i>,
    url: "/banner/all-banner",
  },
  

  {
    id: 15,
    name: "Admin Settings",
    icon: <i className="las la-user-cog text-2xl"></i>,
    url: "/admin-settings",
  },
  
];
