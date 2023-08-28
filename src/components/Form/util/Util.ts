import { SelectOption } from '../types/Types'

export const options_to_object = (opts: SelectOption[]) => {

    return opts.reduce(
      (pre, cur: SelectOption) => {
        let entries = new Map([[cur.value, cur.label]]);
        return Object.assign(pre, Object.fromEntries(entries));
      },
      {}
    )
  }
  