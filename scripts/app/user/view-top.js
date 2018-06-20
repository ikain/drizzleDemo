exports.bindings = {
    users: ''
};


exports.events = {
    'click addUser': 'addUser',
    'click searchUser': 'searchUser'
};

exports.handlers = {
    addUser: function () {
        var topView = this;
        topView.module.showEdit();
        /*
        // 寻找当前module的所有Region
        var topRegion = this.module.regions.top;
        var bottomRegion = this.module.regions.bottom;
        var editRegion = this.module.regions.edit;
        // 再寻找各自子元素 做操作
        $(topRegion.$$('.view-user-top')[0]).hide();
        $(bottomRegion.$$('.view-user-bottom')[0]).hide();
        $(editRegion.$$('.view-user-edit')[0]).show();
        */

        // this.$$ 只能拿到当前item view中的元素 返回NodeList
        // $(topView.$$('.view-user-top')[0]).hide();

    },
    searchUser: function () {
        var topView = this;
        var sex = $(topView.$$('select[name="sex"]')[0]).val();
        var name = $(topView.$$('input[name="name"]')[0]).val();
        this.module.dispatch('refreshList', {name: name, sex: sex});
    }
};
