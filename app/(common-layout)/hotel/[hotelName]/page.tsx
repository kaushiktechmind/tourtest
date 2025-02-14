import React from "react";
import Abc from "../[hotelName]/Abc";

export async function generateMetadata({ params }: { params: { hotelName: string } }) {
    try {
        const { hotelName } = params;
        const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/hotel/${hotelName}`);
        const jsonData = await response.json();
        const hotelData = jsonData.data;

        return {
            title: hotelData?.meta_title || "Default Meta Title",
            description: hotelData?.meta_description || "Default Meta Description",
            keywords: "hotel, homestay, andman nicobar hotel, best hotel",
            openGraph: {
                title: hotelData?.meta_title || "Default OG Title",
                description: hotelData?.meta_description || "Default OG Description",
                type: "website",
                url: `https://tourism-bay-ten.vercel.app/hotel/${hotelName}`,

            },
            twitter: {
                card: "summary_large_image",
                title: hotelData?.meta_title || "Default Twitter Title",
                description: hotelData?.meta_description || "Default Twitter Description",
            },
        };
    } catch (error) {
        console.error("Failed to fetch metadata:", error);
        return {
            title: "Fallback Title",
            description: "Fallback Description",
            keywords: "fallback, default",
        };
    }
}

export default async function Page({ params }: { params: { hotelName: string } }) {
    const { hotelName } = params;

    // Fetch API data separately for use inside the component
    const response = await fetch(`https://yrpitsolutions.com/tourism_api/api/admin/hotel/${hotelName}`);
    const jsonData = await response.json();
    const hotelData = jsonData.data;

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Hotel",
        "name": hotelData?.meta_title || "Hotel Name",
        "description": hotelData?.meta_description || "Hotel Description",
        "url": `hhttps://tourism-bay-ten.vercel.app/hotel/${hotelName}`,
    };

    return (
        <div>
            {/* ✅ Inject Schema Markup as JSON-LD (Without <Head>) */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

            <Abc params={{ hotelName }} />
        </div>
    );
}
