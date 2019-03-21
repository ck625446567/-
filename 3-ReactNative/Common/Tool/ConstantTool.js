export interface ConstantItemType {
    code: string;

    name: string;
}

/**
 * 所有的 name
 * @param items
 * @param findName 查找的key
 * @returns {Array}
 */
export function constantNames(items: ConstantItemType[], findName: string = 'name'): string[] {
    if (!items) {
        return [];
    }
    let names = [];
    for (let item of items) {
        names.push(item[findName]);
    }
    return names;
}

/**
 * 所有的 name
 * @param items
 * @returns {Array}
 */
export function constantKeys(items: ConstantItemType[]): string[] {
    let names = [];
    for (let item of items) {
        names.push(item.code);
    }
    return names;
}

/**
 * 根据名称查找code
 * @param name
 * @param items
 * @param contain 只要相互包含就算检测成功
 * @returns {*}
 */
export function constantCodeByName(
    name: string,
    items: ConstantItemType[],
    contain: boolean = false
): string {
    return (constantItemByName(name, items, contain) || {}).code;
}

/**
 * 根据名称查找code
 * @param name
 * @param items
 * @param contain 只要相互包含就算检测成功
 * @returns {*}
 */
export function constantItemByName(
    name: string,
    items: ConstantItemType[],
    contain: boolean = false
): ConstantItemType {
    if (!name) {
        return null;
    }

    for (let item of items) {
        let itemName = item.name;
        if (contain) {
            if (itemName.indexOf(name) !== -1 || name.indexOf(itemName) !== -1) {
                return item;
            }
        } else {
            if (itemName === name) {
                return item;
            }
        }
    }

    return null;
}

/**
 * 根据名称查找 code
 * @param code
 * @param items
 * @returns {*}
 */
export function constantNameByCode(code: string, items: ConstantItemType[]): string {
    if (!code) {
        return null;
    }

    let index = constantKeys(items).indexOf(code);

    if (index >= 0) {
        return items[index].name;
    }
    return null;
}

/**
 * 指定位置的code
 * @param index
 * @param items
 * @returns {*}
 */
export function constantCodeAtIndex(index: number, items: ConstantItemType[]): string {
    if (typeof index !== 'number') {
        return null;
    }
    if (index < items.length) {
        return items[index].code;
    }
    return null;
}

/**
 * 根据 code 查找 index
 * @param code
 * @param items
 * @returns {*}
 */
export function constantIndexByCode(code: number, items: ConstantItemType[]): number {
    if (!code) {
        return null;
    }
    let index = constantKeys(items).indexOf(code);
    return index >= 0 ? index : null;
}
