# @tecfinite/vlmodel

A model class implementation for Vue.js applications working with Laravel backend. This package provides a seamless integration between Vue.js frontend and Laravel API endpoints.

## Features

- TypeScript support
- Vue 3 compatibility
- Automatic model store management
- Laravel-style model relationships
- Date handling with Luxon
- Axios-based API communication
- Pinia store integration

## Installation

```bash
npm i @tecfinite/vlmodel
```

## Requirements

- Node.js >= 18.0.0
- Vue.js >= 3.5.13
- Axios >= 1.8.4
- Luxon >= 3.6.0
- Pinia >= 3.0.1

## Basic Usage

1. Configure the model:

```typescript
import { configureModel } from '@tecfinite/vlmodel';
import axios from 'axios';

configureModel({
  api: axios.create({
    baseURL: 'your-api-url'
  }),
  onError: (error) => {
    console.error('API Error:', error);
  },
  onSuccess: (message) => {
    console.log('Success:', message);
  }
});
```

2. Create your model class:

```typescript
import VLModel from '@tecfinite/vlmodel';
import { defineStore } from 'pinia';

export class User extends VLModel<User> {
  static get ENDPOINT() {
    return '/api/users';
  }

  static get STORE() {
    return useUserStore();
  }

  // Define your model properties here
  declare name: string;
  declare email: string;
}

// Define your Pinia store
export const useUserStore = defineStore('users', {
  state: () => ({
    collection: new Map(),
    collectionArray: []
  })
});
```

3. Use the model:

```typescript
// Fetch all users
const users = await User.all();

// Find a specific user
const user = await User.find(1);

// Create a new user
const newUser = await User.create({
  name: 'John Doe',
  email: 'john@example.com'
});

// Update a user
const updatedUser = await User.update(1, {
  name: 'Jane Doe'
});

// Delete a user
await user.delete();
```

## API Reference

### Static Methods

- `all<M>(filters?: Array<{ [key: string]: string }>, withRelations?: string[]): Promise<M[]>`
- `find<M>(id: number): Promise<M | null>`
- `create<M>(data: Partial<M>): Promise<M>`
- `update<M>(id: number, data: Partial<M>): Promise<M>`

### Instance Methods

- `delete(): Promise<void>`

### Configuration Options

- `api`: AxiosInstance
- `onError?`: (error: any) => void
- `onSuccess?`: (message: string) => void

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Abdurrahman Salem @ [Tecfinite](https://tecfinite.com)

## Issues and Support

For issues and feature requests, please visit our [GitHub repository](https://github.com/tecfinite/vlmodel/issues).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.