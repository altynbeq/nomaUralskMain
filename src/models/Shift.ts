export interface Shift {
    _id: string; // Unique identifier for the shift
    subUserId: string; // Reference to the SubUser ID
    startTime: string; // Start time of the shift (ISO string)
    endTime: string; // End time of the shift (ISO string)
    selectedStore: {
        _id: string; // Store ID
        storeName: string; // Store name
    }; // Reference to the Store object
    scanTime?: string | null; // Optional timestamp for shift check-in (ISO string)
    endScanTime?: string | null; // Optional timestamp for shift check-out (ISO string)
}
