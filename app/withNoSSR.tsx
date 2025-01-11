// pages/my-page-no-ssr.tsx

import dynamic from 'next/dynamic';

// Dynamically import the page with SSR disabled
const MyPageNoSSR = dynamic(() => import('./(common-layout)/cab-receipt/page'), { ssr: false });

export default MyPageNoSSR;
