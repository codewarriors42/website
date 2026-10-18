import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	adminUserSchema,
	type AdminUserType,
} from "#/server/db/schema/user.db.type.ts";

type AdminUserFormProps = {
	isLoginForm?: boolean;
	onSubmit: (value: AdminUserType) => Promise<void>;
};

export function AdminUserForm({
	isLoginForm = false,
	onSubmit,
}: AdminUserFormProps) {
	const form = useForm({
		defaultValues: {
			username: "",
			password: "",
			name: isLoginForm ? "Login" : "",
		},
		validators: { onChange: adminUserSchema, onSubmit: adminUserSchema },
		onSubmit: async ({ value }) => {
			try {
				await onSubmit({ ...value, isSupreme: true });
				console.log("Submitting form with values:", value);
			} catch (err) {
				console.error("Error submitting member form:", err);
			}
		},
	});

	return (
		<div className="w-full select-none flex items-center justify-center px-4">
			<div className="w-full max-w-sm flex flex-col items-center justify-center">
				<form
					id="add-user-form"
					className="w-full space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						{!isLoginForm && (
							<form.Field name="name">
								{(field) => {
									const isInvalid =
										(field.state.meta.isTouched ||
											form.state.submissionAttempts > 0) &&
										!field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<Input
												className="p-5"
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Name"
												autoComplete="off"
											/>
											{isInvalid && (
												<FieldError
													className="px-2"
													errors={field.state.meta.errors}
												/>
											)}
										</Field>
									);
								}}
							</form.Field>
						)}

						<form.Field name="username">
							{(field) => {
								const isInvalid =
									(field.state.meta.isTouched ||
										form.state.submissionAttempts > 0) &&
									!field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<Input
											className="p-5"
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Username"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError
												className="px-2"
												errors={field.state.meta.errors}
											/>
										)}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="password">
							{(field) => {
								const isInvalid =
									(field.state.meta.isTouched ||
										form.state.submissionAttempts > 0) &&
									!field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<Input
											className="p-5"
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Password"
											type="password"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError
												className="px-2"
												errors={field.state.meta.errors}
											/>
										)}
									</Field>
								);
							}}
						</form.Field>
					</FieldGroup>

					<form.Subscribe
						selector={(state) => [state.isDirty, state.isSubmitting]}
					>
						{([isDirty, isSubmitting]) => (
							<footer className="flex items-center gap-2 md:max-w-sm p-5">
								<Button
									disabled={isSubmitting}
									type="reset"
									className="flex-1"
									variant="secondary"
									onClick={() => {
										form.reset();
									}}
								>
									Reset
								</Button>

								<Button
									className="flex-1"
									type="submit"
									disabled={isSubmitting || !isDirty}
									variant="default"
								>
									{isSubmitting && isLoginForm
										? "Logging in…"
										: isLoginForm
											? "Login"
											: isSubmitting
												? "Creating…"
												: "Create"}
								</Button>
							</footer>
						)}
					</form.Subscribe>
				</form>
			</div>
		</div>
	);
}
