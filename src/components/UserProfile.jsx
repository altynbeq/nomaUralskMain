import { FaRegTimesCircle } from 'react-icons/fa';
import { Button } from '.';
import avatar from '../data/avatar.jpg';
import { useAuthStore, useSubUserStore } from '../store/index';
import { axiosInstance } from '../api/axiosInstance';

const UserProfile = () => {
    const reset = useAuthStore((state) => state.reset);
    const user = useAuthStore((state) => state.user);
    const subUser = useSubUserStore((state) => state.subUser);
    const clearSubUserStore = useSubUserStore((state) => state.clearSubUserStore);
    const clearAuthData = async () => {
        try {
            const result = await axiosInstance.post('/auth/logout');
            if (result.status === 200) {
                reset();
                clearSubUserStore();
            }
        } catch (error) {
            alert('Не удалось разлогиниться');
        }
    };

    return (
        <div className="nav-item absolute right-5 top-16 bg-white subtle-border dark:bg-[#42464D] p-4 md:p-8 rounded-lg w-[90%] md:w-[30%]">
            <div className="flex justify-between text-black items-center">
                <p className="font-semibold text-lg dark:text-gray-200">Профиль</p>
                <Button
                    className="text-black bg-black"
                    icon={<FaRegTimesCircle />}
                    color="white"
                    iconClr="black"
                    size="2xl"
                    borderRadius="50%"
                />
            </div>
            <div className="flex flex-col md:flex-row gap-5 items-center mt-6 border-color border-b-1 pb-6">
                <img
                    className="rounded-full h-24 w-24"
                    src={
                        subUser?.image
                            ? `https://nomalytica-back.onrender.com${subUser.image}`
                            : avatar
                    }
                    alt="user-profile"
                />
                <div className="overflow-hidden text-center md:text-left">
                    <p className="font-semibold text-xl dark:text-gray-200 break-words">
                        {user?.name}
                    </p>
                    <p className="text-gray-500 text-sm font-semibold dark:text-gray-400 break-words">
                        {user?.email}
                    </p>
                </div>
            </div>
            <div className="mt-5">
                <button
                    type="button"
                    onClick={() => clearAuthData()}
                    className="bg-blue-500 flex text-white flex-row rounded-2xl justify-center align-center gap-1 px-4 py-2 w-full hover:drop-shadow-xl"
                >
                    <div className="text-white">Выйти</div>
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
