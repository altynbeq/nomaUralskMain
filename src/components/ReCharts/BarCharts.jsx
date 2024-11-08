import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 41000,
  },
  {
    name: 'Page B',
    uv: 32000,
  },
  {
    name: 'Page C',
    uv: 21000,
  },
  {
    name: 'Page D',
    uv: 22780,
  },
  {
    name: 'Page E',
    uv: 12890,
  },
  {
    name: 'Page F',
    uv: 23390,
  },
  {
    name: 'Page G',
    uv: 34190,
  },
];


function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    // console.log(payload);
    return (
        <div className="custom-tooltip bg-white p-4">
          <p className="label mb-2">{`${payload[0].payload.x}`}</p>
          <p className="label">{`${payload[0].value} ₸`}</p>
        </div>
    );
  }
  return null;
}

export default class BarChartRe extends PureComponent {
  static demoUrl = 'https://codesandbox.io/p/sandbox/simple-bar-chart-72d7y5';


  render() {
    const { data } = this.props;
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
          <XAxis dataKey="x" />
          {/* <YAxis dataKey="y" /> */}
          <Tooltip content={<CustomTooltip />} />

          {/* <Legend /> */}
          {/* <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} /> */}
          <Bar dataKey="y" fill="#ffff" activeBar={<Rectangle fill="white" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
