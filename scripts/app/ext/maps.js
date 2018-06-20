var _ = require('lodash/collection');
module.exports = {
    'file-upload-state': {
        0: '否',
        1: '是'
    },
    'work-content-type': {
        1: '文档',
        2: '图片',
        3: '音频',
        4: '视频'
    }
};

module.exports.get = function(k) {
    var arr = [];
    _.forEach(this[k], function(value, key) {
        arr.push({ key: key, value: value });
    });
    return arr;
};

module.exports.getValue = function(k, sk) {
    return _.find(this[k], function(value, key) {
        return key === sk;
    });
};