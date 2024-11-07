import React, { PureComponent } from 'react';
import { PieChart, Tooltip, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';



export default class HalfPie extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/pie-chart-of-straight-angle-oz0th';

  render() {
    const { data } = this.props;
    console.log("HalfPie data:", data);
    return (
      <ResponsiveContainer width="100%" height="200%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#2b59b4"
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
