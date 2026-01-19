@RestResource(urlMapping='/gamification/v1/*')
global with sharing class GamificationAPI {

    @HttpGet
    global static GameStats getStats() {
        RestRequest req = RestContext.request;
        String email = req.params.get('email');
        Id userId = UserInfo.getUserId();
        
        Employee__c emp;
        if (String.isNotBlank(email)) {
            emp = [SELECT Id, Name, Streak__c, Level__c, XP__c, Current_Badge__c FROM Employee__c WHERE Email__c = :email LIMIT 1];
        } else {
            emp = [SELECT Id, Name, Streak__c, Level__c, XP__c, Current_Badge__c FROM Employee__c WHERE User__c = :userId LIMIT 1];
        }

        if (emp == null) return null;

        return new GameStats(emp);
    }

    global class GameStats {
        public Decimal streak;
        public Decimal level;
        public Decimal xp;
        public String badge;
        public Decimal nextLevelXp;

        public GameStats(Employee__c e) {
            this.streak = e.Streak__c == null ? 0 : e.Streak__c;
            this.level = e.Level__c == null ? 1 : e.Level__c;
            this.xp = e.XP__c == null ? 0 : e.XP__c;
            this.badge = e.Current_Badge__c;
            this.nextLevelXp = this.level * 1000;
        }
    }
}
