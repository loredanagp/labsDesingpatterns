# Creational Design Patterns Lab
Author: Godorogea Loredana
language: TypeScript


## Introduction

Creational design patterns are a general solutions for common problems concerning designinc a class system such that optimize object creation for a certain domain, without growing to much in complexity and maintaining scalability and reusability. Some of these are:

For this project, I picked three Creational Patterns:

* Singleton
* Factory
* Builder

## Implementation

`Singleton` - used for the task system, as being a single source of truth

```typescript
class TaskSystem {
    private static instance: TaskSystem;
    private constructor() {}
    public static getInstance(): TaskSystem {
        if (!TaskSystem.instance) {
            TaskSystem.instance = new TaskSystem();
        }

        return TaskSystem.instance;
    }
}
```
---
`Factory` - used for producing notification emitters (either mail, sms or push), so we set-up a way of communication and know for sure that we can use the INotification interface, with which we have a method `send(props: INotificationProps): void`

```typescript
export class NotificationFactory {
    createEmailNotification(): INotification {
        // Let's pretend that here is a real dependency
        const EmailDependency = null;
        return new EmailNotification(EmailDependency);
    }
    createSMSNotification(): INotification {
        // Let's pretend that here is a real dependency
        const SMSdependency = null;
        return new EmailNotification(SMSdependency);
    }
    createPushotification(): INotification {
        // Let's pretend that here is a real dependency
        const PushDependency = null;
        return new EmailNotification(PushDependency);
    }
}
```
---

`Builder` - Automatize a part of task creation, by setting type and default assignee. In example below, is demonstrated how a really basic construction of bug task is implemented
```typescript

class TaskBuilder {
    /// More code above

    private task: Task;

    private reset(): void {
        this.task = new Task(this.counter++);
    }

    private getNewTaskInstance(): Task {
        const res = this.task;
        this.reset();
        return res;
    }

    createBugTask(): ITask {
        const res = this.getNewTaskInstance();
        res.type = TaskType.bugfix;
        res.asignee = this.teamLeads.qa;
        console.log(`Creating Bug task`);
    
        return res;
    }

    // More code below
}
```

## Results

For this usage, we have following results:
```typescript
const mySystem = TaskSystem.getInstance();
mySystem.setTeamLeads({
    qa: 'Saint Jenerson',
    frontEnd: 'Peter Burgsger',
    backEnd: 'Alison Hooper'
})

mySystem.requestFeature('Self Learning AI for robots', 'Please, make mailing robots learn by themselves how to deliver mail');
mySystem.reportBug('Wrong KillPeople boolean value', 'Whoever set the bool value KillPeople to true, this is not funny');
mySystem.reportBug('Robots try to reconstruct socitety, glorifying cats', 'I have seen recently that our mail delivery system has too many posters of kittens on their walls');
mySystem.reportBug('Robots have put cats everywhere, they are taking over our keyboards', 'please fix this!');
mySystem.requestFeature('adsfrtmntu lk mi k[lpadx adwxnjli gsdfnluiygjplacfzq', 'asjd fsadhlkghewgwalk feawewf');
```


```
System, we have a new feature to develop!

Creating Feature task
Notified Alison Hooper about "New Issue: Self Learning AI for robots" via Email
Creating Layout task
Notified Peter Burgsger about "New Issue: Layout for Self Learning AI for robots" via Email

System, please make a bug task

Creating Bug task
Notified Saint Jenerson about "New Issue: Wrong KillPeople boolean value" via Email

System, please make a bug task

Creating Bug task
Notified Saint Jenerson about "New Issue: Robots try to reconstruct socitety, glorifying cats" via Email

System, please make a bug task

Creating Bug task
Notified Saint Jenerson about "New Issue: Robots have put cats everywhere, they are taking over our keyboards" via Email

System, we have a new feature to develop!

Creating Feature task
Notified Alison Hooper about "New Issue: adsfrtmntu lk mi k[lpadx adwxnjli gsdfnluiygjplacfzq" via Email
Creating Layout task
Notified Peter Burgsger about "New Issue: Layout for adsfrtmntu lk mi k[lpadx adwxnjli gsdfnluiygjplacfzq" via Email
```
