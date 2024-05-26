import {describe, expect, test} from '@jest/globals';
import Scope from '../src/index';

describe('🔐 Testing scope', () => {
  test('📮 Parsing verbal scope', () => {
    const scope1 = new Scope('service:*');
    expect(scope1.scheme).toEqual(['service', '*']);

    const scope2 = new Scope('service:method');
    expect(scope2.scheme).toEqual(['service', 'method']);

    const scope3 = new Scope('service:{method1,method2}');
    expect(scope3.scheme).toEqual(['service', ['method1', 'method2']]);

    const scope4 = new Scope('service.*:method');
    expect(scope4.scheme).toEqual([['service', ['*']], 'method']);

    const scope5 = new Scope('service.{method1,method2}:*');
    expect(scope5.scheme).toEqual([['service', ['method1', 'method2']], '*']);

    const scope6 = new Scope('*.{method1,method2}:method');
    expect(scope6.scheme).toEqual([[['*'], ['method1', 'method2']], 'method']);

    const scope7 = new Scope('{service,host}.users:method');
    expect(scope7.scheme).toEqual([[['service', 'host'], ['users']], 'method']);
  });

  test('🏮 Testing verbal scope', () => {
    const scope = new Scope('service:{auth,users}:*');

    const scopeAuth = 'service:auth:01';
    const userAuth = 'service:users:shayn';

    expect(scope.test(scopeAuth)).toBeTruthy();
    expect(scope.test(userAuth)).toBeTruthy();
  });

  test('🏮 Testing verbal scope with wildcard', () => {
    const scope1 = new Scope('service.*:profile:write');
    const scope2 = new Scope('service.users:profile:write');
    const scope3 = new Scope('service.{bots,users}:profile:*');
    const scope4 = new Scope('{service,host}.*:{profile}:*');

    const wildcardScope = 'service.users:profile:write';

    expect(scope1.test(wildcardScope)).toBeTruthy();
    expect(scope2.test(wildcardScope)).toBeTruthy();
    expect(scope3.test(wildcardScope)).toBeTruthy();
    expect(scope4.test(wildcardScope)).toBeTruthy();
  });
});