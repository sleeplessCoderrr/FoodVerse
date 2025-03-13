import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Menu, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-green-950/20">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-green-600 dark:text-green-500" />
            <span className="font-bold text-xl">FoodVerse</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/explore"
              className="transition-colors hover:text-foreground/80 text-foreground/60 hover:text-foreground dark:text-foreground/60 dark:hover:text-foreground"
            >
              Explore
            </Link>
            <Link
              href="/how-it-works"
              className="transition-colors hover:text-foreground/80 text-foreground/60 hover:text-foreground dark:text-foreground/60 dark:hover:text-foreground"
            >
              How It Works
            </Link>
            <Link
              href="/sellers"
              className="transition-colors hover:text-foreground/80 text-foreground/60 hover:text-foreground dark:text-foreground/60 dark:hover:text-foreground"
            >
              For Sellers
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60 hover:text-foreground dark:text-foreground/60 dark:hover:text-foreground"
            >
              About Us
            </Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-green-600 dark:text-green-500" />
              <span className="font-bold">FoodVerse</span>
            </Link>
            <nav className="mt-6 flex flex-col space-y-4">
              <Link href="/explore" className="text-foreground/70 hover:text-foreground">
                Explore
              </Link>
              <Link href="/how-it-works" className="text-foreground/70 hover:text-foreground">
                How It Works
              </Link>
              <Link href="/sellers" className="text-foreground/70 hover:text-foreground">
                For Sellers
              </Link>
              <Link href="/about" className="text-foreground/70 hover:text-foreground">
                About Us
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
          <ShoppingBag className="h-6 w-6 text-green-600 dark:text-green-500" />
          <span className="font-bold">FoodVerse</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            <Link href="/sign-in">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 dark:text-white">
                Sign In
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

