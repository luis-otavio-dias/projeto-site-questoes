import { useState } from "react";
import { DefaultForm } from "../../components/DefaultForm";
import { DefaultInput } from "../../components/DefaultInput";
import { cn } from "../../lib/utils";
import { MainTemplate } from "../../templates/MainTemplate";
import { api } from "../../services/api";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { useNavigate } from "react-router";
import { Loader } from "../../components/Loader";
import { DefaultTextarea } from "../../components/DefaultTextarea";

type TaskStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

interface TaskResponse {
  id: string | number;
  status: TaskStatus;
}

export function Upload() {
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

  if (!userState.userInfo) {
    navigate("/login");
  }

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
      setUploading(false);
      setTaskStatus(null);
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
      setError(null);
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
    }
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
    <MainTemplate>
      {uploading || taskStatus === "PROCESSING" ? (
        <div className="flex flex-col items-center gap-4">
          <Loader />
          <p className="text-lg">{getStatusMessage()}</p>
        </div>
      ) : (
        <DefaultForm
          onSubmit={handleSubmit}
          buttonText="Enviar"
          buttonDisabled={!examFile || !answerKeyFile || uploading}
          className="flex-1 mx-8 h-[90vh] mt-10 py-10 border-2 rounded-2xl overflow-auto"
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

          <DefaultInput
            id="examFile"
            labelText="Arquivo da Prova (PDF)"
            type="file"
            accept="application/pdf"
            name="examFile"
            onChange={(e) =>
              setExamFile(e.target.files ? e.target.files[0] : null)
            }
            className={cn([
              "w-[260px]",
              "h-[43px]",
              "text-lg",
              "file:border-0",
              "file:mr-4",
              "file:py-2",
              "file:px-4",
              "file:rounded-full",
              "file:text-sm",
              "file:font-semibold",
              "file:bg-primary",
              "file:text-primary-foreground",
              "hover:file:bg-primary/80",
              "hover:cursor-pointer",
              examFile ? "dark:border-primary border-muted-foreground/60" : "",
            ])}
          />
          <DefaultInput
            id="answerKeyFile"
            labelText="Arquivo do Gabarito (PDF)"
            type="file"
            accept="application/pdf"
            name="answerKeyFile"
            onChange={(e) =>
              setAnswerKeyFile(e.target.files ? e.target.files[0] : null)
            }
            className={cn([
              "w-[260px]",
              "h-[43px]",
              "text-lg",
              "file:border-0",
              "file:mr-4",
              "file:py-2",
              "file:px-4",
              "file:rounded-full",
              "file:text-sm",
              "file:font-semibold",
              "file:bg-primary",
              "file:text-primary-foreground",
              "hover:file:bg-primary/80",
              "hover:cursor-pointer",
              answerKeyFile
                ? "dark:border-primary border-muted-foreground/60"
                : "",
            ])}
          />
        </DefaultForm>
      )}
    </MainTemplate>
  );
}
