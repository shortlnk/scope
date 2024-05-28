export type Item = string | '*' | Array<string | '*'>;
export type Section = Item | [Item, Item]
export type Scopewildcard = Section[];

export type MultiPoolVerbal = `{${string | '*' | ','}}`;
export type ScopeVerbal = `${string | '*' | ':' | MultiPoolVerbal}` | `${string | '*' | MultiPoolVerbal}`;

export type Scheme = Scopewildcard | ScopeVerbal;

export type ScopeLiteral = `${string | ':' | ScopeVerbal}`;

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

  public test(scope: ScopeLiteral): boolean {
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

  public exportLiterals(): string[] {
    const tree: Record<number, string[]> = {};

    this.scheme.forEach((section, i) => {
      tree[i] = [];
      if (typeof section === 'string') {
        tree[i].push(section);
        return;
      }

      if (Array.isArray(section)) {
        if (Array.isArray(section[1])) {
          if (Array.isArray(section[0])) {
            for (let j = 0; j < section[0].length; j++) {
              for (let k = 0; k < section[1].length; k++) {
                tree[i].push(`${section[0][j]}.${section[1][k]}`);
              }
            }

            return;
          } else {
            for (let j = 0; j < section[1].length; j++) {
              tree[i].push(`${section[0]}.${section[1][j]}`);
            }
            return;
          }
        } else {
          tree[i].push(...section as string[]);
        }
      }
    });

    const literals: string[] = [];

    const deepRead = (tree: Record<number, string[]>, index = 0, word = '') => {
      if (index === Object.keys(tree).length - 1) {
        tree[index].forEach((literal) => {
          literals.push(word === '' ? literal : `${word}:${literal}`);
        });
        return;
      }

      tree[index].forEach((literal) => {
        deepRead(tree, index + 1, word === '' ? literal : `${word}:${literal}`);
      });
    }

    deepRead(tree, 0, '');
  

    return literals;
  }
}

export default Scope;