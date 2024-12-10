import React, { useState } from 'react';
import { FaChartPie, FaEye, FaEyeSlash } from 'react-icons/fa';
import bgDesk from '../data/LogInBgDesk.png';
import bgMob from '../data/LogInBgMob.png';
import AlertModal from '../components/AlertModal';
import { Button } from 'primereact/button';
import { axiosInstance } from '../api/axiosInstance';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useProfileStore } from '../store/index';

const LogInForm = ({ isQrRedirect }) => {
    const navigate = useNavigate();
    const setProfileName = useProfileStore((state) => state.setName);
    const setProfileEmail = useProfileStore((state) => state.setEmail);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
    const setUser = useAuthStore((state) => state.setUser);
    const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [showAlertMessage, setShowAlertMessage] = useState('');
    const [showLoginAlertMessage, setShowLoginAlertMessage] = useState('');
    const [showReset, setShowReset] = useState(false);
    const [showSuccessPass, setShowSuccessPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alertModalResultMessage, setAlertModalResultMessage] = useState('');
    const [resettedPassword, setResettedPassword] = useState('');
    const [showSuccessReg, setShowSuccessReg] = useState(false);

    const isRegisterPage = window.location.href.includes('register');

    // Обработчик логина
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.post('/auth/login', { email, password });
            const { accessToken, user, isSuccess, refreshToken } = data;
            if (isSuccess) {
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                setUser(user);
                setProfileName(user.email);
                setProfileEmail(user.name);
                setIsLoggedIn(true);
                navigate(isQrRedirect ? '/general?isQrRedirect=true' : '/general');
            }
        } catch (error) {
            setShowLoginAlertMessage(true);
            setShowAlertMessage(
                `${error.response.data.message === 'Invalid email or password' ? 'Неверные данные входа' : 'Не удалось войти. Попробуйте снова'}`,
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Обработчик регистрации
    const handleRegistration = async (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        const companyId = urlParams.get('companyId');
        if (!companyId) {
            alert('Company ID is missing in the URL');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/auth/create-subuser', {
                input: { email, password, name },
                departmentLink: window.location.href,
                companyId,
            });
            if (response.status === 201) {
                setShowSuccessReg(true);
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Registration failed';
            alert(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Обработчик сброса пароля
    const handlePasswordReset = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.post('/auth/reset_password_temporary', { email });
            if (data) {
                setShowSuccessPass(true);
                setShowReset(false);
                setResettedPassword(data.temporaryPassword);
            }
        } catch {
            setShowSuccessPass(true);
            setShowReset(false);
            setEmail('');
            setAlertModalResultMessage('Вы ввели неверную почту');
        } finally {
            setIsLoading(false);
        }
    };

    // Отображение формы логина
    const renderLoginForm = () => (
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-xl flex flex-col gap-4 shadow-sm -space-y-px">
                <div>
                    <label htmlFor="email-address">Почта</label>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none rounded-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Почта"
                    />
                </div>
                <div>
                    <label htmlFor="password">Пароль</label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Пароль"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center">
                <Button
                    onClick={() => setShowReset(true)}
                    className="font-medium hover:text-gray-600"
                >
                    Забыли пароль?
                </Button>
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
                    onClick={handlePasswordReset}
                />
            </Dialog>

            <AlertModal
                open={showSuccessPass}
                message={alertModalResultMessage || `Ваш новый пароль - ${resettedPassword}`}
                onClose={() => setShowSuccessPass(false)}
            />

            <button
                type="submit"
                disabled={isLoading || !email || !password}
                className={`${
                    !email || !password || isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'opacity-100'
                } group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white group-hover:text-indigo-400 bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
                {isLoading ? 'Загрузка...' : 'Войти'}
            </button>
        </form>
    );

    // Отображение формы регистрации
    const renderRegistrationForm = () => (
        <form className="mt-8 space-y-6" onSubmit={handleRegistration}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-xl flex flex-col gap-4 shadow-sm -space-y-px">
                <div>
                    <label htmlFor="email-address">Email</label>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none rounded-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Email"
                    />
                </div>
                <div>
                    <label htmlFor="name">Имя и Фамилия</label>
                    <input
                        id="name"
                        name="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="appearance-none rounded-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Имя и Фамилия"
                    />
                </div>
                <div>
                    <label htmlFor="password">Пароль</label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Пароль"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
            </div>

            <button
                disabled={!email || !password || !name || isLoading}
                type="submit"
                className={`${
                    !email || !password || !name ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                } group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white group-hover:text-indigo-400 bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
                {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
        </form>
    );

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
            style={{ backgroundImage: `url(${window.innerWidth >= 768 ? bgDesk : bgMob})` }}
        >
            <AlertModal
                open={showLoginAlertMessage}
                message={showAlertMessage}
                onClose={() => setShowLoginAlertMessage(false)}
            />
            <div className="max-w-md w-full bg-white p-8 border-8-grey rounded-2xl space-y-8">
                <div className="flex text-blue-800 mb-10 flex-row text-4xl align-center justify-center gap-1">
                    <h2>N</h2>
                    <FaChartPie />
                    <h2>malytica</h2>
                </div>

                {!isRegisterPage && renderLoginForm()}
                {isRegisterPage && renderRegistrationForm()}
            </div>
            <AlertModal
                open={showSuccessReg}
                message="Вы успешно зарегистрировались. Нажмите на кнопку чтобы зайти в сервис"
                onClose={() => {
                    setShowSuccessReg(false);
                    window.location.href = '/';
                }}
            />
        </div>
    );
};

export default LogInForm;
