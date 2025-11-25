import { DefaultForm } from "../DefaultForm";
import { FormInput } from "../FormInput";

type RegisterFormProps = {
  email: string;
  password: string;
  passwordConfirm: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordConfirmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function RegisterForm({
  email,
  password,
  passwordConfirm,
  onEmailChange,
  onPasswordChange,
  onPasswordConfirmChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <DefaultForm buttonText="Register" onSubmit={onSubmit}>
      <div className="flex flex-col items-center justify-center gap-2">
        <FormInput
          id="email"
          label="email"
          placeholder="Your email here"
          value={email}
          type="text"
          onChange={onEmailChange}
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
