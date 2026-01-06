@RestResource(urlMapping='/manager/v1/*')
global with sharing class ManagerAPI {

    @HttpGet
    global static TeamTimesheetsResponse getTeamTimesheets() {
        RestRequest req = RestContext.request;
        String weekParam = req.params.get('week');

        Date weekStart = Date.valueOf(weekParam);

        // Get current user's employee record
        Employee__c manager = [
            SELECT Id
            FROM Employee__c
            WHERE User__c = :UserInfo.getUserId()
            LIMIT 1
        ];

        // Get direct reports
        List<Employee__c> directReports = [
            SELECT Id, Full_Name__c, Role__c
            FROM Employee__c
            WHERE Manager__c = :manager.Id
            AND Status__c = 'Active'
        ];

        Set<Id> reportIds = new Set<Id>();
        for (Employee__c emp : directReports) {
            reportIds.add(emp.Id);
        }

        // Get timesheets
        List<Timesheet__c> timesheets = [
            SELECT Id, Employee__c, Employee__r.Full_Name__c,
                   Employee__r.Role__c, Week_Start_Date__c, Status__c,
                   Total_Hours__c, Billable_Hours__c, Submitted_Date__c
            FROM Timesheet__c
            WHERE Employee__c IN :reportIds
            AND Week_Start_Date__c = :weekStart
            ORDER BY Employee__r.Full_Name__c
        ];

        return new TeamTimesheetsResponse(timesheets);
    }

    @HttpPost
    global static ApprovalResponse approveTimesheet() {
        RestRequest req = RestContext.request;
        String requestBody = req.requestBody.toString();

        ApprovalRequest approvalReq = (ApprovalRequest) JSON.deserialize(
            requestBody,
            ApprovalRequest.class
        );

        Timesheet__c timesheet = [
            SELECT Id, Status__c
            FROM Timesheet__c
            WHERE Id = :approvalReq.timesheetId
            LIMIT 1
        ];

        if (timesheet.Status__c != 'Submitted') {
            return new ApprovalResponse(false, 'Timesheet is not in submitted status');
        }

        timesheet.Status__c = 'Approved';
        timesheet.Approved_By__c = UserInfo.getUserId();
        timesheet.Approved_Date__c = DateTime.now();
        update timesheet;

        return new ApprovalResponse(true, 'Timesheet approved successfully');
    }

    // Response classes
    global class TeamTimesheetsResponse {
        public List<Timesheet__c> timesheets;

        public TeamTimesheetsResponse(List<Timesheet__c> ts) {
            this.timesheets = ts;
        }
    }

    global class ApprovalResponse {
        public Boolean success;
        public String message;

        public ApprovalResponse(Boolean s, String msg) {
            this.success = s;
            this.message = msg;
        }
    }

    global class ApprovalRequest {
        public String timesheetId;
        public String comments;
    }
}
