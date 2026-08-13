import { X, CloudUpload, Check } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { cn } from "../../lib/utils";
import { api } from "../../services/api";
import { Loader } from "../../components/Loader";

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type TaskStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

interface TaskResponse {
  id: string | number;
  status: TaskStatus;
}

// ─── DropZone ─────────────────────────────────────────────────────────────────

interface DropZoneProps {
  label: string;
  file: File | null;
  accept?: string;
  onFile: (file: File) => void;
}

function DropZone({ label, file, accept, onFile }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFile(dropped);
    },
    [onFile],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFile(selected);
  };

  const hasFile = !!file;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex h-[156px] w-full items-center justify-center rounded-[10px] cursor-pointer transition-all duration-200",
        isDragging
          ? "border-2 border-solid border-[#51A2FF] bg-[rgba(43,127,255,0.08)]"
          : hasFile
            ? "border-2 border-solid border-[#51A2FF] bg-[#27272A]"
            : "border-2 border-dashed border-[#3F3F47] bg-[#27272A] hover:border-[#51A2FF] hover:bg-[rgba(43,127,255,0.04)]",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex flex-col items-center gap-2 px-6 text-center">
        <CloudUpload
          className={cn(
            "w-8 h-8 transition-colors",
            hasFile || isDragging ? "text-[#51A2FF]" : "text-[#9F9FA9]",
          )}
        />
        <span
          className={cn(
            "text-base transition-colors",
            hasFile ? "text-white" : "text-[#9F9FA9]",
          )}
        >
          {hasFile ? file.name : label}
        </span>
        {!hasFile && (
          <span className="text-xs text-[#71717B]">PDF, JPG ou PNG</span>
        )}
      </div>
    </div>
  );
}

// ─── UploadModal ──────────────────────────────────────────────────────────────

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [examFile, setExamFile] = useState<File | null>(null);
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);
  const [autoCorrection, setAutoCorrection] = useState(false);
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const resetForm = () => {
    setExamFile(null);
    setAnswerKeyFile(null);
    setAutoCorrection(false);
    setTaskStatus(null);
    setError(null);
    setUploading(false);
  };

  const handleClose = () => {
    if (uploading) return;
    resetForm();
    onClose();
  };

  const checkTaskStatus = async (id: string | number) => {
    try {
      const { data } = await api.get<TaskResponse>(
        `/questions/tasks/${id}/status/`,
      );
      setTaskStatus(data.status);

      if (data.status === "COMPLETED") {
        setUploading(false);
        handleClose();
        navigate(0);
      } else if (data.status === "FAILED") {
        setUploading(false);
        setError("Falha no processamento. Tente novamente.");
      } else {
        setTimeout(() => checkTaskStatus(id), 2000);
      }
    } catch {
      setUploading(false);
      setTaskStatus(null);
      setError("Erro ao verificar o status do processamento.");
    }
  };

  const handleSubmit = async () => {
    if (!examFile) {
      setError("Selecione o arquivo da prova antes de continuar.");
      return;
    }

    const formData = new FormData();
    formData.append("exam_file", examFile);
    if (answerKeyFile) formData.append("answer_key_file", answerKeyFile);
    formData.append("auto_correction", String(autoCorrection));
    // title / description kept for backend compatibility — sent as empty when absent

    try {
      setUploading(true);
      setError(null);
      const { data } = await api.post<TaskResponse>(
        "/questions/upload-exam/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setTaskStatus(data.status);
      checkTaskStatus(data.id);
    } catch {
      setError("Erro ao enviar os arquivos. Tente novamente.");
      setUploading(false);
    }
  };

  const getStatusMessage = () => {
    switch (taskStatus) {
      case "PENDING":
        return "Aguardando processamento...";
      case "PROCESSING":
        return "Processando a prova...";
      case "COMPLETED":
        return "Concluído!";
      case "FAILED":
        return "Falha no processamento.";
      default:
        return "Enviando...";
    }
  };

  const canSubmit = !!examFile && !uploading;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-[512px] rounded-[10px] border border-[#27272A] bg-[#18181B] p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white leading-8">
            Enviar prova
          </h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="opacity-70 hover:opacity-100 transition-opacity text-white disabled:cursor-not-allowed mt-0.5 cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loading state */}
        {uploading ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <Loader />
            <p className="text-base text-[#9F9FA9]">{getStatusMessage()}</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Error */}
            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

            {/* Exam drop zone */}
            <DropZone
              label="Clique ou arraste o arquivo da prova aqui"
              file={examFile}
              accept="application/pdf,image/*"
              onFile={setExamFile}
            />

            {/* Answer key section */}
            <div className="pt-6">
              <p className="mb-3 text-sm font-medium text-[#9F9FA9]">
                Enviar gabarito (opcional)
              </p>
              <DropZone
                label="Clique ou arraste o gabarito aqui"
                file={answerKeyFile}
                accept="application/pdf,image/*"
                onFile={setAnswerKeyFile}
              />
            </div>

            {/* Auto-correction */}
            <div className="pt-6">
              <div className="flex gap-3 rounded-[10px] border border-[#27272A] bg-[rgba(39,39,42,0.5)] p-4">
                {/* Checkbox */}
                <div className="pt-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setAutoCorrection((v) => !v)}
                    aria-checked={autoCorrection}
                    role="checkbox"
                    className={cn(
                      "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shadow-sm cursor-pointer",
                      autoCorrection
                        ? "bg-[#2B7FFF] border-[#2B7FFF]"
                        : "bg-[#030213] border-[#030213]",
                    )}
                  >
                    {autoCorrection && (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </button>
                </div>
                {/* Text */}
                <div
                  className="cursor-pointer"
                  onClick={() => setAutoCorrection((v) => !v)}
                >
                  <p className="text-sm font-medium text-white leading-5">
                    Correção automática
                  </p>
                  <p className="mt-1 text-sm text-[#9F9FA9] leading-[1.625]">
                    Se marcado, a correção será feita por inferência de um
                    modelo de IA. A correção está sujeita a erros.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-8">
              <button
                type="button"
                onClick={handleClose}
                className="h-10 w-[100px] rounded-[10px] bg-[#27272A] text-sm font-medium text-white transition-colors hover:bg-[#3F3F47] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={cn(
                  "h-10 w-[124px] rounded-[10px] text-sm font-medium text-white transition-opacity",
                  "bg-[linear-gradient(135deg,#2B7FFF_0%,#9810FA_100%)]",
                  canSubmit
                    ? "opacity-100 hover:opacity-90 cursor-pointer"
                    : "opacity-50 cursor-not-allowed",
                )}
              >
                Enviar Prova
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
