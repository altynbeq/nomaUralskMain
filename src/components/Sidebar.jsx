import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaChartPie } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { links } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import { useSubUserStore } from '../store/index';

const Sidebar = () => {
    const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();
    const [filteredLinks, setFilteredLinks] = useState([]);
    const access = useSubUserStore((state) => state.accesses);
    const subUser = useSubUserStore((state) => state.subUser);

    const handleCloseSideBar = () => {
        if (activeMenu !== undefined && screenSize <= 900) {
            setActiveMenu(false);
        }
    };

    useEffect(() => {
        if (!access && !subUser) {
            return;
        }
        if (access && Object.keys(subUser).length > 0) {
            const newFilteredLinks = links
                .map((category) => {
                    if (category.title === 'Учёт' && !access.DataManagement) {
                        return null;
                    }

                    let filteredCategoryLinks = category.links.filter((link) => {
                        if (access.Analytics) {
                            if (link.name === 'finance' && !access.Analytics.Finance) return false;
                            if (link.name === 'sales' && !access.Analytics.Sales) return false;
                            if (link.name === 'workers' && !access.Analytics.Workers) return false;
                            if (link.name === 'sklad' && !access.Analytics.Warehouse) return false;
                        }
                        return true;
                    });

                    // Условие для скрытия "finance" при определенном companyId
                    if (subUser?.companyId === '6720f0a45801c6007e836aa4') {
                        filteredCategoryLinks = filteredCategoryLinks.filter(
                            (link) => link.name !== 'finance',
                        );
                    }

                    if (Object.keys(subUser).length > 0) {
                        filteredCategoryLinks = filteredCategoryLinks.filter(
                            (link) => link.name !== 'sales',
                        );
                    }

                    if (filteredCategoryLinks.length === 0) {
                        return null;
                    }

                    return {
                        ...category,
                        links: filteredCategoryLinks,
                    };
                })
                .filter((category) => category !== null);

            setFilteredLinks(newFilteredLinks);
        } else {
            setFilteredLinks(
                links
                    .map((category) => {
                        let filteredCategoryLinks = category.links;

                        // Условие для скрытия "finance" при определенном companyId
                        if (subUser?.companyId === '6720f0a45801c6007e836aa4') {
                            filteredCategoryLinks = filteredCategoryLinks.filter(
                                (link) => link.name !== 'finance',
                            );
                        }

                        if (filteredCategoryLinks.length === 0) {
                            return null;
                        }

                        return {
                            ...category,
                            links: filteredCategoryLinks,
                        };
                    })
                    .filter((category) => category !== null),
            );
        }
    }, [access, subUser]);

    const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
    const normalLink =
        'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

    return (
        <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
            {activeMenu === true && (
                <>
                    <div className="flex justify-between items-center">
                        <Link
                            to="/"
                            onClick={handleCloseSideBar}
                            className="items-center gap-3 ml-3 mt-4 flex flex-row text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
                        >
                            <span className="flex flex-row p-1 gap-1">
                                N<FaChartPie className="mt-1" />
                                malytica
                            </span>
                        </Link>
                        <TooltipComponent content="Menu" position="BottomCenter">
                            <button
                                type="button"
                                onClick={() => setActiveMenu(!activeMenu)}
                                style={{ color: currentColor }}
                                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
                            >
                                <MdOutlineCancel />
                            </button>
                        </TooltipComponent>
                    </div>
                    <div className="mt-10">
                        {filteredLinks.map((item) => (
                            <div key={item.title}>
                                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                                    {item.title}
                                </p>
                                {item.links.map((link) => (
                                    <NavLink
                                        to={`/${link.name}`}
                                        key={link.name}
                                        onClick={handleCloseSideBar}
                                        style={({ isActive }) => ({
                                            backgroundColor: isActive ? currentColor : '',
                                        })}
                                        className={({ isActive }) =>
                                            isActive ? activeLink : normalLink
                                        }
                                    >
                                        {link.icon}
                                        <span>{link.text}</span>
                                    </NavLink>
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;
