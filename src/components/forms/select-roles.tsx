import { ROLES, type Role } from "#/constant/roles.ts";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type RolesPickerProps = {
	value: Role[];
	onChange: (value: Role[]) => void;
};

function formatRole(role: Role) {
	return role.replaceAll("_", " ");
}

export function RolesPicker({ value, onChange }: RolesPickerProps) {
	return (
		<div>
			<Popover>
				<PopoverTrigger
					render={
						<Button
							className="w-fit justify-between gap-2"
							size="default"
							id="m-roles"
							variant="outline"
						>
							<span className="truncate">
								{value.length === 0
									? "Select roles"
									: `${value.length} role${value.length === 1 ? "" : "s"} selected`}
							</span>
							<Plus className="size-4 shrink-0 text-muted-foreground" />
						</Button>
					}
				/>

				<PopoverContent className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden p-0">
					<PopoverHeader className="gap-1 border-b bg-muted/30 px-4 py-3">
						<PopoverTitle>Roles</PopoverTitle>
						<PopoverDescription>
							Select one or more roles for this member.
						</PopoverDescription>
					</PopoverHeader>

					<ToggleGroup
						multiple
						value={value}
						onValueChange={(v) => onChange(v as Role[])}
						className="grid max-h-64 w-full grid-cols-1 gap-1 overflow-y-auto p-3 sm:grid-cols-2"
					>
						{ROLES.map((r) => (
							<ToggleGroupItem
								key={r}
								value={r}
								className="h-auto min-h-9 justify-between gap-2 px-3 py-2 text-left text-xs capitalize"
							>
								<span className="truncate">{formatRole(r)}</span>
								{value.includes(r) && <Check className="size-4 shrink-0" />}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</PopoverContent>
			</Popover>
		</div>
	);
}
