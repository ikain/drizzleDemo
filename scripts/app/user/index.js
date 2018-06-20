var D = require('drizzlejs');

exports.items = {
    top: 'top',
    bottom: 'bottom',
    edit: 'edit'
};
exports.store = {
    models: {
        users: {url: '../user/list'}, // , autoLoad: 'after'
        saveUser: {url: '../user'},
        getUser: {url: '../user'},
        deleteUser: {url: '../user'}
    },
    callbacks: {
        init: function () {
            this.module.dispatch('getUsers');
        },
        deleteUser: function (id) {
            var me = this;
            var deleteUser = this.models.deleteUser;
            if (id) {
                deleteUser.clear();
                deleteUser.set({id: id});
                this.del(deleteUser).then(function () {
                    return me.module.dispatch('getUsers');
                });
            }
        },
        getUsers: function (option) {
            var users = this.models.users;
            if (option) {
                users.clear();
                D.assign(users.params, option);
            }
            return this.get(users);
        },
        saveUser: function (payload) {
            var saveUser = this.models.saveUser;
            var me = this;
            if (payload) {
                if(!payload.id) // 排除id在新增时候为""值
                    delete payload.id;
                saveUser.clear();
                saveUser.set({data: JSON.stringify(payload)}, {loading: true});
                if (payload.id) { // ID 存在 则put更新
                    return this.put(saveUser).then(function () {
                        me.module.showList();
                        return me.module.dispatch('getUsers');
                    });
                } else {
                    return this.post(saveUser).then(function () {
                        me.module.showList();
                        return me.module.dispatch('getUsers');
                    });
                }
            }
        },
        getUser: function (id) {
            var getUser = this.models.getUser;
            if (id) {
                getUser.clear();
                getUser.set({id: id}, {loading: true});
                return this.get(getUser)
            }
        },
        refreshList: function (options) {
            this.module.dispatch('getUsers', options);
        }
    }
};

exports.beforeRender = function () {
    // 页面渲染之前会调用初始化方法 callback
    return this.dispatch('init');
};

exports.afterRender = function () {
    // 页面渲染完成后隐藏编辑
    this.showList();
};

exports.mixin = {
    showEdit: function () {
        // 在此处this代表是当前整个module对象，而在view-*.js 中handlers，this 代表是View
        var topView = this.items.top;
        var bottomView = this.items.bottom;
        var editView = this.items.edit;
        $(topView.$$('.view-user-top')[0]).hide();
        $(bottomView.$$('.view-user-bottom')[0]).hide();
        $(editView.$$('.view-user-edit')[0]).show();
    },
    showList: function () {
        var editView = this.items.edit;
        var topView = this.items.top;
        var bottomView = this.items.bottom;
        // 取出匹配元素返回是NodeList，需要[0]用jquery转
        $(topView.$$('.view-user-top')[0]).show();
        $(bottomView.$$('.view-user-bottom')[0]).show();
        $(editView.$$('.view-user-edit')[0]).hide();
    }
};