"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Mail, MessageCircle } from "lucide-react"

const WHATSAPP_NUMBER = "01144155089"
const WHATSAPP_LINK = "https://wa.me/201144155089"
const EMAIL = "ahmedbadry.deb@gmail.com"
const MAILTO_LINK = `mailto:${EMAIL}`

export default function ContactMoreInfo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="lg"
          className="contact-more-info-bob fixed right-5 bottom-5 z-40 rounded-full px-6 shadow-xl md:right-8 md:bottom-8"
        >
          More Info
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md border-border/20 bg-background/95 shadow-2xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>More Info</DialogTitle>
          <DialogDescription>
            Choose your preferred channel and I will respond quickly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl border border-border/45 bg-muted/20 p-4 transition-colors hover:bg-muted/50"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-green-500/15 text-green-600">
              <MessageCircle className="size-5" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-sm text-muted-foreground">WhatsApp</span>
              <span className="truncate font-medium">{WHATSAPP_NUMBER}</span>
            </span>
          </a>

          <a
            href={MAILTO_LINK}
            className="group flex items-center gap-3 rounded-xl border border-border/45 bg-muted/20 p-4 transition-colors hover:bg-muted/50"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Mail className="size-5" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="truncate font-medium">{EMAIL}</span>
            </span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
