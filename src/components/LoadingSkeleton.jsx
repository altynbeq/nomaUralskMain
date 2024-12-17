import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

const LoadingSkeleton = (props) => {
    return (
        <div
            className="flex justify-center align-center w-[100%]"
            style={{ minHeight: props.height }}
        >
            <Box sx={{ width: '100%', height: props.height ? props.height - 100 : '100%' }}>
                <Skeleton variant="rectangular" width="100%" height="100%" />
                <Skeleton width="60%" />
                <Skeleton width="80%" />
                <Skeleton width="40%" />
            </Box>
        </div>
    );
};

export default LoadingSkeleton;
