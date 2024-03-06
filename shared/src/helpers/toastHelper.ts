import { ToastServiceMethods } from 'primevue/toastservice';

export default class ToastHelper {
    readonly lifeTime = 3000;
    readonly toastInstanse;

    constructor(toastInstanse: ToastServiceMethods) {
      this.toastInstanse = toastInstanse;
    }

    success(detailArg: string, summaryArg = 'Success'): void {
      this.toastInstanse.add(
        {
          severity: 'success',
          summary: summaryArg,
          detail: detailArg,
          life: this.lifeTime,
        },
      );
    }

    info(detailArg: string, summaryArg = 'Info'): void {
      this.toastInstanse.add(
        {
          severity: 'info',
          summary: summaryArg,
          detail: detailArg,
          life: this.lifeTime,
        },
      );
    }

    warning(detailArg: string, summaryArg = 'Warning'): void {
      this.toastInstanse.add(
        {
          severity: 'warn',
          summary: summaryArg,
          detail: detailArg,
          life: this.lifeTime,
        },
      );
    }

    error(detailArg: string, summaryArg = 'Error'): void {
      this.toastInstanse.add(
        {
          severity: 'error',
          summary: summaryArg,
          detail: detailArg,
          life: this.lifeTime,
        },
      );
    }
}
