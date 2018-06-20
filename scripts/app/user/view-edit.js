exports.bindings = {
    users: '',
    getUser: true
};

// 页面dom交互操作用events + handlers 处理
exports.events = {
    'click goBackList': 'goBackList'
};

// 页面数据提交，删除，后台交互用actions
exports.actions = {
    'click saveUser': 'saveUser'
};

exports.dataForActions = {
    saveUser: function (data, e) {
        // data 为表单填写数据，e 为 MouseEvent
        return data;
    }
};

exports.handlers = {
    goBackList :function () {
        var editView = this;
        // 清空缓存的上次getUser对象属性值, data param 等
        editView.module.store.models.getUser.clear();
        // changed方法 使关联此model的View全部自动渲染，在这里作用是清空赋值
        editView.module.store.models.getUser.changed();
        // 调用模块公共扩展方法
        editView.module.showList();
        /*
        // 获取当前module的所有View
        var topView = this.module.items.top;
        var bottomView = this.module.items.bottom;
        // 再根据所有View对象寻找自己的子元素 做操作
        $(topView.$$('.view-user-top')[0]).show();
        $(bottomView.$$('.view-user-bottom')[0]).show();
        $(editView.$$('.view-user-edit')[0]).hide();
        */
    }
};