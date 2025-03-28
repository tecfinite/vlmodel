import type { ModelConfig } from './types';

let modelConfig: ModelConfig;

export function configureModel(config: ModelConfig): void {
    modelConfig = config;
}

export function getModelConfig(): ModelConfig {
    if (!modelConfig) {
        throw new Error('Model not configured. Call configureModel first.');
    }
    return modelConfig;
}