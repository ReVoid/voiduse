import {
  computed,
  type ComputedRef,
  type MaybeRef,
  unref,
} from 'vue';

import {
  isString,
  isNumber,
} from '@sniptt/guards';

type Unit = 'px' | '%' | 'em' | 'rem' | 'vh' | 'vw';

type Size = 'auto' | `${number}${Unit}`;

type SizeValueRaw = string | number;

type SizeRaw = {
  width?: string | number;
  height?: string | number;
}

type SizeStyle = {
  width: Size;
  height: Size;
};

type UseSizeReturn = {
  style: ComputedRef<SizeStyle>;
};

export function useSize(size: MaybeRef<SizeRaw>): UseSizeReturn {
  function parse(payload?: SizeValueRaw): SizeValueRaw {
    if (!payload) {
      return 'auto';
    }

    const UNITS: string = (['px', '%', 'em', 'rem', 'vh', 'vw'] satisfies Unit[]).join('|');
    const expression = new RegExp(`^(-?\\d+(?:\\.\\d+)?)(${UNITS})?$`);
    const [, value = undefined, unit = 'px'] = expression.exec(payload.toString()) || [];

    if (isNumber(value)) {
      return `${value}${unit as Unit}`;
    }

    if (isString(value)) {
      return `${parseInt(value)}${unit as Unit}`;
    }

    return 'auto' satisfies Size;
  }

  const style = computed<SizeStyle>(() => {
    const value = unref(size);
    return {
      width: parse(value.width),
      height: parse(value.height),
    } as SizeStyle;
  });

  return {
    style,
  };
}
