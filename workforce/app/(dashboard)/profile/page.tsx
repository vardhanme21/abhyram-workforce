
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSalesforceConnection } from "@/lib/salesforce";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { User, Mail, Briefcase, Calendar, Hash, DollarSign, Users, Building2 } from "lucide-react";
import { Input } from "@/components/ui/Input"; 
// Note: We are using Input for display-only to match the "Form" look of the design, using readOnly prop.

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  let employee = null;
  let error = null;

  try {
    const conn = await getSalesforceConnection();
    // Fetch all extended fields
    const query = `
      SELECT Id, Full_Name__c, Email__c, Status__c, CreatedDate,
             Employee_ID__c, Department__c, Manager__c, Hire_Date__c, Role__c, Cost_Rate__c, Password__c
      FROM Employee__c 
      WHERE Email__c = '${session.user.email}'
      LIMIT 1
    `;
    
    const result = await conn.query(query);
    if (result.records.length > 0) {
        employee = result.records[0];
    }
  } catch (e) {
    console.error("Failed to fetch employee profile:", e);
    error = "Could not load profile data from Salesforce.";
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-2">Personal details fetched from Salesforce.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {employee ? (
        <Card className="border-t-4 border-t-primary-500 shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2 text-primary-800">
                        <User className="h-5 w-5" />
                        Employee Information
                    </CardTitle>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${employee.Status__c === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
                        {employee.Status__c || 'Unknown'}
                    </div>
                 </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Left Column */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                        <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-900">
                            {employee.Full_Name__c || session.user.name}
                        </div>
                    </div>

                    <div className="space-y-1">
                         <label className="text-xs font-semibold text-gray-500 uppercase">Manager</label>
                         <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 flex items-center gap-2">
                            <Users className="h-3 w-3 text-gray-400" />
                            {employee.Manager__c || 'N/A'}
                         </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Employee ID</label>
                        <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-mono text-gray-700 flex items-center gap-2">
                            <Hash className="h-3 w-3 text-gray-400" />
                            {employee.Employee_ID__c || employee.Id}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Hire Date</label>
                         <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 flex items-center gap-2">
                             <Calendar className="h-3 w-3 text-gray-400" />
                             {employee.Hire_Date__c ? new Date(employee.Hire_Date__c).toLocaleDateString() : 'N/A'}
                         </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Department</label>
                        <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 flex items-center gap-2">
                            <Building2 className="h-3 w-3 text-gray-400" />
                            {employee.Department__c || 'N/A'}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Role</label>
                         <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 flex items-center gap-2">
                             <Briefcase className="h-3 w-3 text-gray-400" />
                             {employee.Role__c || 'N/A'}
                         </div>
                    </div>

                     <div className="space-y-1">
                         {/* Status is already in header, putting Email here instead to balance layout */}
                        <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                        <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 flex items-center gap-2">
                             <Mail className="h-3 w-3 text-gray-400" />
                             {employee.Email__c}
                        </div>
                    </div>

                     <div className="space-y-1">
                         <label className="text-xs font-semibold text-gray-500 uppercase">Password</label>
                         <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                             ••••••••••••
                         </div>
                    </div>

                     <div className="space-y-1 md:col-span-2 border-t pt-4 mt-2">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            Financials
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Cost Rate</label>
                                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                                    {employee.Cost_Rate__c ? `$${employee.Cost_Rate__c}/hr` : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
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
