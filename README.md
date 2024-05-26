# Scope
Create scope schema and test it.

# Installation
```bash
npm install @shortlnk/scope
```
# Documentation

### Simple example
```js
const Scope = require('@shortlnk/scope');

const scopeSchema = 'service:users:*';
const scope = new Scope(scopeSchema);

scope.scheme; // ['service', 'users', '*']

scope.test('service:users:read'); // true
scope.test('service:users:write'); // true

scope.test('service:bots:read'); // false
```

### Multiple choices example
```js
const Scope = require('@shortlnk/scope');

const scopeSchema = 'service:users:{read,write}';

const scope = new Scope(scopeSchema);

scope.scheme; // ['service', 'users', ['read', 'write']]

scope.test('service:users:read'); // true

scope.test('service:users:write'); // true

scope.test('service:users:delete'); // false
```

### Sub scope example
```js
const Scope = require('@shortlnk/scope');

const scopeSchema = 'service.host:users:{read,write}:*';

const scope = new Scope(scopeSchema);

scope.scheme; // [['service' ['host']], 'users', ['read', 'write'], '*']

scope.test('service.host:users:read:1'); // true

scope.test('service.host:users:write:2'); // true

scope.test('service.host:users:delete:3'); // false
```

### Complex example
```js
const Scope = require('@shortlnk/scope');

const scopeSchema = 'service.host:{profile,member}.*:*.{read,write}:*:{exchange,transfer}.{read,write}';

const scope = new Scope(scopeSchema);

scope.scheme; // [['service', ['host']], [['profile', 'member'], ['*']], [['*'], ['read', 'write']], '*', [['exchange', 'transfer'], ['read', 'write']]]

scope.test('service.host:profile.1:dm.read:friend:exchange.read'); // true

scope.test('service.host:member.all:dm.write:friend:transfer.write'); // true

scope.test('service.host:member.3:write:exchange.read'); // false
```

## Reference

```ts
export type Item = string | '*' | Array<string | '*'>;
export type Section = Item | [Item, Item]
export type Scopewildcard = Section[];

export type MultiPoolVerbal = `{${string | '*' | ','}}`;
export type ScopeVerbal = `${string | '*' | ':' | MultiPoolVerbal}` | `${string | '*' | MultiPoolVerbal}`;

export type Scheme = Scopewildcard | ScopeVerbal;

export type ScopeLiteral = `${string | ':' | ScopeVerbal}`;
```

### `new Scope(schema: Scheme): Scope`
Create a new scope instance.

#### Parameters
* `schema` - The scope schema.

### `scope.scheme: Scopewildcard`
The scheme of the scope.

### `scope.test(scope: ScopeLiteral): boolean`
Test if the scope is valid.

#### Parameters
* `scope` - The scope to test.

#### Returns

* `boolean` - `true` if the scope is valid, `false` otherwise.

# Authors

* [**shaynlink**](https://github.com/shaynlink)

# License

MIT License

Copyright (c) 2024 shortlnk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.