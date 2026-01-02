export enum FileOfferType {
  Offer = "offer",
  AcceptOffer = "accept_offer",
  DenyOffer = "deny_offer",
  RequestNextFile = "request_next_file",
  ReadyForOffer = "ready_for_offer",
}

export type FileData = {
  name: string;
  size: number;
  mime: string;
  accSize?: number;
};

export type FileOffer = {
  id: string;
  type: FileOfferType;
  files: FileData[];
  from: string;
  to: string;
  currentFile: number;
};

export type FileProgress = Map<string, { name: string; progress: number }>;

export type FileMessage = {
  type: FileOfferType;
  sender?: string;
  receiver?: string;
  files?: FileData[];
  name?: string;
  size?: number;
  mime?: string;
};
