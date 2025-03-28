import { DateTime } from 'luxon';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { getModelConfig } from './config';
import type { BasicModelAttributes, ModelStoreType, IRelationship } from './types';

export default abstract class VLModel<T extends VLModel<T> & BasicModelAttributes> {
    id: number;
    created_at: DateTime;
    updated_at: DateTime;

    static get ENDPOINT(): string {
        throw new Error('Entity not defined');
    }

    static get FILTERS(): string[] {
        return [];
    }

    static get STORE(): ModelStoreType<VLModel<never>> {
        throw new Error('STORE not implemented');
    }

    static get RELATIONS(): IRelationship<VLModel<never>> {
        return {};
    }

    static get ATTRIBUTES(): string[] {
        return [];
    }

    protected static get config() {
        return getModelConfig();
    }

    protected constructor(attributes: Partial<T>) {
        this.id = attributes.id || (undefined as unknown as number);
        this.created_at = attributes.created_at
            ? DateTime.fromISO(attributes.created_at.toString())
            : (undefined as unknown as DateTime);
        this.updated_at = attributes.updated_at
            ? DateTime.fromISO(attributes.updated_at.toString())
            : (undefined as unknown as DateTime);
        this.addToStore();
    }

    static async all<M extends VLModel<M>>(
        FILTERS?: Array<{ [key: string]: string }>,
        withRelations?: string[],
    ): Promise<M[]> {
        try {
            const response = await this.config.api.get(this.ENDPOINT, {
                params: {
                    FILTERS: FILTERS,
                    with: withRelations,
                },
            });

            return response.data.map(
                (item: Partial<M>) => new (this as unknown as { new (args: Partial<M>): M })(item),
            ) as M[];
        } catch (error) {
            this.config.onError?.(error);
            throw error;
        }
    }

    static async create<M extends VLModel<M>>(data: Partial<M>): Promise<M> {
        try {
            const response = await this.config.api.post(this.ENDPOINT, data);

            this.config.onSuccess?.('Record created successfully');

            return new (this as unknown as {
                new (args: Partial<M>): M
            })(response.data);
        } catch (error) {
            this.config.onError?.(error);
            throw error;
        }
    }

    static async find<M extends VLModel<M>>(id: number): Promise<M | null> {
        try {
            if (this.STORE.collection.has(id)) {
                this.config.onSuccess?.('Record found in store');
                return this.STORE.collection.get(id)?.value as M | null;
            }
            const response = await this.config.api.get(`${this.ENDPOINT}/${id}`);
            this.config.onSuccess?.('Record found successfully');
            return new (this as unknown as { new (args: Partial<M>): M })(response.data);
        } catch (error) {
            this.config.onError?.(error);
            return null;
        }
    }

    static async update<M extends VLModel<M>>(id: number, data: Partial<M>): Promise<M> {
        try {
            const response = await this.config.api.put(`${this.ENDPOINT}/${id}`, data);
            this.config.onSuccess?.('Record updated successfully');
            return new (this as unknown as { new (args: Partial<M>): M })(response.data);
        } catch (error) {
            this.config.onError?.(error);
            throw error;
        }
    }

    async delete<M extends VLModel<M>>(): Promise<void> {

        try {
            const response = await (this.constructor as typeof VLModel<T>).config.api.delete(
                `${(this.constructor as typeof VLModel<T>).ENDPOINT}/${this.id}`
            );
            (this.constructor as typeof VLModel<T>).config.onSuccess?.('Record deleted successfully');
            this.removeFromStore();
        } catch (error) {
            (this.constructor as typeof VLModel<T>).config.onError?.(error);
            throw error;
        }
    }

    private addToStore() {
        if ((this.constructor as typeof VLModel<T>).STORE.collection.has(this.id)) {
            const existingRef = (this.constructor as typeof VLModel<T>).STORE.collection.get(this.id)
            if (existingRef) {
                existingRef.value = this as unknown as T
            }
        } else {
            ;(this.constructor as typeof VLModel<T>).STORE.collection.set(
                this.id,
                ref(this) as Ref<VLModel<T>>,
            )
        }
    }
    private removeFromStore() {
        (this.constructor as typeof VLModel<T>).STORE.collection.delete(this.id)
    }

}