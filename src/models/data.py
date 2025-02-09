from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Optional

@dataclass
class AccountInfo:
    """账号基本信息"""
    nickname: str            # 账号昵称
    finder_id: str          # 视频号ID
    followers_count: int    # 关注者数量
    videos_count: int       # 视频数量

@dataclass
class DailyMetrics:
    """每日数据指标"""
    date: str               # 日期
    read_count: int        # 播放量
    like_count: int        # 点赞数
    fav_count: int         # 收藏数
    comment_count: int     # 评论数
    forward_count: int     # 分享数
    follow_count: int      # 新增关注数

@dataclass
class SourceDistribution:
    """来源分布数据"""
    source_type: str       # 来源类型(关注/朋友/推荐/分享等)
    count: int            # 数量
    percentage: float     # 占比 

@dataclass
class UserInfo:
    """用户基本信息"""
    nickname: str                # 昵称
    username: str               # 加密的用户名
    encrypted_username: str     # 显示的用户名
    city: str                  # 城市
    province: str              # 省份
    country: str               # 国家
    sex: int                   # 性别

@dataclass
class FinderUser:
    """视频号信息"""
    finder_username: str        # 视频号用户名
    nickname: str              # 视频号昵称
    head_img_url: str          # 头像URL
    uniq_id: str              # 唯一ID
    feeds_count: int          # 视频数量
    fans_count: int           # 粉丝数量
    is_master_finder: bool    # 是否是主账号 

@dataclass
class FansSourceData:
    """粉丝来源数据"""
    tab_type: int          # 来源类型ID (0:其他, 3:关注, 4:推荐, 6:分享, 8:朋友, 16:订阅号, 20:主页)
    tab_type_name: str     # 来源类型名称
    add: List[int]         # 7天新增粉丝数
    reduce: List[int]      # 7天减少粉丝数
    net_add: List[int]     # 7天净增粉丝数
    total: List[int]       # 7天总粉丝数

@dataclass
class FansDistribution:
    """粉丝分布数据"""
    add: List[int]                     # 7天总新增粉丝数
    reduce: List[int]                  # 7天总减少粉丝数
    net_add: List[int]                 # 7天总净增粉丝数
    total: List[int]                   # 7天总粉丝数
    fans_by_source: List[FansSourceData]  # 各来源粉丝数据 

@dataclass
class VideoMetrics:
    """视频指标数据"""
    browse: List[str]           # 播放数
    like: List[str]            # 点赞数
    comment: List[str]         # 评论数
    forward: List[str]         # 转发数
    fav: List[str]            # 收藏数
    follow: List[str]         # 关注数
    forward_aggregation: List[str]  # 总转发数

@dataclass 
class VideoSourceData:
    """视频来源数据"""
    tab_type: int              # 来源类型ID
    tab_type_name: str         # 来源类型名称
    data: VideoMetrics         # 指标数据

@dataclass
class VideoDistribution:
    """视频分布数据"""
    data_by_tabtype: List[VideoSourceData]  # 各来源数据
    total_data: VideoMetrics               # 总计数据 