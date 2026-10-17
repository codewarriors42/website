import {
	ArchiveIcon,
	ChatQuestion01Icon,
	DashboardSquare01Icon,
	GraduationCapIcon,
	UserListIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgObject } from "@hugeicons/core-free-icons/types";

interface LinkAttr {
	path: string;
	title: string;
	icon: IconSvgObject;
}

export const navLinks: LinkAttr[] = [
	{
		path: "/admin",
		title: "Dashboard",
		icon: DashboardSquare01Icon,
	},
	{
		path: "/admin/members",
		title: "Members",
		icon: UserListIcon,
	},
	{
		path: "/admin/alumnis",
		title: "Alumnis",
		icon: GraduationCapIcon,
	},
	{
		path: "/admin/archives",
		title: "Archives",
		icon: ArchiveIcon,
	},
	{
		path: "/admin/faqs",
		title: "FAQs",
		icon: ChatQuestion01Icon,
	},
];
