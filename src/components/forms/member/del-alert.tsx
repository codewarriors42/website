import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog.tsx";
import { Button } from "#/components/ui/button.tsx";

type DeleteConfirmationDialogProps = {
	isOpen: boolean;
	memberName: string;
	entityLabel?: string;
	deleting?: boolean;
	onClose: () => void;
	onConfirm: () => void | Promise<void>;
};

export function DeleteConfirmationDialog({
	isOpen,
	memberName,
	entityLabel = "member",
	deleting = false,
	onClose,
	onConfirm,
}: DeleteConfirmationDialogProps) {
	return (
		<AlertDialog
			open={isOpen}
			onOpenChange={(open) => !open && !deleting && onClose()}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete {memberName}?</AlertDialogTitle>
					<AlertDialogDescription>
						This removes the {entityLabel} permanently. You cannot undo this
						action.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<Button
						type="button"
						variant="outline"
						disabled={deleting}
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button
						type="button"
						variant="destructive"
						disabled={deleting}
						onClick={() => void onConfirm()}
					>
						{deleting ? "Deleting..." : `Delete ${entityLabel}`}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
