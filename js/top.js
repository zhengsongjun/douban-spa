var top250 = {
    init: function(){
        this.$element = $('#top250')
        this.isLoading = false
        this.index = 0
        this.isFinish = false
        this.bind()
        this.start()
    },
    bind:function(){
        var _this = this
        this.$element.scroll(function(){
            _this.start()
        })
    },
    start:function(){
        var _this = this
        this.getData(function(data){
            _this.render(data)
        })
    },
    getData: function(callback){
        var _this = this
        if(this.isLoading) return
        _this.isLoading = true
        _this.$element.find('.loading').show()
        $.ajax({
            url: 'http://api.douban.com/v2/movie/top250',
            type: 'GET',
            data: {
                start: _this.index || 0,
                count: 20
            },
            dataType: 'jsonp',
        }).done(function (ret) {
            if(_this.index >= ret.total){
                _this.isFinish = false
            }
            console.log(ret)
            _this.index += 20
            callback && callback(ret)
        }).fail(function () {
            console.log('error')
        }).always(function(){
            _this.isLoading = false
            _this.$element.find('.loading').hiden()
        })
    },
    render:function(data){
        var _this = this
        data.subjects.forEach(function(movie){
            var tpl = `<div class="item clearfix">
            <a href="#">
                <div class="cover">
                    <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543460037&di=2c902c09d26b331aeeb64589f0e0e6de&imgtype=jpg&er=1&src=http%3A%2F%2Fimage3.xyzs.com%2Fupload%2F25%2Fb2%2F425%2F20150506%2F143086863054475_0.jpg" alt="">
                </div>
                <div class="detail">
                    <h2>霸王别姬</h2>
                    <div class="extra">
                        <span class="score">9.3分</span> / <span class="collect_count">1000</span>
                    </div>
                    <div class="extra"><span class="year">1994</span> <span class="type">剧情、爱情</span></div>
                    <div class="extra">导演：<span class="director">张艺谋</span></div>
                    <div class="extra">主演：<span class="actor">张艺谋、刘德华，张学友</span></div>
                </div>
            </a>
        </div>`
            var $node = $(tpl)
            $node.find('.cover img').attr('src', movie.images.medium)
            $node.find('.detail h2').text(movie.title)
            $node.find('.extra .score').text(movie.rating.average)
            $node.find('.extra .collect_count').text(movie.collect_count)
            $node.find('.year').text(movie.year)
            $node.find('.type').text(movie.genres.join('/'))
            $node.find('.extra .director').text(function () {
                var arr = []
                movie.directors.forEach(function (item) {
                    arr.push(item.name)
                })
                return arr.join('、')
            })
            $node.find('.actor').text(function () {
                var arr = []
                movie.casts.forEach(function (item) {
                    arr.push(item.name)
                })
                return arr.join('、')
            })
            _this.$element.append($node)
        })
    },
    isToBottom: function(){
        return this.$element.find('.container') <= this.$element.height() + this.$element.scrollTop() + 10
    }
}

