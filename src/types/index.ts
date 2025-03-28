import type { AxiosInstance } from 'axios';
import type {DateTime} from 'luxon';
import type {Reactive, Ref} from "vue";
import type VLModel from "@/index";
import type {Store} from "pinia";

export interface ModelConfig {
    api: AxiosInstance;
    onError?: (error: any) => void;
    onSuccess?: (message: string) => void;
}

export interface BasicModelAttributes {
    id: number;
    created_at: string | DateTime;
    updated_at: string | DateTime;
}

export type ModelStoreType<T extends VLModel<T>> = Store<
    string,
    {
        collection: Reactive<Map<number, Ref<T>>>
        collectionArray: Ref<T[]>
    },
    Record<string, unknown>,
    Record<string, unknown>
>


// Define relationship types
export type RelationType = 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';

// Define single relationship structure
export type RelationshipConfig<T extends VLModel<T>> = {
    type: RelationType;
    model: typeof VLModel<T>;
};

// Define the final relationship map type
export type IRelationship<T extends VLModel<T>> = {
    [key: string]: RelationshipConfig<T>;
};
