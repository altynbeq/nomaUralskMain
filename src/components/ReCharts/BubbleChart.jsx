import React, { PureComponent } from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const data01 = [
    { hour: 'Ч', index: 1, value: 170, label: 'Monday' },
    { hour: 'П', index: 0, value: 0, label: 'Monday' },
    { hour: 'С', index: 1, value: 150, label: 'Monday' },
    { hour: 'В', index: 0, value: 0, label: 'Monday' },
    { hour: 'П', index: 1, value: 200, label: 'Monday' },
    { hour: 'В', index: 1, value: 300, label: 'Monday' },
    { hour: 'С', index: 1, value: 400, label: 'Monday' },
];

const data02 = [
    { hour: '12a', index: 1, value: 160 },
    { hour: '1a', index: 0, value: 0 },
    { hour: '2a', index: 1, value: 150 },
    { hour: '3a', index: 0, value: 0 },
    { hour: '4a', index: 1, value: 200 },
    { hour: '5a', index: 1, value: 300 },
    { hour: '6a', index: 1, value: 100 },
    { hour: '7a', index: 1, value: 200 },
    { hour: '8a', index: 1, value: 100 },
];

const parseDomain = () => [
    0,
    Math.max(
        Math.max.apply(
            null,
            data01.map((entry) => entry.value),
        ),
        // Math.max.apply(
        //   null,
        //   data02.map((entry) => entry.value),
        // ),
    ),
];

export default class BubbleChart extends PureComponent {
    static demoUrl = 'https://codesandbox.io/p/sandbox/multi-bubble-chart-tcqkqx';

    renderTooltip = (props) => {
        const { active, payload } = props;

        if (active && payload && payload.length) {
            const data = payload[0] && payload[0].payload;

            return (
                <div
                    style={{
                        backgroundColor: '#fff',
                        border: '1px solid #999',
                        margin: 0,
                        padding: 10,
                    }}
                >
                    <p>{data.hour}</p>
                    <p>
                        <span>value: </span>
                        {data.value}
                    </p>
                </div>
            );
        }

        return null;
    };

    render() {
        const domain = parseDomain();
        const range = [16, 225];

        return (
            <div style={{ width: '100%' }}>
                <ResponsiveContainer width="100%" height={60}>
                    <ScatterChart
                        width={800}
                        height={60}
                        margin={{
                            top: 10,
                            right: 0,
                            bottom: 0,
                            left: 0,
                        }}
                    >
                        <XAxis
                            type="category"
                            dataKey="hour"
                            name="hour"
                            interval={0}
                            tickLine={{ transform: 'translate(0, -6)' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="index"
                            height={10}
                            width={10}
                            tick={false}
                            tickLine={false}
                            axisLine={false}
                            // label={{ value: 'Saturday', position: 'insideRight' }}
                        />
                        <ZAxis type="number" dataKey="value" domain={domain} range={range} />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            wrapperStyle={{ zIndex: 100 }}
                            content={this.renderTooltip}
                        />
                        <Scatter data={data01} fill="#8884d8" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        );
    }
}
