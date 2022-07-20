import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core'
import SwiperCore, { Pagination } from 'swiper'
import { SwiperComponent } from 'swiper/angular'
import { animations } from '../../../functions/animations'
import { Store } from '../../../stores/store'

@Component({
  selector: 'app-tour',
  templateUrl: './tour.page.html',
  styleUrls: ['./tour.page.scss'],
  animations: animations(),
})
export class TourPage implements OnInit {
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent
  showSkip = true

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    public store: Store
  ) {}

  ngOnInit() {
    SwiperCore.use([Pagination])
  }

  onSlideChange = () => {
    this.showSkip =
      this.swiper.swiperRef.realIndex < this.swiper.swiperRef.slides.length - 1
    this.changeDetectionRef.detectChanges()
  }

  skip = () => {
    this.swiper.swiperRef.slideTo(this.swiper.swiperRef.slides.length)
  }
}
