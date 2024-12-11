import { memo } from 'react';
import { Dialog } from 'primereact/dialog';
import { formatOnlyDate } from '../../../methods/dataFormatter';

export const ShiftModal = memo(
    ({ selectedDayShiftsModal, setSelectedDayShiftsModal, renderDayShiftsModalContent }) => {
        return (
            <Dialog
                visible={selectedDayShiftsModal.length > 0}
                onHide={() => setSelectedDayShiftsModal([])}
                header={`Смена на ${selectedDayShiftsModal[0]?.startTime ? formatOnlyDate(selectedDayShiftsModal[0].startTime) : ''}`}
                className="w-full sm:w-2/5 md:w-1/2 lg:w-2/5 xl:w-1/3"
            >
                {renderDayShiftsModalContent()}
            </Dialog>
        );
    },
);

ShiftModal.displayName = 'ShiftModal';
