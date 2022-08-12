export const CHANGE_LOADER = 'CHANGE_LOADER';

/**
 * Change a setting value
 * payload.name: name of the setting prop to change
 * payload.value: new value to apply
 */
export function changeLoaderState(name, value) {
    return { type: CHANGE_LOADER, name, value };
}