import React from 'react';

const ChartLegend = ({ data }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '10px',
            }}
        >
            {data.map((entry) => (
                <div
                    key={entry.name}
                    style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}
                >
                    <div
                        style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: entry.fill,
                            marginRight: '5px',
                        }}
                    ></div>
                    <span style={{ fontSize: '14px' }}>{entry.name}</span>
                </div>
            ))}
        </div>
    );
};

export default ChartLegend;
