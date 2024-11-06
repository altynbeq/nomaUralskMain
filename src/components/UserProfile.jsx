import React from 'react';
import { FaRegTimesCircle } from "react-icons/fa";
import { Button } from '.';
import { userProfileData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/avatar.jpg';


const UserProfile = () => {
  const { currentColor, handleLogOut } = useStateContext();
const {userData, setUserData} = useStateContext();
console.log("=>(UserProfile.jsx:13) userData", userData);

  return (
    <div className="nav-item absolute right-5 top-16 bg-white subtle-border dark:bg-[#42464D] p-8 rounded-lg w-[90%] md:w-[30%] ">
      <div className="flex justify-between text-black items-center">
        <p className="font-semibold text-lg dark:text-gray-200">Профиль</p>
        <Button
          className="text-black bg-black"
            icon={<FaRegTimesCircle />}
            color="white"
            iconClr='black'
            // bgHoverColor="light-gray"
            size="2xl"
            borderRadius="50%"
          />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={avatar}
          alt="user-profile"
        />
        <div className='overflow-hidden'>
          <p className="font-semibold text-xl dark:text-gray-200 break-words">{userData.name.split('-')[0].charAt(0).toUpperCase() + userData.name.split('-')[0].slice(1)}</p>
          <p className="text-gray-500 text-sm dark:text-gray-400 break-words">{userData.name.split('-')[1].charAt(0).toUpperCase() + userData.name.split('-')[1].slice(1)}</p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400 break-words">{userData.email.split('-')[0]}</p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <div key={index} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        {/* <Button
          color="white"
          bgColor={currentColor}
          text="Выйти"
          borderRadius="10px"
          width="full"
        /> */}

      <button type="button"  onClick={() => handleLogOut()} style={{ backgroundColor: currentColor}}
      className={`flex text-white flex-row rounded-2xl justify-center text-center align-center gap-1  px-4 py-1 w-full hover:drop-shadow-xl `}
    >
      <div className='text-white'>
        Выйти
      </div>
    </button>
      </div>
    </div>

  );
};

export default UserProfile;
