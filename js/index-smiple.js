var app = {
    init: function(){
        this.$tabs = $('footer>div')
        this.$panels = $('section')
        this.bind()
        top250.init()
        usTop.init()
        search.init()
    },
    bind: function(){
        var _this = this
        this.$tabs.on('click',function(){
            $(this).addClass('active')
                   .siblings().removeClass('active')
            _this.$panels.eq($(this).index()).fadeIn()
                         .siblings().hide()
        })
    }
}


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
        $('main').scroll(function(){
            if(_this.isToBottom()){
                _this.start()
            }
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
            data: {
                start: _this.index,
                count: 20
            },
            dataType: 'jsonp',
        }).done(function (ret) {
            if(_this.index >= ret.total){
                _this.isFinish = false
            }
            _this.index += 20
            callback && callback(ret)
        }).fail(function () {
            console.log('error')
        }).always(function(){
            _this.isLoading = false
            _this.$element.find('.loading').hide()
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
            _this.$element.find('.container').append($node)
        })
    },
    isToBottom: function(){
        return this.$element.find('.container').height() <= $('main').height() + $('main').scrollTop()
    }
}



var search = {
    init: function(){
        this.$element = $('#search')
        keyword = ''
        this.bind()
    },
    bind:function(){
        var _this = this
        _this.$element.find('.search').on('click',function(){
        keyword = _this.$element.find('.header input').val()
        _this.start()
        })
    },
    start:function(){
        var _this = this
        this.getData(function(data){
            _this.render(data)
        })
    },
    getData:function(callback){
        var _this = this
        _this.$element.find('.loading').show()
        $.ajax({
            url: 'http://api.douban.com/v2/movie/search',
            data:{
                q:keyword
            },
            dataType: 'jsonp',
        }).done(function (ret) {
            console.log(ret)
            callback && callback(ret)
        }).fail(function () {
            console.log('error')
        }).always(function(){
            _this.$element.find('.loading').hide()
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
            _this.$element.find('.container').append($node)
        })
    }
}



var usTop = {
    init: function(){
        this.$element = $('#us')
        this.start()
    },
    bind:function(){

    },
    start:function(){
        var _this = this
        this.getData(function(data){
            _this.render(data)
        })
    },
    getData:function(callback){
        var _this = this
        if(this.isLoading) return
        _this.isLoading = true
        _this.$element.find('.loading').show()
        $.ajax({
            url: 'http://api.douban.com/v2/movie/us_box',
            type: 'GET',
            dataType: 'jsonp',
        }).done(function (ret) {
            console.log(ret)
            callback && callback(ret)
        }).fail(function () {
            console.log('error')
        }).always(function(){
            _this.$element.find('.loading').hide()
        })
    },
    render:function(data){
        var _this = this
        data.subjects.forEach(function(movie){
            movie = movie.subject
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
            _this.$element.find('.container').append($node)
        })
    }
}


app.init();