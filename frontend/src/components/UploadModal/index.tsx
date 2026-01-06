import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { cn } from "../../lib/utils";
import { api } from "../../services/api";
import { Loader } from "../../components/Loader";
import { DefaultTextarea } from "../../components/DefaultTextarea";
import { DefaultInput } from "../DefaultInput";
import { DefaultForm } from "../DefaultForm";
import { FileInput } from "../FileInput";

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type TaskStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

interface TaskResponse {
  id: string | number;
  status: TaskStatus;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);
  const [examFile, setExamFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const { state: userState } = useUserContext();
  const navigate = useNavigate();

  const maxLength = 500;
  if (!isOpen) return null;

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const descriptionContent = e.target.value;
    if (descriptionContent.length <= maxLength) {
      setDescription(descriptionContent);
    }
  };

  const checkTaskStatus = async (id: string | number) => {
    try {
      const { data } = await api.get<TaskResponse>(
        `/questions/tasks/${id}/status/`
      );
      setTaskStatus(data.status);

      if (data.status === "COMPLETED") {
        setUploading(false);
        alert("File processed successfully!");
        navigate("/");
      } else if (data.status === "FAILED") {
        setUploading(false);
        setError("File processing failed. Please try again.");
      } else {
        setTimeout(() => checkTaskStatus(id), 2000);
      }
    } catch (error) {
      setError("Error checking task status");
      console.error("Error checking task status:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!examFile || !answerKeyFile) {
      setError("Please select both files");
      return;
    }

    const formData = new FormData();

    formData.append("exam_file", examFile);
    formData.append("answer_key_file", answerKeyFile);

    if (title) formData.append("title", title);

    if (description) formData.append("description", description);

    try {
      setUploading(true);
      const { data } = await api.post<TaskResponse>(
        "/questions/upload-exam/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTaskStatus(data.status);
      checkTaskStatus(data.id);
    } catch (error) {
      setError("Error uploading files");
      setUploading(false);
      console.error("Error uploading files:", error);
    }

    setUploading(false);
  };

  const getStatusMessage = () => {
    switch (taskStatus) {
      case "PENDING": {
        return "Task is pending...";
      }
      case "PROCESSING": {
        return "Task is being processed...";
      }
      case "COMPLETED": {
        return "Task completed successfully!";
      }
      case "FAILED": {
        return "Task failed. Please try again.";
      }
      default:
        return "";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-800 border-2 w-full max-w-md rounded-xl shadow-2xl p-6 relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Adicionar Novo Exame
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <DefaultForm
          onSubmit={handleSubmit}
          buttonText="Enviar"
          buttonDisabled={!examFile || !answerKeyFile || uploading}
          cancelButton={true}
          onClose={onClose}
        >
          {error && <p className="text-red-500">{error}</p>}
          <DefaultInput
            id="title"
            labelText="Título do Exame (opcional)"
            type="text"
            name="title"
            placeholder="Ex: ENEM 2023 - Dia 1"
            onChange={(e) => setTitle(e.target.value)}
            className={cn([
              "w-[260px]",
              "h-[43px]",
              "text-3xl",
              title ? "dark:border-primary border-muted-foreground/60" : "",
            ])}
          />

          <DefaultTextarea
            id="description"
            labelText="Descrição (opcional)"
            name="description"
            placeholder="Detalhes extras..."
            onChange={handleTextareaChange}
            text={description}
            maxLength={maxLength}
            className={cn([
              "w-[260px]",
              "h-[100px]",
              "text-2xl",
              description
                ? "dark:border-primary border-muted-foreground/60"
                : "",
            ])}
          />

          <FileInput
            id="examFile"
            labelText="Arquivo da Prova (PDF)"
            accept="application/pdf"
            name="examFile"
            fileName={examFile ? examFile.name : ""}
            onChange={(e) =>
              setExamFile(e.target.files ? e.target.files[0] : null)
            }
            className={cn(
              examFile
                ? "border-solid dark:border-primary border-muted-foreground/60"
                : ""
            )}
          />
          <FileInput
            id="answerKeyFile"
            labelText="Arquivo do Gabarito (PDF)"
            type="file"
            accept="application/pdf"
            name="answerKeyFile"
            fileName={answerKeyFile ? answerKeyFile.name : ""}
            onChange={(e) =>
              setAnswerKeyFile(e.target.files ? e.target.files[0] : null)
            }
            className={cn(
              answerKeyFile
                ? "dark:border-primary border-muted-foreground/60"
                : ""
            )}
          />
        </DefaultForm>
      </div>
    </div>
  );
}
