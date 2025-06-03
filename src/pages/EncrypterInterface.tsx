"use client";

import { useState } from "react";
import { Shield, Unlock, FileArchive, Files, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { encryptFile, decryptFromArchive, decryptIndividual } from "@/services/fileServices";
import { downloadFile } from "@/lib/download";
import type { EncryptionAlgorithm, ProcessingStatus, AlgorithmOption } from "@/types";

export const algorithmOptions: AlgorithmOption[] = [
  { value: "AES_128", label: "AES 128", description: "Cifrado AES con clave de 128 bits" },
  { value: "AES_256", label: "AES 256", description: "Cifrado AES con clave de 256 bits" },
  { value: "AES_GCM_128", label: "AES-GCM 128", description: "AES en modo GCM con clave de 128 bits" },
  { value: "AES_GCM_256", label: "AES-GCM 256", description: "AES en modo GCM con clave de 256 bits" },
  { value: "CHACHA20", label: "ChaCha20", description: "Cifrado ChaCha20 para mayor velocidad y seguridad" },
];

export default function EncrypterInterface() {
  const [activeTab, setActiveTab] = useState<"encrypt" | "decrypt">("encrypt");
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  // Encryption states
  const [fileToEncrypt, setFileToEncrypt] = useState<File | null>(null);

  const [algorithm, setAlgorithm] = useState<EncryptionAlgorithm>("AES_256");
  const [compress, setCompress] = useState(false);

  // Decryption states
  const [decryptMode, setDecryptMode] = useState<"individual" | "archive">("archive");
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [encryptedFile, setEncryptedFile] = useState<File | null>(null);
  const [encryptedKey, setEncryptedKey] = useState<File | null>(null);
  const [privateKey, setPrivateKey] = useState<File | null>(null);
  const [signature, setSignature] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<File | null>(null);

  const handleEncrypt = async () => {
    if (!encryptFile) return;
    if (!fileToEncrypt) return;

    const result = await encryptFile(
      fileToEncrypt,
      algorithm,
      compress,
      setProgress,
      setStatus,
      setMessage
    );

    if (result) {
      downloadFile(result, `${fileToEncrypt.name}_encrypted.zip`);
    }
  };

  const handleDecryptFromArchive = async () => {
    if (!archiveFile) return;

    const result = await decryptFromArchive(
      archiveFile,
      setProgress,
      setStatus,
      setMessage
    );

    if (result) {
      downloadFile(result, "decrypted_file");
    }
  };

  const handleDecryptIndividual = async () => {
    if (!encryptedFile || !encryptedKey || !privateKey || !signature || !metadata) return;

    const result = await decryptIndividual(
      encryptedFile,
      encryptedKey,
      privateKey,
      signature,
      metadata,
      setProgress,
      setStatus,
      setMessage
    );

    if (result) {
      downloadFile(result, "decrypted_file");
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setProgress(0);
    setMessage("");
    setFileToEncrypt(null);
    setArchiveFile(null);
    setEncryptedFile(null);
    setEncryptedKey(null);
    setPrivateKey(null);
    setSignature(null);
    setMetadata(null);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-green-400" />
            Encrypter Mylo
          </h1>
          <p className="text-gray-300">
            Encripta y desencripta archivos de forma segura con múltiples algoritmos
          </p>
        </div>

        <Card className="md:h-[525px] md:w-[900px] flex mx-auto bg-gray-800 border-gray-700 shadow-2xl">
          <CardHeader className="">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                if (value === 'encrypt' || value === 'decrypt') {
                  setActiveTab(value);
                };
                resetForm();
              }}
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-700 border-gray-600">
                <TabsTrigger
                  value="encrypt"
                  className="flex items-center gap-2 transition-all data-[state=active]:bg-emerald-500 data-[state=active]:hover:bg-emerald-600 data-[state=active]:text-white text-gray-300 cursor-pointer hover:bg-gray-800"
                >
                  <Shield className="h-4 w-4" />
                  Encriptar
                </TabsTrigger>
                <TabsTrigger
                  value="decrypt"
                  className="flex items-center gap-2 transition-all data-[state=active]:bg-green-700 data-[state=active]:hover:bg-green-600 data-[state=active]:text-white text-gray-300 cursor-pointer hover:bg-gray-800"
                >
                  <Unlock className="h-4 w-4" />
                  Desencriptar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="encrypt" className="mt-4 text-center">
                <CardTitle className="flex justify-center items-center gap-2 mb-2 text-white ">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  Encriptar Archivo
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Selecciona un archivo y configura los parámetros de encriptación
                </CardDescription>
              </TabsContent>

              <TabsContent value="decrypt" className="mt-4 text-center">
                <CardTitle className="flex justify-center items-center gap-2 mb-2 text-white">
                  <Unlock className="h-5 w-5 text-green-700" />
                  Desencriptar Archivo
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Sube los archivos necesarios para desencriptar tu contenido, no es necesario seleccionar el tipo de algoritmo
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab}>
              <TabsContent value="encrypt" className="space-y-4">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="w-full">
                    <Label htmlFor="encrypt-file" className="text-sm font-medium text-gray-300">
                      Archivo a encriptar
                    </Label>
                    <Input
                      id="encrypt-file"
                      type="file"
                      onChange={(e) => setFileToEncrypt(e.target.files?.[0] || null)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white file:text-white file:border-0 cursor-pointer w-full"
                    />
                    {fileToEncrypt && (
                      <Badge variant="secondary" className="mt-2 bg-green-900 text-green-200">
                        ✓ {fileToEncrypt.name}
                      </Badge>
                    )}
                  </div>

                  <div className="w-full">
                    <Label htmlFor="algorithm" className="text-sm font-medium text-gray-300">
                      Algoritmo de encriptación
                    </Label>
                    <Select value={algorithm} onValueChange={(value: EncryptionAlgorithm) => setAlgorithm(value)}>
                      <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white w-full cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 ">
                        {algorithmOptions.map((alg) => (
                          <SelectItem key={alg.value} value={alg.value} className="text-white focus:bg-gray-600 cursor-pointer">
                            <div>
                              <div className="font-medium">{alg.label} <span className="text-sm text-gray-400">{alg.description}</span></div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>


                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <Switch
                    id="compress"
                    checked={compress}
                    onCheckedChange={setCompress}
                    className="data-[state=checked]:bg-emerald-500 cursor-pointer"
                  />
                  <div>
                    <Label htmlFor="compress" className="text-sm font-medium text-gray-300">
                      Comprimir archivo antes de encriptar
                    </Label>
                    <p className="text-sm text-gray-400">
                      Reduce el tamaño pero aumenta el tiempo de procesamiento
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleEncrypt}
                  disabled={!encryptFile || status === "processing"}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                  size="lg"
                >
                  {status === "processing" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Encriptando...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Encriptar Archivo
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="decrypt" className="space-y-4">
                <Tabs
                  value={decryptMode}
                  onValueChange={(value) => {
                    if (value === "individual" || value === "archive") {
                      setDecryptMode(value);
                    }
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                    <TabsTrigger
                      value="archive"
                      className="text-xs md:text-sm flex transition-all items-center gap-2 data-[state=active]:bg-green-700 text-gray-300 cursor-pointer hover:bg-gray-800"
                    >
                      <FileArchive className="h-4 w-4" />
                      Archivo comprimido
                    </TabsTrigger>
                    <TabsTrigger
                      value="individual"
                      className="text-xs md:text-sm flex items-center gap-2 data-[state=active]:bg-green-700 text-gray-300 cursor-pointer hover:bg-gray-800"
                    >
                      <Files className="h-4 w-4" />
                      Archivos individuales
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="archive" className="mt-2">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="archive-file" className="text-sm font-medium text-gray-300">
                          Archivo ZIP o RAR con componentes de encriptación
                        </Label>
                        <Input
                          id="archive-file"
                          type="file"
                          accept=".zip,.rar"
                          onChange={(e) => setArchiveFile(e.target.files?.[0] || null)}
                          className="mt-1 bg-gray-700 border-gray-600 text-white file:text-white cursor-pointer"
                        />
                        {archiveFile && (
                          <Badge variant="secondary" className="mt-2 bg-green-900 text-green-200">
                            ✓ {archiveFile.name}
                          </Badge>
                        )}
                      </div>

                      <Button
                        onClick={handleDecryptFromArchive}
                        disabled={!archiveFile || status === "processing"}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                      >
                        {status === "processing" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Desencriptando...
                          </>
                        ) : (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Desencriptar desde archivo
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="individual" className="mt-2">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { id: "encrypted-file", label: "Archivo encriptado", file: encryptedFile, setter: setEncryptedFile, accept: "" },
                          { id: "encrypted-key", label: "Clave encriptada .key", file: encryptedKey, setter: setEncryptedKey, accept: ".key" },
                          { id: "private-key", label: "Clave privada .key", file: privateKey, setter: setPrivateKey, accept: ".key" },
                          { id: "signature", label: "Firma digital .sig", file: signature, setter: setSignature, accept: ".sig" },
                          { id: "metadata", label: "Metadatos .json", file: metadata, setter: setMetadata, accept: ".json" }
                        ].map((item, index) => (
                          <div key={item.id} className={index === 5 ? "md:col-span-3" : ""}>
                            <Label htmlFor={item.id} className="text-xs font-medium text-gray-300">
                              {item.label}
                            </Label>
                            <Input
                              id={item.id}
                              type="file"
                              accept={item.accept}
                              onChange={(e) => item.setter(e.target.files?.[0] || null)}
                              className="mt-1 bg-gray-700 border-gray-600 text-white  file:text-white text-xs cursor-pointer"
                            />
                            {item.file && (
                              <Badge variant="secondary" className="mt-1 bg-green-900 text-green-200 text-xs">
                                ✓ Cargado
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={handleDecryptIndividual}
                        disabled={
                          !encryptedFile ||
                          !encryptedKey ||
                          !privateKey ||
                          !signature ||
                          !metadata ||
                          status === "processing"
                        }
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                      >
                        {status === "processing" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Desencriptando...
                          </>
                        ) : (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Desencriptar archivos
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>

            {status === "processing" && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Progreso</span>
                  <span className="text-sm text-green-400">{progress}%</span>
                </div>
                <Progress value={progress} className="w-full bg-gray-600" />
              </div>
            )}

            {message && (
              <Alert
                className={`mt-4 border ${status === "success"
                  ? "border-green-600 bg-green-900/20"
                  : status === "error"
                    ? "border-red-600 bg-red-900/20"
                    : "border-gray-600 bg-gray-700"
                  }`}
              >
                {status === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : status === "error" ? (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
                <AlertDescription
                  className={
                    status === "success"
                      ? "text-green-300"
                      : status === "error"
                        ? "text-red-300"
                        : "text-gray-300"
                  }
                >
                  {message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Realizado por Camilo Mora como proyecto final para Seguridad Informática.
          </p>
        </div>
      </div>
    </div>
  );
}
