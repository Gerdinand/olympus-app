import Realm from 'realm';

const Notification = {
    name: 'Notification',
    properties: {
        title: 'string',
        body: 'string',
        sound: 'string',
    },
};

const Transation = {
    name: 'Transation',
    properties: {
        hash: 'string',
        nonce: 'int',
        blockHash: 'string',
        blockNumber: 'int',
        transactionIndex: 'int',
        from: 'string',
        to: 'string',
        value: 'string',
        gasPrice: 'string',
        gas: 'int',
        input: 'string',
        stringify: 'string',
    },
};

export default class RealmService {
    public static realm: Realm;
    public static async instance() {
        if (!this.realm) {
            this.realm = await Realm.open({
                schema: [Notification, Transation],
            });
        }
        return this.realm;
    }
}
