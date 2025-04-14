import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen bg-secondary">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Student Login</CardTitle>
            <CardDescription>Login as a student to access the portal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/student/login">
              <Button className="w-full">Go to Student Login</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Login as an administrator to manage student data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/login">
              <Button className="w-full">Go to Admin Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

