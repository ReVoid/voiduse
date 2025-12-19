import {
  ref,
  type Ref,
  reactive,
  computed,
  readonly,
  watch,
} from 'vue';
import {
  isFunction,
} from '@vue/shared';

import {
  useLoading,
} from '@/composables';


type PaginatedData<T> = {
    items: T[];
    page: number;
    size: number;
    total: number;
};

// TODO: Add the limit + offset common signature
// TODO: Add the no-promise overload signature
type Source<T> =
    | T[]
    | ((page: number, size: number) => Promise<PaginatedData<T>>);

type Options = {
    page: number;
    size: number;
    sizes: number[];
};

const OPTIONS_DEFAULT: Readonly<Options> = {
    page: 0,
    size: 3,
    sizes: [3, 5, 10],
};

// TODO: Add description and use cases
export function usePagination<T>(source: Source<T>, options?: Options) {
    const OPTIONS: Options = { ...OPTIONS_DEFAULT, ...options };

    const items = ref<T[]>([]) as Ref<T[]>; // Inevitable `as` assertion :(

    type Params = {
        page: number;
        size: number;
    };

    const batches = reactive<Params>({
        page: OPTIONS.page,
        size: OPTIONS.size,
    });

    const state = reactive<Params>({
        page: OPTIONS.page,
        size: OPTIONS.size,
    });

    const page = computed<number>({
        get() {
            return state.page;
        },
        set(page) {
          Object.assign(batches, {
              page,
              size: state.size,
          });
        },
    });

    const size = computed<number>({
        get() {
            return state.size;
        },
        set(size){
           Object.assign(batches, {
               page: size !== state.size ? 1 : state.page,
               size,
           });
        },
    });

    const sizes = ref<number[]>(OPTIONS.sizes);

    const count = computed<number>(() => {
        const count = Math.ceil(total.value / size.value);
        return Number.isFinite(count) && count > 0 ? count : 0;
    });

    const total = ref<number>(0);

    // TODO: Add the optional min timeout to prevent flickering
    const loading = useLoading();

    const hasPages = computed<boolean>(() => {
        return count.value > 1;
    });

    const hasPrev = computed<boolean>(() => {
        return hasPages.value && page.value > 1;
    });

    const hasNext = computed<boolean>(() => {
        return hasPages.value && page.value < count.value;
    });

    const isFirst = computed<boolean>(() => {
        return hasPages.value && page.value === 1;
    });

    const isLast = computed<boolean>(() => {
        return hasPages.value && page.value === count.value;
    });

    async function prev(): Promise<void> {
        if (hasPrev.value) {
           page.value = page.value - 1;
        }
    }

    async function next(): Promise<void> {
        if (hasNext.value) {
          page.value = page.value + 1;
        }
    }

    async function append(): Promise<void> {
        const data = await execute({
            page: state.page + 1,
            size: state.size,
        });

        update({
            page: data.page,
            size: data.size,
            items: items.value.concat(data.items),
            total: data.total,
        });
    }

    function first(): void {
        page.value = 1;
    }

    function last(): void {
        page.value = count.value;
    }

    async function refresh(): Promise<void> {
        const data = await execute({
            page: state.page,
            size:  state.size,
        });

        update(data);
    }

    // TODO: Prevent promise racing
    async function execute(payload: Params): Promise<PaginatedData<T>> {
        if (isFunction(source)) {
          return await loading.showUntil(source(payload.page, payload.size));
        }

        return {
            items: source.slice((payload.page - 1) * payload.size, payload.page * payload.size),
            page: payload.page,
            size: payload.size,
            total: source.length,
        };
    }

    function update(params: { page: number, size: number, items: T[], total: number }): void {
        state.page = params.page;
        state.size = params.size;
        items.value = params.items;
        total.value = params.total;
    }

    watch(batches, async ({ page, size }) => {
        const data = await execute({
            page,
            size,
        });

        update(data);
    });

    return {
        items: readonly(items),
        isLoading: readonly(loading.isLoading),
        page,
        size,
        sizes,
        count,
        total: readonly(total),
        hasPages,
        hasPrev,
        hasNext,
        isFirst,
        isLast,
        prev,
        next,
        first,
        last,
        append,
        refresh,
    }
}
