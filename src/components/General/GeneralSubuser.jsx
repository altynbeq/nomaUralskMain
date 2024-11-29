import { Profile } from '../Profile/Profile';
import { AddWarehouse } from '../../components/Accounting/Warehouse/AddWarehouse';

export const GeneralSubuser = () => {
    return (
        <div className="flex mt-10 flex-col md:flex-row align-center justify-center md:mr-20">
            <AddWarehouse />
            <Profile />
        </div>
    );
};
