import { Link } from "react-router";
import { DefaultInput } from "../../components/DefaultInput";
import clsx from "clsx";
import { DefaultButton } from "../../components/DefaultButton";
import { FormContainerTemplate } from "../../templates/FormContainerTemplate";

export function Register() {
  return (
    <FormContainerTemplate>
      <div className="border-b-2 w-full flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-accent-foreground mb-10">
          Register
        </h1>
      </div>

      <form
        action=""
        className="flex flex-col  items-center justify-center gap-10"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <DefaultInput
            id="username"
            labelInline={false}
            labelText="Username"
            placeholder="Your username here"
            type="text"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <DefaultInput
            id="password"
            labelInline={false}
            labelText="Password"
            placeholder="Your password here"
            type="password"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <DefaultInput
            id="password-confirm"
            labelInline={false}
            labelText="Confirm Password"
            placeholder="Write your password again"
            type="password"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <DefaultButton
            icon="Register"
            className={clsx([
              "mt-4",
              "w-[260px]",
              "h-[43px]",
              "font-bold",
              "border-transparent",
              "border-2",
              "bg-primary",
              "text-primary-foreground",
              "dark:bg-primary",
              "dark:text-primary-foreground",
              "hover:border-foreground",
              "hover:opacity-80",
              "transition-colors",
            ])}
          />
        </div>
      </form>

      <div>
        <p className="text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary no-underline hover:underline hover:font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </FormContainerTemplate>
  );
}
