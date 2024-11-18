import React, { PureComponent } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export default class Example extends PureComponent {
    static demoUrl = 'https://codesandbox.io/p/sandbox/stacked-area-chart-forked-5yjhcs';

    // Utility function to determine margin based on window width
    getLeftMargin() {
        return window.innerWidth < 768 ? 20 : 50; // 768px as a breakpoint for mobile
    }
    getBotMargin() {
        return window.innerWidth < 768 ? 35 : 66; // 768px as a breakpoint for mobile
    }
    render() {
        const { data } = this.props;

        // Extract store names from the data
        const storeNames =
            data.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'name') : [];

        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    width={500}
                    height={400}
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: this.getLeftMargin(), // Conditional left margin based on window width
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={this.getBotMargin} />

                    {/* Render an Area for each store dynamically */}
                    {storeNames.map((storeName) => (
                        <Area
                            key={storeName}
                            type="monotone"
                            dataKey={storeName} // Use the store name as dataKey
                            stackId="1"
                            stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Generate random color for each store
                            fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Generate random color for each store
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        );
    }
}
