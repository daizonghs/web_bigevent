$(() => {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: (value) => {
            if (value > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间!'
            }
        }
    })
    initUserInfo()


    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: res => {
                if (res.status !== 0) return layer.msg('获取用户信息失败！')

                form.val('formUserInfo', res.data)

            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', e => {
        // 阻止默认重置
        e.preventDefault()
        initUserInfo()
    })

    //  监听表单的提交事件
    $('.layui-form').on('submit', e => {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $('.layui-form').serialize(),
            success: res => {
                if (res.status !== 0) return layer.msg('更新用户信息失败！')
                layer.msg('更新用户信息成功！')

                // 调用父页面的方法
                window.parent.getUserInfo()
            }
        })
    })
})