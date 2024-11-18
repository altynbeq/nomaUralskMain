import { FC } from 'react';
import { Button } from '@mantine/core';
import { IoMdCloseCircle } from 'react-icons/io';

interface ProfileModalHeaderProps {
    onClose: () => void;
}

export const ProfileModalHeader: FC<ProfileModalHeaderProps> = ({ onClose }) => (
    <div>
        <h3>Department Access</h3>
        <Button
            onClick={onClose}
            className="absolute top-3 right-3 w-12 h-12 flex items-center justify-center bg-white  rounded-full"
        >
            <IoMdCloseCircle size={25} />
        </Button>
    </div>
);
