import apiClient from "./config";
import type { EncryptionAlgorithm } from "@/types";

export const encryptFile = (
  file: File,
  algorithm: EncryptionAlgorithm,
  compress: boolean,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("algorithm", algorithm);
  formData.append("compress", compress.toString());

  return apiClient.post("/enhancedFile/encrypt-enhanced", formData, {
    responseType: "blob",
    onUploadProgress,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const decryptFromArchive = (
  archiveFile: File,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
) => {
  const formData = new FormData();
  formData.append("archive", archiveFile);

  return apiClient.post("/enhancedFile/decrypt-from-archive", formData, {
    responseType: "blob",
    onUploadProgress,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const decryptIndividual = (
  encryptedFile: File,
  encryptedKey: File,
  privateKey: File,
  signature: File,
  metadata: File,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
) => {
  const formData = new FormData();
  formData.append("file", encryptedFile);
  formData.append("encryptedKey", encryptedKey);
  formData.append("privateKey", privateKey);
  formData.append("signature", signature);
  formData.append("metadata", metadata);

  return apiClient.post("/enhancedFile/decrypt-enhanced", formData, {
    responseType: "blob",
    onUploadProgress,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getSupportedAlgorithms = () => {
  return apiClient.get<EncryptionAlgorithm[]>("/enhancedFile/algorithms");
};
