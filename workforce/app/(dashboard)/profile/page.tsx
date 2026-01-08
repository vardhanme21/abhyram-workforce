
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSalesforceConnection } from "@/lib/salesforce";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { User, Mail, Briefcase, Calendar, Hash } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  let employee = null;
  let error = null;

  try {
    const conn = await getSalesforceConnection();
    // Query fields from Employee__c based on schema knowledge or safe assumptions
    // Assuming fields from previous context: Full_Name__c, Email__c, Status__c
    // Adding Id for reference.
    const result = await conn.sobject("Employee__c").findOne({
      Email__c: session.user.email
    }, "Id, Full_Name__c, Email__c, Status__c, CreatedDate");

    employee = result;
  } catch (e) {
    console.error("Failed to fetch employee profile:", e);
    error = "Could not load profile data from Salesforce.";
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-2">Manage your personal information and settings.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {employee ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary-500" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <div className="font-medium text-gray-900 mt-1">{employee.Full_Name__c || "N/A"}</div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="bg-primary-50 p-2 rounded-full">
                  <Mail className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                  <div className="text-sm font-medium text-gray-900">{employee.Email__c}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary-500" />
                Employment Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center gap-3">
                <div className="bg-green-50 p-2 rounded-full">
                   <div className={`h-2.5 w-2.5 rounded-full ${employee.Status__c === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                  <div className="text-sm font-medium text-gray-900">{employee.Status__c || "Unknown"}</div>
                </div>
              </div>
               
               <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <div className="bg-gray-50 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                   <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Joined On</label>
                   <div className="text-sm font-medium text-gray-900">
                    {employee.CreatedDate ? new Date(employee.CreatedDate).toLocaleDateString() : "N/A"}
                   </div>
                </div>
              </div>

               <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <div className="bg-gray-50 p-2 rounded-full">
                  <Hash className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                   <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</label>
                   <div className="text-sm font-mono text-gray-600">{employee.Id}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        !error && (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Profile Not Found</h3>
                <p className="mt-1 text-sm text-gray-500">We couldn&apos;t find an employee record for {session.user.email}.</p>
            </div>
        )
      )}
    </div>
  );
}
