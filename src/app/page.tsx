import LoadingSpinner from "@/components/form/LoadingSpinner";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={'/auth/login'}>Login</Link>
    </div>
  );
}
