export type Item = string | '*' | Array<string | '*'>;
export type Section = Item | [Item, Item]
export type Scopewildcard = Section[];

export type MultiPoolVerbal = `{${string | '*' | ','}}`;
export type ScopeVerbal = `${string | '*' | ':' | MultiPoolVerbal}` | `${string | '*' | MultiPoolVerbal}`;

export type Scheme = Scopewildcard | ScopeVerbal;

export class Scope {
  public scheme: Scopewildcard;
  constructor(scheme: Scheme) {
    this.scheme = typeof scheme === 'string' ?
      this.toArray(scheme)
      : scheme;
  }

  public toArray(scheme: ScopeVerbal): Scopewildcard {
    if (!/^([\w+{,}.*]+:?)+/gm.test(scheme)) {
      throw TypeError('Invalid scope scheme');
    }

    return scheme
      .replace(/ +/gm, '')
      .split(':')
      .map((section): Section => {
        if (section.includes('.')) {
          const [key, value] = section.split('.')
          if (value === '*') {
            return [
              key.includes('*')
                ? ['*']
                : /^\{[\w,?{}]+\}$/gm.test(key)
                  ? key.replace(/[\{\}]/gm, '').split(',')
                  : key,
              ['*']
            ];
          } else if (/^\{[\w,?{}]+\}$/gm.test(value)) {
            return [
              key.includes('*')
                ? ['*']
                : /^\{[\w,?{}]+\}$/gm.test(key)
                  ?  key.replace(/[\{\}]/gm, '').split(',')
                  : key,
              value.replace(/[\{\}]/gm, '').split(',')
            ];
          } else {
            return [
              key.includes('*')
                ? ['*']
                : /^\{[\w,?{}]+\}$/gm.test(key)
                  ? key.replace(/[\{\}]/gm, '').split(',')
                  : key,
              [value]
            ];
          }
        }

        if (/^\{[\w,?{}]+\}$/gm.test(section)) {
          return section.replace(/[\{\}]/gm, '').split(',');
        }

        return section;
      });
  }

  test(scope: string): boolean {
    const test = scope.split(':');
    return this.scheme.every((section, index) => {
      if (section === '*' || section.includes('*')) {
        return section;
      }

      if (Array.isArray(section) && Array.isArray(section[1])) {
        const [key, value] = test[index].split('.');
        if (
          section[0] === key ||
          section[0].includes('*') ||
          section[0].includes(key)
        ) {
          return section[1].includes(value) || section[1].includes('*');
        }
      }

      if (Array.isArray(section)) {
        return section.includes(test[index] ?? '*');
      }

      return section === test[index];
    });
  }
}

export default Scope;