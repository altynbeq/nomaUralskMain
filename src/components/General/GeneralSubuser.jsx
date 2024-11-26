import { Profile } from '../Profile/Profile';
import ManageWarehouse from '../../components/Accounting/Warehouse/ManageWarehouse';

export const GeneralSubuser = () => {
    return (
        <div className="flex mt-10 flex-col md:flex-row align-center justify-center md:mr-20">
            <ManageWarehouse />
            <Profile />
        </div>
    );
};
