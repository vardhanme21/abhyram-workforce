@RestResource(urlMapping='/timesheet/v1/*')
global with sharing class TimesheetAPI {

    @HttpGet
    global static TimesheetResponse getWeekTimesheet() {
        RestRequest req = RestContext.request;
        String dateParam = req.params.get('date');

        Date weekDate = Date.valueOf(dateParam);
        Date weekStart = weekDate.toStartOfWeek();

        // Get employee from current user
        Employee__c emp = [
            SELECT Id, Cost_Rate__c
            FROM Employee__c
            WHERE User__c = :UserInfo.getUserId()
            LIMIT 1
        ];

        // Get or create timesheet
        List<Timesheet__c> timesheets = [
            SELECT Id, Week_Start_Date__c, Week_End_Date__c, Status__c,
                   Total_Hours__c, Billable_Hours__c
            FROM Timesheet__c
            WHERE Employee__c = :emp.Id
            AND Week_Start_Date__c = :weekStart
            LIMIT 1
        ];

        Timesheet__c timesheet;
        if (timesheets.isEmpty()) {
            timesheet = new Timesheet__c(
                Employee__c = emp.Id,
                Week_Start_Date__c = weekStart,
                Week_End_Date__c = weekStart.addDays(6),
                Status__c = 'Draft'
            );
            insert timesheet;
        } else {
            timesheet = timesheets[0];
        }

        // Get entries
        List<Timesheet_Entry__c> entries = [
            SELECT Id, Project__c, Project__r.Project_Name__c, Project__r.Project_Code__c,
                   Date__c, Hours__c, Billable__c, Notes__c, Entry_Type__c
            FROM Timesheet_Entry__c
            WHERE Timesheet__c = :timesheet.Id
            ORDER BY Date__c, Project__r.Project_Name__c
        ];

        // Get active projects
        List<Project__c> projects = [
            SELECT Id, Project_Name__c, Project_Code__c, Billable__c
            FROM Project__c
            WHERE Status__c = 'Active'
            ORDER BY Project_Name__c
        ];

        return new TimesheetResponse(timesheet, entries, projects);
    }

    @HttpPost
    global static SaveResponse saveDraft() {
        RestRequest req = RestContext.request;
        String requestBody = req.requestBody.toString();

        SaveRequest saveReq = (SaveRequest) JSON.deserialize(
            requestBody,
            SaveRequest.class
        );

        // Get employee
        Employee__c emp = [
            SELECT Id
            FROM Employee__c
            WHERE User__c = :UserInfo.getUserId()
            LIMIT 1
        ];

        // Upsert timesheet
        Date weekStart = Date.valueOf(saveReq.weekStartDate);
        List<Timesheet__c> existingTimesheets = [
            SELECT Id
            FROM Timesheet__c
            WHERE Employee__c = :emp.Id
            AND Week_Start_Date__c = :weekStart
            LIMIT 1
        ];

        Timesheet__c timesheet;
        if (existingTimesheets.isEmpty()) {
            timesheet = new Timesheet__c(
                Employee__c = emp.Id,
                Week_Start_Date__c = weekStart,
                Week_End_Date__c = weekStart.addDays(6),
                Status__c = 'Draft'
            );
            insert timesheet;
        } else {
            timesheet = existingTimesheets[0];
        }

        // Delete existing entries and recreate (simpler than upsert logic)
        delete [
            SELECT Id
            FROM Timesheet_Entry__c
            WHERE Timesheet__c = :timesheet.Id
        ];

        // Insert new entries
        List<Timesheet_Entry__c> newEntries = new List<Timesheet_Entry__c>();
        for (EntryRequest entryReq : saveReq.entries) {
            newEntries.add(new Timesheet_Entry__c(
                Timesheet__c = timesheet.Id,
                Project__c = entryReq.projectId,
                Date__c = Date.valueOf(entryReq.entryDate),
                Hours__c = entryReq.hours,
                Notes__c = entryReq.notes,
                Entry_Type__c = 'Regular'
            ));
        }

        if (!newEntries.isEmpty()) {
            insert newEntries;
        }

        return new SaveResponse(true, timesheet.Id, 'Draft saved successfully');
    }

    @HttpPut
    global static SubmitResponse submitTimesheet() {
        RestRequest req = RestContext.request;
        String requestBody = req.requestBody.toString();

        SubmitRequest submitReq = (SubmitRequest) JSON.deserialize(
            requestBody,
            SubmitRequest.class
        );

        Timesheet__c timesheet = [
            SELECT Id, Status__c, Total_Hours__c
            FROM Timesheet__c
            WHERE Id = :submitReq.timesheetId
            LIMIT 1
        ];

        // Validation
        if (timesheet.Total_Hours__c == 0) {
            return new SubmitResponse(false, 'Cannot submit timesheet with 0 hours');
        }

        if (timesheet.Status__c == 'Approved') {
            return new SubmitResponse(false, 'Timesheet is already approved');
        }

        // Submit
        timesheet.Status__c = 'Submitted';
        timesheet.Submitted_Date__c = DateTime.now();
        update timesheet;

        // Trigger approval process would go here

        return new SubmitResponse(true, 'Timesheet submitted for approval');
    }

    // Response classes
    global class TimesheetResponse {
        public Timesheet__c timesheet;
        public List<Timesheet_Entry__c> entries;
        public List<Project__c> projects;

        public TimesheetResponse(
            Timesheet__c ts,
            List<Timesheet_Entry__c> ent,
            List<Project__c> proj
        ) {
            this.timesheet = ts;
            this.entries = ent;
            this.projects = proj;
        }
    }

    global class SaveResponse {
        public Boolean success;
        public String timesheetId;
        public String message;

        public SaveResponse(Boolean s, String id, String msg) {
            this.success = s;
            this.timesheetId = id;
            this.message = msg;
        }
    }

    global class SubmitResponse {
        public Boolean success;
        public String message;

        public SubmitResponse(Boolean s, String msg) {
            this.success = s;
            this.message = msg;
        }
    }

    // Request classes
    global class SaveRequest {
        public String weekStartDate;
        public List<EntryRequest> entries;
    }

    global class EntryRequest {
        public String projectId;
        public String entryDate;
        public Decimal hours;
        public String notes;
    }

    global class SubmitRequest {
        public String timesheetId;
    }
}
