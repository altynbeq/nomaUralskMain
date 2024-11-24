import React, { useEffect } from 'react';
import { WorkerStats } from '../components/Workers';
import WorkersList from '../components/demo/WorkersList';

const Workers = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="mt-12 w-[100%] flex flex-col gap-3  justify-center ">
            <div className="flex w-[100%] flex-wrap  gap-5 justify-center">
                <WorkersList />
            </div>
            <div className="flex w-[100%] flex-wrap  gap-5 justify-center   ">
                <WorkerStats mainTitle="Показатели флористов" />
            </div>
        </div>
    );
};

export default Workers;
