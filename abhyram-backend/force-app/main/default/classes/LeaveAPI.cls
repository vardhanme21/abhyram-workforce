@RestResource(urlMapping='/leave/v1/*')
global with sharing class LeaveAPI {

    @HttpGet
    global static LeaveResponse getLeaves() {
        RestRequest req = RestContext.request;
        String email = req.params.get('email');
        Id userId = UserInfo.getUserId();
        Id empId;

        // Resolve Employee ID
        if (String.isNotBlank(email)) {
             List<Employee__c> emps = [SELECT Id FROM Employee__c WHERE Email__c = :email LIMIT 1];
             if (!emps.isEmpty()) empId = emps[0].Id;
        } else {
             List<Employee__c> emps = [SELECT Id FROM Employee__c WHERE User__c = :userId LIMIT 1];
             if (!emps.isEmpty()) empId = emps[0].Id;
        }

        if (empId == null) {
            return new LeaveResponse(false, 'Employee not found', null);
        }

        List<Leave_Request__c> requests = [
            SELECT Id, Start_Date__c, End_Date__c, Leave_Type__c, Status__c, Reason__c 
            FROM Leave_Request__c 
            WHERE Employee__c = :empId
            ORDER BY Start_Date__c DESC
        ];

        return new LeaveResponse(true, 'Leaves fetched', requests);
    }

    @HttpPost
    global static LeaveResponse createLeave() {
        RestRequest req = RestContext.request;
        String body = req.requestBody.toString();
        LeaveRequestWrapper data = (LeaveRequestWrapper)JSON.deserialize(body, LeaveRequestWrapper.class);

        // Resolve Employee ID
        String email = data.email;
        Id userId = UserInfo.getUserId();
        Id empId;

        if (String.isNotBlank(email)) {
             List<Employee__c> emps = [SELECT Id FROM Employee__c WHERE Email__c = :email LIMIT 1];
             if (!emps.isEmpty()) empId = emps[0].Id;
        } else {
             List<Employee__c> emps = [SELECT Id FROM Employee__c WHERE User__c = :userId LIMIT 1];
             if (!emps.isEmpty()) empId = emps[0].Id;
        }

        if (empId == null) {
            return new LeaveResponse(false, 'Employee not found', null);
        }

        Leave_Request__c lr = new Leave_Request__c(
            Employee__c = empId,
            Start_Date__c = Date.valueOf(data.startDate),
            End_Date__c = Date.valueOf(data.endDate),
            Leave_Type__c = data.type,
            Reason__c = data.reason,
            Status__c = 'Pending'
        );

        try {
            insert lr;
            return new LeaveResponse(true, 'Leave request submitted', new List<Leave_Request__c>{lr});
        } catch (Exception e) {
            return new LeaveResponse(false, 'Error: ' + e.getMessage(), null);
        }
    }

    global class LeaveResponse {
        public Boolean success;
        public String message;
        public List<Leave_Request__c> data;

        public LeaveResponse(Boolean s, String m, List<Leave_Request__c> d) {
            this.success = s;
            this.message = m;
            this.data = d;
        }
    }

    global class LeaveRequestWrapper {
        public String email;
        public String startDate;
        public String endDate;
        public String type;
        public String reason;
    }
}
