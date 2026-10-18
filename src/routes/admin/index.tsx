import { createFileRoute } from "@tanstack/react-router";
import { UserManage } from "#/components/forms/user/user-manage.tsx";
import { ContactManage } from "#/components/forms/contact/contact-manage.tsx";

export const Route = createFileRoute("/admin/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="h-full w-full overflow-y-auto overflow-hidden">
			<div className="min-h-full grid grid-cols-1 sm:grid-cols-2">
				<section className="border m-5 rounded-2xl border-border bg-card/50 text-card-foreground">
					<UserManage />
				</section>

				<section className="border-2 m-5 rounded-2xl border-border bg-card/50 text-card-foreground">
					<ContactManage />
				</section>
			</div>
		</div>
	);
}
