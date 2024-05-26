import {describe, expect, test} from '@jest/globals';
import Scope from '../src/index';

const scope1 = new Scope('service:*');
const scope2 = new Scope('service:method');
const scope3 = new Scope('service:{method1,method2}');
const scope4 = new Scope('service.*:method');
const scope5 = new Scope('service.{method1,method2}:*');
const scope6 = new Scope('*.{method1,method2}:method');
const scope7 = new Scope('{service,host}.users:method');
const scope8 = new Scope('service.host:method');

describe('🔐 Testing scope', () => {
  test('📮 Parsing verbal scope', () => {
    expect(scope1.scheme).toEqual(['service', '*']);
    expect(scope2.scheme).toEqual(['service', 'method']);
    expect(scope3.scheme).toEqual(['service', ['method1', 'method2']]);
    expect(scope4.scheme).toEqual([['service', ['*']], 'method']);
    expect(scope5.scheme).toEqual([['service', ['method1', 'method2']], '*']);
    expect(scope6.scheme).toEqual([[['*'], ['method1', 'method2']], 'method']);
    expect(scope7.scheme).toEqual([[['service', 'host'], ['users']], 'method']);
    expect(scope8.scheme).toEqual([['service', ['host']], 'method']);
  });

  test('🏮 Testing verbal scope', () => {
    const scope = new Scope('service:{auth,users}:*');

    const scopeAuth = 'service:auth:01';
    const userAuth = 'service:users:shayn';

    expect(scope.test(scopeAuth)).toBeTruthy();
    expect(scope.test(userAuth)).toBeTruthy();
  });

  test('🔮 Testing verbal scope with wildcard', () => {
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

  test('⚙️ Testing exporting literals', () => {
    expect(scope1.exportLiterals()).toEqual([
      'service:*'
    ]);
    expect(scope2.exportLiterals()).toEqual([
      'service:method'
    ]);
    expect(scope3.exportLiterals()).toEqual([
      'service:method1',
      'service:method2'
    ]);
    expect(scope4.exportLiterals()).toEqual([
      'service.*:method'
    ]);
    expect(scope5.exportLiterals()).toEqual([
      'service.method1:*',
      'service.method2:*'
    ]);
    expect(scope6.exportLiterals()).toEqual([
      '*.method1:method',
      '*.method2:method'
    ]);
    expect(scope7.exportLiterals()).toEqual([
      'service.users:method',
      'host.users:method'
    ]);
    expect(scope8.exportLiterals()).toEqual([
      'service.host:method'
    ]);
  });
});