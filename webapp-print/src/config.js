export const periods = [
  { label: '全て', value: 'any' },
  { label: '今日', value: '0d' },
  { label: '昨日', value: '1d' },
  { label: '一昨日', value: '2d' },
  { label: '３日前', value: '3d' },
  { label: '４日前', value: '4d' },
  { label: '５日前', value: '5d' },
  { label: '６日前', value: '6d' },
  { label: '７日前', value: '7d' },
  { label: '今週 (未実装)', value: '0w' },
  { label: '先週 (未実装)', value: '1w' },
  { label: '今月 (未実装)', value: '0m' },
  { label: '先月 (未実装)', value: '1m' },
  { label: '指定する (未実装)', value: 'custom' }
];

export function computePeriod (by) {
  const def = [ null, null ];
  switch (by) {
    case 'any':
      return def;
    case 'custom':
      return def;
    default:
      if (by.length == 2) {
        switch (by[1]) {
          case 'd':
            const ago = parseInt(by[0]);
            const today = new Date();
            let ts = today.setHours(0, 0, 0, 0);
            ts -= ago * 24 * 60 * 60 * 1000;
            return [ ts, ts + 24 * 60 * 60 * 1000 - 1];
          default:
            return def;
        }
      }
      return def;
  }
}