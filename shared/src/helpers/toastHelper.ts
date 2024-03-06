import { ToastServiceMethods } from 'primevue/toastservice';

export default class ToastHelper {
    readonly toastInstanse;

    constructor(toastInstanse: ToastServiceMethods) {
      this.toastInstanse = toastInstanse;
    }

    success(detailArg: string, summaryArg = 'Success', lifeTime = 5000): void {
      this.toastInstanse.add(
        {
          severity: 'success',
          summary: summaryArg,
          detail: detailArg,
          life: lifeTime,
        },
      );
    }

    info(detailArg: string, summaryArg = 'Info', lifeTime = 5000): void {
      this.toastInstanse.add(
        {
          severity: 'info',
          summary: summaryArg,
          detail: detailArg,
          life: lifeTime,
        },
      );
    }

    warning(detailArg: string, summaryArg = 'Warning', lifeTime = 5000): void {
      this.toastInstanse.add(
        {
          severity: 'warn',
          summary: summaryArg,
          detail: detailArg,
          life: lifeTime,
        },
      );
    }

    error(detailArg: string, summaryArg = 'Error', lifeTime = 5000): void {
      this.toastInstanse.add(
        {
          severity: 'error',
          summary: summaryArg,
          detail: detailArg,
          life: lifeTime,
        },
      );
    }
}
