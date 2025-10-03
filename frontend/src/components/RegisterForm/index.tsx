import { DefaultForm } from "../DefaultForm";
import { FormInput } from "../FormInput";

type RegisterFormProps = {
  username: string;
  password: string;
  passwordConfirm: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordConfirmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function RegisterForm({
  username,
  password,
  passwordConfirm,
  onUsernameChange,
  onPasswordChange,
  onPasswordConfirmChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <DefaultForm buttonText="Register" onSubmit={onSubmit}>
      <div className="flex flex-col items-center justify-center gap-2">
        <FormInput
          id="username"
          label="Username"
          placeholder="Your username here"
          value={username}
          type="text"
          onChange={onUsernameChange}
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <FormInput
          id="password"
          label="Password"
          placeholder="Your password here"
          value={password}
          type="password"
          onChange={onPasswordChange}
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <FormInput
          id="password-confirm"
          label="Confirm Password"
          placeholder="Write your password again"
          value={passwordConfirm}
          type="password"
          onChange={onPasswordConfirmChange}
        />
      </div>
    </DefaultForm>
  );
}
