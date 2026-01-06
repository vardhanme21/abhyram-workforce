@RestResource(urlMapping='/reports/v1/*')
global with sharing class ReportsAPI {

    @HttpGet
    global static void getReports() {
        RestRequest req = RestContext.request;
        String type = req.requestURI.substringAfterLast('/');

        if (type == 'utilization') {
            getUtilization();
        } else if (type == 'projects') {
             getProjectMargins();
        } else {
             setResponse(false, 'Unknown report type', 400);
        }
    }

    private static void getUtilization() {
        // Mocking logic - in real app would aggregate Timesheet_Entry__c
        // Aggregating last 6 weeks
        
        List<AggregateResult> results = [
            SELECT WEEK_IN_YEAR(Date__c) wk, Billable__c, SUM(Hours__c) total
            FROM Timesheet_Entry__c
            WHERE Date__c = LAST_N_DAYS:42
            GROUP BY WEEK_IN_YEAR(Date__c), Billable__c
            ORDER BY WEEK_IN_YEAR(Date__c)
        ];
        
        setResponse(true, results, 200);
    }
    
    private static void getProjectMargins() {
        // Project metrics
        List<Project__c> projects = [
            SELECT Id, Project_Name__c, Budget_Hours__c, Consumed_Hours__c, Billable_Rate__c
            FROM Project__c
            WHERE Status__c = 'Active'
        ];
        
        setResponse(true, projects, 200);
    }

    private static void setResponse(Boolean success, Object data, Integer statusCode) {
        RestContext.response.statusCode = statusCode;
        RestContext.response.headers.put('Content-Type', 'application/json');
        RestContext.response.responseBody = Blob.valueOf(JSON.serialize(new ReportResponse(success, data)));
    }

    global class ReportResponse {
        public Boolean success;
        public Object data;

        public ReportResponse(Boolean s, Object d) {
            this.success = s;
            this.data = d;
        }
    }


    
    global class ChartData {
        public String name;
        public Decimal billable;
        public Decimal nonBillable;
    }
}
