type ErrorDescription = {
  short_error: string;
  solution: string;
};

const errors: Record<number, ErrorDescription> = {
  1: {
    short_error: 'Peace not installed.',
    solution: 'Please install and launch PeaceGUI before retrying.',
  },
  2: {
    short_error: 'Peace not running.',
    solution: 'Please launch PeaceGUI before retrying.',
  },
  3: {
    short_error: 'Peace not ready yet.',
    solution: 'Please launch PeaceGUI before retrying.',
  },
};

export type { ErrorDescription };
export { errors };
