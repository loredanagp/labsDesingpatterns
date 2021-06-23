# Structural Design Patterns
## Author: *Godorogea Loredana*

# Introduction

In this laboratory work I practice structural design patterns, and namely by selecting a field and developing an application for that field, implementing at least 3 structural patterns introduced by the Gang of Four. 

For this lab I have am improving the task management system which was started with lab 1, which covered creational design patterns. In last lab the structure was kind of messy, so I tried to keep it more tidy and more component-oriented.

For current system a few functional improvements have been added to the system in order to satisfy the need for the abovementioned patterns and those are:
* combined notification system (send through multiple channels at once) - to have the room for decorator pattern, where each channel is a decorator
* Subtasks and estimation - to make room for the composite pattern, such that each parent task's estimation depends on its childrens'
* Access to system by privelege type - to make room for proxy pattern which will filter access to method execution.

## Decorator Pattern

Decorator is a pattern which allows dynamically attaching functionality to an object, by wrapping the core object and running code before/after the execution of the core's method. In this project I implemented it with with a multiple-channel notification system (Though I believe strategy pattern would be more suitable).

This is done by declaring a base Decorator class ` NotificationDecorator` from which all notification delivery channels inherit.

A child class call looks like this:
```typescript
// task-system/notifications/sms-notification-decorator.ts

export class SmsNotificationDecorator extends NotificationDecorator {
    private service = new SmsNotification(null);

    send(props: INotificationProps) {
        this.service.send(props);
        super.send(props);
    }
}
```

Which allows us to pass a base class to constructor and execute its method before executing the decorator method. This can be seen in this snippet:

```typescript
// task-system/notifications/notification-factory.ts

createCombinedNotificationService(types: NotificationType[]): INotification {
    let base = this.createPushotificationService();

    if (types.includes(NotificationType.email)) {
        base = new EmailNotificationDecorator(base);
    }

    if (types.includes(NotificationType.sms)) {
        base = new EmailNotificationDecorator(base);
    }

    return base;
}
```

## Composite Pattern

Composite pattern is a solution to recursive queries in a tree-like structures. In this case, having tasks and subtasks, where the task's estimation depends on its subtasks' estimations, it is quite handy for each task to have a method to calculate estimation which will be recursively the sum of core task estimation and estimation of its subtasks. The implementation is allowed by the method noted below:

```typescript
// task-system/task.ts

getEstimation(): number {
    const subtasksEstimation = this.getSubtaskInstances()
        .map(task => task.getEstimation())
        .reduce((accumulator, current) => accumulator + current);
    return this.estimation + subtasksEstimation;
}
```

## Proxy Pattern

The proxy design pattern is a solution to delegate access to a class, such that the proxy implements the interface of the base class but adds modifications on how the methods are called, respecting open-closed principle.

In my project I created a proxy class for the system interaction, by authorization, still keeping all the public methods exposed and intact.

The important bits of implementation can be seen here:
```typescript
// task-system/system-proxy.ts
requestFeature(name: string, description: string, ...subtasksNames: string[]): void {
    if (!(this.currentUser in this.users)) {
        console.log('Access denied!')
        return;
    }
    if (!(this.users[this.currentUser] == SystemUserType.projectOwner)) {
        console.log('Access denied!')
        return;
    }
    this.taskSystem.reportBug(name, description, ...subtasksNames);
}

authoriseAndRun(user: string, fn: () => void) {
    this.currentUser = user;
    fn();
    this.currentUser = '';
}
```

The only way to execute a method would be to pass a lambda expression of method call to the `authoriseAndRun`, which will set the user's hash, try to run the method and reset the active session.
The proxy methods will check the user type by a hash map and execute if the access is suitable.

The user interaction can be seen in `client/index.ts`

```typescript
const admin = '#bda';
const projectOwner = '#asd';

mySystem.authoriseAndRun(
    admin,
    () => mySystem.setTeamLeads({
        qa: 'Saint Jenerson',
        frontEnd: 'Peter Burgsger',
        backEnd: 'Alison Hooper'
    })
);
```


## Conclusion

Creational design patterns seem to be a great tool which grants the oportunity to avoid inheritance and the need of writing repeated code, tightly bounded to its hierarchy.
