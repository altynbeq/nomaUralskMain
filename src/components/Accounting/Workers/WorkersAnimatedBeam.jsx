"use client";
import {FaLink, FaEdit, FaTrashAlt, FaSave} from "react-icons/fa";

import React, {forwardRef, useRef, useState, useEffect} from "react";

import { AnimatedBeam } from "../../MagicUi/AnimateBeam";

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
        // console.log(refs.current[index]);
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
    const [departmentName, setDepartmentName] = useState('');
    const [selectedLevel2, setSelectedLevel2] = useState('');
    const refs = useRef([]);
    const [tooltipModalMode, setTooltipModalMode] = useState(null);
    const [tooltipModalItem, setTooltipModalItem] = useState(null)
    const [copySuccess, setCopySuccess] = useState('');
    const [editedDepartmentName, setEditedDepartmentName] = useState('');

    // console.log(items, refs)

    const handleAddDepartment = (e) => {
        setRenderBeamsOn(false);
        e.preventDefault();
        const newDepartment = {
            icon: <Icons.googleDrive />, // Default icon, can be customized
            id: `department-${Date.now()}`, // Unique ID based on timestamp
            name: departmentName,
            level: 2,
            linkedTo: 'main',
            link: 'https://google.com'
        };
        setItems([newDepartment, ...items]);
        refs.current.push(React.createRef()); // Add a new ref for the new item
        setDepartmentName('');
        setTimeout(()=>{        setRenderBeamsOn(true);}, 1000)
    };

    // Use useCallback to memoize the function and prevent it from causing unnecessary re-renders
    const tooltipIconsClickHandler = (item, mode) => {
        setTooltipModalItem(item);
        setTooltipModalMode(mode);
        setCopySuccess('');
    }

    const renderTooltipModal = (item, mode) => {

const handleCopyClick = (text) => {
            navigator.clipboard.writeText(text)
                .then(() => {
                    setCopySuccess('Text copied!');
                })
                .catch(() => {
                    setCopySuccess('Failed to copy!');
                });
        };

const saveEditedDepartmentName = () => {
    if(editedDepartmentName) {
        const updatedItems = items.map(item => {
            if (item.id === tooltipModalItem.id) {
                return {...item, name: editedDepartmentName};
            }
            return item;
        });
        setItems(updatedItems);
        setTooltipModalMode(null);
        setTooltipModalItem(null);
    }
}
const renderTitle = (item, mode) => {
    if(mode === 'link') return 'Ссылка на добавление ' + `"${item.name}"`
    if(mode === 'edit') return 'Редактировать ' + `"${item.name}"`
    if(mode === 'delete') return 'Удалить '  + `"${item.name}"?`
    return item.name
}

const deleteDepartment = (item) => {
        let updatedItems = items.filter(i => i.id !== item.id);
        updatedItems = updatedItems.filter(i=> i.linkedTo !== item.id);
        setItems(updatedItems);
        setTooltipModalMode(null);
        setTooltipModalItem(null);

}

        return (
            <>{
                  item !== null && mode !== null && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-[90%] w-[600px] relative">
                            <button onClick={(e) => tooltipIconsClickHandler(null, null)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                            <h3 className="text-xl font-bold mb-4">{renderTitle(item,mode)}</h3>
                            <div className="flex flex-row w-full justify-center">
                                { mode !== 'delete' && <>
                                <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder={mode === 'edit' ? item.name : ''}
                                defaultValue={
                                    mode === 'link' ? item.link : item.name
                                }
                                disabled={mode === 'link'}
                                onChange={(e)=>{setEditedDepartmentName(e.target.value)}}
                                />
                                <div className="flex justify-end gap-2">
                                    {
                                        mode === 'link' && <button
                                            onClick={(e) => handleCopyClick(item.link)}
                                            className={`cursor ml-2 px-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ` + `${copySuccess ? 'bg-green-500 opacity-30 pointer-events-none' : ''}`}>
                                            {mode === 'link' ? 'Копировать' : ''}
                                        </button>
                                    }                           {
                                        mode === 'edit' && <button
                                            onClick={(e)=>saveEditedDepartmentName()}
                                            className={`cursor ml-2 px-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ` + `${copySuccess ? 'bg-green-500 opacity-30 pointer-events-none' : ''}`}>
                                            {mode === 'edit' ?   <FaSave/> : ''}

                                        </button>
                                    }
                                </div>
                        </>
                        }
                                { mode == 'delete' && <div className="flex flex-row gap-8 justify-center">
                             <button className="py-2 px-8 bg-blue-500 text-white bold">NO</button>
                             <button
                                 onClick={(e)=>deleteDepartment(item)}
                                 className="py-2 px-8 bg-blue-500 text-white bold">YES</button>
                                </div>}
                            </div>

                        </div>
                    </div>
                )
            }

            </>

        )
    }


    const handleAddWorker = (e) => {
        setRenderBeamsOn(false);
        e.preventDefault();
        const newWorker = {
            icon: <Icons.whatsapp/>, // Default icon, can be customized
            id: `worker-${Date.now()}`, // Unique ID based on timestamp
            name: workerName,
            rank: workerRank,
            level: 3,
            linkedTo: selectedLevel2
        };
        // console.log(selectedLevel2);
        // console.log(newWorker);
        setItems([...items, newWorker]);
        refs.current.push(React.createRef()); // Add a new ref for the new item
        setWorkerName('');
        setWorkerRank('');
        setSelectedLevel2('');
        setTimeout(() => {
            setRenderBeamsOn(true);
        }, 1000)
    };

    useEffect(() => {
        // Update refs to match the current items length
        refs.current = items.map((_, i) => refs.current[i] || React.createRef());

    }, [items, renderBeamsOn,tooltipModalItem]);

    return (
        <>
            {
                renderTooltipModal(tooltipModalItem, tooltipModalMode)
            }
            {/* Form to add department */}
            <div className="top-4 left-4 bg-white p-6 border rounded-lg shadow-lg max-w-[90%] m-auto mb-2">
                <h3 className="text-xl font-bold mb-2">Add Department</h3>
                <form onSubmit={handleAddDepartment} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Department Name"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        className="p-2 border rounded"
                        required
                    />
                    <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                        Add Department
                    </button>
                </form>
            </div>

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
                            <div
                                key={item.id}
                                className="flex flex-col max-w-[150px] items-center gap-4 relative group"
                            >
                                <Circle ref={refs.current[index]} className="size-16">
                                    {item.icon}
                                </Circle>
                                <p className="text-center">{item.name}</p>
                                {/* Tooltip with icons and triangle */}
                                <div className="absolute left-full -ml-8 p-2 bg-white text-black text-sm rounded-lg border-2 border-gray-300 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-2 z-[9999] ">
                                    {/* Triangle */}
                                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-gray-300"></div>

                                    {/* First row: Link and Edit icons */}
                                    <div className="flex gap-2">
                                        <div
                                            onClick={(e) => {
                                                tooltipIconsClickHandler(item, 'link')
                                            }}
                                            className="w-8 h-8 bg-white flex items-center justify-center rounded-full border-2 border-gray-300 shadow cursor-pointer">
                                            <FaLink />
                                        </div>
                                        <div
                                            onClick={(e)=>{
                                                tooltipIconsClickHandler(item,'edit')}}
                                            className="w-8 h-8 bg-white flex items-center justify-center rounded-full border-2 border-gray-300 shadow cursor-pointer">
                                            <FaEdit/>
                                        </div>
                                    </div>
                                    {/* Second row: Trash bin icon */}
                                    <div
                                        onClick={(e)=>{
                                            tooltipIconsClickHandler(item, 'delete')}}
                                        className="mx-auto w-8 h-8 bg-white flex items-center justify-center rounded-full border-2 border-gray-300 shadow cursor-pointer">
                                        <FaTrashAlt />
                                    </div>
                                </div>
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

