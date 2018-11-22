$('footer div').click(function () {
    var index = $(this).index()
    $('section').hide()
        .eq(index).fadeIn()
    $(this).addClass('active')
        .siblings().removeClass('active')

})


var index = 0
var isLoading = false
start()
function start() {
    if(isLoading) return
    isLoading = true
    $('.loading').show()
    $.ajax({
        url: 'http://api.douban.com/v2/movie/top250',
        type: 'GET',
        data: {
            start: index,
            count: 20
        },
        dataType: 'jsonp',
    }).done(function (ret) {
        console.log(ret)
        setData(ret)
        index += 20
    }).fail(function () {
        console.log('error')
    }).always(function(){
        isLoading = false
        $('.loading').hide()
    })
}

$('main').on('scroll', function () {
    // console.log($('main').eq(0).scrollTop())
    // console.log($('section').eq(0).*-+height())
    if($('section').eq(0).height() - 30 <= $('main').scrollTop() + $('main').height()){
        start()
    }
})


function setData(data) {
    data.subjects.forEach(function (movie) {
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
        $('.container').append($node)
    })
}
