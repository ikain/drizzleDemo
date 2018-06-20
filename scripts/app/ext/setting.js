var _ = require('lodash/collection'),
    setting = [{
        key: 'operation.activity-recommend.indexSeq',
        value: '首页排序'
    }, {
        key: 'study.subject.code',
        value: '专题编码'
    }],
    settings = {};
_.map(setting, function(v) {
    settings[v.key] = v.value;
});
exports.get = function(key) {
    if (!settings[key]) throw new Error('Key [' + key + '] is not defined');
    return settings[key];
};
