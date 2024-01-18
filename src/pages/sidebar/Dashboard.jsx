import React from 'react';
import { useMDTContext } from '../../MDTContext';
import { PieChart } from '@mui/x-charts/PieChart';


const data = [
    { category: 'Category A', value: 30 },
    { category: 'Category B', value: 40 },
    { category: 'Category C', value: 20 },
    // Add more data points as needed
];

function Dashboard() {
    const { profiles, businesses, properties } = useMDTContext();

    const categoryCounts = businesses.reduce((counts, business) => {
        const category = business.category || 'Uncategorized';
        counts[category] = (counts[category] || 0) + 1;
        return counts;
    }, {});

    const chartData = Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        value: count,
    }));

    return (
        <PieChart
            series={[
                {
                    data: chartData,
                },
            ]}
            width={400}
            height={200}
        />
    );
}

export default Dashboard;
