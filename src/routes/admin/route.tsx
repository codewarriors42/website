import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { navLinks } from "#/constant/nav-links.ts";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
});

function AdminLayout() {
	return (
		<div className="flex h-dvh w-full flex-col-reverse overflow-hidden bg-background text-foreground sm:flex-row">
			<aside
				className="
					shrink-0 border-t border-sidebar-border text-sidebar-foreground pb-[env(safe-area-inset-bottom)]
					sm:flex sm:w-16 sm:flex-col sm:border-r sm:border-t-0 sm:pb-0
				"
			>
				<Link
					to="/admin"
					aria-label="Club workspace"
					className="
						hidden text-sm font-semibold text-sidebar-foreground outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring
						sm:flex sm:h-16 sm:items-center sm:justify-center
					"
				>
					cw
				</Link>

				<nav
					aria-label="Admin navigation"
					className="
						flex items-center justify-evenly gap-2 px-5 py-1
						sm:flex-1 sm:flex-col sm:justify-normal sm:gap-1 sm:px-2 sm:py-2
					"
				>
					{navLinks.map((link) => (
						<Link
							key={link.title}
							to={link.path}
							title={link.title}
							activeOptions={{ exact: link.path === "/admin" }}
							className="
								flex min-h-16 w-full flex-col items-center justify-center gap-1
								text-sidebar-foreground/50 transition-colors
								hover:bg-sidebar-accent/50 hover:text-sidebar-foreground
								data-[status=active]:text-sidebar-accent-foreground
								outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring
								sm:h-11 sm:min-h-0 sm:flex-none
							"
						>
							<HugeiconsIcon
								icon={link.icon}
								className="size-6 sm:size-5"
								color="currentColor"
								strokeWidth={1.3}
							/>
						</Link>
					))}
				</nav>
			</aside>

			<div className="min-h-0 min-w-0 flex-1 overflow-hidden">
				<Outlet />
			</div>
		</div>
	);
}
