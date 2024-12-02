import React, { useEffect, useState } from 'react';
import WorkersAnimatedBeam from '../components/Accounting/Workers/WorkersAnimatedBeam';
import { SubusersList } from '../components/Accounting/Workers/SubusersList';
import { isValidDepartmentId } from '../methods/isValidDepartmentId';

const AccountingWorkers = () => {
    const [structure, setStructure] = useState('');
    const [itemsFromStructure, setItemsFromStructure] = useState([]);
    const [stores, setStores] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [subUsers, setSubUsers] = useState([]);
    const [update, setUpdate] = useState(false);
    const [currentUserId, setCurrentUserId] = useState('');

    const fetchStructure = async (id) => {
        const url = `https://nomalytica-back.onrender.com/api/structure/get-structure-by-userId/${id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const defaultImage = () => {
        return 'data:image/jpeg;base64,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';
    };

    const buildStores = (structure) => {
        structure.stores.forEach((item) => {
            //if store is not in stores array, add it
            if (!stores.includes(item)) {
                stores.push({
                    id: item._id,
                    icon: defaultImage(),
                    name: item.storeName,
                    level: 1,
                });
            }
        });
        // console.log("=>(AccountingWorkers.jsx:25) stores", stores);
        return stores;
    };

    const buildDepartments = (structure) => {
        structure.departments.forEach((item) => {
            if (!departments.includes(item)) {
                departments.push({
                    id: item._id,
                    icon: defaultImage(),
                    name: item.name,
                    level: 2,
                    linkedTo: item.storeId,
                    link: item.departmentLink,
                });
            }
        });
        // console.log("=>(AccountingWorkers.jsx:44) departments", departments);
        return departments;
    };

    const buildSubUsers = (structure) => {
        structure.subUsers.forEach((item) => {
            if (!subUsers.includes(item)) {
                subUsers.push({
                    id: item._id,
                    icon: defaultImage(),
                    name: item.name,
                    level: 3,
                    linkedTo: item.departmentId,
                });
            }
        });
        // console.log("=>(AccountingWorkers.jsx:54) subUsers", subUsers);
        return subUsers;
    };

    const buildItems = () => {
        // console.log("=>(AccountingWorkers.jsx:82) ", stores,departments,subUsers);
        const items = stores.concat(departments, subUsers);

        // console.log("=>(AccountingWorkers.jsx:60) items", items);
        return items;
    };

    useEffect(() => {
        if (update) {
            setDepartments([]);
            setStores([]);
            setSubUsers([]);
            setStructure('');
            setItemsFromStructure([]);
            setUpdate(false);
        }

        const currentUserId = localStorage.getItem('_id');
        const companyId = localStorage.getItem('companyId');
        const departmentId = localStorage.getItem('departmentId');
        if (!structure) {
            fetchStructure(isValidDepartmentId(departmentId) ? companyId : currentUserId).then(
                (result) => {
                    setStructure(result);
                },
            );
        }

        if (structure && departments.length === 0) {
            setDepartments(buildDepartments(structure));
        }
        if (structure && stores.length === 0) {
            setStores(buildStores(structure));
        }
        if (structure && subUsers.length === 0) {
            setSubUsers(buildSubUsers(structure));
        }

        if (structure && itemsFromStructure.length === 0) {
            setItemsFromStructure(buildItems());
        }
    }, [structure]);

    const Icons = {
        notion: () => (
            <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z"
                    fill="#ffffff"
                />
                <path
                    d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z"
                    fill="#000000"
                    fillRule="evenodd"
                    clipRule="evenodd"
                />
            </svg>
        ),
        openai: () => (
            <svg width="100" height="100" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
            </svg>
        ),
        googleDrive: () => (
            <svg width="100" height="100" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
                    fill="#0066da"
                />
                <path
                    d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
                    fill="#00ac47"
                />
                <path
                    d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
                    fill="#ea4335"
                />
                <path
                    d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
                    fill="#00832d"
                />
                <path
                    d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
                    fill="#2684fc"
                />
                <path
                    d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
                    fill="#ffba00"
                />
            </svg>
        ),
        whatsapp: () => (
            <svg
                width="100"
                height="100"
                viewBox="0 0 175.216 175.552"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient
                        id="b"
                        x1="85.915"
                        x2="86.535"
                        y1="32.567"
                        y2="137.092"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#57d163" />
                        <stop offset="1" stopColor="#23b33a" />
                    </linearGradient>
                    <filter
                        id="a"
                        width="1.115"
                        height="1.114"
                        x="-.057"
                        y="-.057"
                        colorInterpolationFilters="sRGB"
                    >
                        <feGaussianBlur stdDeviation="3.531" />
                    </filter>
                </defs>
                <path
                    d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0"
                    fill="#b3b3b3"
                    filter="url(#a)"
                />
                <path
                    d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
                    fill="#ffffff"
                />
                <path
                    d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"
                    fill="url(#linearGradient1780)"
                />
                <path
                    d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
                    fill="url(#b)"
                />
                <path
                    d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
                    fill="#ffffff"
                    fillRule="evenodd"
                />
            </svg>
        ),
        googleDocs: () => (
            <svg width="47px" height="65px" viewBox="0 0 47 65" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <path
                        d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z"
                        id="path-1"
                    />
                    <path
                        d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z"
                        id="path-3"
                    />
                    <linearGradient
                        x1="50.0053945%"
                        y1="8.58610612%"
                        x2="50.0053945%"
                        y2="100.013939%"
                        id="linearGradient-5"
                    >
                        <stop stopColor="#1A237E" stopOpacity="0.2" offset="0%" />
                        <stop stopColor="#1A237E" stopOpacity="0.02" offset="100%" />
                    </linearGradient>
                    <path
                        d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z"
                        id="path-6"
                    />
                    <path
                        d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z"
                        id="path-8"
                    />
                    <path
                        d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z"
                        id="path-10"
                    />
                    <path
                        d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z"
                        id="path-12"
                    />
                    <path
                        d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z"
                        id="path-14"
                    />
                    <radialGradient
                        cx="3.16804688%"
                        cy="2.71744318%"
                        fx="3.16804688%"
                        fy="2.71744318%"
                        r="161.248516%"
                        gradientTransform="translate(0.031680,0.027174),scale(1.000000,0.723077),translate(-0.031680,-0.027174)"
                        id="radialGradient-16"
                    >
                        <stop stopColor="#FFFFFF" stopOpacity="0.1" offset="0%" />
                        <stop stopColor="#FFFFFF" stopOpacity="0" offset="100%" />
                    </radialGradient>
                </defs>
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-451.000000, -463.000000)">
                        <g id="Hero" transform="translate(0.000000, 63.000000)">
                            <g id="Personal" transform="translate(277.000000, 309.000000)">
                                <g id="Docs-icon" transform="translate(174.000000, 91.000000)">
                                    <g id="Group">
                                        <g id="Clipped">
                                            <mask id="mask-2" fill="white">
                                                <use xlinkHref="#path-1" />
                                            </mask>
                                            <g id="SVGID_1_" />
                                            <path
                                                d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L36.71875,10.3409091 L29.375,0 Z"
                                                id="Path"
                                                fill="#4285F4"
                                                fillRule="nonzero"
                                                mask="url(#mask-2)"
                                            />
                                        </g>
                                        <g id="Clipped">
                                            <mask id="mask-4" fill="white">
                                                <use xlinkHref="#path-3" />
                                            </mask>
                                            <g id="SVGID_1_" />
                                            <polygon
                                                id="Path"
                                                fill="url(#linearGradient-5)"
                                                fillRule="nonzero"
                                                mask="url(#mask-4)"
                                                points="30.6638281 16.4309659 47 32.8582386 47 17.7272727"
                                            ></polygon>
                                        </g>
                                        <g id="Clipped">
                                            <mask id="mask-7" fill="white">
                                                <use xlinkHref="#path-6" />
                                            </mask>
                                            <g id="SVGID_1_" />
                                            <path
                                                d="M11.75,47.2727273 L35.25,47.2727273 L35.25,44.3181818 L11.75,44.3181818 L11.75,47.2727273 Z M11.75,53.1818182 L29.375,53.1818182 L29.375,50.2272727 L11.75,50.2272727 L11.75,53.1818182 Z M11.75,32.5 L11.75,35.4545455 L35.25,35.4545455 L35.25,32.5 L11.75,32.5 Z M11.75,41.3636364 L35.25,41.3636364 L35.25,38.4090909 L11.75,38.4090909 L11.75,41.3636364 Z"
                                                id="Shape"
                                                fill="#F1F1F1"
                                                fillRule="nonzero"
                                                mask="url(#mask-7)"
                                            />
                                        </g>
                                        <g id="Clipped">
                                            <mask id="mask-9" fill="white">
                                                <use xlinkHref="#path-8" />
                                            </mask>
                                            <g id="SVGID_1_" />
                                            <g id="Group" mask="url(#mask-9)">
                                                <g transform="translate(26.437500, -2.954545)">
                                                    <path
                                                        d="M2.9375,2.95454545 L2.9375,16.25 C2.9375,18.6985795 4.90929688,20.6818182 7.34375,20.6818182 L20.5625,20.6818182 L2.9375,2.95454545 Z"
                                                        id="Path"
                                                        fill="#A1C2FA"
                                                        fillRule="nonzero"
                                                    />
                                                </g>
                                            </g>
                                        </g>
                                        <g id="Clipped">
                                            <mask id="mask-11" fill="white">
                                                <use xlinkHref="#path-10" />
                                            </mask>
                                            <g id="SVGID_1_" />
                                            <path
                                                d="M4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,4.80113636 C0,2.36363636 1.9828125,0.369318182 4.40625,0.369318182 L29.375,0.369318182 L29.375,0 L4.40625,0 Z"
                                                id="Path"
                                                fillOpacity="0.2"
                                                fill="#FFFFFF"
                                                fillRule="nonzero"
                                                mask="url(#mask-11)"
                                            />
                                        </g>
                                        <g id="Clipped">
                                            <mask id="mask-13" fill="white">
                                                <use xlinkHref="#path-12" />
                                            </mask>
                                            <g id="SVGID_1_" />
                                            <path
                                                d="M42.59375,64.6306818 L4.40625,64.6306818 C1.9828125,64.6306818 0,62.6363636 0,60.1988636 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,60.1988636 C47,62.6363636 45.0171875,64.6306818 42.59375,64.6306818 Z"
                                                id="Path"
                                                fillOpacity="0.2"
                                                fill="#1A237E"
                                                fillRule="nonzero"
                                                mask="url(#mask-13)"
                                            />
                                        </g>
                                        <g id="Clipped">
                                            <mask id="mask-15" fill="white">
                                                <use xlinkHref="#path-14" />
                                            </mask>
                                            <g id="SVGID_1_" />
                                            <path
                                                d="M33.78125,17.7272727 C31.3467969,17.7272727 29.375,15.7440341 29.375,13.2954545 L29.375,13.6647727 C29.375,16.1133523 31.3467969,18.0965909 33.78125,18.0965909 L47,18.0965909 L47,17.7272727 L33.78125,17.7272727 Z"
                                                id="Path"
                                                fillOpacity="0.1"
                                                fill="#1A237E"
                                                fillRule="nonzero"
                                                mask="url(#mask-15)"
                                            />
                                        </g>
                                    </g>
                                    <path
                                        d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z"
                                        id="Path"
                                        fill="url(#radialGradient-16)"
                                        fillRule="nonzero"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        ),
        zapier: () => (
            <svg
                width="105"
                height="28"
                viewBox="0 0 244 66"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M57.1877 45.2253L57.1534 45.1166L78.809 25.2914V15.7391H44.0663V25.2914H64.8181L64.8524 25.3829L43.4084 45.2253V54.7775H79.1579V45.2253H57.1877Z"
                    fill="#201515"
                />
                <path
                    d="M100.487 14.8297C96.4797 14.8297 93.2136 15.434 90.6892 16.6429C88.3376 17.6963 86.3568 19.4321 85.0036 21.6249C83.7091 23.8321 82.8962 26.2883 82.6184 28.832L93.1602 30.3135C93.5415 28.0674 94.3042 26.4754 95.4482 25.5373C96.7486 24.5562 98.3511 24.0605 99.9783 24.136C102.118 24.136 103.67 24.7079 104.634 25.8519C105.59 26.9959 106.076 28.5803 106.076 30.6681V31.7091H95.9401C90.7807 31.7091 87.0742 32.8531 84.8206 35.1411C82.5669 37.429 81.442 40.4492 81.4458 44.2014C81.4458 48.0452 82.5707 50.9052 84.8206 52.7813C87.0704 54.6574 89.8999 55.5897 93.3089 55.5783C97.5379 55.5783 100.791 54.1235 103.067 51.214C104.412 49.426 105.372 47.3793 105.887 45.2024H106.27L107.723 54.7546H117.275V30.5651C117.275 25.5659 115.958 21.6936 113.323 18.948C110.688 16.2024 106.409 14.8297 100.487 14.8297ZM103.828 44.6475C102.312 45.9116 100.327 46.5408 97.8562 46.5408C95.8199 46.5408 94.4052 46.1843 93.6121 45.4712C93.2256 45.1338 92.9182 44.7155 92.7116 44.246C92.505 43.7764 92.4043 43.2671 92.4166 42.7543C92.3941 42.2706 92.4702 41.7874 92.6403 41.3341C92.8104 40.8808 93.071 40.4668 93.4062 40.1174C93.7687 39.7774 94.1964 39.5145 94.6633 39.3444C95.1303 39.1743 95.6269 39.1006 96.1231 39.1278H106.093V39.7856C106.113 40.7154 105.919 41.6374 105.527 42.4804C105.134 43.3234 104.553 44.0649 103.828 44.6475Z"
                    fill="#201515"
                />
                <path d="M175.035 15.7391H163.75V54.7833H175.035V15.7391Z" fill="#201515" />
                <path
                    d="M241.666 15.7391C238.478 15.7391 235.965 16.864 234.127 19.1139C232.808 20.7307 231.805 23.1197 231.119 26.2809H230.787L229.311 15.7391H219.673V54.7775H230.959V34.7578C230.959 32.2335 231.55 30.2982 232.732 28.9521C233.914 27.606 236.095 26.933 239.275 26.933H243.559V15.7391H241.666Z"
                    fill="#201515"
                />
                <path
                    d="M208.473 17.0147C205.839 15.4474 202.515 14.6657 198.504 14.6695C192.189 14.6695 187.247 16.4675 183.678 20.0634C180.108 23.6593 178.324 28.6166 178.324 34.9352C178.233 38.7553 179.067 42.5407 180.755 45.9689C182.3 49.0238 184.706 51.5592 187.676 53.2618C190.665 54.9892 194.221 55.8548 198.344 55.8586C201.909 55.8586 204.887 55.3095 207.278 54.2113C209.526 53.225 211.483 51.6791 212.964 49.7211C214.373 47.7991 215.42 45.6359 216.052 43.3377L206.329 40.615C205.919 42.1094 205.131 43.4728 204.041 44.5732C202.942 45.6714 201.102 46.2206 198.521 46.2206C195.451 46.2206 193.163 45.3416 191.657 43.5837C190.564 42.3139 189.878 40.5006 189.575 38.1498H216.201C216.31 37.0515 216.367 36.1306 216.367 35.387V32.9561C216.431 29.6903 215.757 26.4522 214.394 23.4839C213.118 20.7799 211.054 18.5248 208.473 17.0147ZM198.178 23.9758C202.754 23.9758 205.348 26.2275 205.962 30.731H189.775C190.032 29.2284 190.655 27.8121 191.588 26.607C193.072 24.8491 195.268 23.972 198.178 23.9758Z"
                    fill="#201515"
                />
                <path
                    d="M169.515 0.00366253C168.666 -0.0252113 167.82 0.116874 167.027 0.421484C166.234 0.726094 165.511 1.187 164.899 1.77682C164.297 2.3723 163.824 3.08658 163.512 3.87431C163.2 4.66204 163.055 5.50601 163.086 6.35275C163.056 7.20497 163.201 8.05433 163.514 8.84781C163.826 9.64129 164.299 10.3619 164.902 10.9646C165.505 11.5673 166.226 12.0392 167.02 12.3509C167.814 12.6626 168.663 12.8074 169.515 12.7762C170.362 12.8082 171.206 12.6635 171.994 12.3514C172.782 12.0392 173.496 11.5664 174.091 10.963C174.682 10.3534 175.142 9.63077 175.446 8.83849C175.75 8.04621 175.89 7.20067 175.859 6.35275C175.898 5.50985 175.761 4.66806 175.456 3.88115C175.151 3.09424 174.686 2.37951 174.09 1.78258C173.493 1.18565 172.779 0.719644 171.992 0.414327C171.206 0.109011 170.364 -0.0288946 169.521 0.00938803L169.515 0.00366253Z"
                    fill="#201515"
                />
                <path
                    d="M146.201 14.6695C142.357 14.6695 139.268 15.8764 136.935 18.2902C135.207 20.0786 133.939 22.7479 133.131 26.2981H132.771L131.295 15.7563H121.657V66H132.942V45.3054H133.354C133.698 46.6852 134.181 48.0267 134.795 49.3093C135.75 51.3986 137.316 53.1496 139.286 54.3314C141.328 55.446 143.629 56.0005 145.955 55.9387C150.68 55.9387 154.277 54.0988 156.748 50.419C159.219 46.7392 160.455 41.6046 160.455 35.0153C160.455 28.6509 159.259 23.6689 156.869 20.0691C154.478 16.4694 150.922 14.6695 146.201 14.6695ZM147.345 42.9602C146.029 44.8668 143.97 45.8201 141.167 45.8201C140.012 45.8735 138.86 45.6507 137.808 45.1703C136.755 44.6898 135.832 43.9656 135.116 43.0574C133.655 41.2233 132.927 38.7122 132.931 35.5243V34.7807C132.931 31.5432 133.659 29.0646 135.116 27.3448C136.572 25.625 138.59 24.7747 141.167 24.7937C144.02 24.7937 146.092 25.6994 147.385 27.5107C148.678 29.322 149.324 31.8483 149.324 35.0896C149.332 38.4414 148.676 41.065 147.356 42.9602H147.345Z"
                    fill="#201515"
                />
                <path d="M39.0441 45.2253H0V54.789H39.0441V45.2253Z" fill="#FF4F00" />
            </svg>
        ),
        messenger: () => (
            <svg width="100" height="100" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <radialGradient
                    id="8O3wK6b5ASW2Wn6hRCB5xa_YFbzdUk7Q3F8_gr1"
                    cx="11.087"
                    cy="7.022"
                    r="47.612"
                    gradientTransform="matrix(1 0 0 -1 0 50)"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor="#1292ff"></stop>
                    <stop offset=".079" stopColor="#2982ff"></stop>
                    <stop offset=".23" stopColor="#4e69ff"></stop>
                    <stop offset=".351" stopColor="#6559ff"></stop>
                    <stop offset=".428" stopColor="#6d53ff"></stop>
                    <stop offset=".754" stopColor="#df47aa"></stop>
                    <stop offset=".946" stopColor="#ff6257"></stop>
                </radialGradient>
                <path
                    fill="url(#8O3wK6b5ASW2Wn6hRCB5xa_YFbzdUk7Q3F8_gr1)"
                    d="M44,23.5C44,34.27,35.05,43,24,43c-1.651,0-3.25-0.194-4.784-0.564	c-0.465-0.112-0.951-0.069-1.379,0.145L13.46,44.77C12.33,45.335,11,44.513,11,43.249v-4.025c0-0.575-0.257-1.111-0.681-1.499	C6.425,34.165,4,29.11,4,23.5C4,12.73,12.95,4,24,4S44,12.73,44,23.5z"
                />
                <path
                    d="M34.992,17.292c-0.428,0-0.843,0.142-1.2,0.411l-5.694,4.215	c-0.133,0.1-0.28,0.15-0.435,0.15c-0.15,0-0.291-0.047-0.41-0.136l-3.972-2.99c-0.808-0.601-1.76-0.918-2.757-0.918	c-1.576,0-3.025,0.791-3.876,2.116l-1.211,1.891l-4.12,6.695c-0.392,0.614-0.422,1.372-0.071,2.014	c0.358,0.654,1.034,1.06,1.764,1.06c0.428,0,0.843-0.142,1.2-0.411l5.694-4.215c0.133-0.1,0.28-0.15,0.435-0.15	c0.15,0,0.291,0.047,0.41,0.136l3.972,2.99c0.809,0.602,1.76,0.918,2.757,0.918c1.576,0,3.025-0.791,3.876-2.116l1.211-1.891	l4.12-6.695c0.392-0.614,0.422-1.372,0.071-2.014C36.398,17.698,35.722,17.292,34.992,17.292L34.992,17.292z"
                    opacity=".05"
                />
                <path
                    d="M34.992,17.792c-0.319,0-0.63,0.107-0.899,0.31l-5.697,4.218	c-0.216,0.163-0.468,0.248-0.732,0.248c-0.259,0-0.504-0.082-0.71-0.236l-3.973-2.991c-0.719-0.535-1.568-0.817-2.457-0.817	c-1.405,0-2.696,0.705-3.455,1.887l-1.21,1.891l-4.115,6.688c-0.297,0.465-0.32,1.033-0.058,1.511c0.266,0.486,0.787,0.8,1.325,0.8	c0.319,0,0.63-0.107,0.899-0.31l5.697-4.218c0.216-0.163,0.468-0.248,0.732-0.248c0.259,0,0.504,0.082,0.71,0.236l3.973,2.991	c0.719,0.535,1.568,0.817,2.457,0.817c1.405,0,2.696-0.705,3.455-1.887l1.21-1.891l4.115-6.688c0.297-0.465,0.32-1.033,0.058-1.511	C36.051,18.106,35.531,17.792,34.992,17.792L34.992,17.792z"
                    opacity=".07"
                />
                <path
                    fill="#ffffff"
                    d="M34.394,18.501l-5.7,4.22c-0.61,0.46-1.44,0.46-2.04,0.01L22.68,19.74	c-1.68-1.25-4.06-0.82-5.19,0.94l-1.21,1.89l-4.11,6.68c-0.6,0.94,0.55,2.01,1.44,1.34l5.7-4.22c0.61-0.46,1.44-0.46,2.04-0.01	l3.974,2.991c1.68,1.25,4.06,0.82,5.19-0.94l1.21-1.89l4.11-6.68C36.434,18.901,35.284,17.831,34.394,18.501z"
                />
            </svg>
        ),
        user: () => (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    };

    const [items, setItems] = useState([
        { icon: <Icons.googleDrive />, id: 'main', name: 'MAIN', level: 1 },
        {
            icon: <Icons.googleDocs />,
            id: 'sales1',
            name: 'SALES DEPARTMENT #1',
            level: 2,
            linkedTo: 'main',
            link: 'https://google.com',
        },
        {
            icon: <Icons.googleDocs />,
            id: 'sales2',
            name: 'SALES DEPARTMENT #2',
            level: 2,
            linkedTo: 'main',
            link: 'https://google.com',
        },
        {
            icon: <Icons.whatsapp />,
            id: 'whatsapp',
            name: 'Alex Smith',
            rank: 'Shop Assistant',
            level: 3,
            linkedTo: 'sales1',
        },
        {
            icon: <Icons.messenger />,
            id: 'messenger',
            name: 'Emily Johnson',
            rank: 'Shop Assistant',
            level: 3,
            linkedTo: 'sales1',
        },
        {
            icon: <Icons.notion />,
            id: 'notion',
            name: 'Michael Brown',
            rank: 'Customer Service Representative',
            level: 3,
            linkedTo: 'sales1',
        },
        {
            icon: <Icons.openai />,
            id: 'openai',
            name: 'Sophia Davis',
            rank: 'Cashier',
            level: 3,
            linkedTo: 'sales1',
        },
        {
            icon: <Icons.user />,
            id: 'user',
            name: 'James Wilson',
            rank: 'Inventory Coordinator',
            level: 3,
            linkedTo: 'sales1',
        },
        {
            icon: <Icons.whatsapp />,
            id: 'whatsapp2',
            name: 'Olivia Miller',
            rank: 'Shop Assistant',
            level: 3,
            linkedTo: 'sales2',
        },
        {
            icon: <Icons.messenger />,
            id: 'messenger2',
            name: 'Liam Taylor',
            rank: 'Shop Assistant',
            level: 3,
            linkedTo: 'sales2',
        },
        {
            icon: <Icons.notion />,
            id: 'notion2',
            name: 'Charlotte Anderson',
            rank: 'Customer Service Representative',
            level: 3,
            linkedTo: 'sales2',
        },
        {
            icon: <Icons.openai />,
            id: 'openai2',
            name: 'Ethan Moore',
            rank: 'Cashier',
            level: 3,
            linkedTo: 'sales2',
        },
        {
            icon: <Icons.user />,
            id: 'user2',
            name: 'Isabella Jackson',
            rank: 'Inventory Coordinator',
            level: 3,
            linkedTo: 'sales2',
        },
    ]);

    let itemsSorted = items.sort((a, b) => {
        // Sort by linkedTo
        if (a.linkedTo !== b.linkedTo) {
            if (a.linkedTo && !b.linkedTo) return -1; // a comes first if a has linkedTo but b does not
            if (!a.linkedTo && b.linkedTo) return 1; // b comes first if b has linkedTo but a does not
            return a.linkedTo > b.linkedTo ? 1 : -1; // Compare linkedTo alphabetically
        }

        // Sort by level if linkedTo is the same
        return a.level - b.level;
    });

    let itemsFromStructureSorted = itemsFromStructure.sort((a, b) => {
        // Sort by linkedTo
        if (a.linkedTo !== b.linkedTo) {
            if (a.linkedTo && !b.linkedTo) return -1; // a comes first if a has linkedTo but b does not
            if (!a.linkedTo && b.linkedTo) return 1; // b comes first if b has linkedTo but a does not
            return a.linkedTo > b.linkedTo ? 1 : -1; // Compare linkedTo alphabetically
        }

        // Sort by level if linkedTo is the same
        return a.level - b.level;
    });

    return (
        <div className="w-[100%] items-center justify-center mt-10 md:mt-0">
            <div className="max-w-[100%]">
                {items.length && (
                    <WorkersAnimatedBeam
                        id={currentUserId}
                        items={itemsFromStructureSorted}
                        Icons={Icons}
                        setItems={setItemsFromStructure}
                        setUpdate={setUpdate}
                        defaultImage={defaultImage}
                    />
                )}
            </div>
            <div className="w-[100%] mt-10 flex items-center justify-center">
                <SubusersList />
            </div>
            {/* <EmployeeCalendar /> */}
        </div>
    );
};

export default AccountingWorkers;
