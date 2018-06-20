var D = require('drizzlejs'),
    getWithParams0;


var strings = {
    ok: '确定',
    cancel: '取消',
    edit: '编辑',
    update: '修改',
    view: '查看',
    remove: '删除',
    stop: '停止',
    operating: '操作',
    enable: '启用',
    disable: '禁用',
    'import-data': '导入',
    'download-template': '下载模板',
    preview: '预览',
    add: '新增',
    save: '保存',
    copy: '复制',
    search: '查询',
    publish: '发布',
    undo: '撤销',
    manage: '管理',
    pass: '通过',
    reject: '拒绝',
    detail: '详情',
    reset: '重置',
    'next-step': '下一步',
    'pre-step': '上一步',
    'no-data': '暂无内容',
    'no-class-data': '暂无班级数据',
    audit: '审核',
    'move-up': '上移',
    'move-down': '下移',
    recover: '恢复',
    suspend: '暂停',
    export: '导出',
    download: '下载',
    'export-data': '导出',
    yes: '是',
    no: '否',
    select: '选择',
    index: '序号',
    type: '类型',
    name: '名称',
    set: '设置',
    state: '状态',
    createTime: '创建时间',
    'save-success': '保存成功',
    'update-success': '修改成功',
    'delete-success': '删除成功',
    'delete-warn': '{0}删除后将无法恢复，是否确定删除该{0}',
    'save-publish': '保存并发布',
    description: '描述',
    reserve: '预定',
    deploy: '配置',
    send: '发送',
    'send-warn': '确定要发送吗？',
    'send-success': '发送成功',
    'select-warn': '请选择数据',
    summary: '统计',
    'agent-name': '证件号码(账号)'
};


var ss = D.assign({}, strings);

exports.get = function(key) {
    if (!ss[key]) throw new Error('Key [' + key + '] is not defined');
    return ss[key];
};

exports.getWithParams = function(key, params) {
    var p;

    if (!ss[key]) throw new Error('Key [' + key + '] is not defined');

    if (!params) throw new Error('params [' + params + '] is not defined');

    if (params && !(params instanceof Array)) {
        p = [params];
    } else {
        p = params;
    }

    return getWithParams0(ss[key], p);
};

getWithParams0 = function(s, p) {
    var str = s,
        i;

    for (i = 0; i < p.length; i++) {
        str = str.replace(new RegExp('\\{' + i + '\\}', 'g'), p[i]);
    }
    return str;
};

exports.getString = function(str, params) {
    return getWithParams0(str, params);
};

// 扩展方法，IE浏览器不兼容startsWith方法
if (typeof String.prototype.startsWith !== 'function') {
    D.assign(String.prototype, {
        startsWith: function(prefix) {
            return this.slice(0, prefix.length) === prefix;
        }
    });
}

