import { Button } from '#/components/ui/button'
import { Card } from '#/components/ui/card'
import { Pencil } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { DeleteFaq } from './del-faq'

type FaqWithId = {
  id: string
  question: string
  answer: string
}

export function FaqCard({ faq }: { faq: FaqWithId }) {
  return (
    <Card className="flex flex-col overflow-hidden p-0 hover:border-border/70 transition-colors">
      {/* Question block */}
      <div className="flex items-start justify-between gap-3 bg-muted/50 px-4 py-3">
        <p className="text-[13px] font-medium leading-relaxed text-foreground flex-1">
          {faq.question}
        </p>
        <div className="w-5 h-5 rounded-full border border-border bg-card flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-[10px] font-semibold text-muted-foreground">
            ?
          </span>
        </div>
      </div>

      {/* Answer block */}
      <div className="px-4 py-3 flex-1">
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          {faq.answer}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 px-3 pb-3 pt-1 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-7 text-xs"
          asChild
        >
          <Link to="/admin/faqs/$id" params={{ id: faq.id }}>
            <Pencil size={11} className="mr-1" /> Edit
          </Link>
        </Button>
        <DeleteFaq faqId={faq.id} />
      </div>
    </Card>
  )
}
