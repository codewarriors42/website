import { AdminUserForm } from "#/components/forms/user/index.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AdminUserForm isLoginForm onSubmit={async () => undefined} />;
}
