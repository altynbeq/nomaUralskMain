"use client";

import React, {forwardRef, useRef, createRef, useState, useEffect} from "react";

import { AnimatedBeam } from "../../MagicUi/AnimateBeam";
import {setTime} from "@syncfusion/ej2-react-schedule";

const Circle = forwardRef(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={`z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] ${className}`}
        >
            {children}
        </div>
    );
});

Circle.displayName = "Circle";
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
function renderBeams (items, refs, containerRef) {
  return   items.map((item, index) => {
        const toItem = items.find(target => target.id === item.linkedTo);
        const toRef = toItem ? refs.current[items.indexOf(toItem)] : null;
        console.log(refs.current[index]);
        return toRef && refs.current[index] && (
            <AnimatedBeam
                key={`beam-${item.id}`}
                containerRef={containerRef}
                fromRef={refs.current[index]}
                toRef={toRef}
                duration={3}
            />
        );
    })
}

export default function AnimatedBeamMultipleOutputDemo({ items,setItems,Icons,className }) {
    const containerRef = useRef(null);
    const [renderBeamsOn, setRenderBeamsOn] = useState(true);
    const [workerName, setWorkerName] = useState('');
    const [workerRank, setWorkerRank] = useState('');
    const [selectedLevel2, setSelectedLevel2] = useState('');
    const refs = useRef([]);
    console.log(items, refs)



    const handleAddWorker = (e) => {
        setRenderBeamsOn(false);
        e.preventDefault();
        const newWorker = {
            icon: <Icons.whatsapp />, // Default icon, can be customized
            id: `worker-${Date.now()}`, // Unique ID based on timestamp
            name: workerName,
            rank: workerRank,
            level: 3,
            linkedTo: selectedLevel2
        };
        console.log(selectedLevel2);
        console.log(newWorker);
        setItems([...items, newWorker]);
        refs.current.push(React.createRef()); // Add a new ref for the new item
        setWorkerName('');
        setWorkerRank('');
        setSelectedLevel2('');
setTimeout(()=>{        setRenderBeamsOn(true);},1000)
    };

    useEffect(() => {
        // Update refs to match the current items length
            refs.current = items.map((_, i) => refs.current[i] || React.createRef());

    }, [items, renderBeamsOn]);

    return (
        <>
        {/* Form to add worker */}
    <div className="top-4 left-4 bg-white p-6 border rounded-lg shadow-lg max-w-[90%] m-auto mb-2">
        <h3 className="text-xl font-bold mb-2">Add Worker</h3>
        <form onSubmit={handleAddWorker} className="flex  gap-4">
            <input
                type="text"
                placeholder="Worker Name"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                className="p-2 border rounded"
                required
            />
            <input
                type="text"
                placeholder="Worker Rank"
                value={workerRank}
                onChange={(e) => setWorkerRank(e.target.value)}
                className="p-2 border rounded"
                required
            />
            <select
                value={selectedLevel2}
                onChange={(e) => setSelectedLevel2(e.target.value)}
                className="p-2 border rounded"
                required
            >
                <option value="">Select Level 2 Department</option>
                {items.filter(item => item.level === 2).map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                ))}
            </select>
            <button type="submit" className="p-2 bg-blue-500 text-white rounded ml-auto ">
                Add Worker
            </button>
        </form>
    </div>

        <div
            className={`mt-10 md:mt-0 ml-auto mr-auto relative flex h-[500px] max-w-[90%] items-center justify-center overflow-hidden rounded-lg border bg-white p-10 md:shadow-xl ${className}`}
            ref={containerRef}
        >
            <div className="flex size-full  flex-col h-full items-stretch justify-between gap-10">
                {/* Top center circle (Level 1) */}
                <div className="flex justify-center">
                    {items.map((item, index) => (
                        item.level === 1 && (
                            <div key={item.id} className="flex flex-col max-w-[120px] items-center gap-4">
                                <p className="text-center">{item.name}</p>
                                <Circle key={item.id} ref={refs.current[index]}>
                                    {item.icon}
                                </Circle>
                            </div>
                        )
                    ))}
                </div>

                {/* Middle center circle (Level 2) */}
                <div className="flex justify-center mr-auto ml-auto gap-10">
                    {items.map((item, index) => (
                        item.level === 2 && (
                            <div key={item.id} className="flex flex-col max-w-[150px] items-center gap-4">
                                <Circle key={item.id} ref={refs.current[index]} className="size-16">
                                    {item.icon}
                                </Circle>
                                <p className="text-center">{item.name}</p>
                            </div>
                        )
                    ))}
                </div>

                {/* Bottom row of circles (Level 3) */}
                <div className="flex justify-between gap-8">
                    {items.map((item, index) => (
                        item.level === 3 && (
                            <div key={item.id} className="flex flex-col max-w-[120px] items-center gap-1">
                                <Circle ref={refs.current[index]}>
                                    {item.icon}
                                </Circle>
                                <p className="text-center">{item.name}</p>
                                <p className="text-xs font-bold text-center">{item.rank}</p>
                            </div>
                        )
                    ))}
                </div>
            </div>

            {/* AnimatedBeams */}
            {renderBeamsOn && renderBeams(items, refs, containerRef)}

        </div>
        </>
    );
}

