export const sidenavData = [
  {
    id: 1,
    name: "Hotel",
    icon: <i className="las la-hotel text-2xl"></i>,
    submenus: [
      { url: "/hotel/all-hotels", title: "All Hotels" },
      { url: "/hotel/attributes", title: "Attributes" },
      { url: "/hotel/hotel-faq", title: "FAQ" },
      { url: "/hotel/hotel-policy", title: "Hotel Policy" },
    ],
  },
  {
    id: 2,
    name: "Packages",
    icon: <i className="las la-umbrella text-2xl"></i>,
    submenus: [
      { url: "/tour/all-tour", title: "All Packages" },
      { url: "/tour/add-new-tour", title: "Add New Package" },
      { url: "/tour/edit-tour", title: "Edit Package" },
      { url: "/tour/categories", title: "Categories" },
      { url: "/tour/attributes", title: "Package Attributes" },
      { url: "/tour/availability", title: "Availability" },
      { url: "/tour/booking-calendar", title: "Booking Calendar" },
    ],
  },
  {
    id: 3,
    name: "Activities",
    icon: <i className="las la-network-wired text-2xl"></i>,
    submenus: [
      { url: "/space/all-space", title: "All Activities" },
      { url: "/space/add-new-space", title: "Add New Activity" },
      { url: "/space/attributes", title: "Activity Attributes" },
      { url: "/space/availability", title: "Availability" },
    ],
  },
  {
    id: 4,
    name: "Flight",
    icon: <i className="las la-plane-departure text-2xl"></i>,
    submenus: [
      { url: "/flight/all-flight", title: "All Flight" },
      { url: "/flight/add-new-flight", title: "Add New Flight" },
      { url: "/flight/airline", title: "Airline" },
      { url: "/flight/airport", title: "Airport" },
      { url: "/flight/seat-type", title: "Seat Type" },
      { url: "/flight/attributes", title: "Attributes" },
    ],
  },
  {
    id: 5,
    name: "Cab",
    icon: <i className="las la-taxi text-2xl"></i>,
    submenus: [
      { url: "/cab/all-cab", title: "All Cab" },
      { url: "/cab/add-new-cab", title: "Add New Cab" },
      { url: "/cab/attributes", title: "Attributes" },
      { url: "/cab/availability", title: "Availablility" },
    ],
  },
  {
    id: 6,
    name: "Boat",
    icon: <i className="las la-ship text-2xl"></i>,
    submenus: [
      { url: "/boat/all-boat", title: "All Boot" },
      { url: "/boat/add-new-boat", title: "Add New Boot" },
      { url: "/boat/attributes", title: "Attributes" },
      { url: "/boat/availability", title: "Availablility" },
    ],
  },
  {
    id: 7,
    name: "Event",
    icon: <i className="las la-calendar-alt text-2xl"></i>,
    submenus: [
      { url: "/event/all-event", title: "All Event" },
      { url: "/event/add-new-event", title: "Add New Event" },
      { url: "/event/attributes", title: "Attributes" },
      { url: "/event/availability", title: "Availablility" },
    ],
  },
  {
    id: 8,
    name: "Booking",
    icon: <i className="las la-calendar-times text-2xl"></i>,
    url: "/cancel-booking",
  },
  {
  
  id: 9,
  name: "Location",
  icon: <i className="las la-map-marker-alt text-2xl"></i>,
  submenus: [
    {url: "/location/all-location", title: "All Location"}
  ]
  
},

  {
    id: 9,
    name: "Guests",
    icon: <i className="las la-user-circle text-2xl"></i>,
    submenus: [
      { url: "/guest/guests-list", title: "Guests List" },
      { url: "/guest/guests-details", title: "Guests Details" },
    ],
  },
  {
    id: 10,
    name: "Agents",
    icon: <i className="las la-user-friends text-2xl"></i>,
    submenus: [
      { url: "/agent/agents-list", title: "Agents List" },
      { url: "/agent/agents-details", title: "Agents Details" },
      { url: "/agent/agents-withdraw", title: "Agents Withdraw" },
    ],
  },
  {
    id: 11,
    name: "Chat",
    icon: <i className="las la-sms text-2xl"></i>,
    url: "/chat",
  },
  {
    id: 12,
    name: "Reviews",
    icon: <i className="lar la-star text-2xl"></i>,
    url: "/reviews",
  },
  {
    id: 13,
    name: "Coupon",
    icon: <i className="las la-ticket-alt text-2xl"></i>,
    url: "/coupon",
  },
  {
    id: 14,
    name: "Total Earnings",
    icon: <i className="las la-hand-holding-usd text-2xl"></i>,
    submenus: [
      { url: "/earning/tax-calculate", title: "Tax Calculate" },
      { url: "/earning/subscription-earn", title: "Subscription Earn" },
      { url: "/earning/withdraw-earn", title: "Withdraw Earn" },
      { url: "/earning/commission-earn", title: "Commission Earn" },
    ],
  },
  {
    id: 15,
    name: "General Settings",
    icon: <i className="las la-cog text-2xl"></i>,
    submenus: [
      { url: "/settings/logo", title: "Logo" },
      { url: "/settings/favicon", title: "Favicon" },
      { url: "/settings/loader", title: "Loader" },
      { url: "/settings/website-content", title: "Website Content" },
      { url: "/settings/footer", title: "Footer" },
      { url: "/settings/error-page", title: "Error Page" },
    ],
  },
  {
    id: 16,
    name: "Payment Settings",
    icon: <i className="las la-credit-card text-2xl"></i>,
    submenus: [
      { url: "/payment/info", title: "Payment Info" },
      { url: "/payment/gateway", title: "Payment Gateway" },
      { url: "/payment/currencies", title: "Currencies" },
      { url: "/payment/reward", title: "Reward Info" },
    ],
  },
  {
    id: 17,
    name: "Admin Settings",
    icon: <i className="las la-user-cog text-2xl"></i>,
    url: "/admin-settings",
  },
  {
    id: 18,
    name: "Authentication",
    icon: <i className="las la-user-shield text-2xl"></i>,
    submenus: [
      { url: "/auth/signup", title: "Sign up" },
      { url: "/auth/signin", title: "Sign in" },
      { url: "/auth/error", title: "404 Error" },
    ],
  },
];
