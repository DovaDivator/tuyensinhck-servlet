export function parseFlexibleDate(input: string): Date {
  const trimmed = input.trim();
  // console.log(trimmed);

  const patterns: [RegExp, (m: RegExpMatchArray) => Date][] = [
    // HH:mm DD/MM/YYYY
    [/^(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})$/, m => new Date(+m[5], +m[4] - 1, +m[3], +m[1], +m[2])],
    // DD/MM/YYYY
    [/^(\d{2})\/(\d{2})\/(\d{4})$/, m => new Date(+m[3], +m[2] - 1, +m[1], 0, 0)],
    // HH:mm
    [/^(\d{2}):(\d{2})$/, m => new Date(1970, 0, 1, +m[1], +m[2])]
  ];

  for (const [regex, parser] of patterns) {
    const match = trimmed.match(regex);
    if (match) return parser(match);
  }

  throw new Error(`parseFlexibleDate: Invalid date format: "${input}"`);
}