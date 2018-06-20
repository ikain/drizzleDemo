var _ = require('lodash/collection');
exports.bindings = {
    users: true
};

exports.dataForTemplate = {
    users: function (data) {
        _.map(data.users || [], function (info, i) {
            info.i = i + 1;
            if (i % 2 === 0)
                info.style = true;
        });
        return data.users;
    }
};

exports.events = {
    'click updateUser-*': 'updateUser',
    'click deleteUser-*': 'deleteUser'
};

exports.actions = {
};

exports.handlers = {
    updateUser: function (id) {
        this.module.dispatch('getUser', id);
        this.module.showEdit();
    },
    deleteUser: function (id) {
        this.module.dispatch('deleteUser', id);
    }
};
