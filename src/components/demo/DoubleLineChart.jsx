import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

class DoubleLineChart extends React.PureComponent {
    static demoUrl =
        'https://codesandbox.io/p/sandbox/line-chart-of-different-axis-intervals-d2kjmp';

    chart = (interval) => {
        const { data } = this.props; // Accessing data from props inside the chart method
        return (
            <ResponsiveContainer height={250} width="100%">
                <LineChart data={data} margin={{ right: 25, top: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={interval} />
                    <YAxis interval={interval} />
                    <Tooltip /> {/* Adding Tooltip component */}
                    <Legend verticalAlign="bottom" height={36} />
                    <Line type="monotone" dataKey="lead" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="conversion" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    render() {
        return (
            <>
                {this.chart('preserveEnd')}
                {/* {this.chart('preserveStart')}
        {this.chart('preserveStartEnd')}
        {this.chart('equidistantPreserveStart')}
        {this.chart(1)} */}
            </>
        );
    }
}

export default DoubleLineChart;
