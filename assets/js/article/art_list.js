$(() => {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(d.getHours())
        var mm = padZero(d.getMinutes())
        var ss = padZero(d.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;


    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示2条
        cate_id: '', //分类id
        state: '' //状态
    }

    initTable()
    initCate()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) return layer.msg('获取分类数据失败！')
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        // 获取表单中项的值
        var cate_id = $('[name=cate_id]').var()
        var state = $('[name=state]').var()

        // 未查询对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分类容器id
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layui: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页,发生切换的时候，触发jump回调
            jump: (obj, first) => {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) initTable()
            }
        })
    }

    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length
            // 获取文章id   
        var id = $(this).attr('data-id')

        // 询问用户是否要删除数据
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: res => {
                    if (res.status !== 0) return layer.msg('删除文章失败！');
                    layer.msg('删除文章成功！')

                    if (len === 1) q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    initTable()
                }
            })

            layer.close(index);
        });
    })

})