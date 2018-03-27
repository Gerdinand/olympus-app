import * as Realm from 'realm';

const NotificationSchema = {
    name: 'Notification',
    properties: {
        title: 'string',
        body: 'string',
        action: 'string?',
        color: 'string?',
        icon: 'string?',
        tag: 'string?',
    },
};

const TransactionSchema = {
    name: 'Transaction',
    properties: {
        sender: 'string',
        receiver: 'string',
        symbol: 'string',
        amount: 'int',
        stringify: 'string',
    },
};

export default class RealmService {
    public static realm: Realm;
    public static async instance() {
        if (!this.realm) {
            this.realm = await Realm.open({
                schema: [NotificationSchema, TransactionSchema],
            });
            return this.realm;
        }
        return this.realm;
    }
}
