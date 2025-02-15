import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const urls = [
      'https://yrpitsolutions.com/tourism_api/api/admin/hotels',
      'https://yrpitsolutions.com/tourism_api/api/cab-main-forms',
      'https://yrpitsolutions.com/tourism_api/api/admin/get_package',
      'https://yrpitsolutions.com/tourism_api/api/admin/get_all_activity',
    ];

    // Fetch data from APIs with error handling
    const responses = await Promise.all(
      urls.map((url) =>
        fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        }).then(async (res) => (res.ok ? res.json() : Promise.reject(`Failed to fetch: ${url}`)))
      )
    );

    const [hotelData, cabData, packageData, activityData] = responses;

    // Ensure data arrays are valid
    const hotels = Array.isArray(hotelData?.data) ? hotelData.data : [];
    const cabs = Array.isArray(cabData) ? cabData : [];
    const packages = Array.isArray(packageData) ? packageData : []; 
    const activities = Array.isArray(activityData) ? activityData : [];

    // Static routes
    const staticRoutes = [
      { url: 'https://andman-latest.vercel.app', lastModified: new Date().toISOString() },
      { url: 'https://andman-latest.vercel.app/ferry-list/single_trip', lastModified: new Date().toISOString() },
    ];

    // Dynamic routes
    const createRoutes = (data: { seo_title: string }[], path: string) =>
      data.map(({ seo_title }) => ({
        url: `https://andman-latest.vercel.app/${path}/${seo_title}`,
        lastModified: new Date().toISOString(),
      }));

    return [
      ...staticRoutes,
      ...createRoutes(hotels, 'hotel'),
      ...createRoutes(cabs, 'cab'),
      ...createRoutes(packages, 'package'),
      ...createRoutes(activities, 'activity'),
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [];
  }
}
