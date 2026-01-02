export enum ToastType {
  Success = "success",
  Error = "error",
}

export type ToastData = {
  id: number;
  type: ToastType;
  title: string;
  description: string;
  duration: number;
};
