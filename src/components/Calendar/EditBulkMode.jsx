import { Dialog } from 'primereact/dialog';

export const EditBulkMode = ({ setOpen, stores, subUsers, open }) => {
    return (
        <Dialog
            header="Добавление смен"
            visible={open}
            onHide={() => setOpen(false)}
            className="bg-white p-6 rounded-lg shadow-lg min-w-[400px] max-w-4xl w-full overflow-y-auto"
        >
            <h1>as</h1>
        </Dialog>
    );
};
