import TaskSystemProxy from '../task-system';

export class Client {
    run() {
        const mySystem = TaskSystemProxy.getInstance();

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

        mySystem.authoriseAndRun(
            projectOwner,
            () => mySystem.requestFeature('Self Learning AI for robots', 'Please, make mailing robots learn by themselves how to deliver mail', 'Research Artificial inteligence')
        )
        mySystem.authoriseAndRun(
            projectOwner,
            () => mySystem.reportBug('Wrong KillPeople boolean value', 'Whoever set the bool value KillPeople to true, this is not funny')
        )
        mySystem.authoriseAndRun(
            projectOwner,
            () => mySystem.reportBug('Robots try to reconstruct socitety, glorifying cats', 'I have seen recently that our mail delivery system has too many posters of kittens on their walls')
        )
        mySystem.authoriseAndRun(
            projectOwner,
            () => mySystem.reportBug('Robots have put cats everywhere, they are taking over our keyboards', 'please fix this!')
        )
        mySystem.authoriseAndRun(
            projectOwner,
            () => mySystem.requestFeature('adsfrtmntu lk mi k[lpadx adwxnjli gsdfnluiygjplacfzq', 'asjd fsadhlkghewgwalk feawewf')
        )
    }
}
