import requests
import json
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
from .config import CONFIG
from .models.data import AccountInfo, DailyMetrics, SourceDistribution, FansSourceData, FansDistribution, VideoMetrics, VideoSourceData, VideoDistribution
from .utils.logger import logger

class WeixinChannelCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(CONFIG['headers'])
        self.session.cookies.update(self._get_cookies())
        
    def _get_cookies(self) -> Dict[str, str]:
        """从配置获取cookie"""
        cookies = {}
        raw_cookie = CONFIG['auth']['cookie']
        for item in raw_cookie.split(';'):
            key, value = item.strip().split('=', 1)
            cookies[key] = value
        return cookies

    def get_account_info(self) -> Optional[AccountInfo]:
        """获取账号基本信息"""
        try:
            url = f"{CONFIG['api']['base_url']}/platform/account/info"
            response = self.session.get(url)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                # 从页面解析数据
                nickname = soup.find('h2', class_='finder-nickname').text
                finder_id = soup.find('span', class_='finder-uniq-id').text
                followers = int(soup.find('span', class_='finder-info-num').text)
                videos = int(soup.find_all('span', class_='finder-info-num')[1].text)
                
                return AccountInfo(
                    nickname=nickname,
                    finder_id=finder_id,
                    followers_count=followers,
                    videos_count=videos
                )
        except Exception as e:
            logger.error(f"获取账号信息失败: {e}")
            return None

    def get_daily_metrics(self, date: str) -> Optional[DailyMetrics]:
        """获取指定日期的数据指标"""
        try:
            # 从页面解析关键指标数据
            metrics = {
                'date': date,
                'read_count': 0,
                'like_count': 0,
                'fav_count': 0,
                'comment_count': 0,
                'forward_count': 0,
                'follow_count': 0
            }
            
            # 遍历页面上的指标数据
            for key, value in metrics.items():
                if key != 'date':
                    element = self.driver.find_element_by_class_name(f'metric-{key}')
                    metrics[key] = int(element.text)
                    
            return DailyMetrics(**metrics)
        except Exception as e:
            logger.error(f"获取日期 {date} 的指标数据失败: {e}")
            return None
        
    def get_metrics(self, start_date: str, end_date: str) -> List[MetricsData]:
        """获取指标数据"""
        url = f"{CONFIG['api']['base_url']}/statistic/post"
        params = {
            'start_date': start_date,
            'end_date': end_date
        }
        response = self.session.get(url, params=params)
        data = response.json()
        return [MetricsData(**item) for item in data['list']]
        
    def get_source_distribution(self, start_date, end_date):
        """获取来源分布数据"""
        pass
        
    def get_trend_data(self, days=7):
        """获取趋势数据"""
        pass

    def get_fans_distribution(self, days: int = 7) -> Optional[FansDistribution]:
        """获取粉丝分布数据"""
        try:
            url = f"{CONFIG['api']['base_url']}/cgi-bin/mmfinderassistant-bin/auth/auth_data"
            response = self.session.get(url)
            if response.status_code == 200:
                data = response.json()['data']
                
                # 解析各来源数据
                fans_by_source = []
                for source in data['fansDataByTabtype']:
                    fans_by_source.append(FansSourceData(
                        tab_type=source['tabType'],
                        tab_type_name=source['tabTypeName'],
                        add=source['add'],
                        reduce=source['reduce'],
                        net_add=source['netAdd'],
                        total=source['total']
                    ))
                
                return FansDistribution(
                    add=data['add'],
                    reduce=data['reduce'],
                    net_add=data['netAdd'],
                    total=data['total'],
                    fans_by_source=fans_by_source
                )
                
        except Exception as e:
            logger.error(f"获取粉丝分布数据失败: {e}")
            return None

    def get_video_metrics(self, days: int = 7) -> Optional[VideoDistribution]:
        """获取视频指标数据"""
        try:
            url = f"{CONFIG['api']['base_url']}/cgi-bin/mmfinderassistant-bin/post/post_data"
            response = self.session.get(url)
            if response.status_code == 200:
                data = response.json()['data']
                
                # 解析来源数据
                source_data = []
                for source in data['dataByTabtype']:
                    metrics = VideoMetrics(
                        browse=source['data']['browse'],
                        like=source['data']['like'],
                        comment=source['data']['comment'],
                        forward=source['data']['forward'],
                        fav=source['data']['fav'],
                        follow=source['data']['follow'],
                        forward_aggregation=source['data']['forwardAggregation']
                    )
                    source_data.append(VideoSourceData(
                        tab_type=source['tabType'],
                        tab_type_name=source['tabTypeName'],
                        data=metrics
                    ))
                
                # 解析总计数据
                total = VideoMetrics(
                    browse=data['totalData']['browse'],
                    like=data['totalData']['like'],
                    comment=data['totalData']['comment'],
                    forward=data['totalData']['forward'],
                    fav=data['totalData']['fav'],
                    follow=data['totalData']['follow'],
                    forward_aggregation=data['totalData']['forwardAggregation']
                )
                
                return VideoDistribution(
                    data_by_tabtype=source_data,
                    total_data=total
                )
                
        except Exception as e:
            logger.error(f"获取视频指标数据失败: {e}")
            return None 