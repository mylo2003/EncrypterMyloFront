export type EncryptionAlgorithm =
  | "AES_128"
  | "AES_256"
  | "AES_GCM_128"
  | "AES_GCM_256"
  | "CHACHA20";

export type ProcessingStatus = "idle" | "processing" | "success" | "error";

export interface AlgorithmOption {
  value: EncryptionAlgorithm;
  label: string;
  description: string;
}
