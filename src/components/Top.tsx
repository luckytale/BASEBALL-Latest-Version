import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import pieChart from '../assets/images/pieChart.jpeg';
import pitchTypeData from '../assets/images/pitchTypeData.jpeg';
import pitchingResult from '../assets/images/pithingResult.jpeg';
import direction from '../assets/images/direction.jpeg';
import SlideImage from './SlideImage';

const EnhancedSwipeableViews = autoPlay(SwipeableViews);

const Top = () => {
  return (
    <>
      <div style={{ padding: 60 }}>
        <div
          style={{
            display: 'flex',
            width: '90vw',
            height: '60vh',
            marginLeft: 10,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 48, marginTop: 70 }}>
              野球はデータで勝つ時代
            </h1>
            <div style={{ fontSize: 16, marginLeft: 20 }}>
              <strong>
                相手を徹底的に分析し、勝利の鍵を見出す。
                <br />
                自身のデータを活用し、成長の可能性を広げる。
                <br />
                BASEBALLはパフォーマンスを最大限に引き出す分析アプリです。
                <br />
                データと分析は試合の勝敗を変える力を秘めています。
              </strong>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <EnhancedSwipeableViews enableMouseEvents interval={5000}>
              <SlideImage imgSrc={pitchTypeData} width="90%" />
              <SlideImage imgSrc={pitchingResult} width="100%" />
              <SlideImage imgSrc={direction} width="90%" />
              <SlideImage imgSrc={pieChart} width="75%" />
            </EnhancedSwipeableViews>
          </div>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default Top;
