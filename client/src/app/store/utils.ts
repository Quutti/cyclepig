import * as objectAssign from "object-assign";

export interface ItemWithId {
    id?: number;
}

export const customError = (error: any, properties: { [key: string]: any }): { [key: string]: any } => {
    const o = { customError: true, original: error };
    return objectAssign({}, o, properties);
}

/**
 * Swaps a item with matching id in a array or just adds new item to the end of
 * the array. Always returns an array with a new object reference.
 */
export const swapOrAdd = (items: ItemWithId[], item: ItemWithId): ItemWithId[] => {
    const index = items.map(i => i.id).indexOf(item.id);
    if (index === -1) {
        // If item is not in a list, just add it to the end
        return [...items, item];
    } else {
        // If item already exists, swap with the new one
        return [
            ...items.slice(0, index - 1),
            item,
            ...items.slice(index)
        ];
    }
}