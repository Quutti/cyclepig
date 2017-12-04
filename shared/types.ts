export interface Ride {
    id?: number;
    bikeId?: number;
    distance: number
    description: string;
    date: string;
}

export interface Bike {
    id: number;
    name: string;
    added: string;
    maintenances: Maintenance[];
    parts: Part[];
}

export interface Maintenance {
    id: number;
    bikeId?: number;
    title: string;
    description: string;
    date: string;
}

export interface Part {
    id: number;
    bikeId?: number;
    name: string;
    comments: string;
    date: string;
    original: boolean;
    active: boolean;
}