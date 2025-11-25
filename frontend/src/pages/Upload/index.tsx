import { useState } from "react";
import { DefaultForm } from "../../components/DefaultForm";
import { DefaultInput } from "../../components/DefaultInput";
import { cn } from "../../lib/utils";
import { MainTemplate } from "../../templates/MainTemplate";
import { api } from "../../services/api";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { useNavigate } from "react-router";

export function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const { state: userState } = useUserContext();
  const navigate = useNavigate();

  if (!userState.userInfo) {
    navigate("/login");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files ? e.target.files[0] : null);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file_upload", file);

    await api.post("/users/upload_file/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setFile(null);
    navigate("/");
    alert("File uploaded successfully!");
  };

  return (
    <MainTemplate>
      <DefaultForm
        onSubmit={handleSubmit}
        buttonText="Enviar"
        buttonDisabled={!file}
      >
        <DefaultInput
          id="file"
          labelText="Selecione um arquivo .csv"
          type="file"
          accept=".csv"
          name="file"
          onChange={handleFileChange}
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
    </MainTemplate>
  );
}
