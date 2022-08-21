$(() => {
    var layer = layui.layer
    var form = layui.form

    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) return layer.msg('初始化文章分类失败')

                // 调用模板引擎
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    $('#btnChooseImage').on('click', () => {
        $('#coverFile').click()
    })

    // 监听 coverFile
    $('#coverFile').on('change', (e) => {
        // 获取的文件列表数组
        var files = e.target.files
        if (files.length === 0) return

        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    var art_state = '已发布'

    $('#btnSave2').on('click', () => {
        art_state = '草稿'
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])

        fd.append('state', art_state)

        // 将封面载剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(blob => { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // j将文件对象存储到 fd中
                fd.append('cover_img', blob)

                // 发起 ajax 数据请求
                publishArticle(fd)
            })

    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0) return layer.msg('发布文章失败！')
                layer.msg('发布文章成功！')

                // 发布文章成功，跳到列表页
                location.href = '/article/art_list.html'
            }
        })
    }


})