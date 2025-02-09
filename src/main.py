from datetime import datetime, timedelta
from crawler import WeixinChannelCrawler
from utils.logger import logger

def main():
    # 创建爬虫实例
    crawler = WeixinChannelCrawler()
    
    try:
        # 获取账号信息
        account = crawler.get_account_info()
        logger.info(f"账号信息: {account}")
        
        # 获取最近7天数据
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)
        metrics = crawler.get_metrics(
            start_date.strftime('%Y-%m-%d'),
            end_date.strftime('%Y-%m-%d')
        )
        logger.info(f"获取到 {len(metrics)} 天数据")
        
    except Exception as e:
        logger.error(f"发生错误: {e}")

if __name__ == '__main__':
    main() 