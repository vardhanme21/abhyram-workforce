public with sharing class AttendanceAPI {
    
    // Custom Exception
    public class AttendanceException extends Exception {}

    @AuraEnabled
    public static Id clockIn(Id employeeId) {
        // Check if already clocked in today
        List<Attendance_Log__c> activeLogs = [
            SELECT Id 
            FROM Attendance_Log__c 
            WHERE Employee__c = :employeeId 
            AND Logout_Time__c = NULL 
            AND CreatedDate = TODAY
            LIMIT 1
        ];

        if (!activeLogs.isEmpty()) {
            throw new AttendanceException('You are already clocked in.');
        }

        Attendance_Log__c newLog = new Attendance_Log__c(
            Employee__c = employeeId,
            Login_Time__c = System.now(),
            Status__c = 'Active'
        );

        insert newLog;
        return newLog.Id;
    }

    @AuraEnabled
    public static void clockOut(Id employeeId) {
        List<Attendance_Log__c> activeLogs = [
            SELECT Id 
            FROM Attendance_Log__c 
            WHERE Employee__c = :employeeId 
            AND Logout_Time__c = NULL 
            AND Status__c = 'Active'
            ORDER BY Login_Time__c DESC
            LIMIT 1
        ];

        if (activeLogs.isEmpty()) {
            throw new AttendanceException('No active attendance session found to clock out from.');
        }

        Attendance_Log__c logToUpdate = activeLogs[0];
        logToUpdate.Logout_Time__c = System.now();
        logToUpdate.Status__c = 'Completed';
        
        update logToUpdate;
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getStatus(Id employeeId) {
        Map<String, Object> result = new Map<String, Object>();
        
        List<Attendance_Log__c> activeLogs = [
            SELECT Id, Login_Time__c 
            FROM Attendance_Log__c 
            WHERE Employee__c = :employeeId 
            AND Logout_Time__c = NULL 
            AND Status__c = 'Active'
            ORDER BY Login_Time__c DESC
            LIMIT 1
        ];

        if (!activeLogs.isEmpty()) {
            result.put('isActive', true);
            result.put('loginTime', activeLogs[0].Login_Time__c);
            result.put('recordId', activeLogs[0].Id);
        } else {
            result.put('isActive', false);
        }
        
        return result;
    }
}
