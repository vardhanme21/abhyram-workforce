import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-primary-50">
      <h1 className="text-4xl font-bold mb-4 text-primary-700">Abhyram Workforce Portal</h1>
      <p className="text-gray-500 mb-8 max-w-md text-center">
        Enterprise time tracking and workforce intelligence system.
      </p>
      <Link href="/login">
        <Button size="lg" className="gap-2">
          Enter Portal <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </main>
  );
}
