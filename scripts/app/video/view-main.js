exports.components = [function() {
	var me = this;
    return {
        id: 'player',
        name: 'videojs',
        options: {
            video: {
                autoplay: true,
                
            },
        }
    };
}];
exports.video = {
    ended: function() {
        
    },
    seeked: function(player) {
        player.play();
    },
    loadeddata: function(player) {
    }
};
exports.beforeClose = function(){
	var player = this.components.player;
	var resourceTotalTime = Math.floor(player.duration());
    var lessonLocationTime = Math.floor(player.cache_.currentTime);
    console.log(resourceTotalTime+"cTime:"+lessonLocationTime);
};
exports.afterClose = function(){
};
