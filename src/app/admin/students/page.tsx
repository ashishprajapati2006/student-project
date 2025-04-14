"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Student {
  name: string;
  rollNo: string;
  branch: string;
  email: string;
  status: string; // Added status field
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

  const handleApprove = (rollNo: string) => {
    updateStudentStatus(rollNo, "approved");
  };

  const handleReject = (rollNo: string) => {
    updateStudentStatus(rollNo, "rejected");
  };

  const updateStudentStatus = async (rollNo: string, status: string) => {
    const updatedStudents = students.map((student) =>
      student.rollNo === rollNo ? { ...student, status: status } : student
    );
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));

    // Send confirmation email (only for approval)
    if (status === "approved") {
      const student = updatedStudents.find((s) => s.rollNo === rollNo);
      if (student) {
        await sendConfirmationEmail(student.email, student.name);
      }
    }
  };

  const sendConfirmationEmail = async (email: string, name: string) => {
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      if (!res.ok) {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.rollNo}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.branch}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.status}</TableCell>
                  <TableCell>
                    {student.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(student.rollNo)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(student.rollNo)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {student.status === "approved" && (
                      <span>Approved</span>
                    )}
                    {student.status === "rejected" && (
                      <span>Rejected</span>
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
