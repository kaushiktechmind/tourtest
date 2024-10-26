// pages/admin/dashboard.tsx
import { useEffect, useState } from 'react';
// import axiosInstance from '../../utils/axiosInstance';

// Define your data type
interface DataItem {
    id: number;   // Adjust based on your API response
    name: string; // Adjust based on your API response
    // Add other properties as needed
}

const Dashboard = () => {
    const [data, setData] = useState<DataItem[]>([]); // Use the interface here

    const fetchData = async () => {
        try {
            // const response = await axiosInstance.get<DataItem[]>('/data-endpoint'); // Specify the type for the response
            // setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <ul>
                {data.map(item => (
                    <li key={item.id}>{item.name}</li> // Now TypeScript knows item has a name
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
