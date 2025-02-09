# 配置文件
CONFIG = {
    'api': {
        'base_url': 'https://channels.weixin.qq.com',
        'auth_data': '/cgi-bin/mmfinderassistant-bin/auth/auth_data',
        'follower': '/statistic/follower',  # 粉丝数据
        'post': '/statistic/post',          # 视频数据
        'source': '/statistic/source',      # 来源分布
        'account': '/account/info'          # 账号信息
    },
    'auth': {
        'cookie': 'pgv_pvid=4103472546; ptcz=b2701da406381e193804da4261fb890f290a621cfe2663a13e972423770ba247; o_cookie=2697138309; RK=hSfQqciC2H; _qimei_uuid42=18703153818100aa87bc65f0a265c1d5fa50df2412; tvfe_boss_uuid=68456dc9b4b725f0; _qimei_q32=a26d766aa8c97f0e387069c240cd8efa; _qimei_q36=4ba1d60815d1d86706c65c2c30001f118118; _qimei_h38=98e560e8ef339eff99e5c33d02000001a17814; qq_domain_video_guid_verify=51f495bb896073bc; eas_sid=61b7t301i7N6g4q2i5d8y5s1S1; _qimei_fingerprint=4fa2833f361c3f721857c21fdda3ed04; _clck=1r58m6g|1|ft9|0; sessionid=BgAARGtY5Qscd6egdZKsPk4Nd3z2zCTyCfRlCrTHszG9ayVz4MuXI2srAEaPH6p%2BpuIQEBMwXzcgiQK%2BiGju7oQBcMQhPdv44aWkzLORc7OW; wxuin=1599924065; compass_token=b_00000194_e8f5d6ab_ee5144a0_433c05e1_d6fdbb2c; compass_rand=CAESIMqluwbOJzvi/W9aKQSgLixw4q3suEVBJOTIGqQf5sg/; compass_login_type=1; compass_magic=227bcae373ffbf9c66fa56ed0e3c8e34af55e706a4f4957ff4a95eb8ca20ca51',
        'compass_token': 'b_00000194_e8f5d6ab_ee5144a0_433c05e1_d6fdbb2c',
        'wxuin': '1599924065'
    },
    'headers': {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'cache-control': 'max-age=0',
        'connection': 'keep-alive',
        'host': 'channels.weixin.qq.com',
        'referer': 'https://channels.weixin.qq.com/login.html',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Microsoft Edge";v="132"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate', 
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0'
    }
} 