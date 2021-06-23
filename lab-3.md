# Structural Design Patterns
## Author: *Godorogea Loredana*

# Introduction

In this laboratory work I practice behavioral design patterns, and namely by selecting a field and developing an application for that field, implementing at least 3 behavioral patterns introduced by the Gang of Four. 

For this lab I have am improving the task management system which was started with lab 1 and 2, which covered creational and structural design patterns.

For current system a few functional improvements have been added to the system in order to satisfy the need for the abovementioned patterns and those are:

* Add possibility to watch task status changes

## Chain of responsibility

Chain of responsibility pattern is a behavioral design pattern that lets you pass a request through a chain of different handlers to process a request

This pattern is implemented here in system-proxy, in order to separate the logic for user authorisation

A child class call looks like this:
```typescript
// task-system/system-proxy/user-cos.ts

abstract class UserHandler {
    protected next!: IUserHandler;

    setNext(handler: IUserHandler): void {
        this.next = handler;
    }
}

export interface IUserHandler {
    execute: (user: string) => boolean;
    setNext: (handler: IUserHandler) => void;
}

export class UserHandlerBuilder {
    private static instance: IUserHandler | undefined;

    static getInstance(userList: IUserList, role?: SystemUserType): IUserHandler {
        if (role !== undefined) {
            let pipe = new UserHasRole(userList, role);

            if (this.instance !== undefined) {
                pipe.setNext(this.instance);
            }
            this.instance = pipe;
        }

        let pipe = new UserExists(userList);
        if (this.instance !== undefined) {
            this.instance.setNext(pipe);
        }

        let result = <IUserHandler> this.instance;
        this.instance = undefined;
        return result;
    }
}
// ...

export class UserHasRole extends UserHandler implements IUserHandler {
    private userList: IUserList;
    private role: SystemUserType;

    constructor(userList: IUserList, role: SystemUserType) {
        super();
        this.userList = userList;
        this.role = role;
    }

    execute(user: string): boolean {
        if (this.userList[user] != this.role) {
            return false;
        }

        if (this.next) {
            return this.next.execute(user);
        }

        return true;
    }
}

```

So we can use this in our system-proxy

```typescript
// task-system/system-proxy/system-proxy.ts

export class TaskSystemProxy implements ITaskSystem {
    private checkIfAdmin: IUserHandler;
    private checkIfPo: IUserHandler;

    //...
    
    constructor() {
        this.checkIfAdmin = UserHandlerBuilder.getInstance(this.users, SystemUserType.admin);
        this.checkIfPo = UserHandlerBuilder.getInstance(this.users, SystemUserType.projectOwner);
    }

    //...
    foo() {
        this.checkIfPo.execute(this.currentUser) // Checks if current user has po rights
    }
}

```

## Observer Pattern

Observer pattern is a design pattern that allows defining a subscriber mechanism, so that outside entities can be notified about an object's changes and react to it.

For this, a general interface was created:

```typescript
//task-system/utils/types.ts
export type ISubscription<T> = (prev: T, current: T) => void;

export interface ISubscribable {
    subscribe: (subscription: ISubscription<any>) => () => void
} 
```

... And a general class with template. It holds an array of subscribers, a method for adding oneself to subscribing list (which returns the unsubscribe function for the specific subscriber) and the emit method, which calls subscriber's callbacks to notify them about the changes.
```typescript
export class Observable<T> {
    private subscribers: ISubscription<T>[] = [];

    private unsubscribe(subscriber: ISubscription<T>) {
        this.subscribers = this.subscribers.filter(item => item != subscriber);
    }

    subscribe(subscriber: ISubscription<T>): () => void {
        this.subscribers.push(subscriber);

        return () => this.unsubscribe(subscriber);
    }

    emit(prev: T, current: T) {
        this.subscribers.forEach(subscription => subscription(prev, current));
    }
} 
```

After that we can extend this functionality in a different class:
```typescript
// task-system/tasks/task.ts
subscribe(subscription: ISubscription<ITaskChanges>) {
    return this.observable.subscribe(subscription);
}

private _asignee: string = '';
public get asignee(): string {
    return this._asignee;
} public set asignee(val: string) {
    this.observable.emit({asignee: this.asignee}, {asignee: val});
    this._asignee = val;
}
```

And we can consume it in the following way:

```typescript
const backTask = this.TaskBuilder.createFeatureTask();

backTask.subscribe((prev, curr) => {
    prev = JSON.stringify(prev);
    curr = JSON.stringify(curr);
    console.log(`Change detected: ${prev}, ${curr}`)
})
```

## Conclusion

Behavioral design patterns seem to be a really great and versatile tool which allows creating really flexible means of interaction between classes, to allow separation of concerns.
