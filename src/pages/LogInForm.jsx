// src/components/LogInForm.jsx
import React, { useState } from 'react';
import { FaChartPie, FaEye, FaEyeSlash } from 'react-icons/fa';
import bgDesk from '../data/LogInBgDesk.png';
import bgMob from '../data/LogInBgMob.png';
import AlertModal from '../components/AlertModal';
import { Button } from 'primereact/button';
import { axiosInstance } from '../api/axiosInstance'; // Импорт обновленного axiosInstance
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { useAuthStore, useProfileStore } from '../store/index';

const LogInForm = ({ isQrRedirect }) => {
    const navigate = useNavigate();
    const setProfileName = useProfileStore((state) => state.setName);
    const setProfileEmail = useProfileStore((state) => state.setEmail);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUser = useAuthStore((state) => state.setUser);
    const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
    const [showPassword, setShowPassword] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [showSuccessPass, setShowSuccessPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alertModalResultMessage, setAlertModalResultMessage] = useState('');
    const [name, setName] = useState('');
    const [resettedPassword, setResettedPassword] = useState('');

    // Обработка логина
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            const { accessToken, user, isSuccess } = response.data;
            if (isSuccess) {
                setAccessToken(accessToken);
                setUser(user);
                setProfileName(user.email);
                setProfileEmail(user.name);
                setIsLoggedIn(true);
                if (isQrRedirect) {
                    navigate('/general?isQrRedirect=true');
                } else {
                    navigate('/general');
                }
            }
        } catch (error) {
            setAlertOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Обработка регистрации
    const handleSubmitRegistration = async (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const companyId = urlParams.get('companyId');

        if (!companyId) {
            alert('Company ID is missing in the URL');
            return;
        }
        try {
            const response = await axiosInstance.post('/subUsers/create-subuser', {
                input: { email, password, name },
                departmentLink: window.location.href,
                companyId,
            });

            if (response.status === 200) {
                setAlertOpen(true);
                // Деактивация кнопки регистрации
                // Вы можете добавить дополнительную логику, если необходимо
            }
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message || 'Registration failed');
            } else {
                alert('Registration failed');
            }
        }
    };

    // Обработка сброса пароля
    const sendPassword = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/users/reset_password_temporary', {
                email: email, // Используем email из состояния
            });
            if (response.data) {
                setShowSuccessPass(true);
                setShowReset(false);
                setResettedPassword(response.data.newPassword);
                // Можно отображать сообщение или временный пароль
            }
        } catch (error) {
            setShowSuccessPass(true);
            setShowReset(false);
            setAlertModalResultMessage('Вы ввели неверную почту');
        } finally {
            setIsLoading(false);
        }
    };

    const onForgotPass = () => {
        setShowReset(true);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
            style={{ backgroundImage: `url(${window.innerWidth >= 768 ? bgDesk : bgMob})` }}
        >
            <AlertModal
                open={alertOpen.login || alertOpen.signUp}
                message={''}
                onClose={() => {
                    setAlertOpen(false);
                }}
            />
            <div className="max-w-md w-full bg-white p-8 border-8-grey rounded-2xl space-y-8">
                <div className="flex text-blue-800 mb-10 flex-row text-4xl align-center justify-center gap-1">
                    <h2>N</h2>
                    <FaChartPie />
                    <h2>malytica</h2>
                </div>

                {!window.location.href.includes('register') && (
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
                                <Button
                                    onClick={onForgotPass}
                                    className="font-medium hover:text-gray-600"
                                >
                                    Забыли пароль?
                                </Button>
                            </div>
                        </div>

                        <Dialog
                            visible={showReset}
                            onHide={() => setShowReset(false)}
                            header="Восстановить пароль"
                        >
                            <InputText
                                className="mt-5 border-2 p-2 w-full"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Введите вашу почту"
                                value={email}
                            />
                            <Button
                                disabled={isLoading || !email}
                                className="mt-10 border-blue-500 border-2 p-2 flex justify-center mx-auto"
                                label="Получить новый пароль"
                                onClick={sendPassword}
                            />
                        </Dialog>

                        <AlertModal
                            open={showSuccessPass}
                            message={
                                alertModalResultMessage
                                    ? alertModalResultMessage
                                    : `Ваш новый пароль - ${showSuccessPass && 'temporaryPassword' in resettedPassword ? resettedPassword.temporaryPassword : ''}`
                            }
                            onClose={() => setShowSuccessPass(false)}
                        />

                        <div>
                            <button
                                type="submit"
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
                {window.location.href.includes('register') && (
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
                                    Имя и Фамилия
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Имя и Фамилия"
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

                        <div>
                            <button
                                disabled={!email || !password || !name}
                                type="submit"
                                className={`${!email || !password || !name ? 'opacity-50 cursor-not-allowed' : 'opacity-100'} group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
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
