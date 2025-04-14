"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface Student {
  name: string;
  rollNo: string;
  branch: string;
  email: string;
  status: "pending" | "approved" | "rejected";
}

const StudentDataDisplay = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Retrieve student data from localStorage on the client side
    const storedStudents = localStorage.getItem("students");
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
  }, []);

  const updateStudentStatus = async (
    rollNo: string,
    newStatus: "pending" | "approved" | "rejected",
    email: string,
    name: string
  ) => {
    const updatedStudents = students.map((student) =>
      student.rollNo === rollNo ? { ...student, status: newStatus } : student
    );
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));

    toast({
      title: "Success",
      description: `Student ${rollNo} status updated to ${newStatus}!`,
    });

    if (newStatus === "approved") {
      // Send confirmation email
      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, name: name }),
        });

        if (response.ok) {
          toast({
            title: "Email Sent",
            description: `Confirmation email sent to ${email}!`,
          });
        } else {
          toast({
            title: "Email Failed",
            description: `Failed to send confirmation email to ${email}.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error sending email:", error);
        toast({
          title: "Email Error",
          description: `Error sending confirmation email to ${email}.`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
          <CardDescription>
            Here are the details of all registered students.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableCaption>A list of all registered students.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.rollNo}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.branch}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {student.status === "pending" && (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                    {student.status === "approved" && (
                      <Badge variant="default">Approved</Badge>
                    )}
                    {student.status === "rejected" && (
                      <Badge variant="destructive">Rejected</Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex items-center justify-center space-x-2">
                    {student.status === "pending" && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve Student</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to approve{" "}
                                {student.name}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  updateStudentStatus(
                                    student.rollNo,
                                    "approved",
                                    student.email,
                                    student.name
                                  )
                                }
                              >
                                Approve
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Student</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject {student.name}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  updateStudentStatus(
                                    student.rollNo,
                                    "rejected",
                                    student.email,
                                    student.name
                                  )
                                }
                              >
                                Reject
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDataDisplay;
