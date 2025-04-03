import Link from "next/link"
import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to the dashboard
  redirect("/dashboard")

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl/none">
                  TaskSmart
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Organize your projects, track progress, and collaborate with your team.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/dashboard" className="apple-button">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

