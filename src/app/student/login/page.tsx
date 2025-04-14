"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const StudentLoginPage = () => {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [branch, setBranch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name || !rollNo || !branch || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Create student object
    const student = {
      name,
      rollNo,
      branch,
      email,
    };

    // Store student data in localStorage
    let students = [];
    const storedStudents = localStorage.getItem("students");
    if (storedStudents) {
      students = JSON.parse(storedStudents);
    }
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));

    toast({
      title: "Success",
      description: "Student data saved successfully!",
    });
    router.push("/"); // Redirect to home page

      // Clear the form fields
      setName("");
      setRollNo("");
      setBranch("");
      setEmail("");
      setPassword("");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-secondary">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Student Login</CardTitle>
          <CardDescription className="text-center">
            Enter your details to register as a student.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="rollNo">Roll No.</label>
              <Input
                id="rollNo"
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="Enter your roll number"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="branch">Branch</label>
              <Input
                id="branch"
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Enter your branch"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">Email ID</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email ID"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full mt-4">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLoginPage;
