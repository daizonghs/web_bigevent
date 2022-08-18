$(() => {
    // 点击去注册账号
    $('#link_reg').on('click', () => {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登录
    $('#link_login').on('click', () => {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从 layui中获取 form对象

    var form = layui.form
    var layer = layui.layer

    // 通过 form.verify() 函数自定义规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 校验两次密码是否一致
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd != value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', (e) => {
        // 阻止默认提交
        e.preventDefault()
        var data = { username: $('#form_reg [name="username"]').val(), password: $('#form_reg [name="password"]').val() }
        $.post('/api/reguser', data, (res) => {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }

            layer.msg('注册成功，请登录！')
            $('#link_login').click()
        })

    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('登录失败!')
                }
                localStorage.setItem('token', res.token)
                layer.msg('登录成功!')

                // 跳到后台主页
                location.href = '/index.html'
            }
        })
    })


})