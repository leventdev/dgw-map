type PickupPoint = {
    address: {
        addressLine1: string;
        addressLine2?: string | null;
        city: string;
        postalCode: string;
    };
    location: {
        latitude: number;
        longitude: number;
    };
    operator: {
        name: string;
    };
    distance: number;
    icon: string;
    openingHours: PickupPointOpeningHour[];
    name: string;
    phone: string | null;
    type: string;
};

type PickupPointOpeningHour = {
    day: string;
    start: {
        hour: number;
        minute: number;
    };
    end: {
        hour: number;
        minute: number;
    };
};