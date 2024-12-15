import React, { useState } from 'react';
import Slider from 'react-slick';
import WorkerStatsComp from '../../components/demo/workersComponents/WorkerStats';
import {
    FaSortAmountDown,
    FaTrophy,
    FaSortAmountUpAlt,
    FaChartLine,
    FaRegTimesCircle,
} from 'react-icons/fa';
import {
    TbRosetteNumber1,
    TbRosetteNumber2,
    TbRosetteNumber3,
    TbRosetteNumber4,
    TbRosetteNumber5,
} from 'react-icons/tb';
import { Dropdown } from 'primereact/dropdown';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const WorkersInfo = [
    {
        avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
        name: 'Robert Wolfkisser',
        position: 1,
        number: <TbRosetteNumber1 />,
        email: 'rob_wolf@gmail.com',
        role: 'Collaborator',
        positionStatus: <FaSortAmountUpAlt />,
        positionStatusColor: 'green-400',
        conversion: '73%',
        sales: 52,
        avgCheck: '12 500тг',
        iconColor: 'orange-400',
        iconInfo: 'BLA bla adasd calscml aslkmca lllw wlqmd dmlwmcoos mslaflfm qlmdql;wq csala!',
        icon: <FaTrophy />,
    },
    {
        avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png',
        name: 'Jill Jailbreaker',
        number: <TbRosetteNumber2 />,
        email: 'jj@breaker.com',
        position: 2,
        conversion: '63%',
        role: 'Collaborator',
        sales: 34,
        positionStatus: <FaSortAmountUpAlt />,
        positionStatusColor: 'green-400',
        avgCheck: '12 500тг',
        lastActive: '6 days ago',
        iconColor: 'green-400',
        iconInfo: 'BLA bla adasd calscml aslkmca lllw wlqmd dmlwmcoos mslaflfm qlmdql;wq csala!',
        icon: <FaSortAmountUpAlt />,
    },
    {
        avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
        name: 'Henry Silkeater',
        number: <TbRosetteNumber3 />,
        email: 'henry@silkeater.io',
        position: 3,
        role: 'Contractor',
        conversion: '43%',
        avgCheck: '12 500тг',
        positionStatus: <FaSortAmountDown />,
        positionStatusColor: 'red-400',
        lastActive: '2 days ago',
        sales: 40,
        iconColor: 'red-400',
        iconInfo: 'BLA bla adasd calscml aslkmca lllw wlqmd dmlwmcoos mslaflfm qlmdql;wq csala!',
        icon: <FaSortAmountDown />,
    },
    {
        avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
        name: 'Bill Horsefighter',
        number: <TbRosetteNumber4 />,
        email: 'bhorsefighter@gmail.com',
        position: 4,
        role: 'Contractor',
        conversion: '33%',
        positionStatus: <FaSortAmountDown />,
        positionStatusColor: 'red-400',
        avgCheck: '12 500тг',
        sales: 34,
        lastActive: '5 days ago',
        iconColor: 'red-400',
        iconInfo: 'BLA bla adasd calscml aslkmca lllw wlqmd dmlwmcoos mslaflfm qlmdql;wq csala!',
        icon: <FaSortAmountDown />,
    },
    {
        avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
        name: 'Jeremy Footviewer',
        number: <TbRosetteNumber5 />,
        email: 'jeremy@foot.dev',
        position: 5,
        role: 'Manager',
        positionStatus: <FaSortAmountDown />,
        positionStatusColor: 'red-400',
        conversion: '23%',
        avgCheck: '12 500тг',
        sales: 31,
        lastActive: '3 days ago',
        iconColor: 'green-400',
        iconInfo: 'BLA bla adasd calscml aslkmca lllw wlqmd dmlwmcoos mslaflfm qlmdql;wq csala!',
        icon: <FaSortAmountDown />,
    },
];
const stores = ['Все магазины', 'Алматы', 'Сатпаева', 'Панфилова'];

const WorkerStats = ({ workersList = WorkersInfo, mainTitle }) => {
    const [selectedStore, setSelectedStore] = useState('Все магазины');
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        customPaging: (i) => (
            <span className={`slider-number  ${i === currentSlide ? 'active' : 'inactive'}`}>
                {i + 1}
            </span> // Add active class conditionally
        ),
        responsive: [
            {
                breakpoint: 1024, // Tablets and smaller
                settings: {
                    slidesToShow: 2, // Show 2 cards on medium screens
                },
            },
            {
                breakpoint: 640, // Mobile devices
                settings: {
                    slidesToShow: 1, // Show only 1 card on mobile
                },
            },
        ],
    };

    const [currentSlide, setCurrentSlide] = React.useState(0);

    const handleSlideChange = (newIndex) => {
        setCurrentSlide(newIndex); // Update the current slide index
    };
    const handleStoreChange = async (e) => {
        setSelectedStore(e);
    };

    return (
        <div className="flex w-[90%] md:max-w-screen-lg flex-col   z-1 mt-10 gap-5 justify-center rounded-2xl subtle-border ">
            <div className="flex flex-row justify-between  p-5">
                <h2 className="flex justify-center mt-5 text-2xl xs:text-base">{mainTitle}</h2>
                <div className=" border-solid	 ">
                    <Dropdown
                        value={selectedStore}
                        onChange={(e) => handleStoreChange(e.value)}
                        options={stores}
                        optionLabel="name"
                        placeholder="Выберите магазин"
                        className="w-full md:w-14rem"
                    />
                </div>
            </div>

            <div className=" mb-10 p-0 md:p-8 dark:bg-secondary-dark-bg rounded-2xl">
                <Slider {...settings} beforeChange={(_, next) => handleSlideChange(next)}>
                    {workersList.map((worker, index) => (
                        <div key={index} className="flex flex-col items-center p-4">
                            <WorkerStatsComp worker={worker} />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default WorkerStats;
