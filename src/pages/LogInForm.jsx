import React, { useEffect, useState } from 'react';
import { useStateContext } from './../contexts/ContextProvider';
import { FaChartPie, FaEye, FaEyeSlash } from 'react-icons/fa';
import bgDesk from '../data/LogInBgDesk.png';
import bgMob from '../data/LogInBgMob.png';
import AlertModal from '../components/AlertModal';
import { se } from 'date-fns/locale';

const LogInForm = () => {
    const { handleLogin, userId } = useStateContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localStorageData, setLocalStorageData] = useState([]);
    const [currentUrl, setCurrentUrl] = useState(window.location.href);
    const [department, setDepartment] = useState('');
    const [token, setToken] = useState('');
    const [name, setName] = useState('');
    const [regBtnActive, setRegBtnActive] = useState(true);
    const [alertOpen, setAlertOpen] = useState({
        login: false,
        signUp: false,
    });

    const deactivateRegBtn = () => {
        setRegBtnActive(false);
    };

    useEffect(() => {
        if (!localStorageData.length) {
            return;
        }
        localStorage.setItem('_id', localStorageData[0]);
        localStorage.setItem('token', localStorageData[1]);
        localStorage.setItem('departmentId', localStorageData[2]);
        window.location.href = '/general';
    }, [localStorageData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const handleLogIn = (email, password) => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            };
            const url = `https://nomalytica-back.onrender.com/api/users/login`;
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === 'Login successful') {
                        if (data.user?.role === 'subUser') {
                            setLocalStorageData([
                                data.user._id,
                                data.token,
                                data.user?.departmentId,
                            ]);
                        } else {
                            setLocalStorageData([data.user._id, data.token]);
                        }
                        handleLogin(data.user._id);
                    } else {
                        setAlertOpen({
                            login: true,
                        });
                    }
                })
                .catch((error) => console.error('Error:', error));
        };
        handleLogIn(email, password);
    };

    const handleSubmitRegistration = (e) => {
        e.preventDefault();
        const handleRegistration = () => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: { email, password, name },
                    departmentLink: currentUrl,
                }),
            };
            const url = `https://nomalytica-back.onrender.com/api/subUsers/create-subuser/`;
            fetch(url, requestOptions).then((res) => {
                if (!res.ok) {
                    res.text().then((error) => alert(error));
                }
                if (res.ok) {
                    res.json().then(() => setAlertOpen({ signUp: true }));
                    deactivateRegBtn();
                }
            });
        };

        handleRegistration();
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
            style={{ backgroundImage: `url(${window.innerWidth >= 768 ? bgDesk : bgMob})` }}
        >
            <AlertModal
                open={alertOpen.login || alertOpen.signUp}
                message={
                    alertOpen.login
                        ? 'Введены не верные данные'
                        : alertOpen.signUp
                          ? 'Вы успешно зарегистрировались'
                          : ''
                }
                onClose={() => setAlertOpen(false)}
            />
            <div className="max-w-md w-full bg-white p-8 border-8-grey rounded-2xl space-y-8">
                <div className="flex text-blue-800 mb-10 flex-row text-4xl align-center justify-center gap-1">
                    <h2>N</h2>
                    <FaChartPie />
                    <h2>malytica</h2>
                </div>

                {!currentUrl.includes('register') && (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-xl flex flex-col gap-4 shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="">
                                    Почта
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Почта"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="">
                                    Пароль
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Пароль"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="text-sm">
                                <a href="#" className="font-medium hover:text-gray-600">
                                    Забыли пароль?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg
                                        className="h-5 w-5 text-blue-500 group-hover:text-indigo-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm-.707 7.293a1 1 0 011.32-.083l.094.083 2 2a1 1 0 01-1.32 1.497l-.094-.083L10 9.414V14a1 1 0 01-2 0v-4.586l-.293.293a1 1 0 01-1.32-1.497l.094-.083 2-2zM10 2c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1V3c0-.55.45-1 1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                                Войти
                            </button>
                        </div>
                    </form>
                )}
                {currentUrl.includes('register') && (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmitRegistration}>
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-xl flex flex-col gap-4 shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="">
                                    Email
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email"
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="">
                                    Имя
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Имя"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="">
                                    Пароль
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Пароль"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/*<div className="flex items-center justify-center">*/}
                        {/*  <div className="text-sm">*/}
                        {/*    <a href="#" className="font-medium hover:text-gray-600">*/}
                        {/*      Забыли пароль?*/}
                        {/*    </a>*/}
                        {/*  </div>*/}
                        {/*</div>*/}

                        <div>
                            <button
                                disabled={!regBtnActive}
                                type="submit"
                                onClick={handleSubmitRegistration}
                                className={`${!regBtnActive ? 'opacity-10' : ''} group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg
                                        className="h-5 w-5 text-blue-500 group-hover:text-indigo-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm-.707 7.293a1 1 0 011.32-.083l.094.083 2 2a1 1 0 01-1.32 1.497l-.094-.083L10 9.414V14a1 1 0 01-2 0v-4.586l-.293.293a1 1 0 01-1.32-1.497l.094-.083 2-2zM10 2c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1V3c0-.55.45-1 1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                                Зарегистрироваться
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LogInForm;
