import { useState } from "react";
import { DefaultForm } from "../../components/DefaultForm";
import { DefaultInput } from "../../components/DefaultInput";
import { cn } from "../../lib/utils";
import { MainTemplate } from "../../templates/MainTemplate";
import { api } from "../../services/api";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { useNavigate } from "react-router";
import { Loader } from "../../components/Loader";

type TaskStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

interface TaskResponse {
  id: string | number;
  status: TaskStatus;
}

export function Upload() {
  const [files, setFiles] = useState<File[] | null>([]);
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const { state: userState } = useUserContext();
  const navigate = useNavigate();

  if (!userState.userInfo) {
    navigate("/login");
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setFile(e.target.files ? e.target.files[0] : null);
    setFiles(Array.from(e.target.files || []));
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
        // If still pending or processing, check again after a delay
        setTimeout(() => checkTaskStatus(id), 2000);
      }
    } catch (error) {
      setError("Error checking task status");
      console.error("Error checking task status:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files || files.length < 2) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();

    formData.append("exam_file", files[1]);
    formData.append("answer_key_file", files[0]);

    try {
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
      // Start checking the task status
      checkTaskStatus(data.id);

      setFiles([]);
    } catch (error) {
      setError("Error uploading files");
      setUploading(false);
      console.error("Error uploading files:", error);
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
          buttonDisabled={!files}
        >
          {error && <p className="text-red-500">{error}</p>}
          <DefaultInput
            id="file"
            labelText="Selecione PDF para upload"
            type="file"
            accept="application/pdf"
            name="file"
            onChange={handleFileChange}
            multiple
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
            ])}
          />
        </DefaultForm>
      )}
    </MainTemplate>
  );
}
