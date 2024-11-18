import React, { PureComponent } from 'react';
import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export default class BarChartRe extends PureComponent {
    render() {
        const { data } = this.props;

        // Define a more refined color palette
        const colors = [
            '#003366', // Dark Navy Blue
            '#00509E', // Medium Navy Blue
            '#0072B8', // Light Blue
            '#A6C8E0', // Soft Light Blue
            '#B0C4DE', // Light Steel Blue
            '#C0D6E4', // Very Light Blue
        ];

        // Calculate the bar size based on the number of stores
        const numberOfStores =
            data.length > 0
                ? Object.keys(data[0]).filter((storeName) => storeName !== 'name').length
                : 0;
        const barSize = numberOfStores > 1 ? 30 : 50; // Adjust sizes as needed

        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {data.length > 0 &&
                        Object.keys(data[0])
                            .filter((storeName) => storeName !== 'name') // Filter out 'name' field
                            .map((storeName, index) => (
                                <Bar
                                    key={storeName}
                                    dataKey={storeName} // Map based on store name
                                    fill={colors[index % colors.length]} // Assign color based on index
                                    activeBar={<Rectangle fill="white" stroke="blue" />}
                                    barSize={barSize} // Set dynamic bar size
                                />
                            ))}
                </BarChart>
            </ResponsiveContainer>
        );
    }
}
