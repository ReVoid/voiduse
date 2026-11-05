import { describe, expect, test, vi } from 'vitest';
import { computed, isReadonly } from 'vue';

import { useList } from '../useList';

describe('useList', () => {
  test('starts with an empty list', () => {
    const list = useList<number>();

    expect(list.items.value).toEqual([]);
    expect(list.first.value).toBeUndefined();
    expect(list.last.value).toBeUndefined();
    expect(list.isEmpty.value).toBe(true);
    expect(list.includes(1)).toBe(false);
    expect(list.isFirst(1)).toBe(false);
    expect(list.isLast(1)).toBe(false);
  });

  describe('add', () => {
    test('appends single values and arrays in order, preserving duplicates', () => {
      const list = useList<number>();
      list.add(1);
      list.add([2, 1, 3]);

      expect(list.items.value).toEqual([1, 2, 1, 3]);
      expect(list.first.value).toBe(1);
      expect(list.last.value).toBe(3);
      expect(list.isEmpty.value).toBe(false);
    });

    test('accepts an empty array without changing the list', () => {
      const list = useList<number>();
      list.add([]);
      expect(list.items.value).toEqual([]);
      list.add(1);
      list.add([]);
      expect(list.items.value).toEqual([1]);
    });

    test('does not reuse the input array as list storage', () => {
      const list = useList<number>();
      const input = [1, 2];
      list.add(input);
      input.push(3);
      list.add(4);

      expect(input).toEqual([1, 2, 3]);
      expect(list.items.value).toEqual([1, 2, 4]);
    });
  });

  describe('remove', () => {
    test('removes every occurrence of a single value and preserves survivor order', () => {
      const list = useList<number>();
      list.add([1, 2, 1, 3]);
      list.remove(1);

      expect(list.items.value).toEqual([2, 3]);
      expect(list.first.value).toBe(2);
      expect(list.last.value).toBe(3);
      expect(list.includes(1)).toBe(false);
    });

    test('leaves the list unchanged when the value is absent', () => {
      const list = useList<number>();
      list.add([1, 2]);
      list.remove(3);

      expect(list.items.value).toEqual([1, 2]);
    });

    test('removes multiple distinct values and all their occurrences', () => {
      const list = useList<number>();
      list.add([1, 2, 3, 1, 4, 2]);
      list.remove([1, 2]);

      expect(list.items.value).toEqual([3, 4]);
    });

    test('still removes a matching value when another requested value is absent', () => {
      const list = useList<number>();
      list.add([1, 2, 3]);
      list.remove([1, 99]);

      expect(list.items.value).toEqual([2, 3]);
    });

    test('does nothing when given an empty array', () => {
      const list = useList<number>();
      list.add([1, 2]);
      list.remove([]);

      expect(list.items.value).toEqual([1, 2]);
    });

    test('handles repeated removal targets', () => {
      const list = useList<number>();
      list.add([1, 2, 1]);
      list.remove([1, 1]);

      expect(list.items.value).toEqual([2]);
    });

    test('resets derived state after removing the final item', () => {
      const list = useList<number>();
      list.add(1);
      list.remove(1);

      expect(list.items.value).toEqual([]);
      expect(list.first.value).toBeUndefined();
      expect(list.last.value).toBeUndefined();
      expect(list.isEmpty.value).toBe(true);
      expect(list.isFirst(1)).toBe(false);
      expect(list.isLast(1)).toBe(false);
    });

    test('handles removal from an empty list', () => {
      const list = useList<number>();
      list.remove(1);
      list.remove([1, 2]);
      list.remove([]);

      expect(list.items.value).toEqual([]);
      expect(list.isEmpty.value).toBe(true);
    });
  });

  describe('replace', () => {
    test('replaces only the first matching item without changing order or length', () => {
      const list = useList<number>();
      list.add([1, 2, 1]);
      list.replace(1, 3);

      expect(list.items.value).toEqual([3, 2, 1]);
      expect(list.first.value).toBe(3);
      expect(list.last.value).toBe(1);
    });

    test('refreshes the last item', () => {
      const list = useList<number>();
      list.add([1, 2]);
      list.replace(2, 3);

      expect(list.last.value).toBe(3);
      expect(list.isLast(3)).toBe(true);
      expect(list.includes(2)).toBe(false);
    });

    test('does nothing when the target is absent, including on an empty list', () => {
      const list = useList<number>();
      list.replace(1, 9);
      expect(list.items.value).toEqual([]);
      list.add([1, 2]);
      list.replace(3, 9);
      expect(list.items.value).toEqual([1, 2]);
    });
  });

  describe('update', () => {
    test('deeply merges partial objects without mutating the original or payload', () => {
      const list = useList<{
        id: number;
        profile: { name: string; address: { city: string; country: string } };
      }>();
      const original = {
        id: 1,
        profile: { name: 'Anna', address: { city: 'Paris', country: 'France' } },
      };
      const payload = { profile: { address: { city: 'Lyon' } } };
      list.add(original);
      // Prime computed values before the update to check invalidation.
      expect(list.first.value).toEqual(original);
      list.update(original, payload);

      expect(list.items.value).toEqual([{
        id: 1,
        profile: { name: 'Anna', address: { city: 'Lyon', country: 'France' } },
      }]);
      expect(list.first.value).toEqual(list.items.value[0]);
      expect(list.last.value).toEqual(list.items.value[0]);
      expect(original.profile.address.city).toBe('Paris');
      expect(payload).toEqual({ profile: { address: { city: 'Lyon' } } });
      payload.profile.address.city = 'Nice';
      expect(list.first.value?.profile.address.city).toBe('Lyon');
    });

    test('replaces nested arrays entirely instead of merging their elements', () => {
      const list = useList<{
        roles: string[];
        profile: { links: { url: string; label?: string }[]; name: string };
      }>();
      const original = {
        roles: ['reader', 'editor'],
        profile: { links: [{ url: 'old', label: 'Old' }, { url: 'other' }], name: 'Anna' },
      };
      const payload = { roles: ['admin'], profile: { links: [{ url: 'new' }] } };
      list.add(original);
      list.update(original, payload);

      expect(list.items.value).toEqual([{
        roles: ['admin'],
        profile: { links: [{ url: 'new' }], name: 'Anna' },
      }]);
      expect(original.roles).toEqual(['reader', 'editor']);
      expect(original.profile.links).toHaveLength(2);
      payload.profile.links[0]!.url = 'changed';
      expect(list.first.value?.profile.links).toEqual([{ url: 'new' }]);
    });

    test('can replace an array field with an empty array', () => {
      const list = useList<{ roles: string[] }>();
      list.add({ roles: ['reader'] });
      list.update({ roles: ['reader'] }, { roles: [] });

      expect(list.items.value).toEqual([{ roles: [] }]);
    });

    test('uses the comparator and updates only the first matching item in place', () => {
      const list = useList<{ id: number; name: string }>((a, b) => a.id === b.id);
      list.add([{ id: 1, name: 'First' }, { id: 2, name: 'Middle' }, { id: 1, name: 'Last' }]);
      list.update({ id: 1, name: 'Search target' }, { name: 'Updated' });

      expect(list.items.value).toEqual([
        { id: 1, name: 'Updated' },
        { id: 2, name: 'Middle' },
        { id: 1, name: 'Last' },
      ]);
    });

    test('passes the actual stored item to the callback and uses its result without merging', () => {
      const list = useList<{ id: number; roles: string[]; optional?: string }>((a, b) => a.id === b.id);
      list.add({ id: 1, roles: ['reader'], optional: 'discard' });
      const updater = vi.fn((current: { id: number; roles: string[] }) => ({
        id: current.id,
        roles: [...current.roles, 'editor'],
      }));
      list.update({ id: 1, roles: [] }, updater);

      expect(updater).toHaveBeenCalledExactlyOnceWith({ id: 1, roles: ['reader'], optional: 'discard' });
      expect(list.items.value).toEqual([{ id: 1, roles: ['reader', 'editor'] }]);
    });

    test('does nothing and does not call the updater if the target is missing', () => {
      const list = useList<number>();
      const updater = vi.fn((current: number) => current + 1);
      list.update(1, updater);
      expect(list.items.value).toEqual([]);
      list.add([1, 2]);
      list.update(3, updater);
      list.update(3, 4);

      expect(updater).not.toHaveBeenCalled();
      expect(list.items.value).toEqual([1, 2]);
    });

    test('replaces primitive values directly or through a callback and keeps consumers reactive', () => {
      const list = useList<number>();
      const total = computed(() => list.items.value.reduce((sum, item) => sum + item, 0));
      list.add([1, 2]);
      expect(total.value).toBe(3);
      list.update(1, 0);
      expect(total.value).toBe(2);
      expect(list.first.value).toBe(0);
      list.update(2, current => current + 3);
      expect(total.value).toBe(5);
      expect(list.last.value).toBe(5);
      expect(list.isEmpty.value).toBe(false);
    });

    test('replaces top-level arrays instead of merging by index', () => {
      const list = useList<number[]>();
      list.add([[1, 2, 3]]);
      list.update([1, 2, 3], [4]);

      expect(list.items.value).toEqual([[4]]);
    });

    test('leaves the list unchanged if the updater throws', () => {
      const list = useList<number>();
      list.add(1);

      expect(() => list.update(1, () => { throw new Error('Failed'); })).toThrow('Failed');
      expect(list.items.value).toEqual([1]);
    });
  });

  describe('comparison', () => {
    test('checks membership and boundaries for primitive values', () => {
      const list = useList<number>();
      list.add([1, 2, 3]);

      expect(list.includes(2)).toBe(true);
      expect(list.includes(4)).toBe(false);
      expect(list.isFirst(1)).toBe(true);
      expect(list.isFirst(2)).toBe(false);
      expect(list.isLast(3)).toBe(true);
      expect(list.isLast(2)).toBe(false);
    });

    test('a single item is both first and last', () => {
      const list = useList<number>();
      list.add(0);

      expect(list.isFirst(0)).toBe(true);
      expect(list.isLast(0)).toBe(true);
      expect(list.isEmpty.value).toBe(false);
    });

    test('uses deep equality for objects by default', () => {
      const list = useList<{ nested: { id: number } }>();
      list.add([{ nested: { id: 1 } }, { nested: { id: 2 } }]);

      expect(list.includes({ nested: { id: 1 } })).toBe(true);
      expect(list.includes({ nested: { id: 3 } })).toBe(false);
      expect(list.isFirst({ nested: { id: 1 } })).toBe(true);
      expect(list.isLast({ nested: { id: 2 } })).toBe(true);
      list.replace({ nested: { id: 1 } }, { nested: { id: 3 } });
      expect(list.first.value).toEqual({ nested: { id: 3 } });
      list.remove({ nested: { id: 2 } });
      expect(list.items.value).toEqual([{ nested: { id: 3 } }]);
    });

    test('uses a custom comparator for membership, boundaries, replacement and removal', () => {
      const list = useList<string>((a, b) => a.toLowerCase() === b.toLowerCase());
      list.add(['Alpha', 'Beta', 'Gamma']);

      expect(list.includes('BETA')).toBe(true);
      expect(list.includes('DELTA')).toBe(false);
      expect(list.isFirst('ALPHA')).toBe(true);
      expect(list.isLast('GAMMA')).toBe(true);
      list.replace('BETA', 'Delta');
      expect(list.items.value).toEqual(['Alpha', 'Delta', 'Gamma']);
      list.remove('ALPHA');
      expect(list.items.value).toEqual(['Delta', 'Gamma']);
    });

    test('uses the custom comparator when removing multiple targets', () => {
      const list = useList<string>((a, b) => a.toLowerCase() === b.toLowerCase());
      list.add(['Alpha', 'Beta', 'Gamma']);
      list.remove(['ALPHA', 'GAMMA']);

      expect(list.items.value).toEqual(['Beta']);
    });
  });

  describe('clear', () => {
    test('empties the list, resets derived state and allows adding again', () => {
      const list = useList<number>();
      list.add([1, 2]);
      expect(list.first.value).toBe(1);
      expect(list.last.value).toBe(2);
      expect(list.isEmpty.value).toBe(false);
      list.clear();

      expect(list.items.value).toEqual([]);
      expect(list.first.value).toBeUndefined();
      expect(list.last.value).toBeUndefined();
      expect(list.isEmpty.value).toBe(true);
      expect(list.includes(1)).toBe(false);
      expect(list.isFirst(1)).toBe(false);
      expect(list.isLast(2)).toBe(false);
      list.clear();
      list.add(3);
      expect(list.items.value).toEqual([3]);
      expect(list.first.value).toBe(3);
      expect(list.last.value).toBe(3);
      expect(list.isEmpty.value).toBe(false);
    });
  });

  test('keeps consumers reactive across append, replacement, removal and clear', () => {
    const { items, add, replace, remove, clear } = useList<number>();
    const total = computed(() => items.value.reduce((sum, item) => sum + item, 0));

    expect(total.value).toBe(0);
    add([1, 2]);
    expect(total.value).toBe(3);
    replace(2, 4);
    expect(total.value).toBe(5);
    remove(1);
    expect(total.value).toBe(4);
    clear();
    expect(total.value).toBe(0);
  });

  test('exposes deeply readonly items that reject external mutations', () => {
    const list = useList<{ id: number }>();
    list.add({ id: 1 });
    expect(isReadonly(list.items)).toBe(true);
    expect(isReadonly(list.items.value)).toBe(true);
    expect(isReadonly(list.items.value[0])).toBe(true);

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      // @ts-expect-error: deliberately attempt to mutate the public readonly array.
      list.items.value.push({ id: 2 });

      // @ts-expect-error: deliberately attempt to replace the public readonly ref.
      list.items.value = [];

      for (const item of list.items.value) {
        // @ts-expect-error: deliberately attempt to mutate a readonly item.
        item.id = 99;
      }

      expect(list.items.value).toEqual([{ id: 1 }]);
    } finally {
      warn.mockRestore();
    }
  });
});
