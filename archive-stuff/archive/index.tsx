import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select.tsx";
import { PhotoUpload, validatePhoto } from "../file-upload";
import { ARCHIVE_CATEGORIES, archiveSchema, type ArchiveType } from "#/server/db/schema/archive.db.type.ts";
import { ARCHIVE_EVENTS } from "#/constant/archive-events.ts";

const CURRENT_YEAR = new Date().getFullYear();

const ARCHIVE_YEARS = Array.from(
    { length: CURRENT_YEAR - 1970 + 1 },
    (_, index) => CURRENT_YEAR - index,
);


interface ArchiveFormProps {
    initialValues?: ArchiveType;
    onSubmit: (values: ArchiveType) => void | Promise<void>;
}

function toFormValues(initial?: ArchiveType): ArchiveType {
    if (!initial) {
        return {
            title: "",
            competition: "",
            category: "creative-prompt",
            event: "Hackathon",
            contributors: [],
            year: new Date().getFullYear(),
            links: [],
            image: "",
        };
    }
    return {
        ...initial,
        links: initial.links.map((s) => ({
            platform: s.platform,
            URL: s.URL,
        })),
    };
}

export function ArchiveForm({ initialValues, onSubmit }: ArchiveFormProps) {
    const [photoError, setPhotoError] = useState<string | null>(null);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: toFormValues(initialValues),
        validators: { onChange: archiveSchema },
        onSubmit: async ({ value }) => {
            setSubmitError(null);
            try {
                await onSubmit(archiveSchema.parse(value));
            } catch (err) {
                setSubmitError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong. Try again.",
                );
            }
        },
    });

    useEffect(() => {
        form.reset(toFormValues(initialValues));
        setPhotoError(null);
        setSubmitAttempted(false);
        setSubmitError(null);
    }, [form, initialValues]);

    const isInvalid = (meta: { isTouched: boolean; isValid: boolean }) =>
        (meta.isTouched || submitAttempted) && !meta.isValid;

    function handlePick(file: File) {
        const error = validatePhoto(file);
        setPhotoError(error);
        if (!error) form.setFieldValue("image", file);
    }

    function handleRemove() {
        setPhotoError(null);
        form.setFieldValue("image", "");
    }

    return (
        <>
            <form
                id="archive-form"
                noValidate
                className="mx-auto w-full overflow-y-auto px-5 h-[65%]"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSubmitAttempted(true);
                    void form.handleSubmit();
                }}
            >
                <FieldGroup className="gap-4">
                    {/* Photo (optional) */}
                    <form.Subscribe
                        selector={(s) => [s.values.title, s.values.image] as const}
                    >
                        {([title, image]) => (
                            <Field data-invalid={!!photoError} className="px-4">
                                <FieldLabel>
                                    Profile photo{" "}
                                    <span className="font-normal text-muted-foreground">
                                        (optional)
                                    </span>
                                </FieldLabel>
                                <PhotoUpload
                                    file={image instanceof File ? image : null}
                                    savedUrl={typeof image === "string" ? image : ""}
                                    name={title}
                                    onPick={handlePick}
                                    onRemove={handleRemove}
                                />
                                {photoError ? (
                                    <FieldError errors={[{ message: photoError }]} />
                                ) : (
                                    <FieldDescription className="text-xs pt-1">
                                        JPG, PNG or WebP, up to 5 MB.
                                    </FieldDescription>
                                )}
                            </Field>
                        )}
                    </form.Subscribe>

                    {/* Name + grade */}
                    <div className="grid max-w-sm px-4 gap-3">
                        <form.Field name="title">
                            {(field) => {
                                const invalid = isInvalid(field.state.meta);
                                return (
                                    <Field data-invalid={invalid}>
                                        <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder="The title of the archive"
                                            autoComplete="off"
                                            aria-invalid={invalid}
                                        />
                                        {invalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>
                        <form.Field name="competition">
                            {(field) => {
                                const invalid = isInvalid(field.state.meta);
                                return (
                                    <Field data-invalid={invalid}>
                                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder="Competition name"
                                            autoComplete="off"
                                            aria-invalid={invalid}
                                        />
                                        {invalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="year">
                            {(field) => {
                                const invalid = isInvalid(field.state.meta);
                                return (
                                    <Field data-invalid={invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Year
                                        </FieldLabel>
                                        <Select
                                            value={field.state.value ? String(field.state.value) : ""}
                                            onValueChange={(value) => {
                                                field.handleChange(Number(value));
                                                field.handleBlur();
                                            }}
                                        >
                                            <SelectTrigger id={field.name} aria-invalid={invalid}>
                                                <SelectValue placeholder="Select graduation year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ARCHIVE_YEARS.map((year) => (
                                                    <SelectItem key={year} value={String(year)}>
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {invalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>



                        <form.Field name="category">
                            {(field) => {
                                const invalid = isInvalid(field.state.meta);
                                return (
                                    <Field data-invalid={invalid}>
                                        <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                                        <Select
                                            value={field.state.value ? String(field.state.value) : ""}
                                            onValueChange={(v) => {
                                                field.handleChange(v as ArchiveType["category"]);
                                                field.handleBlur();
                                            }}
                                        >
                                            <SelectTrigger
                                                id={field.name}
                                                className="max-w-fit"
                                                aria-invalid={invalid}
                                            >
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ARCHIVE_CATEGORIES.map((g) => (
                                                    <SelectItem key={g} value={String(g)}>
                                                        {g}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {invalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>



                        <form.Field name="event">
                            {(field) => {
                                const invalid = isInvalid(field.state.meta);
                                return (
                                    <Field data-invalid={invalid}>
                                        <FieldLabel htmlFor={field.name}>Event</FieldLabel>
                                        <Select
                                            value={field.state.value ? String(field.state.value) : ""}
                                            onValueChange={(v) => {
                                                field.handleChange(v as ArchiveType["event"]);
                                                field.handleBlur();
                                            }}
                                        >
                                            <SelectTrigger
                                                id={field.name}
                                                className="max-w-fit"
                                                aria-invalid={invalid}
                                            >
                                                <SelectValue placeholder="Select event" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ARCHIVE_EVENTS.map((g) => (
                                                    <SelectItem key={g} value={String(g)}>
                                                        {g}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {invalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="contributors">
                            {(field) => {
                                const invalid = isInvalid(field.state.meta);
                                return (
                                    <Field data-invalid={invalid}>
                                        <FieldLabel htmlFor={field.name}>Contributors</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value.join(", ")}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                        .split(",")
                                                        .map((contributor) => contributor.trim())
                                                        .filter(Boolean),
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                            placeholder="Enter contributors"
                                            type="text"
                                            autoComplete="off"
                                            aria-invalid={invalid}
                                        />
                                        {invalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        </form.Field>
                    </div>
                </FieldGroup>
            </form>

            {/* Actions */}
            <form.Subscribe selector={(s) => s.isSubmitting}>
                {(isSubmitting) => (
                    <div className="flex items-center mt-7 gap-3 px-4">
                        {submitError && (
                            <p role="alert" className="text-sm text-destructive sm:mr-auto">
                                {submitError}
                            </p>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={() => {
                                form.reset();
                                setPhotoError(null);
                                setSubmitError(null);
                                setSubmitAttempted(false);
                            }}
                        >
                            Reset
                        </Button>
                        <Button type="submit" form="archive-form" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Saving…"
                                : initialValues
                                    ? "Update archive"
                                    : "Add archive"}
                        </Button>
                    </div>
                )}
            </form.Subscribe>
        </>
    );
}
