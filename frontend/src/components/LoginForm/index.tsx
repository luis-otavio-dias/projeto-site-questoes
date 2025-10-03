import { DefaultForm } from "../DefaultForm";
import { FormInput } from "../FormInput";

type LoginFormPros = {
  username: string;
  password: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function LoginForm({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginFormPros) {
  return (
    <DefaultForm buttonText="Login" onSubmit={onSubmit}>
      <div className="flex flex-col items-center justify-center gap-2">
        <FormInput
          id="username"
          label="Username"
          placeholder="Your username here"
          type="text"
          value={username}
          onChange={onUsernameChange}
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <FormInput
          id="password"
          label="Password"
          placeholder="Your password here"
          type="password"
          value={password}
          onChange={onPasswordChange}
        />
      </div>
    </DefaultForm>
  );
}
