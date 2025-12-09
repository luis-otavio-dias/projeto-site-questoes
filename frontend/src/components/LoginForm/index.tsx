import { DefaultForm } from "../DefaultForm";
import { FormInput } from "../FormInput";

type LoginFormPros = {
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormPros) {
  return (
    <DefaultForm buttonText="Login" onSubmit={onSubmit}>
      <div className="flex flex-col items-center justify-center gap-2">
        <FormInput
          id="email"
          label="Email"
          placeholder="Your email here"
          type="email"
          value={email}
          onChange={onEmailChange}
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
