import {
  encryptFile as apiEncrypt,
  decryptFromArchive as apiDecryptArchive,
  decryptIndividual as apiDecryptIndividual,
} from "@/api/fileApi";
import type { EncryptionAlgorithm, ProcessingStatus } from "@/types";

export const encryptFile = async (
  file: File,
  algorithm: EncryptionAlgorithm,
  compress: boolean,
  setProgress: (value: number) => void,
  setStatus: (status: ProcessingStatus) => void,
  setMessage: (message: string) => void
): Promise<Blob | null> => {
  if (!file) {
    setMessage("Por favor, selecciona un archivo para encriptar");
    setStatus("error");
    return null;
  }

  setStatus("processing");
  setProgress(0);
  setMessage("Encriptando archivo...");

  try {
    const response = await apiEncrypt(file, algorithm, compress, (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      setProgress(percentCompleted);
    });

    setProgress(100);
    setStatus("success");
    setMessage("Archivo encriptado exitosamente. La descarga comenzará automáticamente.");
    return response.data;
  } catch (error) {
    setStatus("error");
    setMessage("Error al encriptar el archivo. Por favor intenta nuevamente.");
    setProgress(0);
    return null;
  }
};

export const decryptFromArchive = async (
  archiveFile: File,
  setProgress: (value: number) => void,
  setStatus: (status: ProcessingStatus) => void,
  setMessage: (message: string) => void
): Promise<Blob | null> => {
  if (!archiveFile) {
    setMessage("Por favor, selecciona un archivo ZIP o RAR");
    setStatus("error");
    return null;
  }

  setStatus("processing");
  setProgress(0);
  setMessage("Desencriptando desde archivo comprimido...");

  try {
    const response = await apiDecryptArchive(archiveFile, (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      setProgress(percentCompleted);
    });

    setProgress(100);
    setStatus("success");
    setMessage("Archivo desencriptado exitosamente. La descarga comenzará automáticamente.");
    return response.data;
  } catch (error) {
    setStatus("error");
    setMessage("Error al desencriptar el archivo. Verifica que el archivo sea válido.");
    setProgress(0);
    return null;
  }
};

export const decryptIndividual = async (
  encryptedFile: File,
  encryptedKey: File,
  privateKey: File,
  signature: File,
  metadata: File,
  setProgress: (value: number) => void,
  setStatus: (status: ProcessingStatus) => void,
  setMessage: (message: string) => void
): Promise<Blob | null> => {
  if (!encryptedFile || !encryptedKey || !privateKey || !signature || !metadata) {
    setMessage("Por favor, selecciona todos los archivos requeridos");
    setStatus("error");
    return null;
  }

  setStatus("processing");
  setProgress(0);
  setMessage("Desencriptando archivos individuales...");

  try {
    const response = await apiDecryptIndividual(
      encryptedFile,
      encryptedKey,
      privateKey,
      signature,
      metadata,
      (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        setProgress(percentCompleted);
      }
    );

    setProgress(100);
    setStatus("success");
    setMessage("Archivo desencriptado exitosamente. La descarga comenzará automáticamente.");
    return response.data;
  } catch (error) {
    setStatus("error");
    setMessage("Error al desencriptar el archivo. Verifica que todos los archivos sean válidos.");
    setProgress(0);
    return null;
  }
};
