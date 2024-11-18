import { FaLink, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Department } from '../../../models/index';

interface EditDepartmentProps {
    tooltipIconsClickHandler: (item: Department, mode: 'link' | 'edit' | 'delete') => void;
    item: Department;
}

export const EditDepartment: React.FC<EditDepartmentProps> = ({
    tooltipIconsClickHandler,
    item,
}) => {
    return (
        <div className="flex gap-8">
            <div
                onClick={() => {
                    tooltipIconsClickHandler(item, 'link');
                }}
                className="w-8 h-8 bg-white flex items-center justify-center rounded-full border-2 border-gray-300 shadow cursor-pointer"
            >
                <FaLink />
            </div>
            <div
                onClick={() => {
                    tooltipIconsClickHandler(item, 'edit');
                }}
                className="w-8 h-8 bg-white flex items-center justify-center rounded-full border-2 border-gray-300 shadow cursor-pointer"
            >
                <FaEdit />
            </div>
            <div
                onClick={() => {
                    tooltipIconsClickHandler(item, 'delete');
                }}
                className="w-8 h-8 bg-white flex items-center justify-center rounded-full border-2 border-gray-300 shadow cursor-pointer"
            >
                <FaTrashAlt />
            </div>
        </div>
    );
};
