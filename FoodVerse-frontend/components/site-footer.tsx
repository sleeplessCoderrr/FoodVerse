import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-green-600" />
            <span className="font-bold">FoodVerse</span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} FoodVerse. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          <nav className="flex gap-4 md:gap-6">
            <Link href="/terms" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

