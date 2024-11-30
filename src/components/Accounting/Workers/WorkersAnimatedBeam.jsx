import { FaSave, FaPlus } from 'react-icons/fa';
import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { AnimatedBeam } from '../../MagicUi/AnimateBeam';
import { ProfileModal } from './ProfileModal';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import QRCode from 'react-qr-code';

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

Circle.displayName = 'Circle';
function renderBeams(items, refs, containerRef) {
    return items.map((item, index) => {
        const toItem = items.find((target) => target.id === item.linkedTo);
        const toRef = toItem ? refs.current[items.indexOf(toItem)] : null;
        return (
            toRef &&
            refs.current[index] && (
                <AnimatedBeam
                    key={`beam-${item.id}`}
                    containerRef={containerRef}
                    fromRef={refs.current[index]}
                    toRef={toRef}
                    duration={3}
                />
            )
        );
    });
}

export default function AnimatedBeamMultipleOutputDemo({
    update,
    items,
    setItems,
    className,
    defaultImage,
}) {
    const containerRef = useRef(null);
    const [renderBeamsOn, setRenderBeamsOn] = useState(false);
    const [departmentName, setDepartmentName] = useState('');
    const [addDepartmentModal, setAddDepartmentModal] = useState(false);
    const [selectedLevel1, setSelectedLevel1] = useState('');
    const refs = useRef([]);
    const [tooltipModalMode, setTooltipModalMode] = useState(null);
    const [tooltipModalItem, setTooltipModalItem] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');
    const [editedDepartmentName, setEditedDepartmentName] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [showStoreModal, setShowStoreModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [message, setMessage] = useState('');

    // Use useCallback to memoize the function and prevent it from causing unnecessary re-renders
    const tooltipIconsClickHandler = (item, mode) => {
        setTooltipModalItem(item);
        setTooltipModalMode(mode);
        setCopySuccess('');
    };

    const renderTooltipModal = (item, mode) => {
        const handleCopyClick = (text) => {
            const companyId = localStorage.getItem('_id');
            navigator.clipboard
                .writeText(`${text}&companyId=${companyId}`)
                .then(() => {
                    setCopySuccess('Text copied!');
                })
                .catch(() => {
                    setCopySuccess('Failed to copy!');
                });
        };

        const saveEditedDepartmentName = () => {
            if (editedDepartmentName) {
                const updatedItems = items.map((item) => {
                    if (item.id === tooltipModalItem.id) {
                        return { ...item, name: editedDepartmentName };
                    }
                    return item;
                });
                const updateFetch = async () => {
                    const response = await fetch(
                        `https://nomalytica-back.onrender.com/api/departments/update-department/${tooltipModalItem.id}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                name: editedDepartmentName,
                            }),
                        },
                    );
                    const data = await response.json();
                    // console.log(data);
                };
                updateFetch();
                setItems(updatedItems);
                setTooltipModalMode(null);
                setTooltipModalItem(null);
            }
        };
        const renderTitle = (item, mode) => {
            if (mode === 'link') return 'Ссылка на добавление ' + `"${item.name}"`;
            if (mode === 'edit') return 'Редактировать ' + `"${item.name}"`;
            if (mode === 'delete') return 'Удалить ' + `"${item.name}"?`;
            return item.name;
        };

        const deleteDepartment = (item) => {
            let updatedItems = items.filter((i) => i.id !== item.id);
            updatedItems = updatedItems.filter((i) => i.linkedTo !== item.id);
            setItems(updatedItems);
            setTooltipModalMode(null);
            setTooltipModalItem(null);
        };

        return (
            <>
                {item !== null && mode !== null && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-[90%] w-[600px] relative">
                            <button
                                onClick={(e) => tooltipIconsClickHandler(null, null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            <h3 className="text-xl font-bold mb-4">{renderTitle(item, mode)}</h3>
                            <div className="flex flex-row w-full justify-center">
                                {mode !== 'delete' && (
                                    <>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded"
                                            placeholder={mode === 'edit' ? item.name : ''}
                                            defaultValue={mode === 'link' ? item.link : item.name}
                                            disabled={mode === 'link'}
                                            onChange={(e) => {
                                                setEditedDepartmentName(e.target.value);
                                            }}
                                        />
                                        <div className="flex justify-end gap-2">
                                            {mode === 'link' && (
                                                <button
                                                    onClick={(e) => handleCopyClick(item.link)}
                                                    className={
                                                        `cursor ml-2 px-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ` +
                                                        `${copySuccess ? 'bg-green-500 opacity-30 pointer-events-none' : ''}`
                                                    }
                                                >
                                                    {mode === 'link' ? 'Копировать' : ''}
                                                </button>
                                            )}{' '}
                                            {mode === 'edit' && (
                                                <button
                                                    onClick={(e) => saveEditedDepartmentName()}
                                                    className={
                                                        `cursor ml-2 px-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ` +
                                                        `${copySuccess ? 'bg-green-500 opacity-30 pointer-events-none' : ''}`
                                                    }
                                                >
                                                    {mode === 'edit' ? <FaSave /> : ''}
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                                {mode == 'delete' && (
                                    <div className="flex flex-row gap-8 justify-center">
                                        <button className="py-2 px-8 bg-blue-500 text-white bold">
                                            NO
                                        </button>
                                        <button
                                            onClick={(e) => deleteDepartment(item)}
                                            className="py-2 px-8 bg-blue-500 text-white bold"
                                        >
                                            YES
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };
    const renderAddDepartmentModal = () => {
        return (
            addDepartmentModal && (
                <>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
                        {/* Form to add department */}
                        <div className="top-4 left-4 bg-white p-6 border rounded-lg shadow-lg max-w-[90%] relative">
                            <button
                                onClick={(e) => {
                                    setAddDepartmentModal(false);
                                    setDepartmentName('');
                                    setSelectedLevel1('');
                                }}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            <h3 className="text-xl font-bold mb-2">Новый департамент</h3>
                            <form onSubmit={handleAddDepartment} className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Название"
                                    value={departmentName}
                                    onChange={(e) => {
                                        setDepartmentName(e.target.value);
                                    }}
                                    className="p-2 border rounded"
                                    required
                                />
                                <select
                                    value={selectedLevel1}
                                    onChange={(e) => setSelectedLevel1(e.target.value)}
                                    className="p-2 border rounded"
                                    required
                                >
                                    <option value="">Выбрать магазин</option>
                                    {items
                                        .filter((item) => item.level === 1)
                                        .map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                                <button
                                    type="submit"
                                    className="p-2 bg-blue-500 text-white rounded"
                                >
                                    Добавить
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )
        );
    };

    const handleAddDepartment = (e) => {
        setRenderBeamsOn(false);
        e.preventDefault();

        const fetchAddDepartment = async () => {
            const response = await fetch(
                `https://nomalytica-back.onrender.com/api/departments/create-department/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        storeId: selectedLevel1,
                        name: departmentName,
                    }),
                },
            );
            const data = await response.json();
            if (response.status === 201) {
                const newDepartment = {
                    icon: defaultImage(), // Default icon, can be customized
                    id: data.department._id, // Unique ID based on timestamp
                    name: departmentName,
                    level: 2,
                    linkedTo: data.department.storeId,
                    link: data.department.departmentLink,
                };
                setItems([newDepartment, ...items]);
                refs.current.push(React.createRef()); // Add a new ref for the new item
                setDepartmentName('');
                setAddDepartmentModal(false);
                setTimeout(() => {
                    setRenderBeamsOn(true);
                }, 1000);
            }
        };

        fetchAddDepartment();

        refs.current.push(React.createRef()); // Add a new ref for the new item
        setTimeout(() => {
            setRenderBeamsOn(true);
        }, 300);
        setSelectedLevel1('');
    };

    useEffect(() => {
        // Update refs to match the current items length
        refs.current = items.map((_, i) => refs.current[i] || React.createRef());
        if (items.length) {
            setRenderBeamsOn(true);
        }
    }, [items, renderBeamsOn, tooltipModalItem, update]);

    const qrRef = useRef(null);

    const handleQRDownload = () => {
        if (qrRef.current) {
            const svg = qrRef.current.querySelector('svg');
            if (!svg) {
                console.error('QR code SVG not found');
                return;
            }
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svg);
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'qrcode.svg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <>
            {renderTooltipModal(tooltipModalItem, tooltipModalMode)}
            {renderAddDepartmentModal()}
            <Dialog
                visible={showStoreModal}
                header={selectedStore?.name || ''}
                onHide={() => setShowStoreModal(false)}
            >
                <div ref={qrRef}>
                    <QRCode
                        title="GeeksForGeeks"
                        value={'http://192.168.0.105:3000?isQr=true'}
                        bgColor={'#FFFFFF'}
                        fgColor={'#000000'}
                        size={600}
                    />
                </div>
                <Button
                    className="mt-5 bg-blue-500 text-white rounded p-2 w-full"
                    onClick={() => handleQRDownload()}
                    label="Cкачать QR-код"
                />
            </Dialog>
            <div
                className={`mt-10 md:mt-0 ml-auto mr-auto relative flex h-[500px] max-w-[90%] items-center justify-center overflow-hidden rounded-lg border bg-white p-10 md:shadow-xl ${className}`}
                ref={containerRef}
            >
                <div className="flex size-full  flex-col h-full items-stretch justify-between gap-10">
                    {/* Top center circle (Level 1) */}
                    <div className="flex justify-center gap-10">
                        {items.map(
                            (item, index) =>
                                item.level === 1 && (
                                    <Button
                                        onClick={() => {
                                            setShowStoreModal(true);
                                            setSelectedStore(item);
                                        }}
                                        key={item.id}
                                        className="flex flex-col max-w-[120px] items-center gap-4 cursor-pointer"
                                    >
                                        <p className="text-center">{item.name}</p>
                                        <Circle
                                            key={item.id}
                                            ref={refs.current[index]}
                                            className="overflow-hidden"
                                        >
                                            <img
                                                src={defaultImage()}
                                                style={{ transform: 'scale(3)' }}
                                            />
                                        </Circle>
                                    </Button>
                                ),
                        )}
                    </div>
                    {selectedDepartment && (
                        <ProfileModal
                            department={selectedDepartment}
                            isOpen={selectedDepartment !== null}
                            tooltipIconsClickHandler={tooltipIconsClickHandler}
                            onClose={() => setSelectedDepartment(null)}
                        />
                    )}

                    {/* Middle center circle (Level 2) */}
                    <div className="flex justify-center mr-auto ml-auto gap-10">
                        {items.map(
                            (item, index) =>
                                item.level === 2 && (
                                    <div
                                        key={item.id}
                                        className="flex flex-col items-center gap-4 relative group cursor-pointer"
                                        onClick={() => setSelectedDepartment(item)}
                                    >
                                        <Circle
                                            key={item.id}
                                            ref={refs.current[index]}
                                            className="overflow-hidden"
                                        >
                                            <img
                                                src={defaultImage()}
                                                style={{ transform: 'scale(3)' }}
                                            />
                                        </Circle>
                                        <p className="text-center">{item.name}</p>
                                        {/* Tooltip with icons and triangle */}
                                        <div className="absolute left-full -ml-8 p-2 bg-white text-black text-sm rounded-lg border-2 border-gray-300 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-2 z-[9999] "></div>
                                    </div>
                                ),
                        )}
                        <div
                            key={'newDep'}
                            className="flex flex-col max-w-[120px] items-center gap-4 group cursor-pointer"
                            onClick={(e) => setAddDepartmentModal(true)}
                        >
                            <Circle key={'newDep'}>
                                <FaPlus color={'#3b82f6'} />
                            </Circle>
                            <p className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Добавить
                            </p>
                        </div>
                    </div>
                </div>

                {/* AnimatedBeams */}
                {renderBeamsOn && items.length && renderBeams(items, refs, containerRef)}
            </div>
        </>
    );
}
