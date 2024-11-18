import React, { PureComponent } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default class RadarChart extends PureComponent {
    render() {
        const { data } = this.props; // Destructure data from props

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <ResponsiveContainer width="100%" height="80%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="10%"
                        outerRadius="80%"
                        barSize={10}
                        data={data}
                    >
                        <RadialBar
                            minAngle={15}
                            label={{ position: 'insideStart', fill: '#fff' }}
                            background
                            clockWise
                            dataKey="uv"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}
