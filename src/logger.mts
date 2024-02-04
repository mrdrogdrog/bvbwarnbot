import { createConsola } from "consola";

export const logger = createConsola({
  fancy: true,
  formatOptions: {
    colors: true,
    date: true,
    columns: 20
  }
});

