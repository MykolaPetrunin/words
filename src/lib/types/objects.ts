export type ApiObjectDataValue = string | number | boolean | null;

export type ApiObjectData = Record<string, ApiObjectDataValue>;

export interface ApiObject {
    id: string;
    name: string;
    data: ApiObjectData | null;
}
